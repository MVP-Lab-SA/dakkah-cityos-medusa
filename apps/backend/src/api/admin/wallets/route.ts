import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { WALLET_MODULE } from "../../../../modules/wallet";

// GET    /admin/wallets        — list all wallets
// POST   /admin/wallets/:id/credit  (separate route)
// POST   /admin/wallets/:id/debit   (separate route)

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const walletService = req.scope.resolve(WALLET_MODULE) as any;
  const limit = parseInt((req.query.limit as string) || "20");
  const offset = parseInt((req.query.offset as string) || "0");

  try {
    const wallets = await walletService.listWallets(
      {},
      { take: limit, skip: offset, order: { created_at: "DESC" } },
    );
    const count = await walletService.countWallets();
    return res.json({ wallets: Array.isArray(wallets) ? wallets : [], count });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}
