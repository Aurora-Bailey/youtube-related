const Mongo = require('./mongo.js')
const youtubeScraper = new Mongo('youtube-scraper')

async function start () {
  let db = await youtubeScraper.getDB()
  console.log('start')
  let start = await db.collection('channel_info').find().sort({_id: 1}).limit(1).toArray()
  let startDate = start[0].crawlDate
  console.log('end')
  let end = await db.collection('channel_info').find().sort({_id: -1}).limit(1).toArray()
  let endDate = end[0].crawlDate

  console.log(startDate)
  console.log(endDate)

  let delta = endDate - startDate
  let numChunks = 1000
  let chunkSize = Math.ceil(delta / numChunks)

  console.log(['Date', 'Channel ID', 'Channel Name', 'Subscribers', 'Sum'].join(','))
  for (var i = 0; i < numChunks; i++) {
    let startChunk = startDate + (i * chunkSize)
    let endChunk = startChunk + chunkSize
    // console.log('chunk', chunkSize, JSON.stringify({crawlDate: {$gt: startChunk, $lt: endChunk}}))
    let largest = await db.collection('channel_info').find({crawlDate: {$gt: startChunk, $lt: endChunk}}).limit(1).sort({"info.statistics.subscriberCount": -1}).toArray()
    if (largest.length === 0) continue
    let subscriberCount = await db.collection('channel_info').find({crawlDate: {$gt: startChunk, $lt: endChunk}}, {projection: {"info.statistics.subscriberCount": 1, _id: 0}}).toArray()
    let sum = subscriberCount.map(v => {return v.info.statistics.subscriberCount}).reduce((a, c) => { return parseInt(a) + parseInt(c) })
    let date = new Date(largest[0].crawlDate)
    console.log([date.toJSON(), largest[0].info.id, largest[0].info.snippet.title, largest[0].info.statistics.subscriberCount, sum].join(','))
    subscriberCount = ''
  }
  console.log('DONE!')
}
start()
