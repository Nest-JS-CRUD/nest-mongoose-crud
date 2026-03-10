// services/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseCrudService } from 'nest-mongoose-crud';

import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService extends BaseCrudService<UserDocument> {
  constructor(@InjectModel(User.name) userModel: Model<UserDocument>) {
    super(userModel);
  }
}
