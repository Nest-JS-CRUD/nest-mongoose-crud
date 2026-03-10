# nest-mongoose-crud

> 🔧 **Fast, extensible CRUD helpers for NestJS + Mongoose**

`nest-mongoose-crud` is a zero‑boilerplate package that provides a
fully‑typed base service and configurable controller factory for
building RESTful CRUD APIs with NestJS and Mongoose. Built with developer
experience in mind, it handles filtering, pagination, sorting, searching,
and population out of the box while letting you override or extend any
behaviour.

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
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop()
  content: string;

  @Prop({ type: String, ref: 'User' })
  author: string;
}

export type PostDocument = Post & Document;
export const PostSchema = SchemaFactory.createForClass(Post);
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

  // optional: add custom methods or override existing ones
  findAllUpdate() {
    return this.model.find({});
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

  // you may override any endpoint, add new ones, etc.
  @Get()
  findAll() {
    return this.service.findAllUpdate();
  }
}
```

> 👇 Example user controller from the test project:

```ts
const BaseCrudController = createCrudController({
  create: { dto: CreateUserDto },
  update: { dto: UpdateUserDto },
});

@Controller('users')
export class UserController extends BaseCrudController {
  constructor(protected readonly service: UserService) {
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

## 🔍 Query Features

`BaseCrudService` uses an internal `APIFeatures` helper to interpret
standard REST query parameters. All of the following work out of the
box when you call `service.findAll(query)` or hit a controller
event:

| Parameter                      | Description                                     | Example                 |
| ------------------------------ | ----------------------------------------------- | ----------------------- | --- |
| `?field=value`                 | Exact match (supports comma‑separated values)   | `?status=active,paused` |
| `?price[gte]=10&price[lte]=50` | Comparison operators (`gte`, `gt`, `lte`, `lt`) |                         |
| `?sort=createdAt,-title`       | Sort by one or more fields                      |                         |
| `?fields=name,email`           | Project specific fields                         |                         |
| `?page=2&limit=20`             | Pagination                                      |                         |
| `?search=term:field1,field2`   | Case‑insensitive regex search                   |                         |
| `?populate=author:email        | comments:body`                                  | Populate mongoose refs  |     |

> ℹ️ The `filter()` stage strips control fields (`page`, `sort`,
> `limit`, `fields`, `search`, `populate`) before building a mongoose
> filter object.

### Examples

```http
GET /posts?author=John&status[ne]=draft&sort=-createdAt&page=1&limit=10
```

```http
GET /posts?search=nestjs:title,content
```

```http
GET /posts?populate=author:name,email
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
  pipes?: any[];
  status?: number; // HTTP status code
  enabled?: boolean; // turn off an endpoint
  validationOptions?: ValidationPipeOptions;
}

interface CrudControllerConfig {
  create?: EndpointConfig;
  update?: EndpointConfig;
  delete?: EndpointConfig;
  getAll?: EndpointConfig;
  getOne?: EndpointConfig;
  global?: {
    guards?: any[];
    interceptors?: any[];
    pipes?: any[];
  };
}
```

#### Example – add guards and interceptors to `getAll` and `create`

```ts
const BaseController = createCrudController({
  global: {
    guards: [AuthGuard],
    interceptors: [LoggingInterceptor],
  },
  getAll: {
    guards: [AdminGuard],
    interceptors: [CacheInterceptor],
  },
  create: { dto: CreatePostDto, status: 201 },
});
```

#### Disable an endpoint entirely

```ts
const BaseController = createCrudController({
  delete: { enabled: false },
});
```

#### Override validation options

```ts
const BaseController = createCrudController({
  create: {
    dto: CreateDto,
    validationOptions: { whitelist: false, transform: false },
  },
});
```

---

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

## 📄 License

MIT © Your Name or Organization
