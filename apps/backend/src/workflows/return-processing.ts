import {
  createWorkflow,
  WorkflowResponse,
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"

type ReturnProcessingInput = {
  orderId: string
  customerId: string
  items: { lineItemId: string; quantity: number; reason: string }[]
  returnMethod: string
}

const requestReturnStep = createStep(
  "request-return-step",
  async (input: ReturnProcessingInput, { container }) => {
    const returnRequest = {
      order_id: input.orderId,
      customer_id: input.customerId,
      items: input.items,
      status: "requested",
      return_method: input.returnMethod,
      created_at: new Date(),
    }
    return new StepResponse({ returnRequest })
  }
)

const inspectReturnStep = createStep(
  "inspect-return-items-step",
  async (input: { returnRequest: any }) => {
    const inspection = {
      items_received: true,
      condition: "acceptable",
      inspected_at: new Date(),
    }
    return new StepResponse({ inspection })
  }
)

const processRefundStep = createStep(
  "process-return-refund-step",
  async (input: { orderId: string; items: any[]; customerId: string }, { container }) => {
    const refund = {
      order_id: input.orderId,
      customer_id: input.customerId,
      status: "refunded",
      refunded_at: new Date(),
    }
    return new StepResponse({ refund })
  }
)

const restockItemsStep = createStep(
  "restock-returned-items-step",
  async (input: { items: any[] }, { container }) => {
    const restocked = input.items.map((item: any) => ({
      line_item_id: item.lineItemId,
      quantity: item.quantity,
      restocked: true,
    }))
    return new StepResponse({ restocked })
  }
)

export const returnProcessingWorkflow = createWorkflow(
  "return-processing-workflow",
  (input: ReturnProcessingInput) => {
    const { returnRequest } = requestReturnStep(input)
    const { inspection } = inspectReturnStep({ returnRequest })
    const { refund } = processRefundStep({ orderId: input.orderId, items: input.items, customerId: input.customerId })
    const { restocked } = restockItemsStep({ items: input.items })
    return new WorkflowResponse({ returnRequest, inspection, refund, restocked })
  }
)
