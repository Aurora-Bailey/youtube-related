const cluster = require('cluster')
global.__basedir = __dirname

if (cluster.isMaster) {
  const Master = require('./master')
  const master = new Master(cluster)
} else {
  const Worker = require(process.env.WORKER_SCRIPT)
  const worker = new Worker(cluster)
}
