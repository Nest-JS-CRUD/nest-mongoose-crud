import { Controller } from '@nestjs/common';

import { PostService } from './post.service';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

import { createCrudController } from 'utils/create-crud.controller.utils';
import { PostDocument } from './schemas/post.schema';

const CrudController = createCrudController({
  create: { dto: CreatePostDto },
  update: { dto: UpdatePostDto },
});

@Controller('posts')
export class PostController extends CrudController<PostDocument> {
  constructor(protected readonly service: PostService) {
    super();
  }
}
