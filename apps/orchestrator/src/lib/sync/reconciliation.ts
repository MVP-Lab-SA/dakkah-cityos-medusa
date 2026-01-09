import { Payload } from 'payload'

export interface ReconciliationResult {
  entity: string
  totalChecked: number
  mismatches: number
  fixed: number
  errors: string[]
}

export async function reconcileProducts(payload: Payload, tenantId: string): Promise<ReconciliationResult> {
  const result: ReconciliationResult = {
    entity: 'products',
    totalChecked: 0,
    mismatches: 0,
    fixed: 0,
    errors: []
  }
  
  try {
    // Get all product content for this tenant
    const productContent = await payload.find({
      collection: 'product-content',
      where: {
        tenant: { equals: tenantId }
      },
      limit: 1000,
    })
    
    result.totalChecked = productContent.docs.length
    
    // Get Medusa endpoint
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
      result.errors.push('No Medusa integration found')
      return result
    }
    
    const endpoint = integration.docs[0]
    const apiKey = process.env[endpoint.secretRef] || process.env.MEDUSA_API_KEY
    
    // Check each product
    for (const content of productContent.docs) {
      if (!content.medusaProductId) {
        result.mismatches++
        continue
      }
      
      try {
        // Fetch from Medusa
        const response = await fetch(`${endpoint.baseUrl}/admin/products/${content.medusaProductId}`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          }
        })
        
        if (!response.ok) {
          result.mismatches++
          result.errors.push(`Product ${content.medusaProductId} not found in Medusa`)
          continue
        }
        
        const { product } = await response.json()
        
        // Check for mismatches
        if (product.title !== content.title || product.handle !== content.handle) {
          result.mismatches++
          
          // Fix by updating Payload
          await payload.update({
            collection: 'product-content',
            id: content.id,
            data: {
              title: product.title,
              handle: product.handle,
              lastSyncAt: new Date().toISOString(),
              syncStatus: 'synced',
            }
          })
          
          result.fixed++
        }
      } catch (error: any) {
        result.errors.push(`Error checking product ${content.medusaProductId}: ${error.message}`)
      }
    }
    
  } catch (error: any) {
    result.errors.push(`Reconciliation error: ${error.message}`)
  }
  
  return result
}

export async function reconcileVendors(payload: Payload, tenantId: string): Promise<ReconciliationResult> {
  const result: ReconciliationResult = {
    entity: 'vendors',
    totalChecked: 0,
    mismatches: 0,
    fixed: 0,
    errors: []
  }
  
  try {
    // Get all stores (vendors) for this tenant
    const stores = await payload.find({
      collection: 'stores',
      where: {
        tenant: { equals: tenantId }
      },
      limit: 1000,
    })
    
    result.totalChecked = stores.docs.length
    
    // Get Medusa endpoint
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
      result.errors.push('No Medusa integration found')
      return result
    }
    
    const endpoint = integration.docs[0]
    const apiKey = process.env[endpoint.secretRef] || process.env.MEDUSA_API_KEY
    
    // Check each vendor
    for (const store of stores.docs) {
      if (!store.medusaVendorId) {
        result.mismatches++
        continue
      }
      
      try {
        // Fetch vendor from Medusa custom module
        const response = await fetch(`${endpoint.baseUrl}/admin/vendors/${store.medusaVendorId}`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          }
        })
        
        if (!response.ok) {
          result.mismatches++
          result.errors.push(`Vendor ${store.medusaVendorId} not found in Medusa`)
          continue
        }
        
        const { vendor } = await response.json()
        
        // Check for mismatches
        const expectedName = vendor.name || vendor.business_name
        if (expectedName !== store.name) {
          result.mismatches++
          
          // Fix by updating Payload
          await payload.update({
            collection: 'stores',
            id: store.id,
            data: {
              name: expectedName,
              lastSyncAt: new Date().toISOString(),
            }
          })
          
          result.fixed++
        }
      } catch (error: any) {
        result.errors.push(`Error checking vendor ${store.medusaVendorId}: ${error.message}`)
      }
    }
    
  } catch (error: any) {
    result.errors.push(`Reconciliation error: ${error.message}`)
  }
  
  return result
}

export async function reconcileTenants(payload: Payload): Promise<ReconciliationResult> {
  const result: ReconciliationResult = {
    entity: 'tenants',
    totalChecked: 0,
    mismatches: 0,
    fixed: 0,
    errors: []
  }
  
  try {
    // Get all tenants
    const tenants = await payload.find({
      collection: 'tenants',
      limit: 1000,
    })
    
    result.totalChecked = tenants.docs.length
    
    // Check each tenant
    for (const tenant of tenants.docs) {
      if (!tenant.medusaTenantId) {
        result.mismatches++
        continue
      }
      
      try {
        // Get Medusa endpoint for this tenant
        const integration = await payload.find({
          collection: 'integration-endpoints',
          where: {
            and: [
              { systemType: { equals: 'medusa' } },
              { tenantId: { equals: tenant.id } },
              { enabled: { equals: true } },
            ]
          },
          limit: 1,
        })
        
        if (integration.docs.length === 0) {
          result.errors.push(`No Medusa integration for tenant ${tenant.name}`)
          continue
        }
        
        const endpoint = integration.docs[0]
        const apiKey = process.env[endpoint.secretRef] || process.env.MEDUSA_API_KEY
        
        // Fetch tenant from Medusa custom module
        const response = await fetch(`${endpoint.baseUrl}/admin/tenants/${tenant.medusaTenantId}`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          }
        })
        
        if (!response.ok) {
          result.mismatches++
          result.errors.push(`Tenant ${tenant.medusaTenantId} not found in Medusa`)
          continue
        }
        
        const { tenant: medusaTenant } = await response.json()
        
        // Check for mismatches
        if (medusaTenant.name !== tenant.name || medusaTenant.handle !== tenant.slug) {
          result.mismatches++
          
          // Fix by updating Payload
          await payload.update({
            collection: 'tenants',
            id: tenant.id,
            data: {
              name: medusaTenant.name,
              slug: medusaTenant.handle || medusaTenant.code,
              lastSyncAt: new Date().toISOString(),
            }
          })
          
          result.fixed++
        }
      } catch (error: any) {
        result.errors.push(`Error checking tenant ${tenant.medusaTenantId}: ${error.message}`)
      }
    }
    
  } catch (error: any) {
    result.errors.push(`Reconciliation error: ${error.message}`)
  }
  
  return result
}
