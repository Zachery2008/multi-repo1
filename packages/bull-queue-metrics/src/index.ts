import Queue from 'bull'
import promClient from 'prom-client'
import * as bullProm from 'bull-prom';
 
let queue = new Queue('testQueue', {
  redis: {
    port: parseInt(process.env.REDIS_PORT || '6379'),
    host: process.env.REDIS_HOST
  },
})
 
const bullMetric = bullProm.init({
  promClient, // optional, it will use internal prom client if it is not given
  interval: 1000, // optional, in ms, default to 60000
});
 
const started = bullMetric.start(queue)
 
// Optional
//started.stop()
 