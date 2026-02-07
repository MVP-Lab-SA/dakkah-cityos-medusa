import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// POST /admin/invoices/:id/void - Void an invoice
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const invoiceModule = req.scope.resolve("invoice")
  const { id } = req.params
  const { reason } = req.body as { reason?: string }
  
  const invoice = await invoiceModule.voidInvoice(id, reason)
  
  res.json({ invoice })
}
