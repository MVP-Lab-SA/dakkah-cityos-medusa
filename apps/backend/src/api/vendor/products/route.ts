import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type { VendorModuleService } from "../../types"

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

  const filters: Record<string, unknown> = {
    "metadata.vendor_id": context.vendorId,
  }

  if (status) filters.status = status

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
    filters,
    pagination: {
      skip: Number(offset),
      take: Number(limit),
    },
  })

  // Get total count
  const { data: allProducts } = await query.graph({
    entity: "product",
    fields: ["id"],
    filters,
  })

  return res.json({
    products,
    count: allProducts.length,
    limit: Number(limit),
    offset: Number(offset),
  })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const context = (req as any).cityosContext as CityOSContext | undefined

  if (!context?.vendorId) {
    return res.status(403).json({ message: "Vendor context required" })
  }

  const vendorModule = req.scope.resolve("vendor") as VendorModuleService
  const vendor = await vendorModule.retrieveVendor(context.vendorId)

  // Import workflow
  const { createProductsWorkflow } = await import("@medusajs/medusa/core-flows")

  const body = req.body as Record<string, any>
  const productData = {
    ...body,
    metadata: {
      ...body.metadata,
      vendor_id: context.vendorId,
      tenant_id: vendor.tenant_id,
    },
    status: vendor.auto_approve_products ? "published" : "draft", // Auto-approve or pending review
  }

  const { result } = await createProductsWorkflow(req.scope).run({
    input: {
      products: [productData],
    },
  })

  return res.status(201).json({ product: result[0] })
}
