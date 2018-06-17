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
    this.data = false
    this.ready = false
    console.log(`${chalk.bgGreen.black(' ' + this.i + ' ')}${lib.memoryUsed()}${lib.stopwatch()} ${chalk.green(process.env.WORKER_SCRIPT)} started! {skip: ${chalk.yellow(this.skip)}, limit: ${chalk.yellow(this.limit)}`)

    this.setup()
  }

  crunch (channelList) {
    // console.log(`${chalk.bgGreen.black(' ' + this.i + ' ')}${lib.memoryUsed()}${lib.stopwatch()} crunch data...`)
    this.data.forEach(channel => {
      let subs = channel.subscriptions
      channelList.forEach(channelItem => {

      })

    })

  }

  message (text) {
    let msg = JSON.parse(text)
    if (msg.m === "crunch") {
      this.crunch(msg.channels)
    }
  }

  async setup () {
    process.on('message', this.message)
    this.data = await this.getData()
    this.ready = true
    process.send(JSON.stringify({
      m: 'setup',
      v: true
    }))
    console.log(`${chalk.bgGreen.black(' ' + this.i + ' ')}${lib.memoryUsed()}${lib.stopwatch()} ready`)
  }

  async getData () {
    // console.log(`${chalk.bgGreen.black(' ' + this.i + ' ')}${lib.memoryUsed()}${lib.stopwatch()} loading data from MongoDB...`)
    let db = await youtubeScraper.getDB()
    let data = await db.collection('channel_subscriptions').find({}, {limit: this.limit, skip: this.skip}).toArray()
    youtubeScraper.close()
    return data
  }
}

module.exports = CrunchRelated
