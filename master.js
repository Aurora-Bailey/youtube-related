const numCPUs = require('os').cpus().length
const lib = require(__basedir + '/lib.js')
const Mongo = require(__basedir + '/mongo.js')
const youtubeScraper = new Mongo('youtube-scraper')
const chalk = require('chalk')

class Master {
  constructor (cluster) {
    this.cluster = cluster
    console.log(`${chalk.yellow.inverse('master')}${lib.memoryUsed()}${lib.stopwatch()} start`)

    this.setup()
  }

  message (text) {
    let msg = JSON.parse(text)
  }

  async setup () {
    this.cluster.on('exit', (worker, code, signal) => { console.log(`${chalk.yellow.inverse('master')}${lib.memoryUsed()}${lib.totaltime()} worker died`) })
    this.startWorkers()
  }

  async startWorkers () {
    let workersPerCore = 2
    let numWorkers = numCPUs * workersPerCore
    let channelSubscriptionNum = await this.countChannelSubscriptions()
    let channelsPerWorker = Math.ceil(channelSubscriptionNum / numWorkers)
    for (var i = 0; i < numWorkers; i++) {
      this.cluster.fork({WORKER_I: i, WORKER_SCRIPT: "./workers/crunchRelated.js", WORKER_SKIP: i * channelsPerWorker, WORKER_LIMIT: channelsPerWorker})
      .on('message', this.message)
    }
  }

  async countChannelSubscriptions () {
    let db = await youtubeScraper.getDB()
    let num = await db.collection('channel_subscriptions').find().count()
    youtubeScraper.close()
    console.log(num, 'but returning', 100)
    return 100 // num
  }
}

module.exports = Master
