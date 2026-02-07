import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// POST - Convert quote to order (admin)
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params
  const { notify_customer } = req.body as { notify_customer?: boolean }
  
  const query = req.scope.resolve("query")
  const quoteService = req.scope.resolve("quoteModuleService")

  const { data: quotes } = await query.graph({
    entity: "quote",
    fields: [
      "id", 
      "status", 
      "customer_id", 
      "company_id",
      "items.*",
      "total",
      "discount_total",
      "shipping_address.*",
      "billing_address.*",
      "valid_until"
    ],
    filters: { id }
  })

  if (!quotes.length) {
    return res.status(404).json({ message: "Quote not found" })
  }

  const quote = quotes[0]

  // Validate quote status
  if (quote.status !== "approved") {
    return res.status(400).json({ 
      message: "Only approved quotes can be converted to orders" 
    })
  }

  // Check if quote is still valid
  if (quote.valid_until && new Date(quote.valid_until) < new Date()) {
    return res.status(400).json({ 
      message: "Quote has expired. Please create a new quote." 
    })
  }

  try {
    // Create cart from quote
    const cartService = req.scope.resolve("cartModuleService")
    
    const cart = await cartService.createCarts({
      customer_id: quote.customer_id,
      metadata: {
        quote_id: quote.id,
        converted_by_admin: true
      }
    })

    // Add items from quote to cart
    for (const item of quote.items || []) {
      await cartService.addLineItems(cart.id, {
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_price: item.unit_price
      })
    }

    // Apply quote discount if any
    if (quote.discount_total > 0) {
      // TODO: Apply discount to cart
    }

    // Update quote status
    await quoteService.updateQuotes({
      selector: { id },
      data: {
        status: "converted",
        converted_at: new Date(),
        cart_id: cart.id
      }
    })

    // Notify customer if requested
    if (notify_customer) {
      // TODO: Send notification to customer
    }

    res.json({
      message: "Quote converted to cart successfully",
      quote_id: id,
      cart_id: cart.id
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
