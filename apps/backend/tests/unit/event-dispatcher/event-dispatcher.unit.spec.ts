jest.mock("../../../src/lib/temporal-client", () => ({
  startWorkflow: jest.fn(),
}))

jest.mock("../../../src/integrations/node-hierarchy-sync", () => ({
  NodeHierarchySyncService: jest.fn().mockImplementation(() => ({
    syncSingleNode: jest.fn().mockResolvedValue(undefined),
    deleteNodeFromSystems: jest.fn().mockResolvedValue(undefined),
  })),
}))

const mockSyncProduct = jest.fn().mockResolvedValue(undefined)
const mockSyncGovernancePolicies = jest.fn().mockResolvedValue(undefined)
const MockMedusaToPayloadSync = jest.fn().mockImplementation(() => ({
  syncProduct: mockSyncProduct,
  syncGovernancePolicies: mockSyncGovernancePolicies,
}))

jest.mock("../../../src/integrations/payload-sync/medusa-to-payload.js", () => ({
  MedusaToPayloadSync: MockMedusaToPayloadSync,
}), { virtual: true })

const mockErpSyncProduct = jest.fn().mockResolvedValue({ name: "erp-product-1" })
const mockErpSyncCustomer = jest.fn().mockResolvedValue({ name: "erp-customer-1" })
const mockErpCreateInvoice = jest.fn().mockResolvedValue({ name: "erp-invoice-1" })
const MockERPNextService = jest.fn().mockImplementation(() => ({
  syncProduct: mockErpSyncProduct,
  syncCustomer: mockErpSyncCustomer,
  createInvoice: mockErpCreateInvoice,
}))

jest.mock("../../../src/integrations/erpnext/service.js", () => ({
  ERPNextService: MockERPNextService,
}), { virtual: true })

jest.mock("../../../src/integrations/fleetbase/service.js", () => ({
  FleetbaseService: jest.fn().mockImplementation(() => ({
    createShipment: jest.fn().mockResolvedValue({ tracking_number: "TRACK-1" }),
  })),
}), { virtual: true })

jest.mock("../../../src/integrations/waltid/service.js", () => ({
  WaltIdService: jest.fn().mockImplementation(() => ({
    issueVendorCredential: jest.fn().mockResolvedValue({ credentialId: "cred-1" }),
  })),
}), { virtual: true })

import { startWorkflow } from "../../../src/lib/temporal-client"
import { NodeHierarchySyncService } from "../../../src/integrations/node-hierarchy-sync"
import {
  getWorkflowForEvent,
  getAllMappedEvents,
  dispatchEventToTemporal,
  processOutboxEvents,
  dispatchCrossSystemEvent,
} from "../../../src/lib/event-dispatcher"

const mockStartWorkflow = startWorkflow as jest.Mock

