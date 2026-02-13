// @ts-nocheck
import { MedusaService } from "@medusajs/framework/utils"
import { Invoice } from "./models/invoice"
import { InvoiceItem } from "./models/invoice-item"

class InvoiceModuleService extends MedusaService({
  Invoice,
  InvoiceItem,
}) {
  /**
   * Generate a unique invoice number
   */
  async generateInvoiceNumber(companyId: string): Promise<string> {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const prefix = companyId.slice(0, 4).toUpperCase()
    
    // Get count of invoices for this company this month
    const [invoices, count] = await this.listInvoices({
      company_id: companyId,
      invoice_number: { $like: `INV-${prefix}-${year}${month}%` }
    })
    
    const sequence = String(count + 1).padStart(4, '0')
    return `INV-${prefix}-${year}${month}-${sequence}`
  }
  
  /**
   * Create an invoice with items
   */
  async createInvoiceWithItems(data: {
    company_id: string
    customer_id?: string
    issue_date: Date
    due_date: Date
    period_start?: Date
    period_end?: Date
    payment_terms?: string
    payment_terms_days?: number
    currency_code?: string
    notes?: string
    items: Array<{
      title: string
      description?: string
      order_id?: string
      order_display_id?: string
      quantity: number
      unit_price: number
    }>
    metadata?: Record<string, any>
  }) {
    const invoiceNumber = await this.generateInvoiceNumber(data.company_id)
    
    // Calculate totals from items
    const itemsWithTotals = data.items.map(item => ({
      ...item,
      subtotal: item.quantity * item.unit_price,
      tax_total: 0, // Tax calculated at invoice level if needed
      total: item.quantity * item.unit_price,
    }))
    
    const subtotal = itemsWithTotals.reduce((sum, item) => sum + item.subtotal, 0)
    const tax_total = 0 // Can be configured based on company tax settings
    const total = subtotal + tax_total
    
    // Create invoice
    const invoice = await this.createInvoices({
      invoice_number: invoiceNumber,
      company_id: data.company_id,
      customer_id: data.customer_id,
      status: "draft",
      issue_date: data.issue_date,
      due_date: data.due_date,
      period_start: data.period_start,
      period_end: data.period_end,
      payment_terms: data.payment_terms,
      payment_terms_days: data.payment_terms_days || 30,
      subtotal,
      tax_total,
      total,
      amount_due: total,
      currency_code: data.currency_code || "usd",
      notes: data.notes,
      metadata: data.metadata,
    })
    
    // Create invoice items
    const createdItems = await this.createInvoiceItems(
      itemsWithTotals.map(item => ({
        ...item,
        invoice_id: invoice.id,
      }))
    )
    
    return { invoice, items: createdItems }
  }
  
  /**
   * Mark invoice as sent
   */
  async markAsSent(invoiceId: string) {
    return this.updateInvoices({
      id: invoiceId,
      status: "sent",
    })
  }
  
  /**
   * Mark invoice as paid
   */
  async markAsPaid(invoiceId: string, amount?: number) {
    const [invoice] = await this.listInvoices({ id: invoiceId })
    
    if (!invoice) {
      throw new Error(`Invoice ${invoiceId} not found`)
    }
    
    const amountPaid = amount || Number(invoice.total)
    const newAmountPaid = Number(invoice.amount_paid) + amountPaid
    const amountDue = Number(invoice.total) - newAmountPaid
    
    return this.updateInvoices({
      id: invoiceId,
      status: amountDue <= 0 ? "paid" : invoice.status,
      amount_paid: newAmountPaid,
      amount_due: Math.max(0, amountDue),
      paid_at: amountDue <= 0 ? new Date() : null,
    })
  }
  
  /**
   * Check and mark overdue invoices
   */
  async markOverdueInvoices() {
    const now = new Date()
    
    const [overdueInvoices] = await this.listInvoices({
      status: "sent",
      due_date: { $lt: now.toISOString() },
    })
    
    const updated = []
    for (const invoice of overdueInvoices) {
      const result = await this.updateInvoices({
        id: invoice.id,
        status: "overdue",
      })
      updated.push(result)
    }
    
    return updated
  }
  
  /**
   * Void an invoice
   */
  async voidInvoice(invoiceId: string, reason?: string) {
    return this.updateInvoices({
      id: invoiceId,
      status: "void",
      internal_notes: reason,
    })
  }
}

export default InvoiceModuleService
