import { NextRequest, NextResponse } from 'next/server'
import { Metrics } from '../../../lib/monitoring'
import redis from '../../../lib/cache'

export async function GET(request: NextRequest) {
  try {
    // Get application metrics
    const appMetrics = Metrics.getAll()
    
    // Get Redis info
    let redisMetrics = {}
    try {
      const info = await redis.info()
      const lines = info.split('\r\n')
      redisMetrics = lines.reduce((acc: any, line) => {
        if (line.includes(':')) {
          const [key, value] = line.split(':')
          acc[key] = isNaN(Number(value)) ? value : Number(value)
        }
        return acc
      }, {})
    } catch (error) {
      redisMetrics = { error: 'Redis unavailable' }
    }
    
    // Get queue metrics
    const queueMetrics = {
      // These would come from Bull queue
      // For now, placeholder
      jobs: {
        completed: 0,
        failed: 0,
        active: 0,
        waiting: 0
      }
    }
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      application: appMetrics,
      redis: redisMetrics,
      queue: queueMetrics,
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to get metrics'
      },
      { status: 500 }
    )
  }
}
