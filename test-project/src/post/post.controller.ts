import {
  Body,
  Controller,
  Post,
  Type,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { createCrudController } from 'nest-mongoose-crud'; // Adjust path as needed

// import { createCrudController } from 'utils/create-crud.controller.utils';

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
    super(service); // Pass service to parent constructor
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
