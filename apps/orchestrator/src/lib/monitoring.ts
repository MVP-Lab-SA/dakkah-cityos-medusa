/**
 * Monitoring and Logging Utilities
 * 
 * Provides structured logging and performance monitoring
 * Ready for integration with external services (Sentry, Datadog, etc.)
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: any
}

/**
 * Structured logger
 */
export class Logger {
  private context: LogContext

  constructor(context: LogContext = {}) {
    this.context = context
  }

  private log(level: LogLevel, message: string, meta?: LogContext) {
    const timestamp = new Date().toISOString()
    const logData = {
      timestamp,
      level,
      message,
      ...this.context,
      ...meta
    }

    const logString = JSON.stringify(logData, null, 2)

    switch (level) {
      case 'debug':
        console.debug(logString)
        break
      case 'info':
        console.info(logString)
        break
      case 'warn':
        console.warn(logString)
        break
      case 'error':
        console.error(logString)
        break
    }

    // Send to external monitoring service if configured
    if (process.env.SENTRY_DSN && level === 'error') {
      // TODO: Send to Sentry
      // Sentry.captureException(new Error(message), { extra: logData })
    }
  }

  debug(message: string, meta?: LogContext) {
    if (process.env.NODE_ENV !== 'production') {
      this.log('debug', message, meta)
    }
  }

  info(message: string, meta?: LogContext) {
    this.log('info', message, meta)
  }

  warn(message: string, meta?: LogContext) {
    this.log('warn', message, meta)
  }

  error(message: string, meta?: LogContext) {
    this.log('error', message, meta)
  }

  child(context: LogContext): Logger {
    return new Logger({ ...this.context, ...context })
  }
}

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  private startTime: number
  private checkpoints: Map<string, number>

  constructor() {
    this.startTime = Date.now()
    this.checkpoints = new Map()
  }

  /**
   * Mark a checkpoint
   */
  checkpoint(name: string) {
    this.checkpoints.set(name, Date.now())
  }

  /**
   * Get duration since start
   */
  duration(): number {
    return Date.now() - this.startTime
  }

  /**
   * Get duration of a checkpoint
   */
  checkpointDuration(name: string): number | null {
    const time = this.checkpoints.get(name)
    return time ? Date.now() - time : null
  }

  /**
   * Get all metrics
   */
  metrics() {
    const metrics: { [key: string]: number } = {
      total: this.duration()
    }

    this.checkpoints.forEach((time, name) => {
      metrics[name] = Date.now() - time
    })

    return metrics
  }

  /**
   * Log metrics
   */
  log(logger: Logger, message: string) {
    logger.info(message, {
      performance: this.metrics()
    })
  }
}

/**
 * Metrics tracking
 */
export class Metrics {
  private static counters: Map<string, number> = new Map()
  private static gauges: Map<string, number> = new Map()
  private static histograms: Map<string, number[]> = new Map()

  /**
   * Increment a counter
   */
  static increment(metric: string, value: number = 1) {
    const current = this.counters.get(metric) || 0
    this.counters.set(metric, current + value)
  }

  /**
   * Set a gauge value
   */
  static gauge(metric: string, value: number) {
    this.gauges.set(metric, value)
  }

  /**
   * Record a histogram value
   */
  static histogram(metric: string, value: number) {
    const values = this.histograms.get(metric) || []
    values.push(value)
    this.histograms.set(metric, values)
  }

  /**
   * Get all metrics
   */
  static getAll() {
    return {
      counters: Object.fromEntries(this.counters),
      gauges: Object.fromEntries(this.gauges),
      histograms: Object.fromEntries(
        Array.from(this.histograms.entries()).map(([key, values]) => [
          key,
          {
            count: values.length,
            min: Math.min(...values),
            max: Math.max(...values),
            avg: values.reduce((a, b) => a + b, 0) / values.length
          }
        ])
      )
    }
  }

  /**
   * Reset all metrics
   */
  static reset() {
    this.counters.clear()
    this.gauges.clear()
    this.histograms.clear()
  }
}

/**
 * Error tracking
 */
export class ErrorTracker {
  private static errors: Array<{
    timestamp: Date
    message: string
    stack?: string
    context?: LogContext
  }> = []

  /**
   * Track an error
   */
  static track(error: Error, context?: LogContext) {
    this.errors.push({
      timestamp: new Date(),
      message: error.message,
      stack: error.stack,
      context
    })

    // Send to external service if configured
    if (process.env.SENTRY_DSN) {
      // TODO: Send to Sentry
      // Sentry.captureException(error, { extra: context })
    }
  }

  /**
   * Get recent errors
   */
  static getRecent(limit: number = 100) {
    return this.errors.slice(-limit)
  }

  /**
   * Clear errors
   */
  static clear() {
    this.errors = []
  }
}

/**
 * Health check utilities
 */
export class HealthCheck {
  private static checks: Map<string, () => Promise<boolean>> = new Map()

  /**
   * Register a health check
   */
  static register(name: string, checkFn: () => Promise<boolean>) {
    this.checks.set(name, checkFn)
  }

  /**
   * Run all health checks
   */
  static async runAll() {
    const results: { [key: string]: boolean } = {}
    
    for (const [name, checkFn] of this.checks) {
      try {
        results[name] = await checkFn()
      } catch (error) {
        results[name] = false
      }
    }

    return {
      healthy: Object.values(results).every(v => v === true),
      checks: results,
      timestamp: new Date().toISOString()
    }
  }
}

// Default logger instance
export const logger = new Logger({ service: 'orchestrator' })

// Sync-specific loggers
export const syncLogger = new Logger({ service: 'orchestrator', module: 'sync' })
export const queueLogger = new Logger({ service: 'orchestrator', module: 'queue' })
export const webhookLogger = new Logger({ service: 'orchestrator', module: 'webhook' })
