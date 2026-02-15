import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../lib/api-error-handler"

// Reference the same store (in production, use database)
const paymentTermsStore: Map<string, any> = new Map()

/**
 * @route GET /admin/payment-terms/:id
 * @desc Get a specific payment term
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { id } = req.params

    const term = paymentTermsStore.get(id)
    if (!term) {
      return res.status(404).json({ error: "Payment term not found" })
    }

    res.json({ payment_term: term })
  } catch (error: any) {
    handleApiError(res, error, "ADMIN-PAYMENT-TERMS-ID")}
}

/**
 * @route PUT /admin/payment-terms/:id
 * @desc Update a payment term
 */
export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { id } = req.params
    const updates = req.body as {
      name?: string
      net_days?: number
      discount_percent?: number
      discount_days?: number
      is_default?: boolean
      is_active?: boolean
    }

    const existingTerm = paymentTermsStore.get(id)
    if (!existingTerm) {
      return res.status(404).json({ error: "Payment term not found" })
    }

    // Validate
    if (updates.discount_percent !== undefined && (updates.discount_percent < 0 || updates.discount_percent > 100)) {
      return res.status(400).json({ error: "Discount percent must be between 0 and 100" })
    }

    const net_days = updates.net_days ?? existingTerm.net_days
    const discount_days = updates.discount_days ?? existingTerm.discount_days
    
    if (discount_days > net_days) {
      return res.status(400).json({ error: "Discount days cannot exceed net days" })
    }

    // Update code if discount values changed
    const discount_percent = updates.discount_percent ?? existingTerm.discount_percent
    let code: string
    if (discount_percent > 0 && discount_days > 0) {
      code = `${discount_percent}/${discount_days} Net ${net_days}`
    } else {
      code = `Net ${net_days}`
    }

    // Handle default flag
    if (updates.is_default) {
      paymentTermsStore.forEach((term, key) => {
        if (term.is_default && key !== id) {
          paymentTermsStore.set(key, { ...term, is_default: false })
        }
      })
    }

    const updatedTerm = {
      ...existingTerm,
      ...updates,
      code,
      updated_at: new Date()
    }

    paymentTermsStore.set(id, updatedTerm)

    res.json({ payment_term: updatedTerm })
  } catch (error: any) {
    handleApiError(res, error, "ADMIN-PAYMENT-TERMS-ID")}
}

/**
 * @route DELETE /admin/payment-terms/:id
 * @desc Delete a payment term
 */
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { id } = req.params

    const term = paymentTermsStore.get(id)
    if (!term) {
      return res.status(404).json({ error: "Payment term not found" })
    }

    if (term.is_default) {
      return res.status(400).json({ error: "Cannot delete the default payment term" })
    }

    paymentTermsStore.delete(id)

    res.json({ success: true, deleted_id: id })
  } catch (error: any) {
    handleApiError(res, error, "ADMIN-PAYMENT-TERMS-ID")}
}

