import Queue from 'bull'
import express = require('express')
import promClient from 'prom-client'
import client = require('prom-client')
import { bullQueueMetrics } from 'src/lib/bullQueueMetrics'
import { captureQueueName, assessmentQueueName, capturePrefix, assessmentPrefix} from 'src/constants'
const delay = require('delay')

require('dotenv').config()

const port = process.env.PORT || 3000
const app: express.Application = express()
/*
const captureQueue = new Queue(captureQueueName, {
  redis: {
    port: parseInt(process.env.REDIS_PORT || '6379'),
    host: process.env.REDIS_HOST,
  }
})

const assessmentQueue = new Queue(assessmentQueueName, {
  redis: {
    port: parseInt(process.env.REDIS_PORT || '6379'),
    host: process.env.REDIS_HOST,
  }
})

// create captureQueue metrics client
const captureMetric = new bullQueueMetrics({
  promClient, // optional, it will use internal prom client if it is not given
  interval: 5000, // optional, in ms, default to 60000
}, captureQueueName, capturePrefix)

// create assessmentQueue metrics client
const assessmentMetric = new bullQueueMetrics({
  promClient, // optional, it will use internal prom client if it is not given
  interval: 7000, // optional, in ms, default to 60000
}, assessmentQueueName, assessmentPrefix)

// start monitoring captureQueue
captureMetric.start(captureQueue)

// start monitoring assesssmentQueue
assessmentMetric.start(assessmentQueue)

// open the url to prometheus for access ot metrics
app.get('/metrics', function (req, res) {
  res.set('Content-Type', promClient.register.contentType);
  res.end(promClient.register.metrics())
})
*/
app.listen(port, () => console.log(`Bull Queue Metrics listening on PORT ${port}`))

process.on('SIGTERM',  () => {
  console.info('SIGTERM signal received.')

  //delay(100)

  //process.exit(0)
})
