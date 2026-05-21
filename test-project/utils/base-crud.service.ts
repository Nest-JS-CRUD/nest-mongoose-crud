// base/base-crud.service.ts
import { Model, Document } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import APIFeatures from './apiFeatures.utils';
import IQuery from './interfaces/query.interface';

export abstract class BaseCrudService<
  T extends Document,
  CreateDto = any, // Make CreateDto optional with default 'any'
  UpdateDto = any, // Make UpdateDto optional with default 'any'
> {
  constructor(protected readonly model: Model<T>) {}

  /**
   * Get all documents with filtering, pagination, sorting
   */
  async findAll(query: IQuery) {
    const payload = new APIFeatures(this.model.find(), query)
      .filter()
      .search()
      .populate()
      .sort()
      .limitFields()
      .paginate();

    const limit = query.limit ? +query.limit : 10;
    const page = query.page ? +query.page : 1;

    const result = await this.model.find(payload.query);
    const count = await this.model.countDocuments(payload.filterObject);
    const pages = Math.ceil(count / +limit);

    return {
      status: 'success',
      total: result.length,
      nextPage: +page < pages ? +page + 1 : null,
      prevPage: +page > 1 ? +page - 1 : null,
      count,
      pages,
      currentPage: page,
      data: result,
    };
  }

  /**
   * Get a single document by ID
   */
  async findOne(id: string, query: Partial<IQuery> = {}) {
    const payload = new APIFeatures(this.model.find({ _id: id }), query)
      .filter()
      .populate();

    const [result] = await payload.query;

    if (!result) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return { status: 'success', data: result };
  }

  /**
   * Create a new document using Create DTO (optional)
   */
  async createOne(createDto: CreateDto) {
    const result = await this.model.create(createDto as any);
    return { status: 'success', data: result };
  }

  /**
   * Update a document by ID using Update DTO (optional)
   */
  async updateOne(id: string, updateDto: UpdateDto) {
    const data = await this.model.findById(id);

    if (!data) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    await this.model.updateOne({ _id: id }, updateDto as any);
    const saved = await this.model.findById(id);

    return { status: 'success', data: saved };
  }

  /**
   * Delete a document by ID
   */
  async deleteOne(id: string) {
    const data = await this.model.findById(id);

    if (!data) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    await this.model.findByIdAndDelete(id);
    return { status: 'delete successful' };
  }

  /**
   * Find documents by custom filter
   */
  async find(filter: any = {}, query: Partial<IQuery> = {}) {
    const payload = new APIFeatures(this.model.find(filter), query)
      .filter()
      .populate()
      .sort()
      .limitFields();

    return await payload.query;
  }

  /**
   * Find one document by custom filter
   */
  async findOneBy(filter: any = {}, query: Partial<IQuery> = {}) {
    const payload = new APIFeatures(this.model.find(filter), query)
      .filter()
      .populate()
      .limitFields();

    const result = await payload.query;

    if (!result) {
      throw new NotFoundException('Document not found with the given filter');
    }

    return result;
  }

  /**
   * Find document by ID without any query processing
   */
  async findById(id: string, query: IQuery): Promise<T | null> {
    const payload = new APIFeatures(this.model.find({ _id: id }), query)
      .filter()
      .populate()
      .limitFields();

    const [result] = await payload.query;

    if (!result) {
      throw new NotFoundException('Document not found with that ID');
    }

    return result;
  }

  /**
   * Count documents by filter
   */
  async count(filter: any = {}) {
    return await this.model.countDocuments(filter);
  }

  /**
   * Check if document exists
   */
  async exists(filter: any = {}): Promise<boolean> {
    const count = await this.model.countDocuments(filter).limit(1);
    return count > 0;
  }
}
