import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { createStep } from "@medusajs/framework/workflows-sdk"

// Step: Calculate and create commission transaction
const calculateCommissionStep = createStep(
  "calculate-commission-step",
  async (
    input: {
      vendorId: string
      orderId: string
      lineItemId?: string
      orderSubtotal: number
      orderTotal: number
      tenantId: string
      storeId?: string | null
    },
    { container }
  ) => {
    const commissionModule = container.resolve("commission")

    const transaction = await commissionModule.createCommissionTransaction(input)

    return { transaction }
  },
  async ({ transaction }, { container }) => {
    const commissionModule = container.resolve("commission")
    await commissionModule.deleteCommissionTransactions(transaction.id)
  }
)

// Workflow
export const calculateCommissionWorkflow = createWorkflow(
  "calculate-commission-workflow",
  (
    input: {
      vendorId: string
      orderId: string
      lineItemId?: string
      orderSubtotal: number
      orderTotal: number
      tenantId: string
      storeId?: string | null
    }
  ) => {
    const { transaction } = calculateCommissionStep(input)

    return new WorkflowResponse({ transaction })
  }
)
