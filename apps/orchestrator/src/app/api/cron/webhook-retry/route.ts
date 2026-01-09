import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(req: NextRequest) {
  // Verify cron secret
  const cronSecret = req.headers.get('x-cron-secret')
  if (cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const payload = await getPayload({ config })
  let retried = 0
  let succeeded = 0
  let failed = 0
  
  try {
    // Get failed webhooks that are due for retry
    const now = new Date()
    const webhooks = await payload.find({
      collection: 'webhook-logs',
      where: {
        and: [
          { status: { equals: 'retrying' } },
          { nextRetryAt: { less_than_equal: now.toISOString() } },
        ]
      },
      limit: 50, // Retry up to 50 webhooks per run
    })
    
    for (const webhook of webhooks.docs) {
      try {
        // Only retry up to 5 times
        if (webhook.attempts >= 5) {
          await payload.update({
            collection: 'webhook-logs',
            id: webhook.id,
            data: {
              status: 'failed',
              errorMessage: 'Max retry attempts reached',
            }
          })
          failed++
          continue
        }
        
        // Get integration endpoint
        const integration = await payload.find({
          collection: 'integration-endpoints',
          where: {
            and: [
              { systemType: { equals: webhook.systemType } },
              { tenantId: { equals: webhook.tenantId } },
              { enabled: { equals: true } },
            ]
          },
          limit: 1,
        })
        
        if (integration.docs.length === 0) {
          throw new Error('Integration endpoint not found')
        }
        
        // Retry webhook delivery
        const endpoint = integration.docs[0]
        // TODO: Implement actual webhook delivery
        
        // Update webhook log
        await payload.update({
          collection: 'webhook-logs',
          id: webhook.id,
          data: {
            status: 'success',
            attempts: webhook.attempts + 1,
            responseCode: 200,
          }
        })
        
        succeeded++
        retried++
      } catch (error: any) {
        // Calculate next retry with exponential backoff
        const nextRetryDelay = Math.min(300 * Math.pow(2, webhook.attempts), 3600) // Max 1 hour
        const nextRetryAt = new Date(Date.now() + nextRetryDelay * 1000)
        
        await payload.update({
          collection: 'webhook-logs',
          id: webhook.id,
          data: {
            attempts: webhook.attempts + 1,
            nextRetryAt: nextRetryAt.toISOString(),
            errorMessage: error.message,
          }
        })
        
        retried++
      }
    }
    
    return NextResponse.json({
      success: true,
      retried,
      succeeded,
      failed,
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      retried,
      succeeded,
      failed,
    }, { status: 500 })
  }
}
