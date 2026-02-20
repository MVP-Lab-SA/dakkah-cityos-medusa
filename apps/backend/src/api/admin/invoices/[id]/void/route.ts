import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { handleApiError } from "../../../../../lib/api-error-handler";

// POST /admin/invoices/:id/void - Void an invoice
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const invoiceModule = req.scope.resolve("invoice") as any;
    const { id } = req.params;
    const { reason } = req.body as { reason?: string };

    const invoice = await invoiceModule.voidInvoice(id, reason);

    res.json({ invoice });
  } catch (error: any) {
    handleApiError(res, error, "POST admin invoices id void");
  }
}
