"use strict";
// base/interfaces/crud-service.interface.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractCrudService = void 0;
const common_1 = require("@nestjs/common");
const apiFeatures_utils_1 = __importDefault(require("./apiFeatures.utils"));
class AbstractCrudService {
    constructor(model, entityName = 'Document') {
        this.model = model;
        this.entityName = entityName;
    }
    async getAll(query) {
        const features = new apiFeatures_utils_1.default(this.model.find(), query)
            .filter()
            .search()
            .populate()
            .sort()
            .limitFields()
            .paginate();
        const limit = query.limit ? +query.limit : 10;
        const page = query.page ? +query.page : 1;
        const [result, count] = await Promise.all([
            this.model.find(features.query),
            this.model.countDocuments(features.filterObject),
        ]);
        const pages = Math.ceil(count / limit);
        return {
            status: 'success',
            total: result.length,
            pagination: {
                nextPage: page < pages ? page + 1 : null,
                prevPage: page > 1 ? page - 1 : null,
                currentPage: page, // Now it's definitely a number
                totalPages: pages,
                totalItems: count,
                itemsPerPage: limit,
            },
            data: result,
        };
    }
    async getOne(id, query = {}) {
        const features = new apiFeatures_utils_1.default(this.model.find({ _id: id }), query)
            .filter()
            .populate();
        const [result] = await features.query;
        if (!result) {
            throw new common_1.NotFoundException(`${this.entityName} with ID ${id} not found`);
        }
        return { status: 'success', data: result };
    }
    async createOne(payload) {
        const result = await this.model.create(payload);
        return { status: 'success', data: result };
    }
    async updateOne(id, payload) {
        const result = await this.model.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
        });
        if (!result) {
            throw new common_1.NotFoundException(`${this.entityName} with ID ${id} not found`);
        }
        return { status: 'success', data: result };
    }
    async deleteOne(id) {
        const result = await this.model.findByIdAndDelete(id);
        if (!result) {
            throw new common_1.NotFoundException(`${this.entityName} with ID ${id} not found`);
        }
        return {
            status: 'success',
            message: `${this.entityName} deleted successfully`,
            data: { id },
        };
    }
    // Utility methods
    async findById(id) {
        return this.model.findById(id);
    }
    async findOne(filter) {
        return this.model.findOne(filter);
    }
    async findMany(filter = {}) {
        return this.model.find(filter);
    }
}
exports.AbstractCrudService = AbstractCrudService;
//# sourceMappingURL=handlerFactory.utils.js.map