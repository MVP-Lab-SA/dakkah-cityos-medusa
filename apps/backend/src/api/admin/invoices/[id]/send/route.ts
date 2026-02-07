import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// POST /admin/invoices/:id/send - Mark invoice as sent
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const invoiceModule = req.scope.resolve("invoice")
  const { id } = req.params
  
  const invoice = await invoiceModule.markAsSent(id)
  
  res.json({ invoice })
}
