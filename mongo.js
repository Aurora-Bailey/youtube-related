const {MongoClient} = require('mongodb')

class Mongo {
  constructor(dbName) {
    this._url = 'mongodb://localhost:27017' //104.198.106.226:27017'
    this._dbName = dbName
    this._db = false
    this._client = false
  }

  async close () {
    if (this._client) {
      await this._client.close()
      this._db = false
      this._client = false
    }
  }

  async getDB () {
    if (this._db) {
      return this._db
    } else {
      let client = await MongoClient.connect(this._url)
      this._db = client.db(this._dbName)
      this._client = client
      return this._db
    }
  }
}

module.exports = Mongo
