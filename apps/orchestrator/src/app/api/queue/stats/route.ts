import { NextRequest, NextResponse } from 'next/server'
import { getQueueService } from '@/lib/queue'

export async function GET(req: NextRequest) {
  try {
    const queueService = getQueueService()
    const stats = await queueService.getQueueStats()
    
    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error: any) {
    console.error('Error getting queue stats:', error)
    return NextResponse.json({
      error: error.message,
    }, { status: 500 })
  }
}
