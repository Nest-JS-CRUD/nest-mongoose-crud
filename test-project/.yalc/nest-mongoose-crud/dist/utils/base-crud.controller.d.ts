import { Document } from 'mongoose';
import type IQuery from './interfaces/query.interface';
import { BaseCrudService } from './base-crud.service';
export declare abstract class BaseCrudController<T extends Document> {
    protected abstract service: BaseCrudService<T>;
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
    findOne(id: string, query: Partial<IQuery>): Promise<{
        status: string;
        data: import("mongoose").IfAny<T, any, Document<unknown, {}, T, {}, {}> & (import("mongoose").Require_id<T> extends infer T_1 ? T_1 extends import("mongoose").Require_id<T> ? T_1 extends {
            __v?: infer U;
        } ? T_1 : T_1 & {
            __v: number;
        } : never : never)>;
    }>;
    create(payload: any): Promise<{
        status: string;
        data: import("mongoose").IfAny<T, any, Document<unknown, {}, T, {}, {}> & (import("mongoose").Require_id<T> extends infer T_1 ? T_1 extends import("mongoose").Require_id<T> ? T_1 extends {
            __v?: infer U;
        } ? T_1 : T_1 & {
            __v: number;
        } : never : never)>;
    }>;
    update(id: string, payload: any): Promise<{
        status: string;
        data: import("mongoose").IfAny<T, any, Document<unknown, {}, T, {}, {}> & (import("mongoose").Require_id<T> extends infer T_1 ? T_1 extends import("mongoose").Require_id<T> ? T_1 extends {
            __v?: infer U;
        } ? T_1 : T_1 & {
            __v: number;
        } : never : never)> | null;
    }>;
    delete(id: string): Promise<{
        status: string;
    }>;
}
//# sourceMappingURL=base-crud.controller.d.ts.map