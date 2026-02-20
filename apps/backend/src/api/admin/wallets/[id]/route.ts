import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
// GET  /admin/wallets/:id   — wallet detail + transactions
// POST /admin/wallets/:id/adjust — admin credit/debit

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const walletService = req.scope.resolve("wallet") as any;
  const { id } = req.params;

  try {
    const wallet = await walletService.retrieveWallet(id);
    const transactions = await walletService.getTransactionHistory(id, {
      limit: 50,
    });
    return res.json({ wallet, transactions });
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const walletService = req.scope.resolve("wallet") as any;
  const { id } = req.params;
  const { type, amount, description, reference_id } = req.body as any;

  if (!type || !["credit", "debit"].includes(type)) {
    return res
      .status(400)
      .json({ message: "type must be 'credit' or 'debit'" });
  }
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "amount must be positive" });
  }

  try {
    let transaction;
    if (type === "credit") {
      transaction = await walletService.creditWallet(
        id,
        amount,
        description,
        reference_id,
      );
    } else {
      transaction = await walletService.debitWallet(
        id,
        amount,
        description,
        reference_id,
      );
    }
    return res.json({ transaction });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}

