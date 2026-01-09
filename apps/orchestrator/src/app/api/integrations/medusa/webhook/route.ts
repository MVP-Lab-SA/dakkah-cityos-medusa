import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { verifyWebhookSignature, generateRequestId, calculatePayloadHash } from '@/lib/webhookVerification'

export async function POST(req: NextRequest) {
  const requestId = generateRequestId()
  const payload = await getPayload({ config })
  
  let tenantId: string | null = null
  let storeId: string | null = null
  let eventType: string = 'unknown'
  let signatureValid = false
  let status: 'success' | 'failed' = 'success'
  let errorMessage: string | undefined
  
  try {
    // Get webhook body
    const body = await req.text()
    const jsonBody = JSON.parse(body)
    
    eventType = jsonBody.event || jsonBody.type || 'unknown'
    tenantId = jsonBody.tenant_id || req.headers.get('x-tenant-id')
    storeId = jsonBody.store_id || req.headers.get('x-store-id')
    
    // Verify signature
    const signature = req.headers.get('x-medusa-signature') || req.headers.get('x-webhook-signature')
    const secret = process.env.MEDUSA_WEBHOOK_SECRET
    
    if (signature && secret) {
      signatureValid = verifyWebhookSignature({
        secret,
        signatureHeader: signature,
        payload: body,
        tolerance: parseInt(process.env.WEBHOOK_REPLAY_WINDOW_SECONDS || '300'),
      })
      
      if (!signatureValid) {
        throw new Error('Invalid webhook signature')
      }
    }
    
    // Calculate payload hash for deduplication
    const payloadHash = calculatePayloadHash(jsonBody)
    
    // Check for duplicate webhook (within last hour)
    const oneHourAgo = new Date(Date.now() - 3600000)
    const existing = await payload.find({
      collection: 'webhook-logs',
      where: {
        and: [
          { payloadHash: { equals: payloadHash } },
          { createdAt: { greater_than: oneHourAgo.toISOString() } },
        ]
      },
      limit: 1,
    })
    
    if (existing.docs.length > 0) {
      console.log(`Duplicate webhook detected: ${requestId}`)
      return NextResponse.json({ 
        received: true, 
        duplicate: true,
        requestId 
      })
    }
    
    // Process webhook based on event type
    switch (eventType) {
      case 'order.placed':
      case 'order.completed':
        await handleOrderEvent(jsonBody, payload, tenantId, storeId)
        break
      
      case 'product.created':
      case 'product.updated':
        await handleProductEvent(jsonBody, payload, tenantId, storeId)
        break
      
      case 'vendor.created':
      case 'vendor.updated':
      case 'vendor.approved':
        await handleVendorEvent(jsonBody, payload, tenantId, storeId)
        break
      
      case 'tenant.created':
      case 'tenant.updated':
        await handleTenantEvent(jsonBody, payload, tenantId, storeId)
        break
      
      case 'inventory.low':
        await handleInventoryEvent(jsonBody, payload, tenantId, storeId)
        break
      
      default:
        console.log(`Unhandled event type: ${eventType}`)
    }
    
    // Log successful webhook
    await payload.create({
      collection: 'webhook-logs',
      data: {
        requestId,
        systemType: 'medusa',
        direction: 'inbound',
        tenantId,
        storeId,
        eventType,
        signatureValid,
        status: 'success',
        attempts: 1,
        payloadHash,
        responseCode: 200,
        responseBodySnippet: JSON.stringify({ received: true }).substring(0, 1000),
      }
    })
    
    return NextResponse.json({ 
      received: true,
      requestId,
      eventType,
    })
    
  } catch (error: any) {
    status = 'failed'
    errorMessage = error.message
    
    // Log failed webhook
    await payload.create({
      collection: 'webhook-logs',
      data: {
        requestId,
        systemType: 'medusa',
        direction: 'inbound',
        tenantId,
        storeId,
        eventType,
        signatureValid,
        status: 'failed',
        attempts: 1,
        responseCode: 500,
        errorMessage,
      }
    })
    
    return NextResponse.json({ 
      error: 'Webhook processing failed',
      requestId,
    }, { status: 500 })
  }
}

async function handleOrderEvent(data: any, payload: any, tenantId: string | null, storeId: string | null) {
  // Create sync job to update order status in Payload
  await payload.create({
    collection: 'sync-jobs',
    data: {
      jobType: 'medusa_to_payload',
      status: 'queued',
      tenantId,
      storeId,
      sourceCollection: 'orders',
      sourceDocId: data.id,
      targetSystem: 'payload',
      metadata: {
        event: data.event,
        orderStatus: data.status,
      },
    }
  })
}

async function handleProductEvent(data: any, payload: any, tenantId: string | null, storeId: string | null) {
  // Create sync job to sync product from Medusa to Payload
  await payload.create({
    collection: 'sync-jobs',
    data: {
      jobType: 'medusa_to_payload',
      status: 'queued',
      tenantId,
      storeId,
      sourceCollection: 'products',
      sourceDocId: data.id,
      targetSystem: 'payload',
      metadata: {
        event: data.event,
        sourceData: {
          id: data.id,
          title: data.title,
          handle: data.handle,
          description: data.description,
          metadata: data.metadata,
        },
      },
    }
  })
}

async function handleVendorEvent(data: any, payload: any, tenantId: string | null, storeId: string | null) {
  // Create sync job to sync vendor from Medusa to Payload
  await payload.create({
    collection: 'sync-jobs',
    data: {
      jobType: 'medusa_to_payload',
      status: 'queued',
      tenantId,
      storeId,
      sourceCollection: 'vendors',
      sourceDocId: data.id,
      targetSystem: 'payload',
      metadata: {
        event: data.event,
        sourceData: {
          id: data.id,
          name: data.name,
          business_name: data.business_name,
          handle: data.handle,
          email: data.email,
          phone: data.phone,
          status: data.status,
          metadata: data.metadata,
        },
      },
    }
  })
}

async function handleTenantEvent(data: any, payload: any, tenantId: string | null, storeId: string | null) {
  // Create sync job to sync tenant from Medusa to Payload
  await payload.create({
    collection: 'sync-jobs',
    data: {
      jobType: 'medusa_to_payload',
      status: 'queued',
      tenantId,
      storeId,
      sourceCollection: 'tenants',
      sourceDocId: data.id,
      targetSystem: 'payload',
      metadata: {
        event: data.event,
        sourceData: {
          id: data.id,
          name: data.name,
          handle: data.handle,
          code: data.code,
          is_active: data.is_active,
          default_currency: data.default_currency,
          default_language: data.default_language,
          metadata: data.metadata,
        },
      },
    }
  })
}

async function handleInventoryEvent(data: any, payload: any, tenantId: string | null, storeId: string | null) {
  // Log inventory alert
  console.log(`Low inventory alert for product: ${data.product_id}`)
  
  // Create audit log
  await payload.create({
    collection: 'audit-logs',
    data: {
      entityType: 'inventory',
      entityId: data.product_id,
      action: 'inventory.low',
      tenantId,
      timestamp: new Date().toISOString(),
      metadata: {
        quantity: data.quantity,
        threshold: data.threshold,
        locationId: data.location_id,
      }
    }
  })
  
  // TODO: Send notification via notification service
}
