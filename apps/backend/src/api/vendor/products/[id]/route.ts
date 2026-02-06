import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")
  const context = (req as any).cityosContext
  const { id } = req.params

  if (!context?.vendorId) {
    return res.status(403).json({ message: "Vendor context required" })
  }

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
      "options.*",
    ],
    filters: { id },
  })

  if (!products || products.length === 0) {
    return res.status(404).json({ message: "Product not found" })
  }

  // Verify vendor ownership
  if (products[0].metadata?.vendor_id !== context.vendorId) {
    return res.status(403).json({ message: "Not authorized to access this product" })
  }

  return res.json({ product: products[0] })
}

export async function PATCH(req: MedusaRequest, res: MedusaResponse) {
  const context = (req as any).cityosContext
  const { id } = req.params

  if (!context?.vendorId) {
    return res.status(403).json({ message: "Vendor context required" })
  }

  // Verify ownership
  const query = req.scope.resolve("query")
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "metadata"],
    filters: { id },
  })

  if (!products || products.length === 0) {
    return res.status(404).json({ message: "Product not found" })
  }

  if (products[0].metadata?.vendor_id !== context.vendorId) {
    return res.status(403).json({ message: "Not authorized to update this product" })
  }

  // Import workflow
  const { updateProductsWorkflow } = await import("@medusajs/medusa/core-flows")

  const body = req.body as Record<string, any>
  const { result } = await updateProductsWorkflow(req.scope).run({
    input: {
      products: [
        {
          id,
          ...body,
        },
      ],
    },
  })

  return res.json({ product: result[0] })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const context = (req as any).cityosContext
  const { id } = req.params

  if (!context?.vendorId) {
    return res.status(403).json({ message: "Vendor context required" })
  }

  // Verify ownership
  const query = req.scope.resolve("query")
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "metadata"],
    filters: { id },
  })

  if (!products || products.length === 0) {
    return res.status(404).json({ message: "Product not found" })
  }

  if (products[0].metadata?.vendor_id !== context.vendorId) {
    return res.status(403).json({ message: "Not authorized to delete this product" })
  }

  // Import workflow
  const { deleteProductsWorkflow } = await import("@medusajs/medusa/core-flows")

  await deleteProductsWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  return res.status(204).send()
}
