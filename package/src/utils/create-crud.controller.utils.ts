import {
  Put,
  Get,
  Post,
  Body,
  Type,
  Patch,
  Param,
  Query,
  Delete,
  UsePipes,
  HttpCode,
  UseGuards,
  HttpStatus,
  ValidationPipe,
  applyDecorators,
  UseInterceptors,
} from '@nestjs/common';

import { Document } from 'mongoose';
import { BaseCrudService } from './base-crud.service';
import type IQuery from './interfaces/query.interface';

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

function applyEndpointDecorators(config?: EndpointConfig) {
  const decorators: any[] = [];

  if (config?.guards?.length) {
    decorators.push(UseGuards(...config.guards));
  }

  if (config?.interceptors?.length) {
    decorators.push(UseInterceptors(...config.interceptors));
  }

  if (config?.pipes?.length) {
    decorators.push(UsePipes(...config.pipes));
  }

  // Note: dto validation should be applied to specific parameters (@Body, @Query, etc.)
  // not globally to the method, as it can interfere with response serialization

  if (config?.status) {
    decorators.push(HttpCode(config.status));
  }

  return decorators.length ? applyDecorators(...decorators) : () => {};
}

export function createCrudController<T extends Document>(
  config: CrudControllerConfig = {},
): Type<any> {
  abstract class BaseController {
    constructor(protected readonly service: BaseCrudService<T>) {}

    @Get()
    @applyEndpointDecorators(config.getAll)
    async findAll(@Query() query: IQuery) {
      return this.service.findAll(query);
    }

    @Get(':id')
    @applyEndpointDecorators(config.getOne)
    async getOne(@Param('id') id: string, @Query() query: IQuery) {
      try {
        const result = await this.service.findById(id, query);
        console.log({ result });
        return result;
      } catch (error) {
        throw error;
      }
    }

    @Post()
    @applyEndpointDecorators(config.create)
    async create(
      @Body(
        new ValidationPipe({
          transform: true,
          whitelist: true,
          forbidNonWhitelisted: true,
          expectedType: config.create?.dto,
        }),
      )
      payload: any,
    ) {
      return this.service.createOne(payload);
    }

    @Put(':id')
    @applyEndpointDecorators(config.update)
    async update(
      @Param('id') id: string,
      @Body(
        new ValidationPipe({
          transform: true,
          whitelist: true,
          forbidNonWhitelisted: true,
          expectedType: config.update?.dto,
        }),
      )
      payload: any,
    ) {
      return this.service.updateOne(id, payload);
    }

    @Patch(':id')
    @applyEndpointDecorators(config.update)
    async patch(
      @Param('id') id: string,
      @Body(
        new ValidationPipe({
          transform: true,
          whitelist: true,
          forbidNonWhitelisted: true,
          expectedType: config.update?.dto,
        }),
      )
      payload: any,
    ) {
      return this.service.updateOne(id, payload);
    }

    @Delete(':id')
    @applyEndpointDecorators(config.delete)
    async delete(@Param('id') id: string) {
      return this.service.deleteOne(id);
    }
  }

  return BaseController as Type<any>;
}
