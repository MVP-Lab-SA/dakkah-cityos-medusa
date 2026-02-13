import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { checkTemporalHealth } from "../../../lib/temporal-client.js"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const health = await checkTemporalHealth()
  return res.json(health)
}
