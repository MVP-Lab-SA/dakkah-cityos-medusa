import { NextRequest, NextResponse } from 'next/server'
import { HealthCheck } from '../../../lib/monitoring'
import redis from '../../../lib/cache'
import { getPayload } from 'payload'
import config from '@payload-config'

// Register health checks
HealthCheck.register('redis', async () => {
  try {
    await redis.ping()
    return true
  } catch {
    return false
  }
})

HealthCheck.register('payload', async () => {
  try {
    const payload = await getPayload({ config })
    // Try a simple query
    await payload.find({
      collection: 'stores',
      limit: 1
    })
    return true
  } catch {
    return false
  }
})

HealthCheck.register('medusa', async () => {
  try {
    const response = await fetch(
      `${process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'}/health`,
      { method: 'GET' }
    )
    return response.ok
  } catch {
    return false
  }
})

export async function GET(request: NextRequest) {
  try {
    const results = await HealthCheck.runAll()
    
    const status = results.healthy ? 200 : 503
    
    return NextResponse.json(results, { status })
  } catch (error) {
    return NextResponse.json(
      {
        healthy: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    )
  }
}
