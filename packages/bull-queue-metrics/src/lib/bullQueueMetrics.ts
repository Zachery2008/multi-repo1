import client = require('prom-client')
import * as bull from 'bull'

interface Options {
  promClient?: any;
  interval?: number;
}

export class bullQueueMetrics {
  // labels of metrics
  QUEUE_NAME_LABEL: string
  QUEUE_PREFIX_LABEL: string
  
  // interval of mini-seconds to query jobs' counts 
  private _interval: number
  
  // metrics names 
  private _activeMetricName: string
  private _waitingMetricName: string
  private _completedMetricName: string
  private _failedMetricName: string
  private _delayedMetricName: string
  private _durationMetricName: string

  private _completedMetric: any
  private _failedMetric: any
  private _delayedMetric: any
  private _activeMetric: any
  private _waitingMetric: any
  private _durationMetric: any

  constructor(opts: Options, queueName: string, queuePrefix: string) {
    const { interval = 60000, promClient = client } = opts;

    this.QUEUE_NAME_LABEL = queueName
    this.QUEUE_PREFIX_LABEL = queuePrefix

    this._interval = interval

    this._activeMetricName = queuePrefix + '_jobs_active_total'
    this._waitingMetricName = queuePrefix + '_jobs_waiting_total'
    this._completedMetricName = queuePrefix + '_jobs_completed_total'
    this._failedMetricName = queuePrefix + '_jobs_failed_total'
    this._delayedMetricName = queuePrefix + '_jobs_delayed_total'
    this._durationMetricName = queuePrefix + '_jobs_duration_milliseconds'

    this._completedMetric = new promClient.Gauge({
      name: this._completedMetricName,
      help: 'Number of completed jobs',
      labelNames: [this.QUEUE_NAME_LABEL, this.QUEUE_PREFIX_LABEL],
    })

    this._failedMetric = new promClient.Gauge({
      name: this._failedMetricName,
      help: 'Number of failed jobs',
      labelNames: [this.QUEUE_NAME_LABEL, this.QUEUE_PREFIX_LABEL],
    })

    this._delayedMetric = new promClient.Gauge({
      name: this._delayedMetricName,
      help: 'Number of delayed jobs',
      labelNames: [this.QUEUE_NAME_LABEL, this.QUEUE_PREFIX_LABEL],
    })
  
    this._activeMetric = new promClient.Gauge({
      name: this._activeMetricName,
      help: 'Number of active jobs',
      labelNames: [this.QUEUE_NAME_LABEL, this.QUEUE_PREFIX_LABEL],
    })
  
    this._waitingMetric = new promClient.Gauge({
      name: this._waitingMetricName,
      help: 'Number of waiting jobs',
      labelNames: [this.QUEUE_NAME_LABEL, this.QUEUE_PREFIX_LABEL],
    })
  
    this._durationMetric = new promClient.Summary({
      name: this._durationMetricName,
      help: 'Time to complete jobs',
      labelNames: [this.QUEUE_NAME_LABEL, this.QUEUE_PREFIX_LABEL],
      maxAgeSeconds: 300,
      ageBuckets: 13,
    })

  }
  
  public start(queue: bull.Queue) {
    let metricInterval: any

    // @ts-ignore
    const keyPrefix = queue.keyPrefix.replace(/.*\{|\}/gi, '')

    const labels = {
      [this.QUEUE_NAME_LABEL]: queue.name,
      [this.QUEUE_PREFIX_LABEL]: keyPrefix,
    }

    queue.on('completed', (job) => {
      if (!job.finishedOn) {
        return
      }
      const duration = job.finishedOn - job.processedOn!;
      this._durationMetric.observe(labels, duration);
    })

    metricInterval = setInterval(() => {
      queue
        .getJobCounts()
        .then(({ completed, failed, delayed, active, waiting }) => {
          this._completedMetric.set(labels, (completed || 0))
          this._failedMetric.set(labels, (failed || 0))
          this._delayedMetric.set(labels, (delayed || 0))
          this._activeMetric.set(labels, (active || 0))
          this._waitingMetric.set(labels, (waiting || 0))
        })
    }, this._interval)
    return {
      stop: () => metricInterval.clearInterval(),
    }
  }
  
}
