import { Payload } from 'payload'

export interface SyncContext {
  job: any
  payload: Payload
  tenantId: string
  storeId?: string
}

export async function syncContentToMedusa(context: SyncContext, contentDoc: any) {
  const { payload, tenantId } = context
  
  // Get Medusa integration endpoint
  const integration = await getMedusaEndpoint(payload, tenantId)
  const medusaProductId = contentDoc.medusaProductId
  
  if (!medusaProductId) {
    throw new Error('Content document missing medusaProductId')
  }
  
  // Update product metadata in Medusa
  const response = await fetch(`${integration.baseUrl}/admin/products/${medusaProductId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${integration.apiKey}`,
    },
    body: JSON.stringify({
      metadata: {
        // Content metadata
        payload_content_id: contentDoc.id,
        seo_title: contentDoc.seoTitle,
        seo_description: contentDoc.seoDescription,
        seo_keywords: contentDoc.seoKeywords,
        last_content_sync: new Date().toISOString(),
        
        // Rich content references
        long_description: contentDoc.longDescription,
        features: contentDoc.features,
        specifications: contentDoc.specifications,
      }
    })
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Medusa API error: ${response.status} - ${error}`)
  }
  
  const result = await response.json()
  return { action: 'updated', medusaId: medusaProductId, response: result }
}

export async function syncPageToMedusa(context: SyncContext, pageDoc: any) {
  const { payload, tenantId } = context
  
  // Get Medusa integration endpoint
  const integration = await getMedusaEndpoint(payload, tenantId)
  
  // Store page metadata in Medusa (custom endpoint)
  const response = await fetch(`${integration.baseUrl}/store/pages/${pageDoc.slug}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': integration.publishableKey,
    },
    body: JSON.stringify({
      slug: pageDoc.slug,
      title: pageDoc.title,
      payload_page_id: pageDoc.id,
      last_sync: new Date().toISOString(),
    })
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Medusa API error: ${response.status} - ${error}`)
  }
  
  const result = await response.json()
  return { action: 'synced', pageSlug: pageDoc.slug, response: result }
}

export async function syncBrandingToMedusa(context: SyncContext, storeDoc: any) {
  const { payload, tenantId } = context
  
  // Get Medusa integration endpoint
  const integration = await getMedusaEndpoint(payload, tenantId)
  
  // Update store/vendor branding in Medusa
  const response = await fetch(`${integration.baseUrl}/admin/stores/${storeDoc.medusaVendorId || 'default'}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${integration.apiKey}`,
    },
    body: JSON.stringify({
      metadata: {
        branding: storeDoc.branding,
        payload_store_id: storeDoc.id,
        last_branding_sync: new Date().toISOString(),
      }
    })
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Medusa API error: ${response.status} - ${error}`)
  }
  
  const result = await response.json()
  return { action: 'updated', storeId: storeDoc.id, response: result }
}

async function getMedusaEndpoint(payload: Payload, tenantId: string) {
  const integration = await payload.find({
    collection: 'integration-endpoints',
    where: {
      and: [
        { systemType: { equals: 'medusa' } },
        { tenantId: { equals: tenantId } },
        { enabled: { equals: true } },
      ]
    },
    limit: 1,
  })
  
  if (integration.docs.length === 0) {
    throw new Error(`No Medusa integration endpoint found for tenant: ${tenantId}`)
  }
  
  const endpoint = integration.docs[0]
  const apiKey = process.env[endpoint.secretRef] || process.env.MEDUSA_API_KEY
  const publishableKey = process.env.MEDUSA_PUBLISHABLE_KEY
  
  if (!apiKey) {
    throw new Error('Medusa API key not configured')
  }
  
  return {
    baseUrl: endpoint.baseUrl,
    apiKey,
    publishableKey,
  }
}
