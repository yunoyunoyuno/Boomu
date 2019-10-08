class APIFeatures {
  constructor(mongooseModelQuery, expressQueryStr) {
    //expressQueryStr => req.query & .find() is an model query
    this.modelQuery = mongooseModelQuery;
    this.queryString = expressQueryStr;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludesFields = ["page", "limit", "sort", "fields"];
    excludesFields.forEach(el => delete queryObj[el]);
    //Create queryString
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

    //model.find() also return the query so the line below still worked
    this.modelQuery = this.modelQuery.find(JSON.parse(queryStr));
    //For implement the other methods, need to return entire object
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      //req.query object has a sort method.
      const sortBy = this.queryString.sort.split(",").join(" ");
      //mongoose Model also have a sort() method after find()
      this.modelQuery = this.modelQuery.sort(sortBy);
    } else {
      this.modelQuery = this.modelQuery.sort("-createdAt");
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page || 1;
    const limit = this.queryString.limit || 100;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.modelQuery = this.modelQuery.select(fields);
    } else {
      this.modelQuery = this.modelQuery.select("-__v");
    }
    return this;
  }
}

module.exports = APIFeatures;
