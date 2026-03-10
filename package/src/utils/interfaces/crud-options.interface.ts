import { Type } from '@nestjs/common';

export interface CrudMethodOptions<TDto> {
  dto?: Type<TDto>;
  guards?: any[];
  interceptors?: any[];
}

export interface CrudOptions<C, U> {
  create?: CrudMethodOptions<C>;
  update?: CrudMethodOptions<U>;
}
