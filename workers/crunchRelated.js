const chalk = require('chalk')
const lib = require(__basedir + '/lib.js')
const Mongo = require(__basedir + '/mongo.js')
const youtubeScraper = new Mongo('youtube-scraper')

class CrunchRelated {
  constructor (cluster) {
    this.cluster = cluster
    this.i = parseInt(process.env.WORKER_I)
    this.skip = parseInt(process.env.WORKER_SKIP)
    this.limit = parseInt(process.env.WORKER_LIMIT)
    console.log(`${chalk.bgGreen.black(' ' + this.i + ' ')}${lib.memoryUsed()}${lib.stopwatch()} ${chalk.green(process.env.WORKER_SCRIPT)} started! {skip: ${chalk.yellow(this.skip)}, limit: ${chalk.yellow(this.limit)}`)

    this.run()
  }

  async run () {
    try {
      let data = this.getData()
      crunch(data)
    } catch (e) {
      console.log(e)
    }
  }

  crunch (data) {
    console.log(`${chalk.bgGreen.black(' ' + this.i + ' ')}${lib.memoryUsed()}${lib.stopwatch()} crunch data...`)

  }

  async getData () {
    console.log(`${chalk.bgGreen.black(' ' + this.i + ' ')}${lib.memoryUsed()}${lib.stopwatch()} loading data from MongoDB...`)
    let db = await youtubeScraper.getDB()
    let data = await db.collection('channel_subscriptions').find({}, {limit: this.limit, skip: this.skip}).toArray()
    youtubeScraper.close()
    return data
  }
}

module.exports = CrunchRelated
