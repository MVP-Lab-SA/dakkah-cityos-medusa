import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getTemporalClient } from "../../../../lib/temporal-client"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const c = await getTemporalClient()

    const limit = Math.min(Number(req.query.limit) || 20, 100)
    const workflows: any[] = []

    const iterator = c.workflow.list({
      query: `TaskQueue = "cityos-workflow-queue"`,
      pageSize: limit,
    })

    let count = 0
    for await (const wf of iterator) {
      workflows.push({
        workflowId: wf.workflowId,
        runId: wf.runId,
        type: wf.type,
        status: wf.status?.name || wf.status,
        startTime: wf.startTime,
        closeTime: wf.closeTime,
      })
      count++
      if (count >= limit) break
    }

    return res.json({ workflows, count: workflows.length })
  } catch (err: any) {
    return res.status(503).json({
      error: "Failed to list workflows",
      message: err.message,
    })
  }
}
