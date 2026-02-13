import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import {
  queryDynamicWorkflowStatus,
  signalDynamicWorkflow,
  cancelDynamicWorkflow,
} from "../../../../../lib/dynamic-workflow-client.js"

const SignalWorkflowSchema = z.object({
  signal: z.string().min(1, "signal name is required"),
  data: z.any().optional(),
})

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { workflowId } = req.params

  try {
    const status = await queryDynamicWorkflowStatus(workflowId)
    return res.json(status)
  } catch (err: any) {
    return res.status(503).json({
      error: "Failed to get workflow status",
      message: err.message,
    })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { workflowId } = req.params

  try {
    const parsed = SignalWorkflowSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parsed.error.flatten().fieldErrors,
      })
    }

    const { signal, data } = parsed.data

    await signalDynamicWorkflow(workflowId, signal, data)

    return res.json({
      success: true,
      workflowId,
      signal,
    })
  } catch (err: any) {
    return res.status(503).json({
      error: "Failed to signal workflow",
      message: err.message,
    })
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { workflowId } = req.params

  try {
    await cancelDynamicWorkflow(workflowId)

    return res.json({
      success: true,
      workflowId,
      message: "Workflow cancellation requested",
    })
  } catch (err: any) {
    return res.status(503).json({
      error: "Failed to cancel workflow",
      message: err.message,
    })
  }
}
