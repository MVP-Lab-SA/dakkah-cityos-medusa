import integrationSyncHandler, { config } from "../integration-sync-subscriber"

jest.mock("../../integrations/payload-sync", () => ({
  MedusaToPayloadSync: jest.fn().mockImplementation(() => ({
    syncProduct: jest.fn().mockResolvedValue(undefined),
    syncGovernancePolicies: jest.fn().mockResolvedValue(undefined),
  })),
}))

jest.mock("../../integrations/orchestrator", () => ({
  createIntegrationOrchestrator: jest.fn().mockReturnValue({
    syncToSystem: jest.fn().mockResolvedValue(undefined),
  }),
}))

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    create: jest.fn().mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: { docs: [{ id: "payload_doc_1" }] } }),
      delete: jest.fn().mockResolvedValue({}),
    }),
  },
}))

const { MedusaToPayloadSync } = require("../../integrations/payload-sync")
const { createIntegrationOrchestrator } = require("../../integrations/orchestrator")

describe("integration-sync-subscriber", () => {
  const mockContainer = {} as any
  let originalEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    originalEnv = { ...process.env }
    jest.clearAllMocks()
    jest.spyOn(console, "log").mockImplementation(() => {})
    jest.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    process.env = originalEnv
    jest.restoreAllMocks()
  })

  function createEvent(name: string, data: any = {}) {
    return { event: { name, data }, container: mockContainer } as any
  }

  describe("config", () => {
    it("includes governance.policy.changed in event list", () => {
      expect(config.event).toContain("governance.policy.changed")
    })

    it("includes all expected events", () => {
      expect(config.event).toEqual(
        expect.arrayContaining([
          "product.created",
          "product.updated",
          "customer.created",
          "order.placed",
          "product.deleted",
          "governance.policy.changed",
        ])
      )
    })
  })

  describe("product.created", () => {
    it("syncs product to Payload when env vars are set", async () => {
      process.env.PAYLOAD_API_URL = "http://payload.test"
      process.env.PAYLOAD_API_KEY = "key123"

      const mockSyncProduct = jest.fn().mockResolvedValue(undefined)
      MedusaToPayloadSync.mockImplementation(() => ({
        syncProduct: mockSyncProduct,
        syncGovernancePolicies: jest.fn(),
      }))

      await integrationSyncHandler(createEvent("product.created", { id: "prod_1" }))

      expect(MedusaToPayloadSync).toHaveBeenCalledWith(mockContainer, {
        payloadUrl: "http://payload.test",
        payloadApiKey: "key123",
      })
      expect(mockSyncProduct).toHaveBeenCalledWith("prod_1")
    })

    it("breaks early when productId is missing", async () => {
      process.env.PAYLOAD_API_URL = "http://payload.test"
      process.env.PAYLOAD_API_KEY = "key123"

      await integrationSyncHandler(createEvent("product.created", {}))

      expect(MedusaToPayloadSync).not.toHaveBeenCalled()
    })

    it("syncs product to ERPNext when env vars are set", async () => {
      process.env.ERPNEXT_SITE_URL = "http://erpnext.test"
      process.env.ERPNEXT_API_KEY = "erpkey"
      process.env.ERPNEXT_API_SECRET = "erpsecret"

      const mockSyncToSystem = jest.fn().mockResolvedValue(undefined)
      createIntegrationOrchestrator.mockReturnValue({ syncToSystem: mockSyncToSystem })

      await integrationSyncHandler(createEvent("product.created", { id: "prod_2" }))

      expect(mockSyncToSystem).toHaveBeenCalledWith(
        "erpnext", "product", "prod_2", { id: "prod_2" }, { direction: "outbound" }
      )
    })
  })

  describe("customer.created", () => {
    it("syncs customer to ERPNext when env vars are set", async () => {
      process.env.ERPNEXT_SITE_URL = "http://erpnext.test"
      process.env.ERPNEXT_API_KEY = "erpkey"
      process.env.ERPNEXT_API_SECRET = "erpsecret"

      const mockSyncToSystem = jest.fn().mockResolvedValue(undefined)
      createIntegrationOrchestrator.mockReturnValue({ syncToSystem: mockSyncToSystem })

      await integrationSyncHandler(createEvent("customer.created", { id: "cust_1" }))

      expect(mockSyncToSystem).toHaveBeenCalledWith(
        "erpnext", "customer", "cust_1", { id: "cust_1" }, { direction: "outbound" }
      )
    })

    it("breaks early when customerId is missing", async () => {
      process.env.ERPNEXT_SITE_URL = "http://erpnext.test"
      process.env.ERPNEXT_API_KEY = "erpkey"
      process.env.ERPNEXT_API_SECRET = "erpsecret"

      await integrationSyncHandler(createEvent("customer.created", {}))

      expect(createIntegrationOrchestrator).not.toHaveBeenCalled()
    })
  })

  describe("order.placed", () => {
    it("syncs order to both ERPNext and Fleetbase", async () => {
      process.env.ERPNEXT_SITE_URL = "http://erpnext.test"
      process.env.ERPNEXT_API_KEY = "erpkey"
      process.env.ERPNEXT_API_SECRET = "erpsecret"
      process.env.FLEETBASE_API_URL = "http://fleetbase.test"
      process.env.FLEETBASE_API_KEY = "fbkey"

      const mockSyncToSystem = jest.fn().mockResolvedValue(undefined)
      createIntegrationOrchestrator.mockReturnValue({ syncToSystem: mockSyncToSystem })

      await integrationSyncHandler(createEvent("order.placed", { id: "order_1" }))

      expect(mockSyncToSystem).toHaveBeenCalledWith(
        "erpnext", "order", "order_1", { id: "order_1" }, { direction: "outbound" }
      )
      expect(mockSyncToSystem).toHaveBeenCalledWith(
        "fleetbase", "order", "order_1", { id: "order_1" }, { direction: "outbound" }
      )
    })

    it("breaks early when orderId is missing", async () => {
      process.env.ERPNEXT_SITE_URL = "http://erpnext.test"
      process.env.ERPNEXT_API_KEY = "erpkey"
      process.env.ERPNEXT_API_SECRET = "erpsecret"

      await integrationSyncHandler(createEvent("order.placed", {}))

      expect(createIntegrationOrchestrator).not.toHaveBeenCalled()
    })
  })

  describe("product.deleted", () => {
    it("removes product from Payload CMS", async () => {
      process.env.PAYLOAD_API_URL = "http://payload.test"
      process.env.PAYLOAD_API_KEY = "key123"

      const axios = require("axios").default
      const mockGet = jest.fn().mockResolvedValue({ data: { docs: [{ id: "payload_doc_1" }] } })
      const mockDelete = jest.fn().mockResolvedValue({})
      axios.create.mockReturnValue({ get: mockGet, delete: mockDelete })

      await integrationSyncHandler(createEvent("product.deleted", { id: "prod_del_1" }))

      expect(axios.create).toHaveBeenCalledWith({
        baseURL: "http://payload.test",
        headers: {
          Authorization: "Bearer key123",
          "Content-Type": "application/json",
        },
      })
      expect(mockGet).toHaveBeenCalledWith("/api/product-content", {
        params: { where: { medusaProductId: { equals: "prod_del_1" } }, limit: 1 },
      })
      expect(mockDelete).toHaveBeenCalledWith("/api/product-content/payload_doc_1")
    })

    it("breaks early when productId is missing", async () => {
      process.env.PAYLOAD_API_URL = "http://payload.test"
      process.env.PAYLOAD_API_KEY = "key123"

      const axios = require("axios").default

      await integrationSyncHandler(createEvent("product.deleted", {}))

      expect(axios.create).not.toHaveBeenCalled()
    })
  })

  describe("governance.policy.changed", () => {
    it("syncs governance policies to Payload when env vars and tenant_id are present", async () => {
      process.env.PAYLOAD_API_URL = "http://payload.test"
      process.env.PAYLOAD_API_KEY = "key123"

      const mockSyncGovernancePolicies = jest.fn().mockResolvedValue(undefined)
      MedusaToPayloadSync.mockImplementation(() => ({
        syncProduct: jest.fn(),
        syncGovernancePolicies: mockSyncGovernancePolicies,
      }))

      await integrationSyncHandler(createEvent("governance.policy.changed", { tenant_id: "tenant_1" }))

      expect(MedusaToPayloadSync).toHaveBeenCalledWith(mockContainer, {
        payloadUrl: "http://payload.test",
        payloadApiKey: "key123",
      })
      expect(mockSyncGovernancePolicies).toHaveBeenCalledWith("tenant_1")
    })

    it("breaks early when tenant_id is missing", async () => {
      process.env.PAYLOAD_API_URL = "http://payload.test"
      process.env.PAYLOAD_API_KEY = "key123"

      await integrationSyncHandler(createEvent("governance.policy.changed", {}))

      expect(MedusaToPayloadSync).not.toHaveBeenCalled()
    })

    it("skips sync when PAYLOAD env vars are not set", async () => {
      delete process.env.PAYLOAD_API_URL
      delete process.env.PAYLOAD_API_KEY

      await integrationSyncHandler(createEvent("governance.policy.changed", { tenant_id: "tenant_1" }))

      expect(MedusaToPayloadSync).not.toHaveBeenCalled()
    })

    it("logs error but does not rethrow when syncGovernancePolicies fails", async () => {
      process.env.PAYLOAD_API_URL = "http://payload.test"
      process.env.PAYLOAD_API_KEY = "key123"

      MedusaToPayloadSync.mockImplementation(() => ({
        syncProduct: jest.fn(),
        syncGovernancePolicies: jest.fn().mockRejectedValue(new Error("Sync failed")),
      }))

      await expect(
        integrationSyncHandler(createEvent("governance.policy.changed", { tenant_id: "tenant_1" }))
      ).resolves.not.toThrow()

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining("Failed to sync governance policies")
      )
    })
  })

  describe("unknown event", () => {
    it("logs unhandled event", async () => {
      await integrationSyncHandler(createEvent("some.unknown.event", {}))

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining("Unhandled event: some.unknown.event")
      )
    })
  })
})
