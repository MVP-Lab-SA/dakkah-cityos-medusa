import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { metrics } from "../../../observability/metrics";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const metricsData = await metrics.getMetrics();

  res.setHeader("Content-Type", "text/plain");
  res.send(metricsData);
}
