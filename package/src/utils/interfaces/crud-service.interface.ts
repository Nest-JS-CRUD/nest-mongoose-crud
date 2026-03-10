// base/interfaces/crud-service.interface.ts
import { Document } from 'mongoose';
import type IQuery from './query.interface';

export interface ApiResponse<T> {
  status: string;
  data: T;
}

export interface PaginatedResponse<T> {
  status: string;
  total: number;
  pagination: {
    nextPage: number | null;
    prevPage: number | null;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  data: T[];
}

export interface DeleteResponse {
  status: string;
  message: string;
  data: { id: string };
}

export interface ICrudService<T extends Document> {
  getAll(query: IQuery): Promise<PaginatedResponse<T>>;
  getOne(id: string, query?: Partial<IQuery>): Promise<ApiResponse<T>>;
  createOne(payload: Partial<T>): Promise<ApiResponse<T>>;
  updateOne(id: string, payload: Partial<T>): Promise<ApiResponse<T>>;
  deleteOne(id: string): Promise<DeleteResponse>;
}
