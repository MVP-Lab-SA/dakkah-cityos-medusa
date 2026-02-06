import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

interface CityOSContext {
  vendorId?: string
  tenantId?: string
  storeId?: string
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")
  const context = (req as any).cityosContext as CityOSContext | undefined

  if (!context?.vendorId) {
    return res.status(403).json({ message: "Vendor context required" })
  }

  const { limit = 20, offset = 0, status } = req.query as Record<string, string>

  // Note: metadata filtering may need custom implementation
  const { data: products } = await query.graph({
    entity: "product",
    fields: [
      "id",
      "title",
      "handle",
      "status",
      "thumbnail",
      "description",
      "metadata",
      "variants.*",
      "variants.prices.*",
      "images.*",
    ],
    filters: status ? { status: status as any } : undefined,
    pagination: {
      skip: Number(offset),
      take: Number(limit),
    },
  })

  // Filter by vendor_id in metadata (client-side for now)
  const vendorProducts = products.filter(
    (p: any) => p.metadata?.vendor_id === context.vendorId
  )

  return res.json({
    products: vendorProducts,
    count: vendorProducts.length,
    limit: Number(limit),
    offset: Number(offset),
  })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const context = (req as any).cityosContext as CityOSContext | undefined

  if (!context?.vendorId) {
    return res.status(403).json({ message: "Vendor context required" })
  }

  const vendorModule = req.scope.resolve("vendor") as any
  const vendor = await vendorModule.retrieveVendor(context.vendorId)

  // Import workflow
  const { createProductsWorkflow } = await import("@medusajs/medusa/core-flows")

  const body = req.body as Record<string, any>
  const productData: any = {
    title: body.title,
    handle: body.handle,
    description: body.description,
    thumbnail: body.thumbnail,
    images: body.images,
    options: body.options,
    variants: body.variants,
    category_ids: body.category_ids,
    collection_id: body.collection_id,
    type_id: body.type_id,
    metadata: {
      ...body.metadata,
      vendor_id: context.vendorId,
      tenant_id: vendor?.tenant_id,
    },
    status: vendor?.auto_approve_products ? "published" : "draft",
  }

  const { result } = await createProductsWorkflow(req.scope).run({
    input: {
      products: [productData],
    },
  })

  return res.status(201).json({ product: result[0] })
}
