const numCPUs = require('os').cpus().length
const lib = require(__basedir + '/lib.js')
const Mongo = require(__basedir + '/mongo.js')
const youtubeScraper = new Mongo('youtube-scraper')
const chalk = require('chalk')

class Master {
  constructor (cluster) {
    this.cluster = cluster
    console.log(`${chalk.yellow.inverse('master')}${lib.memoryUsed()}${lib.stopwatch()} start`)

    this.setupClusterEvents()
    this.startWorkers()
  }

  setupClusterEvents () {
    this.cluster.on('exit', (worker, code, signal) => {
      console.log(`${chalk.yellow.inverse('master')}${lib.memoryUsed()}${lib.totaltime()} worker died`)

    });
  }

  async startWorkers () {
    let workersPerCore = 2
    let numWorkers = numCPUs * workersPerCore
    let channelSubscriptionNum = await this.countChannelSubscriptions()
    let channelsPerWorker = Math.ceil(channelSubscriptionNum / numWorkers)
    for (var i = 0; i < numWorkers; i++) {
      this.cluster.fork({WORKER_I: i, WORKER_SCRIPT: "./workers/crunchRelated.js", WORKER_SKIP: i * channelsPerWorker, WORKER_LIMIT: channelsPerWorker})
    }
  }

  async countChannelSubscriptions () {
    let db = await youtubeScraper.getDB()
    let num = await db.collection('channel_subscriptions').find().count()
    youtubeScraper.close()
    return num
  }
}

module.exports = Master
