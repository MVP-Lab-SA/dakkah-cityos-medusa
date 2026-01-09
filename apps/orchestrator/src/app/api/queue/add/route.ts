import { NextRequest, NextResponse } from 'next/server'
import { getQueueService } from '@/lib/queue'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const { jobType, tenantId, storeId, sourceCollection, sourceDocId, targetSystem, targetId, metadata } = body
    
    if (!jobType || !tenantId || !sourceCollection || !sourceDocId || !targetSystem) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 })
    }
    
    const queueService = getQueueService()
    const job = await queueService.addSyncJob({
      jobType,
      tenantId,
      storeId,
      sourceCollection,
      sourceDocId,
      targetSystem,
      targetId,
      metadata,
    })
    
    return NextResponse.json({
      success: true,
      jobId: job.id,
      message: 'Sync job added to queue',
    })
  } catch (error: any) {
    console.error('Error adding job to queue:', error)
    return NextResponse.json({
      error: error.message,
    }, { status: 500 })
  }
}
