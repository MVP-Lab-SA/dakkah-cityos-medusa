import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

/**
 * POST /store/quotes
 * Create a new quote request
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const quoteModuleService = req.scope.resolve("quoteModuleService") as any;
  const { items, customer_notes, company_id, tenant_id, region_id, store_id } = req.body as Record<string, any>;

  // Validate authenticated customer
  if (!req.auth_context?.actor_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const customerId = req.auth_context.actor_id;

  // Generate quote number
  const quoteNumber = await quoteModuleService.generateQuoteNumber();

  // Create quote
  const quote = await quoteModuleService.createQuotes({
    quote_number: quoteNumber,
    customer_id: customerId,
    company_id,
    tenant_id,
    store_id,
    region_id,
    status: "draft",
    customer_notes,
    currency_code: "usd",
  });

  // Create quote items
  const quoteItems = [];
  for (const item of ((items || []) as any[])) {
    const quoteItem = await quoteModuleService.createQuoteItems({
      quote_id: quote.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      title: item.title,
      sku: item.sku,
      thumbnail: item.thumbnail,
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: BigInt(item.unit_price) * BigInt(item.quantity),
      total: BigInt(item.unit_price) * BigInt(item.quantity),
    });
    quoteItems.push(quoteItem);
  }

  // Calculate totals
  await quoteModuleService.calculateQuoteTotals(quote.id);

  // Retrieve updated quote
  const updatedQuote = await quoteModuleService.retrieveQuote(quote.id, {
    relations: ["items"],
  });

  res.json({ quote: updatedQuote });
}

/**
 * GET /store/quotes
 * List customer's quotes
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const quoteModuleService = req.scope.resolve("quoteModuleService") as any;

  if (!req.auth_context?.actor_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const customerId = req.auth_context.actor_id;

  const quotes = await quoteModuleService.listQuotes(
    {
      customer_id: customerId,
    },
    {
      order: { created_at: "DESC" },
    }
  );

  res.json({ quotes, count: Array.isArray(quotes) ? quotes.length : 0 });
}
