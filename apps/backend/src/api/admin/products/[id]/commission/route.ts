// @ts-nocheck
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../../lib/api-error-handler"

// GET - Get per-product commission override
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const { id } = req.params
    const query = req.scope.resolve("query")

    const { data: commissions } = await query.graph({
      entity: "product_commission",
      fields: ["id", "product_id", "rate", "type", "created_at", "updated_at"],
      filters: { product_id: id }
    })

    if (!commissions.length) {
      // Return default (no override)
      return res.json({
        product_id: id,
        has_override: false,
        commission: null
      })
    }

    res.json({
      product_id: id,
      has_override: true,
      commission: commissions[0]
    })

  } catch (error) {
    handleApiError(res, error, "GET admin products id commission")
  }
}

// POST - Create per-product commission override
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const { id } = req.params
    const { rate, type = "percentage" } = req.body as {
      rate: number
      type?: "percentage" | "fixed"
    }

    const commissionService = req.scope.resolve("commissionModuleService")
    const query = req.scope.resolve("query")

    // Validate rate
    if (type === "percentage" && (rate < 0 || rate > 100)) {
      return res.status(400).json({ message: "Percentage rate must be between 0 and 100" })
    }

    if (rate < 0) {
      return res.status(400).json({ message: "Rate cannot be negative" })
    }

    // Check if override already exists
    const { data: existing } = await query.graph({
      entity: "product_commission",
      fields: ["id"],
      filters: { product_id: id }
    })

    if (existing.length > 0) {
      return res.status(400).json({ 
        message: "Commission override already exists. Use PUT to update." 
      })
    }

    const commission = await commissionService.createProductCommissions({
      product_id: id,
      rate,
      type
    })

    res.status(201).json({
      message: "Commission override created",
      commission
    })

  } catch (error) {
    handleApiError(res, error, "POST admin products id commission")
  }
}

// PUT - Update per-product commission override
export async function PUT(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const { id } = req.params
    const { rate, type } = req.body as {
      rate?: number
      type?: "percentage" | "fixed"
    }

    const commissionService = req.scope.resolve("commissionModuleService")
    const query = req.scope.resolve("query")

    // Find existing override
    const { data: existing } = await query.graph({
      entity: "product_commission",
      fields: ["id"],
      filters: { product_id: id }
    })

    if (!existing.length) {
      return res.status(404).json({ message: "No commission override found for this product" })
    }

    // Validate rate
    if (rate !== undefined) {
      const effectiveType = type || "percentage"
      if (effectiveType === "percentage" && (rate < 0 || rate > 100)) {
        return res.status(400).json({ message: "Percentage rate must be between 0 and 100" })
      }
      if (rate < 0) {
        return res.status(400).json({ message: "Rate cannot be negative" })
      }
    }

    await commissionService.updateProductCommissions({
      selector: { product_id: id },
      data: {
        ...(rate !== undefined && { rate }),
        ...(type && { type })
      }
    })

    const { data: updated } = await query.graph({
      entity: "product_commission",
      fields: ["id", "product_id", "rate", "type"],
      filters: { product_id: id }
    })

    res.json({
      message: "Commission override updated",
      commission: updated[0]
    })

  } catch (error) {
    handleApiError(res, error, "PUT admin products id commission")
  }
}

// DELETE - Remove per-product commission override
export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const { id } = req.params
    const commissionService = req.scope.resolve("commissionModuleService")
    const query = req.scope.resolve("query")

    const { data: existing } = await query.graph({
      entity: "product_commission",
      fields: ["id"],
      filters: { product_id: id }
    })

    if (!existing.length) {
      return res.status(404).json({ message: "No commission override found for this product" })
    }

    await commissionService.deleteProductCommissions(existing[0].id)

    res.json({
      message: "Commission override removed",
      product_id: id
    })

  } catch (error) {
    handleApiError(res, error, "DELETE admin products id commission")
  }
}
