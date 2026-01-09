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
  let processed = 0
  let failed = 0
  
  try {
    // Get queued sync jobs
    const jobs = await payload.find({
      collection: 'sync-jobs',
      where: {
        status: { equals: 'queued' }
      },
      limit: 100, // Process up to 100 jobs per run
      sort: 'createdAt',
    })
    
    for (const job of jobs.docs) {
      try {
        // Mark as running
        await payload.update({
          collection: 'sync-jobs',
          id: job.id,
          data: {
            status: 'running',
            startedAt: new Date().toISOString(),
          }
        })
        
        // Process based on job type
        if (job.jobType === 'payload_to_medusa') {
          await syncPayloadToMedusa(job, payload)
        } else if (job.jobType === 'medusa_to_payload') {
          await syncMedusaToPayload(job, payload)
        } else if (job.jobType === 'reconcile') {
          await reconcileData(job, payload)
        }
        
        // Mark as success
        await payload.update({
          collection: 'sync-jobs',
          id: job.id,
          data: {
            status: 'success',
            finishedAt: new Date().toISOString(),
          }
        })
        
        processed++
      } catch (error: any) {
        // Mark as failed
        await payload.update({
          collection: 'sync-jobs',
          id: job.id,
          data: {
            status: 'failed',
            finishedAt: new Date().toISOString(),
            errorMessage: error.message,
          }
        })
        
        failed++
      }
    }
    
    return NextResponse.json({
      success: true,
      processed,
      failed,
      total: jobs.docs.length,
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      processed,
      failed,
    }, { status: 500 })
  }
}

async function syncPayloadToMedusa(job: any, payload: any) {
  // Get integration endpoint for Medusa
  const integration = await payload.find({
    collection: 'integration-endpoints',
    where: {
      and: [
        { systemType: { equals: 'medusa' } },
        { tenantId: { equals: job.tenantId } },
        { enabled: { equals: true } },
      ]
    },
    limit: 1,
  })
  
  if (integration.docs.length === 0) {
    throw new Error('No Medusa integration endpoint found')
  }
  
  const endpoint = integration.docs[0]
  const apiKey = process.env[endpoint.secretRef] || process.env.MEDUSA_API_KEY
  
  // Fetch source document
  const doc = await payload.findByID({
    collection: job.sourceCollection,
    id: job.sourceDocId,
  })
  
  // Sync to Medusa
  const response = await fetch(`${endpoint.baseUrl}/admin/products/${job.targetId || doc.medusaProductId}`, {
    method: job.targetId ? 'POST' : 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'x-publishable-api-key': doc.store || '',
    },
    body: JSON.stringify({
      // Map Payload fields to Medusa fields
      metadata: {
        payload_content_id: doc.id,
        last_sync: new Date().toISOString(),
      }
    })
  })
  
  if (!response.ok) {
    throw new Error(`Medusa API error: ${response.statusText}`)
  }
}

async function syncMedusaToPayload(job: any, payload: any) {
  // TODO: Implement Medusa → Payload sync
  console.log('Syncing from Medusa to Payload', job)
}

async function reconcileData(job: any, payload: any) {
  // TODO: Implement data reconciliation
  console.log('Reconciling data', job)
}
