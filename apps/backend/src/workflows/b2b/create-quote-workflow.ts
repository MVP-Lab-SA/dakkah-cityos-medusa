import {
  createWorkflow,
  WorkflowResponse,
  transform,
} from "@medusajs/framework/workflows-sdk";
import { Modules } from "@medusajs/framework/utils";

interface CreateQuoteInput {
  company_id: string;
  customer_id: string;
  tenant_id: string;
  store_id?: string;
  region_id?: string;
  items: Array<{
    product_id: string;
    variant_id: string;
    quantity: number;
    custom_unit_price?: string;
  }>;
  customer_notes?: string;
  valid_days?: number;
}

/**
 * Create B2B Quote Workflow
 * 
 * Creates a new quote request from a company.
 * Generates quote number and calculates totals.
 */
export const createQuoteWorkflow = createWorkflow(
  "create-quote",
  (input: CreateQuoteInput) => {
    // 1. Generate quote number
    const quoteNumber = transform({ input }, async ({ input }, { container }) => {
      const quoteService = container.resolve("quoteModuleService");
      return await quoteService.generateQuoteNumber();
    });

    // 2. Get product info for line items
    const productInfo = transform({ input }, async ({ input }, { container }) => {
      const productService = container.resolve(Modules.PRODUCT);
      const products: any[] = [];

      for (const item of input.items) {
        const product = await productService.retrieveProduct(item.product_id, {
          relations: ["variants"],
        });
        const variant = product.variants.find((v: any) => v.id === item.variant_id);
        
        products.push({
          ...item,
          title: product.title,
          description: product.description,
          sku: variant?.sku,
          thumbnail: product.thumbnail,
          unit_price: variant?.price?.amount || "0",
        });
      }

      return products;
    });

    // 3. Create quote
    const quote = transform(
      { input, quoteNumber, productInfo },
      async ({ input, quoteNumber, productInfo }, { container }) => {
        const quoteService = container.resolve("quoteModuleService");
        
        const validUntil = input.valid_days
          ? new Date(Date.now() + input.valid_days * 24 * 60 * 60 * 1000)
          : null;

        const quote = await quoteService.createQuotes({
          quote_number: quoteNumber,
          company_id: input.company_id,
          customer_id: input.customer_id,
          tenant_id: input.tenant_id,
          store_id: input.store_id,
          region_id: input.region_id,
          status: "draft",
          customer_notes: input.customer_notes,
          valid_until: validUntil,
        });

        return quote;
      }
    );

    // 4. Create quote items
    transform(
      { quote, productInfo },
      async ({ quote, productInfo }, { container }) => {
        const quoteService = container.resolve("quoteModuleService");

        for (const item of productInfo) {
          const unitPrice = item.custom_unit_price || item.unit_price;
          const subtotal = BigInt(unitPrice) * BigInt(item.quantity);

          await quoteService.createQuoteItems({
            quote_id: quote.id,
            product_id: item.product_id,
            variant_id: item.variant_id,
            title: item.title,
            description: item.description,
            sku: item.sku,
            thumbnail: item.thumbnail,
            quantity: item.quantity,
            unit_price: item.unit_price,
            custom_unit_price: item.custom_unit_price,
            subtotal: subtotal.toString(),
            total: subtotal.toString(),
          });
        }
      }
    );

    // 5. Calculate totals
    transform({ quote }, async ({ quote }, { container }) => {
      const quoteService = container.resolve("quoteModuleService");
      await quoteService.calculateQuoteTotals(quote.id);
    });

    return new WorkflowResponse(quote);
  }
);
