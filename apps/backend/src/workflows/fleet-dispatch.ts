import {
  createWorkflow,
  WorkflowResponse,
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"

type FleetDispatchInput = {
  orderId: string
  pickupAddress: string
  deliveryAddress: string
  packageWeight: number
  priority: string
  tenantId: string
}

const prepareOrderForDispatchStep = createStep(
  "prepare-order-dispatch-step",
  async (input: FleetDispatchInput) => {
    const dispatchRequest = {
      order_id: input.orderId,
      pickup: input.pickupAddress,
      delivery: input.deliveryAddress,
      weight: input.packageWeight,
      priority: input.priority,
      status: "pending_assignment",
      created_at: new Date(),
    }
    return new StepResponse({ dispatchRequest })
  }
)

const findAvailableDriverStep = createStep(
  "find-available-driver-step",
  async (input: { pickupAddress: string; priority: string }) => {
    const driver = {
      driver_id: `driver_${Date.now()}`,
      name: "Available Driver",
      distance_km: 2.5,
      estimated_pickup: new Date(Date.now() + 15 * 60 * 1000),
    }
    return new StepResponse({ driver })
  }
)

const assignDriverStep = createStep(
  "assign-driver-step",
  async (input: { orderId: string; driverId: string }) => {
    const assignment = {
      order_id: input.orderId,
      driver_id: input.driverId,
      status: "assigned",
      assigned_at: new Date(),
    }
    return new StepResponse({ assignment })
  }
)

const initializeTrackingStep = createStep(
  "initialize-delivery-tracking-step",
  async (input: { orderId: string; driverId: string }) => {
    const tracking = {
      tracking_id: `TRK-${input.orderId}-${Date.now()}`,
      order_id: input.orderId,
      driver_id: input.driverId,
      status: "in_transit",
      started_at: new Date(),
    }
    return new StepResponse({ tracking })
  }
)

export const fleetDispatchWorkflow = createWorkflow(
  "fleet-dispatch-workflow",
  (input: FleetDispatchInput) => {
    const { dispatchRequest } = prepareOrderForDispatchStep(input)
    const { driver } = findAvailableDriverStep({ pickupAddress: input.pickupAddress, priority: input.priority })
    const { assignment } = assignDriverStep({ orderId: input.orderId, driverId: driver.driver_id })
    const { tracking } = initializeTrackingStep({ orderId: input.orderId, driverId: driver.driver_id })
    return new WorkflowResponse({ dispatchRequest, assignment, tracking })
  }
)
