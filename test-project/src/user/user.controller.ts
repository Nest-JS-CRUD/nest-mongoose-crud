import { Controller, Type } from '@nestjs/common';

import { UserService } from './user.service';

import { createCrudController } from 'nest-mongoose-crud'; // Adjust path as needed

import { CreateUserDto } from './dto/create-user.dto';

import { UpdateUserDto } from './dto/update-user.dto';

const BaseCrudController: Type<any> = createCrudController({
  create: { dto: CreateUserDto },
  update: { dto: UpdateUserDto },
  delete: { enabled: false },
});

@Controller('users')
export class UserController extends BaseCrudController {
  constructor(protected readonly service: UserService) {
    super(service);
  }
}
