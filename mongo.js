const {MongoClient} = require('mongodb')

class Mongo {
  constructor(dbName) {
    this._url = 'mongodb://localhost:27017'
    this._dbName = dbName
    this._db = false
    this._client = false
  }

  close () {
    if (this._client) {
      this._client.close()
    }
  }

  async getDB () {
    if (this._db) {
      return this._db
    } else {
      let client = await MongoClient.connect(this._url, { useNewUrlParser: true })
      this._db = client.db(this._dbName)
      this._client = client
      return this._db
    }
  }
}

module.exports = Mongo
