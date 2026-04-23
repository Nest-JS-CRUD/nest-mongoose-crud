# nest-mongoose-crud

> 🔧 **Fast, extensible CRUD helpers for NestJS + Mongoose**

`nest-mongoose-crud` is a zero‑boilerplate package that provides a
fully‑typed base service and configurable controller factory for
building RESTful CRUD APIs with NestJS and Mongoose. Built with developer
experience in mind, it handles filtering, pagination, sorting, searching,
and population out of the box while letting you override or extend any
behaviour.

---

## Table of Contents

- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Querying](#-querying)
- [Controller Configuration](#-controller-configuration)
- [Override example](#override-example)
- [Additional Utilities](#-additional-utilities)
- [Advanced Tips](#-advanced-tips)
- [Development & Testing](#-development--testing)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📦 Installation

```bash
# using npm
npm install nest-mongoose-crud

# or yarn
yarn add nest-mongoose-crud
```

> Works with NestJS v8+ and Mongoose v6+.

---

## 🚀 Quick Start

### 1. Define your schema & model

```ts
// src/post/schemas/post.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

export type PostDocument = Post & Document;

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
}

export enum PostVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  UNLISTED = 'unlisted',
}

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true, index: true, text: true })
  title: string;

  @Prop({ required: true, index: true, text: true })
  content: string;

  @Prop({
    type: String,
    enum: PostStatus,
    default: PostStatus.DRAFT,
    index: true,
  })
  status: PostStatus;

  @Prop({
    type: String,
    enum: PostVisibility,
    default: PostVisibility.PUBLIC,
    index: true,
  })
  visibility: PostVisibility;

  // --- MANY-TO-ONE RELATIONSHIP WITH USER ---
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  author: User;

  // --- FIELDS FOR SEARCHING ---
  @Prop([String])
  keywords: string[];

  @Prop([String])
  categories: string[];

  // --- FIELDS FOR RANGE QUERIES ---
  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: 0 })
  likeCount: number;

  @Prop({ default: 0 })
  commentCount: number;

  @Prop({ type: Date })
  publishedAt: Date;

  @Prop()
  readingTime: number; // in minutes

  // --- FIELDS FOR FILTERING ---
  @Prop({ default: false, index: true })
  isFeatured: boolean;

  @Prop({ default: false, index: true })
  isPinned: boolean;

  @Prop({ default: false, index: true })
  allowComments: boolean;

  @Prop({ default: true })
  allowSharing: boolean;

  @Prop([String])
  tags: string[];

  // --- METADATA & SEO ---
  @Prop()
  excerpt: string;

  @Prop()
  coverImage: string;

  @Prop()
  slug: string;

  @Prop()
  metaTitle: string;

  @Prop()
  metaDescription: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  metadata: Record<string, any>;
}

export const PostSchema = SchemaFactory.createForClass(Post);

// --- COMPOUND INDEXES FOR OPTIMIZED QUERIES ---

// Text search index on title and content
PostSchema.index({ title: 'text', content: 'text' });

// For user's post feed
PostSchema.index({
  status: 1,
  visibility: 1,
  publishedAt: -1,
  isFeatured: 1,
});
```

### 2. Create a service by extending `BaseCrudService`

```ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseCrudService } from 'nest-mongoose-crud';
import { Post, PostDocument } from './schemas/post.schema';

@Injectable()
export class PostService extends BaseCrudService<PostDocument> {
  constructor(@InjectModel(Post.name) model: Model<PostDocument>) {
    super(model);
  }
}
```

All of the common operations (`findAll`, `findOne`, `createOne`,
`updateOne`, `deleteOne`) are implemented for you and return consistent
response shapes.

### 3. Generate a controller with `createCrudController`

```ts
import { Controller } from '@nestjs/common';
import { createCrudController } from 'nest-mongoose-crud';

import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

const BaseController = createCrudController({
  create: { dto: CreatePostDto },
  update: { dto: UpdatePostDto },
});

@Controller('posts')
export class PostController extends BaseController {
  constructor(protected readonly service: PostService) {
    super(service);
  }
}
```

### 4. Wire everything up in a module

```ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post, PostSchema } from './schemas/post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
```

---

## 🔍 Querying

The `APIFeatures` class provides powerful querying capabilities for your CRUD APIs, allowing you to filter, sort, search, paginate, and populate your data efficiently. Below, each feature is explained in detail with practical examples using our Post model.

### Filtering

Filtering allows you to retrieve documents that match specific criteria. There are two types: basic filtering for exact matches and advanced filtering for range queries.

#### Basic Filtering

For fields that accept multiple values (like enums, arrays, or booleans), use comma-separated values. This uses MongoDB's `$in` operator to match any of the provided values.

**Explanation:** This is useful for filtering by categories, statuses, tags, or any field where you want to include multiple options. The query parameter value is split by commas and converted to an `$in` array.

**Example:** Get posts that are either published or archived.

```http
GET /posts?status=published,archived
```

This translates to MongoDB query: `{ status: { $in: ['published', 'archived'] } }`

**Example:** Get posts with specific tags.

```http
GET /posts?tags=javascript,react,nestjs
```

**Example:** Get featured and pinned posts.

```http
GET /posts?isFeatured=true&isPinned=true
```

In our Post model, you can filter by:

- **Enums:** `status` (draft, published, archived, deleted), `visibility` (public, private, unlisted)
- **Arrays:** `categories`, `tags`, `keywords`
- **Booleans:** `isFeatured`, `isPinned`, `allowComments`, `allowSharing`
- **Relationships:** `author` (user ID)

#### Advanced Filtering

For range queries and comparisons, use bracket notation with MongoDB comparison operators:

- `[gte]` - greater than or equal (`$gte`)
- `[gt]` - greater than (`$gt`)
- `[lte]` - less than or equal (`$lte`)
- `[lt]` - less than (`$lt`)

**Explanation:** These operators allow precise range filtering on numeric or date fields. The bracket notation `[operator]` is parsed to extract the field name and apply the corresponding MongoDB operator.

**Example:** Get posts with high engagement (more than 100 views and 10 likes).

```http
GET /posts?viewCount[gte]=100&likeCount[gte]=10
```

**Example:** Get posts published between January 1, 2024 and December 31, 2024.

```http
GET /posts?publishedAt[gte]=2024-01-01&publishedAt[lte]=2024-12-31
```

**Example:** Get posts with reading time between 5-15 minutes.

```http
GET /posts?readingTime[gte]=5&readingTime[lte]=15
```

Note: Date fields should be in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ). Our Post model has `publishedAt` for publication dates and automatic `createdAt`/`updatedAt` timestamps.

You can combine multiple operators on the same field or different fields:

```http
GET /posts?viewCount[gte]=50&commentCount[lte]=5&readingTime[gte]=3&readingTime[lte]=10
```

### Sorting

Sort your results by one or more fields to control the order of returned documents.

**Explanation:** Separate multiple fields with commas. Prefix a field with `-` for descending order. If no sort is specified, results default to `-createdAt` (newest first). This uses MongoDB's `sort()` method.

**Example:** Sort posts by view count descending.

```http
GET /posts?sort=-viewCount
```

**Example:** Sort by engagement metrics in ascending order.

```http
GET /posts?sort=commentCount
```

For our Post model, you can sort by any field including: `title`, `status`, `visibility`, `publishedAt`, `viewCount`, `likeCount`, `commentCount`, `readingTime`, `isFeatured`, `isPinned`, `createdAt`, `updatedAt`, and more.

### Limiting Fields

Control which fields are included or excluded in the response to optimize payload size and hide sensitive data.

**Explanation:** Use a comma-separated list of field names. By default, the `__v` field (Mongoose version key) is excluded. Prefix fields with `-` to exclude them instead of including only them. This uses MongoDB's `select()` method.

**Example:** Only return essential fields for a list view.

```http
GET /posts?fields=title,excerpt,viewCount,likeCount,publishedAt,author
```

**Example:** Return all fields except content and metadata for performance.

```http
GET /posts?fields=-content,-metadata,-__v
```

**Example:** Get only SEO-related fields.

```http
GET /posts?fields=slug,metaTitle,metaDescription,coverImage
```

### Pagination

Split large result sets into manageable pages for better performance and user experience.

**Explanation:** Use `page` (default: 1) and `limit` (default: 10) parameters. The API calculates the skip value as `(page - 1) * limit`. The response includes pagination metadata like total count, current page, total pages, and next/previous page numbers.

**Example:** Get the second page with 20 posts per page.

```http
GET /posts?page=2&limit=20
```

This skips the first 20 documents and returns documents 21-40.

**Example:** Get featured posts with pagination.

```http
GET /posts?isFeatured=true&page=1&limit=5
```

### Searching

Perform case-insensitive text searches across multiple fields using regex.

**Explanation:** The format is `?search=searchTerm:field1,field2,field3`. The search term is applied as a regex pattern to each specified field, combined with MongoDB's `$or` operator. This is efficient when fields have text indexes.

**Example:** Search for "javascript" in the title or content fields.

```http
GET /posts?search=javascript:title,content
```

**Example:** Search across title, content, and keywords.

```http
GET /posts?search=react:title,content,keywords
```

**Example:** Search in excerpt and meta description for SEO content.

```http
GET /posts?search=seo:excerpt,metaDescription
```

This creates: `{ $or: [{ title: { $regex: 'javascript', $options: 'i' } }, { content: { $regex: 'javascript', $options: 'i' } }] }`

In our Post model, `title` and `content` have text indexes, making searches fast. You can also search in `excerpt`, `metaTitle`, `metaDescription`, or array fields like `keywords`, `categories`, `tags`.

### Population

Populate referenced documents to include related data in your response, avoiding multiple queries.

**Explanation:** Specify the reference path and optionally which fields to select from the populated document. This reduces payload size by only including necessary fields. Use `|` to separate multiple population paths. Population occurs after filtering, sorting, etc., for optimal performance.

**Format:** `?populate=path:field1,field2,field3`

**Example:** Populate the author field, but only include firstName, lastName, and email from the User model.

```http
GET /posts?populate=author:firstName,lastName,email
```

**Example:** Get author details and role for permission checks.

```http
GET /posts?populate=author:firstName,lastName,email,role,status
```

In our Post model, `author` references the User model. Without field selection, all User fields would be included; with selection, only the specified fields are returned, improving performance and security. You can also populate deeply to include nested relationships.

**Example:** Combine with other queries - get published posts by active users.

```http
GET /posts?status=published&populate=author:status&author.status=active
```

---

## 🛠 Controller Configuration

`createCrudController` accepts a configuration object allowing you to
enhance or disable each CRUD endpoint and apply guards, pipes,
interceptors, custom status codes, and DTO validation.

```ts
interface EndpointConfig {
  dto?: DtoClass; // class used by ValidationPipe
  guards?: any[];
  interceptors?: any[];
}

interface CrudControllerConfig {
  create?: EndpointConfig;
  update?: EndpointConfig;
  delete?: EndpointConfig;
  getAll?: EndpointConfig;
  getOne?: EndpointConfig;
}
```

#### Example – add guards and interceptors to `getAll` and `create`

```ts
const BaseController = createCrudController({
  getAll: {
    guards: [AdminGuard, SomeOtherGuard, ...],
    interceptors: [CacheInterceptor, SomeOtherInterceptor, ...],
  },
  create: { dto: CreatePostDto },
});
```

#### Override validation options

```ts
const BaseController = createCrudController({
  create: {
    dto: CreateDto,
  },
});
```

---

## Override example

The following shows a simple way to override a generated endpoint by
providing a custom service method and a controller handler. You can
either override a handler via the `createCrudController` options
(`handler`), or replace the route entirely by extending the base
controller — this example demonstrates a common pattern: custom service
logic plus an explicit controller method that calls it.

```ts
// src/post/post.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostUpdated } from './dto/create-post-update.dto';

import { BaseCrudService } from 'nest-mongoose-crud'; // Adjust path as needed

@Injectable()
export class PostService extends BaseCrudService<PostDocument> {
  constructor(@InjectModel(Post.name) postModel: Model<PostDocument>) {
    super(postModel);
  }

  create(updatePostDto: CreatePostUpdated) {
    return 'create one updated!!';
  }
}
```

```ts
// src/post/post.controller.ts
import {
  Body,
  Controller,
  Post,
  Type,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { createCrudController } from 'nest-mongoose-crud'; // Adjust path as needed
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { LogRequest1Interceptor } from './interceptors/log-request-1/log-request-1.interceptor';
import { LogRequest2Interceptor } from './interceptors/log-request-2/log-request-2.interceptor';
import { LogRequest1Guard } from './guards/log-request-1/log-request-1.guard';
import { CreatePostUpdated } from './dto/create-post-update.dto';
import { LogRequest2Guard } from './guards/log-request-1/log-request-2.guard';

const BaseController: Type<any> = createCrudController({
  create: {
    dto: CreatePostDto,
    interceptors: [LogRequest1Interceptor, LogRequest2Interceptor],
  },

  update: {
    dto: UpdatePostDto,
  },

  getAll: {
    guards: [LogRequest1Guard, LogRequest2Guard],
    interceptors: [LogRequest1Interceptor, LogRequest2Interceptor],
  },
});

@Controller('posts')
export class PostController extends BaseController {
  constructor(private service: PostService) {
    super(service);
  }

  @Post()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  create(@Body() dto: CreatePostUpdated) {
    return this.service.create(dto);
  }
}
```

This snippet demonstrates:

- overriding service behaviour by extending `BaseCrudService`;
- exposing a custom controller route that delegates to the service;
- mixing generated options (via `createCrudController`) with explicit
  controller methods when you need full control.

## 📦 Additional Utilities

Although the service + controller factory is the primary API, the
package also exports:

```ts
export { BaseCrudService } from './utils/base-crud.service';
export { createCrudController } from './utils/create-crud.controller.utils';
export { BaseCrudController } from './utils/base-crud.controller';
export { APIFeatures } from './utils/apiFeatures.utils';
export * from './utils/interfaces/*';
```

`BaseCrudController` is an abstract class you can extend if you prefer
manual decorator application rather than the factory. `APIFeatures` can
be reused if you build custom query logic.

There is also a legacy `handlerFactory` / `AbstractCrudService` in
`handlerFactory.utils.ts` which implements similar operations; it is
maintained for backwards compatibility but the newer `BaseCrudService`
and `createCrudController` are recommended for all new work.

---

## 🧠 Advanced Tips

- **Custom filters:** call `service.find(filter, query)` to run the
  standard pipeline on a subset of documents.
- **Custom lookups:** override `findAll`, `findOne`, etc. and call
  `super.findAll(query)` if you need base behaviour as a starting point.
- **Type safety:** generics ensure returned data is correctly typed when
  you extend `BaseCrudService<T>` and supply a DTO to controller
  config.
- **Error handling:** `NotFoundException` is thrown automatically when a
  requested document is missing.

---

## 🛠 Development & Testing

The repository includes a `test-project` subfolder demonstrating
integration with a real Nest application. To run the example:

```bash
cd test-project
npm install
npm run start:dev
```

You can also link the package locally with `npm link` (see the script
in the top‑level `package.json`).

---

## 🤝 Contributing

See the contribution workflow and PR checklist in
[`CONTRIBUTING.md`](./CONTRIBUTING.md).

---

## 📄 License

MIT © Your Name or Organization
