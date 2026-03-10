import { Type, HttpStatus } from '@nestjs/common';
import { Document } from 'mongoose';
export interface EndpointConfig {
    dto?: Type<any>;
    guards?: any[];
    interceptors?: any[];
    pipes?: any[];
    status?: HttpStatus;
    enabled?: boolean;
    validationOptions?: {
        transform?: boolean;
        whitelist?: boolean;
        forbidNonWhitelisted?: boolean;
    };
}
export interface CrudControllerConfig {
    create?: EndpointConfig;
    update?: EndpointConfig;
    delete?: EndpointConfig;
    getAll?: EndpointConfig;
    getOne?: EndpointConfig;
    global?: {
        guards?: any[];
        interceptors?: any[];
        pipes?: any[];
    };
}
export declare function createCrudController<T extends Document>(config?: CrudControllerConfig): Type<any>;
//# sourceMappingURL=create-crud.controller.utils.d.ts.map