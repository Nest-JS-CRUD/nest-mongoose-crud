// base/interfaces/crud-service.interface.ts

// base/abstract-crud.service.ts
import { Model, Document } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import APIFeatures from './apiFeatures.utils';
import IQuery from './interfaces/query.interface';
import { ICrudService } from './interfaces/crud-service.interface';

export abstract class AbstractCrudService<T extends Document>
  implements ICrudService<T>
{
  constructor(
    protected readonly model: Model<T>,
    protected readonly entityName: string = 'Document',
  ) {}

  async getAll(query: IQuery) {
    const features = new APIFeatures(this.model.find(), query)
      .filter()
      .search()
      .populate()
      .sort()
      .limitFields()
      .paginate();

    const limit = query.limit ? +query.limit : 10;
    const page = query.page ? +query.page : 1;

    const [result, count] = await Promise.all([
      this.model.find(features.query),
      this.model.countDocuments(features.filterObject),
    ]);

    const pages = Math.ceil(count / limit);

    return {
      status: 'success',
      total: result.length,
      pagination: {
        nextPage: page < pages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        currentPage: page, // Now it's definitely a number
        totalPages: pages,
        totalItems: count,
        itemsPerPage: limit,
      },
      data: result,
    };
  }

  async getOne(id: string, query: Partial<IQuery> = {}) {
    const features = new APIFeatures(this.model.find({ _id: id }), query)
      .filter()
      .populate();

    const [result] = await features.query;

    if (!result) {
      throw new NotFoundException(`${this.entityName} with ID ${id} not found`);
    }

    return { status: 'success', data: result };
  }

  async createOne(payload: Partial<T>) {
    const result = await this.model.create(payload);
    return { status: 'success', data: result };
  }

  async updateOne(id: string, payload: Partial<T>) {
    const result = await this.model.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!result) {
      throw new NotFoundException(`${this.entityName} with ID ${id} not found`);
    }

    return { status: 'success', data: result };
  }

  async deleteOne(id: string) {
    const result = await this.model.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException(`${this.entityName} with ID ${id} not found`);
    }

    return {
      status: 'success',
      message: `${this.entityName} deleted successfully`,
      data: { id },
    };
  }

  // Utility methods
  protected async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  protected async findOne(filter: any): Promise<T | null> {
    return this.model.findOne(filter);
  }

  protected async findMany(filter: any = {}): Promise<T[]> {
    return this.model.find(filter);
  }
}
