import { MedusaService } from "@medusajs/framework/utils";
import Quote from "./models/quote";
import QuoteItem from "./models/quote-item";

/**
 * Quote Service
 * 
 * Manages B2B quotes and RFQ workflow.
 */
class QuoteModuleService extends MedusaService({
  Quote,
  QuoteItem,
}) {
  /**
   * Generate next quote number
   */
  async generateQuoteNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const [quotes] = await this.listQuotes({
      quote_number: { $like: `Q-${year}-%` },
    });
    
    const nextNum = quotes.length + 1;
    return `Q-${year}-${nextNum.toString().padStart(4, "0")}`;
  }

  /**
   * Calculate quote totals
   */
  async calculateQuoteTotals(quoteId: string): Promise<void> {
    const [items] = await this.listQuoteItems({ quote_id: quoteId });
    
    let subtotal = 0n;
    let discountTotal = 0n;
    let taxTotal = 0n;
    let total = 0n;

    for (const item of items) {
      const itemPrice = item.custom_unit_price 
        ? BigInt(item.custom_unit_price)
        : BigInt(item.unit_price);
      
      const itemSubtotal = itemPrice * BigInt(item.quantity);
      const itemDiscount = BigInt(item.discount_total || 0);
      const itemTax = BigInt(item.tax_total || 0);
      const itemTotal = itemSubtotal - itemDiscount + itemTax;

      await this.updateQuoteItems({
        id: item.id,
        subtotal: itemSubtotal.toString(),
        total: itemTotal.toString(),
      });

      subtotal += itemSubtotal;
      discountTotal += itemDiscount;
      taxTotal += itemTax;
      total += itemTotal;
    }

    await this.updateQuotes({
      id: quoteId,
      subtotal: subtotal.toString(),
      discount_total: discountTotal.toString(),
      tax_total: taxTotal.toString(),
      total: total.toString(),
    });
  }

  /**
   * Check if quote is valid (not expired)
   */
  async isQuoteValid(quoteId: string): Promise<boolean> {
    const quote = await this.retrieveQuote(quoteId);
    
    if (!quote.valid_until) return true;
    
    return new Date() <= new Date(quote.valid_until);
  }

  /**
   * Apply custom discount to quote
   */
  async applyCustomDiscount(
    quoteId: string,
    discountPercentage?: number,
    discountAmount?: bigint,
    reason?: string
  ): Promise<void> {
    const quote = await this.retrieveQuote(quoteId);
    const subtotal = BigInt(quote.subtotal || 0);
    
    let finalDiscount = BigInt(quote.discount_total || 0);

    if (discountPercentage) {
      finalDiscount += (subtotal * BigInt(Math.floor(discountPercentage * 100))) / 10000n;
    }

    if (discountAmount) {
      finalDiscount += discountAmount;
    }

    await this.updateQuotes({
      id: quoteId,
      custom_discount_percentage: discountPercentage,
      custom_discount_amount: discountAmount?.toString(),
      discount_total: finalDiscount.toString(),
      discount_reason: reason,
    });

    await this.calculateQuoteTotals(quoteId);
  }

  /**
   * Expire old quotes
   */
  async expireQuotes(): Promise<number> {
    const now = new Date();
    const [quotes] = await this.listQuotes({
      status: ["approved", "submitted", "under_review"],
      valid_until: { $lt: now },
    });

    for (const quote of quotes) {
      await this.updateQuotes({
        id: quote.id,
        status: "expired",
      });
    }

    return quotes.length;
  }
}

export default QuoteModuleService;
