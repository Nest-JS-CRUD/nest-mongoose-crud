import IQuery from './interfaces/query.interface';
import type { Query, Document } from 'mongoose';
interface MongoComparisonOperators {
    $gte?: string | number;
    $gt?: string | number;
    $lte?: string | number;
    $lt?: string | number;
    $in?: any[];
    $eq?: any;
    $ne?: any;
    [key: string]: any;
}
interface MongoSearchCondition {
    [field: string]: {
        $regex: string;
        $options: string;
    };
}
interface IFilterObject {
    [key: string]: string | number | boolean | MongoComparisonOperators | MongoSearchCondition[] | undefined;
    $or?: MongoSearchCondition[];
}
declare class APIFeatures<T extends Document> {
    query: Query<T[], T>;
    queryString: IQuery;
    filterObject: IFilterObject;
    constructor(query: Query<T[], T>, queryString: IQuery);
    filter(): this;
    sort(): this;
    limitFields(): this;
    paginate(): this;
    search(): this;
    populate(): this;
}
export default APIFeatures;
//# sourceMappingURL=apiFeatures.utils.d.ts.map