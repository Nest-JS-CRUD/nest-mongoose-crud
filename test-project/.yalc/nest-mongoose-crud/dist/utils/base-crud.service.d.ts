import { Model, Document } from 'mongoose';
import IQuery from './interfaces/query.interface';
export declare abstract class BaseCrudService<T extends Document, CreateDto = any, // Make CreateDto optional with default 'any'
UpdateDto = any> {
    protected readonly model: Model<T>;
    constructor(model: Model<T>);
    /**
     * Get all documents with filtering, pagination, sorting
     */
    findAll(query: IQuery): Promise<{
        status: string;
        total: number;
        nextPage: number | null;
        prevPage: number | null;
        count: number;
        pages: number;
        currentPage: number;
        data: import("mongoose").IfAny<T, any, Document<unknown, {}, T, {}, {}> & (import("mongoose").Require_id<T> extends infer T_1 ? T_1 extends import("mongoose").Require_id<T> ? T_1 extends {
            __v?: infer U;
        } ? T_1 : T_1 & {
            __v: number;
        } : never : never)>[];
    }>;
    /**
     * Get a single document by ID
     */
    findOne(id: string, query?: Partial<IQuery>): Promise<{
        status: string;
        data: import("mongoose").IfAny<T, any, Document<unknown, {}, T, {}, {}> & (import("mongoose").Require_id<T> extends infer T_1 ? T_1 extends import("mongoose").Require_id<T> ? T_1 extends {
            __v?: infer U;
        } ? T_1 : T_1 & {
            __v: number;
        } : never : never)>;
    }>;
    /**
     * Create a new document using Create DTO (optional)
     */
    createOne(createDto: CreateDto): Promise<{
        status: string;
        data: import("mongoose").IfAny<T, any, Document<unknown, {}, T, {}, {}> & (import("mongoose").Require_id<T> extends infer T_1 ? T_1 extends import("mongoose").Require_id<T> ? T_1 extends {
            __v?: infer U;
        } ? T_1 : T_1 & {
            __v: number;
        } : never : never)>;
    }>;
    /**
     * Update a document by ID using Update DTO (optional)
     */
    updateOne(id: string, updateDto: UpdateDto): Promise<{
        status: string;
        data: import("mongoose").IfAny<T, any, Document<unknown, {}, T, {}, {}> & (import("mongoose").Require_id<T> extends infer T_1 ? T_1 extends import("mongoose").Require_id<T> ? T_1 extends {
            __v?: infer U;
        } ? T_1 : T_1 & {
            __v: number;
        } : never : never)> | null;
    }>;
    /**
     * Delete a document by ID
     */
    deleteOne(id: string): Promise<{
        status: string;
    }>;
    /**
     * Find one document by custom filter
     */
    findOneBy(filter?: any, query?: Partial<IQuery>): Promise<import("mongoose").IfAny<T, any, Document<unknown, {}, T, {}, {}> & (import("mongoose").Require_id<T> extends infer T_1 ? T_1 extends import("mongoose").Require_id<T> ? T_1 extends {
        __v?: infer U;
    } ? T_1 : T_1 & {
        __v: number;
    } : never : never)>[]>;
    /**
     * Find document by ID without any query processing
     */
    findById(id: string, query: IQuery): Promise<{
        status: string;
        data: import("mongoose").IfAny<T, any, Document<unknown, {}, T, {}, {}> & (import("mongoose").Require_id<T> extends infer T_1 ? T_1 extends import("mongoose").Require_id<T> ? T_1 extends {
            __v?: infer U;
        } ? T_1 : T_1 & {
            __v: number;
        } : never : never)>;
    }>;
    /**
     * Count documents by filter
     */
    count(filter?: any): Promise<number>;
    /**
     * Check if document exists
     */
    exists(filter?: any): Promise<boolean>;
}
//# sourceMappingURL=base-crud.service.d.ts.map