const chalk = require('chalk')

class Lib {
  constructor () {
    this.stopwatch_now = Date.now()
    this.totaltime_start = Date.now()
  }

  memoryUsed () {
    const used = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
    return chalk.cyan.inverse(` ${used} MB `)
  }

  stopwatch () {
    let then = this.stopwatch_now
    this.stopwatch_now = Date.now()
    return chalk.magenta.inverse(` ${this.stopwatch_now - then} ms `)
  }

  totaltime () {
    let now = Date.now()
    return chalk.red.inverse(` ${((now - this.totaltime_start) / 60000).toFixed(2)} min `)
  }
}

module.exports = new Lib()
