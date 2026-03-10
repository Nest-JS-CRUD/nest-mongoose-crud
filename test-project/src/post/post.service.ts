import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostUpdated } from './dto/create-post-update.dto';

import { BaseCrudService } from 'nest-mongoose-crud'; // Adjust path as needed

// import { BaseCrudService } from 'utils/base-crud.service';

@Injectable()
export class PostService extends BaseCrudService<PostDocument> {
  constructor(@InjectModel(Post.name) postModel: Model<PostDocument>) {
    super(postModel);
  }

  create(updatePostDto: CreatePostUpdated) {
    return 'create one updated!!';
  }
}
