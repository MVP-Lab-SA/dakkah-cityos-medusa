import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { startWorkflow } from "../../../../lib/temporal-client.js"
import { getWorkflowForEvent } from "../../../../lib/event-dispatcher.js"
import { z } from "zod"

const triggerSchema = z.object({
  workflowId: z.string().min(1),
  input: z.record(z.string(), z.unknown()).optional(),
  nodeContext: z.record(z.string(), z.unknown()).optional(),
  eventType: z.string().optional(),
})

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const validation = triggerSchema.safeParse(req.body)

  if (!validation.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: validation.error.issues,
    })
  }

  const { workflowId, input, nodeContext, eventType } = validation.data

  const mapping = eventType ? getWorkflowForEvent(eventType) : null
  const resolvedWorkflowId = mapping ? mapping.workflowId : workflowId
  const resolvedTaskQueue = mapping ? mapping.taskQueue : undefined

  try {
    const result = await startWorkflow(resolvedWorkflowId, input, nodeContext, resolvedTaskQueue)
    return res.status(201).json({
      message: "Workflow triggered successfully",
      workflowId: resolvedWorkflowId,
      runId: result.runId,
    })
  } catch (err: any) {
    return res.status(503).json({
      error: "Failed to trigger workflow",
      message: err.message,
    })
  }
}