describe("event-dispatcher", () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.clearAllMocks()
    process.env = { ...originalEnv }
    delete process.env.PAYLOAD_API_URL
    delete process.env.PAYLOAD_API_KEY
    delete process.env.ERPNEXT_SITE_URL
    delete process.env.ERPNEXT_API_KEY
    delete process.env.ERPNEXT_API_SECRET
    delete process.env.FLEETBASE_API_URL
    delete process.env.FLEETBASE_API_KEY
    delete process.env.FLEETBASE_ORG_ID
    delete process.env.WALTID_API_URL
    delete process.env.WALTID_API_KEY
  })

  afterAll(() => {
    process.env = originalEnv
  })

  describe("getWorkflowForEvent", () => {
    it("returns correct workflow mapping for a known event", () => {
      expect(getWorkflowForEvent("order.placed")).toEqual({
        workflowId: "xsystem.unified-order-orchestrator",
        taskQueue: "commerce-queue",
      })
    })

    it("returns null for an unknown event", () => {
      expect(getWorkflowForEvent("unknown.event")).toBeNull()
    })

    it('maps "governance.policy.changed" to "xsystem.governance-policy-propagation"', () => {
      expect(getWorkflowForEvent("governance.policy.changed")).toEqual({
        workflowId: "xsystem.governance-policy-propagation",
        taskQueue: "xsystem-platform-queue",
      })
    })

    it("returns correct workflow for vendor.created", () => {
      expect(getWorkflowForEvent("vendor.created")).toEqual({
        workflowId: "commerce.vendor-onboarding",
        taskQueue: "xsystem-platform-queue",
      })
    })

    it("returns correct workflow for product.updated", () => {
      expect(getWorkflowForEvent("product.updated")).toEqual({
        workflowId: "commerce.sync-product-to-cms",
        taskQueue: "commerce-queue",
      })
    })
  })

  describe("getAllMappedEvents", () => {
    it("returns an array of all event keys", () => {
      const events = getAllMappedEvents()
      expect(Array.isArray(events)).toBe(true)
      expect(events.length).toBeGreaterThan(0)
    })

    it('contains "governance.policy.changed"', () => {
      expect(getAllMappedEvents()).toContain("governance.policy.changed")
    })

    it('contains "order.placed"', () => {
      expect(getAllMappedEvents()).toContain("order.placed")
    })

    it("contains node and tenant events", () => {
      const events = getAllMappedEvents()
      expect(events).toContain("node.created")
      expect(events).toContain("tenant.provisioned")
    })
  })

  describe("dispatchEventToTemporal", () => {
    it("successfully dispatches and returns dispatched true with runId", async () => {
      mockStartWorkflow.mockResolvedValue({ runId: "run-123" })

      const result = await dispatchEventToTemporal("order.placed", { id: "order-1" })

      expect(result).toEqual({ dispatched: true, runId: "run-123" })
      expect(mockStartWorkflow).toHaveBeenCalledWith(
        "xsystem.unified-order-orchestrator",
        { id: "order-1" },
        {},
        "commerce-queue"
      )
    })

    it("passes nodeContext to startWorkflow", async () => {
      mockStartWorkflow.mockResolvedValue({ runId: "run-456" })
      const ctx = { tenantId: "t1", nodeId: "n1" }

      await dispatchEventToTemporal("order.placed", { id: "o1" }, ctx)

      expect(mockStartWorkflow).toHaveBeenCalledWith(
        "xsystem.unified-order-orchestrator",
        { id: "o1" },
        ctx,
        "commerce-queue"
      )
    })

    it("returns dispatched false for unmapped event", async () => {
      const result = await dispatchEventToTemporal("unmapped.event", {})

      expect(result.dispatched).toBe(false)
      expect(result.error).toContain("No workflow mapped")
      expect(mockStartWorkflow).not.toHaveBeenCalled()
    })

    it("catches startWorkflow errors and returns dispatched false with error", async () => {
      mockStartWorkflow.mockRejectedValue(new Error("Temporal connection failed"))

      const result = await dispatchEventToTemporal("order.placed", { id: "o1" })

      expect(result).toEqual({
        dispatched: false,
        error: "Temporal connection failed",
      })
    })
  })

  describe("processOutboxEvents", () => {
    function makeContainer(events: any[], overrides: Record<string, any> = {}) {
      return {
        resolve: jest.fn().mockReturnValue({
          listPendingEvents: jest.fn().mockResolvedValue(events),
          buildEnvelope: jest.fn().mockImplementation((e: any) => ({
            payload: e.payload || {},
          })),
          markPublished: jest.fn().mockResolvedValue(undefined),
          markFailed: jest.fn().mockResolvedValue(undefined),
          ...overrides,
        }),
      }
    }

    it("processes pending events successfully", async () => {
      mockStartWorkflow.mockResolvedValue({ runId: "run-1" })
      const events = [
        {
          id: "evt-1",
          event_type: "order.placed",
          payload: { id: "order-1" },
          tenant_id: "t1",
          node_id: "n1",
          correlation_id: "c1",
          channel: "web",
        },
      ]
      const container = makeContainer(events)

      const result = await processOutboxEvents(container)

      expect(result.processed).toBe(1)
      expect(result.failed).toBe(0)
      expect(result.errors).toHaveLength(0)
      const svc = container.resolve.mock.results[0].value
      expect(svc.markPublished).toHaveBeenCalledWith("evt-1")
    })

    it("skips events with no workflow mapping", async () => {
      const events = [
        { id: "evt-2", event_type: "unknown.event", payload: {} },
      ]
      const container = makeContainer(events)

      const result = await processOutboxEvents(container)

      expect(result.processed).toBe(0)
      expect(result.failed).toBe(0)
      expect(mockStartWorkflow).not.toHaveBeenCalled()
    })

    it("handles errors in individual event processing", async () => {
      mockStartWorkflow.mockRejectedValue(new Error("workflow fail"))
      const events = [
        {
          id: "evt-3",
          event_type: "order.placed",
          payload: { id: "o1" },
          tenant_id: "t1",
        },
      ]
      const container = makeContainer(events)

      const result = await processOutboxEvents(container)

      expect(result.processed).toBe(0)
      expect(result.failed).toBe(1)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0]).toContain("evt-3")
      const svc = container.resolve.mock.results[0].value
      expect(svc.markFailed).toHaveBeenCalledWith("evt-3", "workflow fail")
    })

    it("handles error getting pending events", async () => {
      const container = {
        resolve: jest.fn().mockReturnValue({
          listPendingEvents: jest.fn().mockRejectedValue(new Error("DB down")),
          buildEnvelope: jest.fn(),
          markPublished: jest.fn(),
          markFailed: jest.fn(),
        }),
      }

      const result = await processOutboxEvents(container)

      expect(result.processed).toBe(0)
      expect(result.failed).toBe(0)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0]).toContain("Outbox processing error")
    })
  })

  describe("dispatchCrossSystemEvent", () => {
    const mockContainer = { resolve: jest.fn() }

    describe("governance case", () => {
      it("calls syncGovernancePolicies when env vars and tenant_id present", async () => {
        mockStartWorkflow.mockResolvedValue({ runId: "r1" })
        process.env.PAYLOAD_API_URL = "https://payload.test"
        process.env.PAYLOAD_API_KEY = "pk_test"

        const result = await dispatchCrossSystemEvent(
          "governance.policy.changed",
          { tenant_id: "tenant-1" },
          mockContainer
        )

        expect(result.integrations).toContain("payload")
        expect(mockSyncGovernancePolicies).toHaveBeenCalledWith("tenant-1")
      })

      it("uses nodeContext.tenantId when payload has no tenant_id", async () => {
        mockStartWorkflow.mockResolvedValue({ runId: "r1" })
        process.env.PAYLOAD_API_URL = "https://payload.test"
        process.env.PAYLOAD_API_KEY = "pk_test"

        const result = await dispatchCrossSystemEvent(
          "governance.policy.changed",
          {},
          mockContainer,
          { tenantId: "ctx-tenant" }
        )

        expect(result.integrations).toContain("payload")
        expect(mockSyncGovernancePolicies).toHaveBeenCalledWith("ctx-tenant")
      })

      it("skips Payload sync without env vars", async () => {
        mockStartWorkflow.mockResolvedValue({ runId: "r1" })

        const result = await dispatchCrossSystemEvent(
          "governance.policy.changed",
          { tenant_id: "t1" },
          mockContainer
        )

        expect(result.integrations).not.toContain("payload")
      })

      it("skips sync without tenant_id", async () => {
        mockStartWorkflow.mockResolvedValue({ runId: "r1" })
        process.env.PAYLOAD_API_URL = "https://payload.test"
        process.env.PAYLOAD_API_KEY = "pk_test"

        const result = await dispatchCrossSystemEvent(
          "governance.policy.changed",
          {},
          mockContainer
        )

        expect(mockSyncGovernancePolicies).not.toHaveBeenCalled()
        expect(result.integrations).not.toContain("payload")
      })

      it("continues gracefully on sync error", async () => {
        mockStartWorkflow.mockResolvedValue({ runId: "r1" })
        process.env.PAYLOAD_API_URL = "https://payload.test"
        process.env.PAYLOAD_API_KEY = "pk_test"
        mockSyncGovernancePolicies.mockRejectedValueOnce(new Error("sync boom"))

        const result = await dispatchCrossSystemEvent(
          "governance.policy.changed",
          { tenant_id: "t1" },
          mockContainer
        )

        expect(result.integrations).not.toContain("payload")
        expect(result.temporal).toBe(true)
      })
    })

    describe("product case", () => {
      it("syncs to Payload and ERPNext when env vars present", async () => {
        mockStartWorkflow.mockResolvedValue({ runId: "r1" })
        process.env.PAYLOAD_API_URL = "https://payload.test"
        process.env.PAYLOAD_API_KEY = "pk_test"
        process.env.ERPNEXT_SITE_URL = "https://erp.test"
        process.env.ERPNEXT_API_KEY = "ek"
        process.env.ERPNEXT_API_SECRET = "es"

        const result = await dispatchCrossSystemEvent(
          "product.updated",
          { id: "prod-1", handle: "my-product", title: "My Product" },
          mockContainer
        )

        expect(result.integrations).toContain("payload")
        expect(result.integrations).toContain("erpnext")
        expect(mockSyncProduct).toHaveBeenCalledWith("prod-1")
      })
    })

    describe("customer case", () => {
      it("syncs to ERPNext when env vars present", async () => {
        mockStartWorkflow.mockResolvedValue({ runId: "r1" })
        process.env.ERPNEXT_SITE_URL = "https://erp.test"
        process.env.ERPNEXT_API_KEY = "ek"
        process.env.ERPNEXT_API_SECRET = "es"

        const result = await dispatchCrossSystemEvent(
          "customer.created",
          { id: "cust-1", email: "test@example.com", first_name: "John", last_name: "Doe" },
          mockContainer
        )

        expect(result.integrations).toContain("erpnext")
        expect(mockErpSyncCustomer).toHaveBeenCalledWith(
          expect.objectContaining({
            customer_name: "John Doe",
            customer_email: "test@example.com",
          })
        )
      })
    })

    describe("node case", () => {
      it("calls NodeHierarchySyncService.syncSingleNode for node.created", async () => {
        mockStartWorkflow.mockResolvedValue({ runId: "r1" })

        const result = await dispatchCrossSystemEvent(
          "node.created",
          { id: "node-1" },
          mockContainer
        )

        expect(result.integrations).toContain("payload")
        expect(result.integrations).toContain("erpnext")
        expect(result.integrations).toContain("fleetbase")
        expect(result.integrations).toContain("waltid")
        expect(NodeHierarchySyncService).toHaveBeenCalledWith(mockContainer)
      })

      it("calls deleteNodeFromSystems for node.deleted", async () => {
        mockStartWorkflow.mockResolvedValue({ runId: "r1" })
        const mockDelete = jest.fn().mockResolvedValue(undefined)
        ;(NodeHierarchySyncService as jest.Mock).mockImplementation(() => ({
          syncSingleNode: jest.fn(),
          deleteNodeFromSystems: mockDelete,
        }))

        const result = await dispatchCrossSystemEvent(
          "node.deleted",
          { id: "node-2", tenant_id: "t1" },
          mockContainer
        )

        expect(mockDelete).toHaveBeenCalledWith("node-2", "t1")
        expect(result.integrations).toContain("payload")
      })
    })

    describe("unknown event prefix", () => {
      it("dispatches to temporal but has no integrations", async () => {
        mockStartWorkflow.mockResolvedValue({ runId: "r1" })

        const result = await dispatchCrossSystemEvent(
          "subscription.created",
          { id: "sub-1" },
          mockContainer
        )

        expect(result.temporal).toBe(true)
        expect(result.integrations).toHaveLength(0)
      })

      it("returns empty integrations for completely unknown prefix", async () => {
        mockStartWorkflow.mockResolvedValue({ runId: "r1" })

        const result = await dispatchCrossSystemEvent(
          "xyz.something",
          {},
          mockContainer
        )

        expect(result.integrations).toHaveLength(0)
      })
    })
  })
})
