import { getQueueService, SyncJobData } from '../queue'

export async function queueSyncJob(jobData: Omit<SyncJobData, 'targetSystem'> & { targetSystem?: 'medusa' | 'payload' }) {
  try {
    const queueService = getQueueService()
    
    // Also create database record for tracking
    const { getPayload } = await import('payload')
    const config = await import('../../payload.config')
    const payload = await getPayload({ config: config.default })
    
    await payload.create({
      collection: 'sync-jobs',
      data: {
        jobType: jobData.jobType,
        status: 'queued',
        tenantId: jobData.tenantId,
        storeId: jobData.storeId,
        sourceCollection: jobData.sourceCollection,
        sourceDocId: jobData.sourceDocId,
        targetSystem: jobData.targetSystem || 'medusa',
        targetId: jobData.targetId,
        metadata: jobData.metadata,
      }
    })
    
    // Add to queue
    await queueService.addSyncJob({
      ...jobData,
      targetSystem: jobData.targetSystem || 'medusa',
    })
    
    return { success: true }
  } catch (error) {
    console.error('Error queuing sync job:', error)
    throw error
  }
}
