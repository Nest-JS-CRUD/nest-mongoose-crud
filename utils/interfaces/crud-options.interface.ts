import { Type } from '@nestjs/common';

export interface CrudMethodOptions {
  dto?: Type<any>;
  guards?: any[];
  interceptors?: any[];
}

export interface CrudOptions {
  create?: CrudMethodOptions;
  update?: CrudMethodOptions;
}
