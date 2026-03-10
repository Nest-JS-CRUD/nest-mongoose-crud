import { Document } from 'mongoose';
import type IQuery from './interfaces/query.interface';
import { BaseCrudService } from './base-crud.service';
import { Get, Param, Post, Query } from '@nestjs/common';

export abstract class BaseCrudController<T extends Document> {
  protected abstract service: BaseCrudService<T>;

  @Get()
  async findAll(@Query() query: IQuery) {
    return this.service.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Query() query: Partial<IQuery>) {
    return this.service.findOne(id, query);
  }

  @Post()
  async create(payload: any) {
    return this.service.createOne(payload);
  }

  async update(id: string, payload: any) {
    return this.service.updateOne(id, payload);
  }

  async delete(id: string) {
    return this.service.deleteOne(id);
  }
}
