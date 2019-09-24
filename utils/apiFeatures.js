class APIFeatures {
  constructor(query, queryObject) {
    this.query = query
    this.queryObject = queryObject
  }

  filter() {
    const queryObjectReplica = { ...this.queryObject }
    const excludedFields = ['page', 'sort', 'limit', 'fields']

    excludedFields.forEach(field => delete queryObjectReplica[field])

    let queryString = JSON.stringify(queryObjectReplica)
    queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
    this.query = this.query.find(JSON.parse(queryString))

    return this
  }

  sort() {
    if (this.queryObject.sort) {
      const sortBy = this.queryObject.sort.split(',').join(' ')
      this.query = this.query.sort(sortBy)
    } else this.query = this.query.sort('-createdAt')

    return this
  }

  limitFields() {
    if (this.queryObject.fields)
      this.query = this.query.select(this.queryObject.fields.split(',').join(' '))
    else this.query = this.query.select('-__v')

    return this
  }

  paginate() {
    const skip = (this.queryObject.page * 1 - 1 || 0) * (this.queryObject.limit * 1 || 100)
    this.query = this.query.skip(skip).limit(this.queryObject.limit * 1 || 100)

    return this
  }
}

module.exports = APIFeatures
