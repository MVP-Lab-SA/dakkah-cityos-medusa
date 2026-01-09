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
  const { syncContentToMedusa, syncPageToMedusa, syncBrandingToMedusa } = await import('@/lib/sync/payloadToMedusa')
  
  const context = {
    job,
    payload,
    tenantId: job.tenantId,
    storeId: job.storeId,
  }
  
  // Fetch source document
  const doc = await payload.findByID({
    collection: job.sourceCollection,
    id: job.sourceDocId,
  })
  
  let result
  
  // Route to appropriate sync function based on collection
  switch (job.sourceCollection) {
    case 'product-content':
      result = await syncContentToMedusa(context, doc)
      break
    case 'pages':
      result = await syncPageToMedusa(context, doc)
      break
    case 'stores':
      result = await syncBrandingToMedusa(context, doc)
      break
    default:
      throw new Error(`Unsupported source collection: ${job.sourceCollection}`)
  }
  
  // Update job with result
  await payload.update({
    collection: 'sync-jobs',
    id: job.id,
    data: {
      logs: [
        ...(job.logs || []),
        {
          timestamp: new Date().toISOString(),
          level: 'info',
          message: `Successfully synced: ${JSON.stringify(result)}`,
        }
      ]
    }
  })
}

async function syncMedusaToPayload(job: any, payload: any) {
  const { syncProductToPayload, syncVendorToPayload, syncTenantToPayload, syncOrderToPayload } = await import('@/lib/sync/medusaToPayload')
  
  const context = {
    job,
    payload,
    tenantId: job.tenantId,
    storeId: job.storeId,
  }
  
  // Get the data from job metadata (passed from webhook)
  const sourceData = job.metadata?.sourceData
  
  if (!sourceData) {
    throw new Error('Missing source data in job metadata')
  }
  
  let result
  
  // Route to appropriate sync function based on source collection
  switch (job.sourceCollection) {
    case 'products':
      result = await syncProductToPayload(context, sourceData)
      break
    case 'vendors':
      result = await syncVendorToPayload(context, sourceData)
      break
    case 'tenants':
      result = await syncTenantToPayload(context, sourceData)
      break
    case 'orders':
      result = await syncOrderToPayload(context, sourceData)
      break
    default:
      throw new Error(`Unsupported source collection: ${job.sourceCollection}`)
  }
  
  // Update job with result
  await payload.update({
    collection: 'sync-jobs',
    id: job.id,
    data: {
      targetId: result.id,
      logs: [
        ...(job.logs || []),
        {
          timestamp: new Date().toISOString(),
          level: 'info',
          message: `Successfully synced: ${JSON.stringify(result)}`,
        }
      ]
    }
  })
}

async function reconcileData(job: any, payload: any) {
  const { reconcileProducts, reconcileVendors, reconcileTenants } = await import('@/lib/sync/reconciliation')
  
  let result
  
  // Route to appropriate reconciliation based on metadata
  const entity = job.metadata?.entity || 'products'
  
  switch (entity) {
    case 'products':
      result = await reconcileProducts(payload, job.tenantId)
      break
    case 'vendors':
      result = await reconcileVendors(payload, job.tenantId)
      break
    case 'tenants':
      result = await reconcileTenants(payload)
      break
    default:
      throw new Error(`Unsupported reconciliation entity: ${entity}`)
  }
  
  // Update job with result
  await payload.update({
    collection: 'sync-jobs',
    id: job.id,
    data: {
      logs: [
        ...(job.logs || []),
        {
          timestamp: new Date().toISOString(),
          level: 'info',
          message: `Reconciliation complete: ${JSON.stringify(result)}`,
        }
      ]
    }
  })
}
