import { Payload } from 'payload'

export interface SyncContext {
  job: any
  payload: Payload
  tenantId: string
  storeId?: string
}

export async function syncProductToPayload(context: SyncContext, productData: any) {
  const { job, payload, tenantId } = context
  
  // Check if product content already exists
  const existing = await payload.find({
    collection: 'product-content',
    where: {
      medusaProductId: { equals: productData.id }
    },
    limit: 1,
  })
  
  const contentData = {
    title: productData.title,
    handle: productData.handle,
    medusaProductId: productData.id,
    tenant: tenantId,
    store: job.storeId,
    description: productData.description || '',
    seoTitle: productData.metadata?.seo_title || productData.title,
    seoDescription: productData.metadata?.seo_description || productData.description || '',
    seoKeywords: productData.metadata?.seo_keywords || '',
    lastSyncAt: new Date().toISOString(),
    syncStatus: 'synced',
  }
  
  if (existing.docs.length > 0) {
    // Update existing
    await payload.update({
      collection: 'product-content',
      id: existing.docs[0].id,
      data: contentData
    })
    
    return { action: 'updated', id: existing.docs[0].id }
  } else {
    // Create new
    const created = await payload.create({
      collection: 'product-content',
      data: contentData
    })
    
    return { action: 'created', id: created.id }
  }
}

export async function syncVendorToPayload(context: SyncContext, vendorData: any) {
  const { payload, tenantId } = context
  
  // Vendors in Medusa are stored in custom vendor module
  // We'll create a Store in Payload to represent the vendor's storefront
  const existing = await payload.find({
    collection: 'stores',
    where: {
      medusaVendorId: { equals: vendorData.id }
    },
    limit: 1,
  })
  
  const storeData = {
    name: vendorData.name || vendorData.business_name,
    handle: vendorData.handle,
    medusaVendorId: vendorData.id,
    tenant: tenantId,
    status: vendorData.status === 'active' ? 'active' : 'inactive',
    branding: {
      primaryColor: vendorData.metadata?.primary_color || '#000000',
      logoUrl: vendorData.metadata?.logo_url || '',
    },
    contact: {
      email: vendorData.email || '',
      phone: vendorData.phone || '',
    },
    lastSyncAt: new Date().toISOString(),
  }
  
  if (existing.docs.length > 0) {
    await payload.update({
      collection: 'stores',
      id: existing.docs[0].id,
      data: storeData
    })
    
    return { action: 'updated', id: existing.docs[0].id }
  } else {
    const created = await payload.create({
      collection: 'stores',
      data: storeData
    })
    
    return { action: 'created', id: created.id }
  }
}

export async function syncTenantToPayload(context: SyncContext, tenantData: any) {
  const { payload } = context
  
  const existing = await payload.find({
    collection: 'tenants',
    where: {
      medusaTenantId: { equals: tenantData.id }
    },
    limit: 1,
  })
  
  const tenantPayloadData = {
    name: tenantData.name,
    slug: tenantData.handle || tenantData.code,
    medusaTenantId: tenantData.id,
    status: tenantData.is_active ? 'active' : 'inactive',
    settings: {
      defaultCurrency: tenantData.default_currency || 'usd',
      defaultLanguage: tenantData.default_language || 'en',
    },
    lastSyncAt: new Date().toISOString(),
  }
  
  if (existing.docs.length > 0) {
    await payload.update({
      collection: 'tenants',
      id: existing.docs[0].id,
      data: tenantPayloadData
    })
    
    return { action: 'updated', id: existing.docs[0].id }
  } else {
    const created = await payload.create({
      collection: 'tenants',
      data: tenantPayloadData
    })
    
    return { action: 'created', id: created.id }
  }
}

export async function syncOrderToPayload(context: SyncContext, orderData: any) {
  const { payload, tenantId } = context
  
  // Create audit log for order event
  await payload.create({
    collection: 'audit-logs',
    data: {
      entityType: 'order',
      entityId: orderData.id,
      action: `order.${orderData.status}`,
      tenantId,
      actor: orderData.customer_id,
      timestamp: new Date().toISOString(),
      metadata: {
        total: orderData.total,
        currency: orderData.currency_code,
        items: orderData.items?.length || 0,
      }
    }
  })
  
  return { action: 'logged', id: orderData.id }
}
