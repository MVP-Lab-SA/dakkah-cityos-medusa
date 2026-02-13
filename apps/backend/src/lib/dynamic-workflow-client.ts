import { randomUUID } from "crypto"
import { getTemporalClient } from "./temporal-client"

export interface DynamicWorkflowInput {
  goal: string
  context: Record<string, any>
  availableTools: string[]
  maxIterations?: number
  nodeContext?: {
    tenantId?: string
    nodeId?: string
    channel?: string
    locale?: string
  }
  metadata?: Record<string, any>
}

export interface DynamicWorkflowResult {
  workflowRunId: string
  workflowId: string
  taskQueue: string
}

const DYNAMIC_TASK_QUEUE = "cityos-dynamic-queue"
const DYNAMIC_WORKFLOW_TYPE = "cityOSDynamicAgentWorkflow"

export async function startDynamicWorkflow(
  input: DynamicWorkflowInput
): Promise<DynamicWorkflowResult> {
  const client = await getTemporalClient()

  const workflowId = `dynamic-${Date.now()}-${randomUUID().slice(0, 8)}`

  const handle = await client.workflow.start(DYNAMIC_WORKFLOW_TYPE, {
    taskQueue: DYNAMIC_TASK_QUEUE,
    workflowId,
    args: [
      {
        goal: input.goal,
        context: input.context,
        availableTools: input.availableTools,
        maxIterations: input.maxIterations ?? 10,
        nodeContext: input.nodeContext ?? {},
        metadata: input.metadata ?? {},
        correlationId: randomUUID(),
      },
    ],
  })

  return {
    workflowRunId: handle.firstExecutionRunId,
    workflowId: handle.workflowId,
    taskQueue: DYNAMIC_TASK_QUEUE,
  }
}

export async function queryDynamicWorkflowStatus(
  workflowId: string
): Promise<any> {
  try {
    const client = await getTemporalClient()
    const handle = client.workflow.getHandle(workflowId)
    const description = await handle.describe()

    let queryResult: any = null
    try {
      queryResult = await handle.query("status")
    } catch {
      // Query may not be supported by all workflow implementations
    }

    return {
      workflowId: description.workflowId,
      runId: description.runId,
      status: description.status?.name ?? "UNKNOWN",
      type: description.type,
      startTime: description.startTime,
      closeTime: description.closeTime,
      taskQueue: description.taskQueue,
      queryResult,
    }
  } catch (err: any) {
    throw new Error(`Failed to query workflow ${workflowId}: ${err.message}`)
  }
}

export async function signalDynamicWorkflow(
  workflowId: string,
  signalName: string,
  data: any
): Promise<void> {
  try {
    const client = await getTemporalClient()
    const handle = client.workflow.getHandle(workflowId)
    await handle.signal(signalName, data)
  } catch (err: any) {
    throw new Error(`Failed to signal workflow ${workflowId}: ${err.message}`)
  }
}

export async function cancelDynamicWorkflow(
  workflowId: string
): Promise<void> {
  try {
    const client = await getTemporalClient()
    const handle = client.workflow.getHandle(workflowId)
    await handle.cancel()
  } catch (err: any) {
    throw new Error(`Failed to cancel workflow ${workflowId}: ${err.message}`)
  }
}

export async function listDynamicWorkflows(
  filters?: { status?: string; limit?: number }
): Promise<any[]> {
  try {
    const client = await getTemporalClient()

    const limit = filters?.limit ?? 10
    let query = `TaskQueue = "${DYNAMIC_TASK_QUEUE}"`

    if (filters?.status === "open") {
      query += ` AND ExecutionStatus = "Running"`
    } else if (filters?.status === "closed") {
      query += ` AND ExecutionStatus != "Running"`
    }

    const workflows: any[] = []
    const iterator = client.workflow.list({ query })

    for await (const workflow of iterator) {
      workflows.push({
        workflowId: workflow.workflowId,
        runId: workflow.runId,
        status: workflow.status?.name ?? "UNKNOWN",
        type: workflow.type,
        startTime: workflow.startTime,
        closeTime: workflow.closeTime,
        taskQueue: workflow.taskQueue,
      })
      if (workflows.length >= limit) {
        break
      }
    }

    return workflows
  } catch (err: any) {
    throw new Error(`Failed to list dynamic workflows: ${err.message}`)
  }
}
