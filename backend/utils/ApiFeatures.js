class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
    // console.log(queryStr.page);
  }

  //used as ?keyword=samsung
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i", // this makes the search case insensitive
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }

  //used as price[gte] 2000
  filter() {
    let queryCopy = { ...this.queryStr };

    //removing some fields for category
    const removeFields = ["keyword", "sort", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);

    //filter for price and rating
    let querystr = JSON.stringify(queryCopy);
    querystr = querystr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(querystr));
    return this;
  }

  pagination(productsPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skip = productsPerPage * (currentPage - 1);
    // console.log(currentPage);

    this.query = this.query.limit(productsPerPage).skip(skip);

    return this;
  }
}
module.exports = ApiFeatures;
