"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCrudController = createCrudController;
const common_1 = require("@nestjs/common");
function applyEndpointDecorators(config) {
    const decorators = [];
    if (config?.guards?.length) {
        decorators.push((0, common_1.UseGuards)(...config.guards));
    }
    if (config?.interceptors?.length) {
        decorators.push((0, common_1.UseInterceptors)(...config.interceptors));
    }
    if (config?.pipes?.length) {
        decorators.push((0, common_1.UsePipes)(...config.pipes));
    }
    // Note: dto validation should be applied to specific parameters (@Body, @Query, etc.)
    // not globally to the method, as it can interfere with response serialization
    if (config?.status) {
        decorators.push((0, common_1.HttpCode)(config.status));
    }
    return decorators.length ? (0, common_1.applyDecorators)(...decorators) : () => { };
}
function createCrudController(config = {}) {
    class BaseController {
        constructor(service) {
            this.service = service;
        }
        async findAll(query) {
            return this.service.findAll(query);
        }
        async getOne(id, query) {
            try {
                const result = await this.service.findById(id, query);
                console.log({ result });
                return result;
            }
            catch (error) {
                throw error;
            }
        }
        async create(payload) {
            return this.service.createOne(payload);
        }
        async update(id, payload) {
            return this.service.updateOne(id, payload);
        }
        async patch(id, payload) {
            return this.service.updateOne(id, payload);
        }
        async delete(id) {
            return this.service.deleteOne(id);
        }
    }
    __decorate([
        (0, common_1.Get)(),
        applyEndpointDecorators(config.getAll),
        __param(0, (0, common_1.Query)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], BaseController.prototype, "findAll", null);
    __decorate([
        (0, common_1.Get)(':id'),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Query)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], BaseController.prototype, "getOne", null);
    __decorate([
        (0, common_1.Post)(),
        applyEndpointDecorators(config.create),
        __param(0, (0, common_1.Body)(new common_1.ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            expectedType: config.create?.dto,
        }))),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], BaseController.prototype, "create", null);
    __decorate([
        (0, common_1.Put)(':id'),
        applyEndpointDecorators(config.update),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)(new common_1.ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            expectedType: config.update?.dto,
        }))),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], BaseController.prototype, "update", null);
    __decorate([
        (0, common_1.Patch)(':id'),
        applyEndpointDecorators(config.update),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)(new common_1.ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            expectedType: config.update?.dto,
        }))),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], BaseController.prototype, "patch", null);
    __decorate([
        (0, common_1.Delete)(':id'),
        applyEndpointDecorators(config.delete),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], BaseController.prototype, "delete", null);
    return BaseController;
}
//# sourceMappingURL=create-crud.controller.utils.js.map