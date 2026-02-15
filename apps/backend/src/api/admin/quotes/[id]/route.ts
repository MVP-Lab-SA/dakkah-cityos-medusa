import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { handleApiError } from "../../../../lib/api-error-handler"

// GET /admin/quotes/:id
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const { id } = req.params
  
    const { data: quotes } = await query.graph({
      entity: "quote",
      fields: ["*"],
      filters: { id },
    })
  
    if (!quotes.length) {
      return res.status(404).json({ message: "Quote not found" })
    }
  
    const quote = quotes[0]
  
    // Fetch items
    const { data: items } = await query.graph({
      entity: "quote_item",
      fields: ["*"],
      filters: { quote_id: id },
    })
  
    // Fetch company and customer
    let company = null
    let customer = null
  
    if (quote.company_id) {
      const { data: companies } = await query.graph({
        entity: "company",
        fields: ["id", "name", "email", "phone"],
        filters: { id: quote.company_id },
      })
      company = companies[0] || null
    }
  
    if (quote.customer_id) {
      const { data: customers } = await query.graph({
        entity: "customer",
        fields: ["id", "email", "first_name", "last_name", "phone"],
        filters: { id: quote.customer_id },
      })
      customer = customers[0] || null
    }
  
    res.json({ quote: { ...quote, items, company, customer } })

  } catch (error) {
    handleApiError(res, error, "GET admin quotes id")
  }
}

// PUT /admin/quotes/:id - Update quote
export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  try {
    const quoteModule = req.scope.resolve("quote")
    const { id } = req.params
  
    const {
      custom_discount_percentage,
      custom_discount_amount,
      discount_reason,
      valid_until,
      internal_notes,
    } = req.body as {
      custom_discount_percentage?: number
      custom_discount_amount?: number
      discount_reason?: string
      valid_until?: string
      internal_notes?: string
    }
  
    const updateData: Record<string, unknown> = { id }
    if (custom_discount_percentage !== undefined) updateData.custom_discount_percentage = custom_discount_percentage
    if (custom_discount_amount !== undefined) updateData.custom_discount_amount = custom_discount_amount
    if (discount_reason !== undefined) updateData.discount_reason = discount_reason
    if (valid_until !== undefined) updateData.valid_until = valid_until ? new Date(valid_until) : null
    if (internal_notes !== undefined) updateData.internal_notes = internal_notes
  
    const quote = await quoteModule.updateQuotes(updateData)
  
    res.json({ quote })

  } catch (error) {
    handleApiError(res, error, "PUT admin quotes id")
  }
}
