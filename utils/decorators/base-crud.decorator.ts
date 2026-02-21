import {
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import {
  CrudOptions,
  CrudMethodOptions,
} from '../interfaces/crud-options.interface';

import { BaseCrudController } from 'utils/base-crud.controller';

type Constructor<T = any> = new (...args: any[]) => T;

type CrudControllerConstructor = Constructor<BaseCrudController<any>>;

export function Crud<T extends BaseCrudController<any>>(
  options: CrudOptions,
): (target: Constructor<T>) => void {
  return function (target) {
    const prototype = target.prototype;

    if (options.create) defineCreateRoute(prototype, options.create);

    if (options.update) defineUpdateRoute(prototype, options.update);
  };
}

function defineCreateRoute(prototype: any, config: CrudMethodOptions) {
  const methodName = 'create';

  prototype[methodName] = function (payload: any) {
    return super.create(payload);
  };

  const descriptor = Object.getOwnPropertyDescriptor(prototype, methodName);

  Post()(prototype, methodName, descriptor);
  Body()(prototype, methodName, 0);

  if (config.guards?.length) {
    UseGuards(...config.guards)(prototype, methodName, descriptor);
  }

  if (config.interceptors?.length) {
    UseInterceptors(...config.interceptors)(prototype, methodName, descriptor);
  }

  if (config.dto) {
    UsePipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    )(prototype, methodName, descriptor);
  }
}

function defineUpdateRoute(prototype: any, config: CrudMethodOptions) {
  const methodName = 'update';

  prototype[methodName] = function (id: string, payload: any) {
    return super.update(id, payload);
  };

  const descriptor = Object.getOwnPropertyDescriptor(prototype, methodName);

  Patch(':id')(prototype, methodName, descriptor);
  Param('id')(prototype, methodName, 0);
  Body()(prototype, methodName, 1);

  if (config.guards?.length) {
    UseGuards(...config.guards)(prototype, methodName, descriptor);
  }

  if (config.interceptors?.length) {
    UseInterceptors(...config.interceptors)(prototype, methodName, descriptor);
  }

  if (config.dto) {
    UsePipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    )(prototype, methodName, descriptor);
  }
}
