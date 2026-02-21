import {
  Body,
  Post,
  Patch,
  Param,
  UsePipes,
  UseGuards,
  ValidationPipe,
  applyDecorators,
  UseInterceptors,
} from '@nestjs/common';

import { Document } from 'mongoose';
import { CrudOptions } from './interfaces/crud-options.interface';
import { BaseCrudController } from './base-crud.controller';

export function createCrudController(options: CrudOptions) {
  abstract class CrudController<
    T extends Document,
  > extends BaseCrudController<T> {
    /*
     * CREATE
     */
    @Post()
    @UsePipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    )
    @applyCrudMethodOptions(options.create)
    async create(@Body() payload: any) {
      return super.create(payload);
    }

    /*
     * UPDATE
     */
    @Patch(':id')
    @UsePipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    )
    @applyCrudMethodOptions(options.update)
    async update(@Param('id') id: string, @Body() payload: any) {
      return super.update(id, payload);
    }
  }

  return CrudController as abstract new <T extends Document>(
    ...args: any[]
  ) => BaseCrudController<T>;
}

function applyCrudMethodOptions(config?: {
  guards?: any[];
  interceptors?: any[];
}) {
  if (!config) return applyDecorators();

  const decorators: any[] = [];

  if (config.guards?.length) {
    decorators.push(UseGuards(...config.guards));
  }

  if (config.interceptors?.length) {
    decorators.push(UseInterceptors(...config.interceptors));
  }

  return applyDecorators(...decorators);
}
