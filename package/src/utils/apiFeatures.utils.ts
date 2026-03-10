import IQuery from './interfaces/query.interface';
// import IPayload from 'src/interfaces/payload.interface';
// import generateApiFilter from './generateApiFilter';
// import advancedFilter from './advancedFilter';

// find({
//   isActive: true,
//   role: { $in: [UserRole.ADMIN, UserRole.USER] },
//   age: { $gte: 20, $lte: 30 },
//   firstName: { $regex: 'john', $options: 'i' },
// });

// /api/users?age[gte]=20&age[lte]=30&search[firstName||lastName]=john

// {
//   "age": {
//     "gte": "20",
//     "lte": "30"
//   }
// }

// $or: [
//     { name: { $regex: searchTerm, $options: 'i' } },
//     { email: { $regex: searchTerm, $options: 'i' } },
//     { description: { $regex: searchTerm, $options: 'i' } }
//   ]

import type { Query, Document } from 'mongoose';

// Define Mongo operators
interface MongoComparisonOperators {
  $gte?: string | number;
  $gt?: string | number;
  $lte?: string | number;
  $lt?: string | number;
  $in?: any[];
  $eq?: any;
  $ne?: any;
  [key: string]: any; // For other operators
}

interface MongoSearchCondition {
  [field: string]: {
    $regex: string;
    $options: string;
  };
}

// Define the filter object structure
interface IFilterObject {
  [key: string]:
    | string
    | number
    | boolean
    | MongoComparisonOperators
    | MongoSearchCondition[]
    | undefined;
  $or?: MongoSearchCondition[];
}

class APIFeatures<T extends Document> {
  query: Query<T[], T>;
  queryString: IQuery;
  filterObject: IFilterObject = {};

  constructor(query: Query<T[], T>, queryString: IQuery) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };

    const excludedFields = [
      'page',
      'sort',
      'limit',
      'fields',
      'search',
      'populate',
    ];
    excludedFields.forEach((el) => delete queryObj[el]);

    const filter = Object.entries(queryObj).reduce(
      (acc: IFilterObject, [key, value]) => {
        const params: Record<string, keyof MongoComparisonOperators> = {
          gte: '$gte',
          gt: '$gt',
          lte: '$lte',
          lt: '$lt',
        };

        if (
          key.includes('gte') ||
          key.includes('gt') ||
          key.includes('lte') ||
          key.includes('lt')
        ) {
          const match = key.match(/\[(.*?)\]/);
          const operator = match ? match[1] : null;

          if (!operator) return acc;

          const [field] = key.split(`[${operator}]`);

          // Initialize acc[field] as MongoComparisonOperators if it doesn't exist
          if (!acc[field]) acc[field] = {} as MongoComparisonOperators;

          // Get the MongoDB operator
          const mongoOperator = params[operator];

          if (mongoOperator) {
            // Type-safe assignment
            (acc[field] as MongoComparisonOperators)[mongoOperator] = value;
          }
        } else {
          // Handle regular fields with $in operator
          acc[key] = { $in: value.split(',') };
        }

        return acc;
      },
      {} as IFilterObject,
    );

    this.filterObject = filter;
    // this.query = this.query.find(this.filterObject);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields) as unknown as Query<T[], T>;
    } else {
      this.query = this.query.select('-v') as unknown as Query<T[], T>;
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page ? +this.queryString.page : 1;
    const limit = this.queryString.limit ? +this.queryString.limit : 10;
    const skip = (page - 1) * limit;

    // page=2&limit=10
    this.query = this.query.skip(skip).limit(limit);
    // this.queryString.limit = limit;

    return this;
  }

  //?search=term:field1,field2
  search() {
    if (this.queryString.search) {
      const [term, fields] = this.queryString.search.split(':');

      if (!term || !fields) return this;

      const fieldArray = fields.split(',');

      // Create search conditions
      const searchConditions = fieldArray.map((field) => ({
        [field]: { $regex: term, $options: 'i' },
      }));

      // Combine existing filter with search conditions
      if (this.filterObject.$or) {
        // If $or already exists, append to it
        this.filterObject.$or.push(...searchConditions);
      } else {
        // Create $or if it doesn't exist
        this.filterObject.$or = searchConditions;
      }
    }

    // Update the query with the combined filter
    this.query = this.query.find(this.filterObject);

    return this;
  }

  //?populate=path1:field1,field2|path2:field1,field2
  populate() {
    if (this.queryString.populate) {
      const optionsArr = this.queryString.populate.split('|');

      const options = optionsArr.map((option) => {
        const [path, fields] = option.split(':');

        const select = fields ? fields.split(',').join(' ') : '-v';

        return { path, select };
      });

      this.query = this.query.populate(options);
    }

    return this;
  }
}

export default APIFeatures;
