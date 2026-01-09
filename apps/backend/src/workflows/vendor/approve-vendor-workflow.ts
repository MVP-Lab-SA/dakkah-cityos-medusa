import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { createStep } from "@medusajs/framework/workflows-sdk"

// Step: Approve vendor
const approveVendorStep = createStep(
  "approve-vendor-step",
  async (
    input: {
      vendorId: string
      approvedBy: string
      notes?: string
    },
    { container }
  ) => {
    const vendorModule = container.resolve("vendor")

    const vendor = await vendorModule.updateVendors({
      id: input.vendorId,
      verification_status: "approved",
      status: "active",
      verified_at: new Date(),
      verified_by: input.approvedBy,
      verification_notes: input.notes,
      onboarded_at: new Date(),
    })

    return { vendor }
  },
  async ({ vendor }, { container }) => {
    const vendorModule = container.resolve("vendor")
    await vendorModule.updateVendors({
      id: vendor.id,
      verification_status: "pending",
      status: "onboarding",
      verified_at: null,
      verified_by: null,
      onboarded_at: null,
    })
  }
)

// Workflow
export const approveVendorWorkflow = createWorkflow(
  "approve-vendor-workflow",
  (
    input: {
      vendorId: string
      approvedBy: string
      notes?: string
    }
  ) => {
    const { vendor } = approveVendorStep(input)

    return new WorkflowResponse({ vendor })
  }
)
