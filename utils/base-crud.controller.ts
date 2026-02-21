import { Document } from 'mongoose';
import type IQuery from './interfaces/query.interface';
import { BaseCrudService } from './base-crud.service';

export abstract class BaseCrudController<T extends Document> {
  protected abstract service: BaseCrudService<T>;

  async getAll(query: IQuery) {
    return this.service.getAll(query);
  }

  async getOne(id: string, query: Partial<IQuery>) {
    return this.service.getOne(id, query);
  }

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
