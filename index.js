const Mongo = require('./mongo.js')
const youtubeScraper = new Mongo('youtube-scraper')

class Main {
  constructor () {
    this.run()
  }

  run () {
    try {
      this.getData()
    } catch (e) {
      console.log(e)
    }
  }

  async getData () {
    let db = await youtubeScraper.getDB()
    let x = await db.collection('crawled').find({}, {limit: 1}).toArray()
    console.log('x')
    console.log(x)
    youtubeScraper.close()
  }
}

const main = new Main()
