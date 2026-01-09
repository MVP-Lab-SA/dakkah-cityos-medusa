import Bull, { Queue, Job } from 'bull'
import Redis from 'ioredis'

export interface SyncJobData {
  jobType: 'payload_to_medusa' | 'medusa_to_payload' | 'reconcile'
  tenantId: string
  storeId?: string
  sourceCollection: string
  sourceDocId: string
  targetSystem: 'medusa' | 'payload'
  targetId?: string
  metadata?: Record<string, any>
}

class QueueService {
  private syncQueue: Queue<SyncJobData> | null = null
  private redis: Redis | null = null
  
  private getRedisConfig() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
    const url = new URL(redisUrl)
    
    return {
      host: url.hostname,
      port: parseInt(url.port) || 6379,
      password: url.password || undefined,
      db: parseInt(url.pathname.slice(1)) || 0,
      tls: url.protocol === 'rediss:' ? {} : undefined,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    }
  }
  
  async initializeQueue() {
    if (this.syncQueue) {
      return this.syncQueue
    }
    
    const redisConfig = this.getRedisConfig()
    
    this.syncQueue = new Bull<SyncJobData>('sync-jobs', {
      redis: redisConfig,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: 100, // Keep last 100 completed jobs
        removeOnFail: 200, // Keep last 200 failed jobs
      },
    })
    
    // Process jobs
    this.syncQueue.process(async (job: Job<SyncJobData>) => {
      return await this.processJob(job)
    })
    
    // Error handlers
    this.syncQueue.on('error', (error) => {
      console.error('Queue error:', error)
    })
    
    this.syncQueue.on('failed', (job, err) => {
      console.error(`Job ${job.id} failed with error:`, err)
    })
    
    this.syncQueue.on('completed', (job) => {
      console.log(`Job ${job.id} completed successfully`)
    })
    
    return this.syncQueue
  }
  
  async addSyncJob(jobData: SyncJobData) {
    const queue = await this.initializeQueue()
    
    const job = await queue.add(jobData, {
      jobId: `${jobData.jobType}-${jobData.sourceCollection}-${jobData.sourceDocId}-${Date.now()}`,
    })
    
    console.log(`Added sync job ${job.id}:`, jobData)
    return job
  }
  
  async processJob(job: Job<SyncJobData>) {
    const { jobType, sourceCollection, sourceDocId, tenantId, storeId } = job.data
    
    console.log(`Processing job ${job.id}: ${jobType} for ${sourceCollection}/${sourceDocId}`)
    
    // Update job progress
    await job.progress(10)
    
    try {
      const payload = await this.getPayload()
      
      // Find the sync job in database
      const syncJobs = await payload.find({
        collection: 'sync-jobs',
        where: {
          and: [
            { sourceCollection: { equals: sourceCollection } },
            { sourceDocId: { equals: sourceDocId } },
            { status: { equals: 'queued' } },
          ]
        },
        limit: 1,
        sort: '-createdAt',
      })
      
      if (syncJobs.docs.length === 0) {
        console.log(`No matching sync job found in database for ${sourceCollection}/${sourceDocId}`)
        return { status: 'skipped', reason: 'no_database_record' }
      }
      
      const syncJobDoc = syncJobs.docs[0]
      
      // Update status to running
      await payload.update({
        collection: 'sync-jobs',
        id: syncJobDoc.id,
        data: {
          status: 'running',
          startedAt: new Date().toISOString(),
        }
      })
      
      await job.progress(30)
      
      // Process based on job type
      let result
      if (jobType === 'payload_to_medusa') {
        const { syncContentToMedusa, syncPageToMedusa, syncBrandingToMedusa } = await import('./sync/payloadToMedusa')
        
        const context = {
          job: syncJobDoc,
          payload,
          tenantId,
          storeId,
        }
        
        // Fetch source document
        const doc = await payload.findByID({
          collection: sourceCollection as any,
          id: sourceDocId,
        })
        
        await job.progress(50)
        
        // Route to appropriate sync function
        switch (sourceCollection) {
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
            throw new Error(`Unsupported source collection: ${sourceCollection}`)
        }
      } else if (jobType === 'medusa_to_payload') {
        const { syncProductToPayload, syncVendorToPayload, syncTenantToPayload, syncOrderToPayload } = await import('./sync/medusaToPayload')
        
        const context = {
          job: syncJobDoc,
          payload,
          tenantId,
          storeId,
        }
        
        await job.progress(50)
        
        const sourceData = syncJobDoc.metadata?.sourceData
        if (!sourceData) {
          throw new Error('Missing source data in job metadata')
        }
        
        // Route to appropriate sync function
        switch (sourceCollection) {
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
            throw new Error(`Unsupported source collection: ${sourceCollection}`)
        }
      } else if (jobType === 'reconcile') {
        const { reconcileProducts, reconcileVendors, reconcileTenants } = await import('./sync/reconciliation')
        
        await job.progress(50)
        
        const entity = syncJobDoc.metadata?.entity || 'products'
        
        switch (entity) {
          case 'products':
            result = await reconcileProducts(payload, tenantId)
            break
          case 'vendors':
            result = await reconcileVendors(payload, tenantId)
            break
          case 'tenants':
            result = await reconcileTenants(payload)
            break
          default:
            throw new Error(`Unsupported reconciliation entity: ${entity}`)
        }
      }
      
      await job.progress(90)
      
      // Update sync job as success
      await payload.update({
        collection: 'sync-jobs',
        id: syncJobDoc.id,
        data: {
          status: 'success',
          finishedAt: new Date().toISOString(),
          logs: [
            ...(syncJobDoc.logs || []),
            {
              timestamp: new Date().toISOString(),
              level: 'info',
              message: `Successfully synced: ${JSON.stringify(result)}`,
            }
          ]
        }
      })
      
      await job.progress(100)
      
      return { status: 'success', result }
      
    } catch (error: any) {
      console.error(`Error processing job ${job.id}:`, error)
      
      // Update sync job as failed
      try {
        const payload = await this.getPayload()
        const syncJobs = await payload.find({
          collection: 'sync-jobs',
          where: {
            and: [
              { sourceCollection: { equals: sourceCollection } },
              { sourceDocId: { equals: sourceDocId } },
              { status: { in: ['queued', 'running'] } },
            ]
          },
          limit: 1,
          sort: '-createdAt',
        })
        
        if (syncJobs.docs.length > 0) {
          await payload.update({
            collection: 'sync-jobs',
            id: syncJobs.docs[0].id,
            data: {
              status: 'failed',
              finishedAt: new Date().toISOString(),
              errorMessage: error.message,
              logs: [
                ...(syncJobs.docs[0].logs || []),
                {
                  timestamp: new Date().toISOString(),
                  level: 'error',
                  message: error.message,
                }
              ]
            }
          })
        }
      } catch (updateError) {
        console.error('Failed to update sync job status:', updateError)
      }
      
      throw error
    }
  }
  
  private async getPayload() {
    const { getPayload } = await import('payload')
    const config = await import('../payload.config')
    return getPayload({ config: config.default })
  }
  
  async getQueueStats() {
    const queue = await this.initializeQueue()
    
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
    ])
    
    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
      total: waiting + active + completed + failed + delayed,
    }
  }
  
  async close() {
    if (this.syncQueue) {
      await this.syncQueue.close()
      this.syncQueue = null
    }
    
    if (this.redis) {
      await this.redis.quit()
      this.redis = null
    }
  }
}

// Singleton instance
let queueServiceInstance: QueueService | null = null

export function getQueueService(): QueueService {
  if (!queueServiceInstance) {
    queueServiceInstance = new QueueService()
  }
  return queueServiceInstance
}

export default getQueueService
