"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCrudService = void 0;
const common_1 = require("@nestjs/common");
const apiFeatures_utils_1 = __importDefault(require("./apiFeatures.utils"));
class BaseCrudService {
    constructor(model) {
        this.model = model;
    }
    /**
     * Get all documents with filtering, pagination, sorting
     */
    async findAll(query) {
        const payload = new apiFeatures_utils_1.default(this.model.find(), query)
            .filter()
            .search()
            .populate()
            .sort()
            .limitFields()
            .paginate();
        const limit = query.limit ? +query.limit : 10;
        const page = query.page ? +query.page : 1;
        const result = await this.model.find(payload.query);
        const count = await this.model.countDocuments(payload.filterObject);
        const pages = Math.ceil(count / +limit);
        return {
            status: 'success',
            total: result.length,
            nextPage: +page < pages ? +page + 1 : null,
            prevPage: +page > 1 ? +page - 1 : null,
            count,
            pages,
            currentPage: page,
            data: result,
        };
    }
    /**
     * Get a single document by ID
     */
    async findOne(id, query = {}) {
        const payload = new apiFeatures_utils_1.default(this.model.find({ _id: id }), query)
            .filter()
            .populate();
        const [result] = await payload.query;
        if (!result) {
            throw new common_1.NotFoundException(`Document with ID ${id} not found`);
        }
        return { status: 'success', data: result };
    }
    /**
     * Create a new document using Create DTO (optional)
     */
    async createOne(createDto) {
        const result = await this.model.create(createDto);
        return { status: 'success', data: result };
    }
    /**
     * Update a document by ID using Update DTO (optional)
     */
    async updateOne(id, updateDto) {
        const data = await this.model.findById(id);
        if (!data) {
            throw new common_1.NotFoundException(`Document with ID ${id} not found`);
        }
        await this.model.updateOne({ _id: id }, updateDto);
        const saved = await this.model.findById(id);
        return { status: 'success', data: saved };
    }
    /**
     * Delete a document by ID
     */
    async deleteOne(id) {
        const data = await this.model.findById(id);
        if (!data) {
            throw new common_1.NotFoundException(`Document with ID ${id} not found`);
        }
        await this.model.findByIdAndDelete(id);
        return { status: 'delete successful' };
    }
    /**
     * Find one document by custom filter
     */
    async findOneBy(filter = {}, query = {}) {
        const payload = new apiFeatures_utils_1.default(this.model.find(filter), query)
            .filter()
            .populate()
            .limitFields();
        const result = await payload.query;
        if (!result) {
            throw new common_1.NotFoundException('Document not found with the given filter');
        }
        return result;
    }
    /**
     * Find document by ID without any query processing
     */
    async findById(id, query) {
        const payload = new apiFeatures_utils_1.default(this.model.find({ _id: id }), query)
            .filter()
            .populate()
            .limitFields();
        const [result] = await payload.query;
        if (!result) {
            throw new common_1.NotFoundException('Document not found with that ID');
        }
        return { status: 'success', data: result };
    }
    /**
     * Count documents by filter
     */
    async count(filter = {}) {
        return await this.model.countDocuments(filter);
    }
    /**
     * Check if document exists
     */
    async exists(filter = {}) {
        const count = await this.model.countDocuments(filter).limit(1);
        return count > 0;
    }
}
exports.BaseCrudService = BaseCrudService;
//# sourceMappingURL=base-crud.service.js.map