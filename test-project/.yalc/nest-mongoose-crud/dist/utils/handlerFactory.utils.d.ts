import { Model, Document } from 'mongoose';
import IQuery from './interfaces/query.interface';
import { ICrudService } from './interfaces/crud-service.interface';
export declare abstract class AbstractCrudService<T extends Document> implements ICrudService<T> {
    protected readonly model: Model<T>;
    protected readonly entityName: string;
    constructor(model: Model<T>, entityName?: string);
    getAll(query: IQuery): Promise<{
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
        data: import("mongoose").IfAny<T, any, Document<unknown, {}, T, {}, {}> & (import("mongoose").Require_id<T> extends infer T_1 ? T_1 extends import("mongoose").Require_id<T> ? T_1 extends {
            __v?: infer U;
        } ? T_1 : T_1 & {
            __v: number;
        } : never : never)>[];
    }>;
    getOne(id: string, query?: Partial<IQuery>): Promise<{
        status: string;
        data: import("mongoose").IfAny<T, any, Document<unknown, {}, T, {}, {}> & (import("mongoose").Require_id<T> extends infer T_1 ? T_1 extends import("mongoose").Require_id<T> ? T_1 extends {
            __v?: infer U;
        } ? T_1 : T_1 & {
            __v: number;
        } : never : never)>;
    }>;
    createOne(payload: Partial<T>): Promise<{
        status: string;
        data: import("mongoose").IfAny<T, any, Document<unknown, {}, T, {}, {}> & (import("mongoose").Require_id<T> extends infer T_1 ? T_1 extends import("mongoose").Require_id<T> ? T_1 extends {
            __v?: infer U;
        } ? T_1 : T_1 & {
            __v: number;
        } : never : never)>;
    }>;
    updateOne(id: string, payload: Partial<T>): Promise<{
        status: string;
        data: import("mongoose").IfAny<T, any, Document<unknown, {}, T, {}, {}> & (import("mongoose").Require_id<T> extends infer T_1 ? T_1 extends import("mongoose").Require_id<T> ? T_1 extends {
            __v?: infer U;
        } ? T_1 : T_1 & {
            __v: number;
        } : never : never)>;
    }>;
    deleteOne(id: string): Promise<{
        status: string;
        message: string;
        data: {
            id: string;
        };
    }>;
    protected findById(id: string): Promise<T | null>;
    protected findOne(filter: any): Promise<T | null>;
    protected findMany(filter?: any): Promise<T[]>;
}
//# sourceMappingURL=handlerFactory.utils.d.ts.map