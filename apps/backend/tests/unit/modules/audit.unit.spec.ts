jest.mock("@medusajs/framework/utils", () => {
  const chainable = () => {
    const chain: any = {
      primaryKey: () => chain,
      nullable: () => chain,
      default: () => chain,
      unique: () => chain,
      searchable: () => chain,
      index: () => chain,
    }
    return chain
  }

  return {
    MedusaService: () =>
      class MockMedusaBase {
        async listAuditLogs(_filter: any): Promise<any> { return [] }
        async createAuditLogs(_data: any): Promise<any> { return {} }
      },
    model: {
      define: () => ({ indexes: () => ({}) }),
      id: chainable,
      text: chainable,
      number: chainable,
      json: chainable,
      enum: () => chainable(),
      boolean: chainable,
      dateTime: chainable,
      bigNumber: chainable,
      float: chainable,
      array: chainable,
      hasOne: () => chainable(),
      hasMany: () => chainable(),
      belongsTo: () => chainable(),
      manyToMany: () => chainable(),
    },
  }
})

import AuditModuleService from "../../../src/modules/audit/service"

describe("AuditModuleService", () => {
  let service: AuditModuleService

  beforeEach(() => {
    service = new AuditModuleService()
    jest.clearAllMocks()
  })

  describe("logAction", () => {
    it("creates an audit log entry", async () => {
      const createSpy = jest.spyOn(service as any, "createAuditLogs").mockResolvedValue({ id: "log-1" })

      const result = await service.logAction({
        tenantId: "t1",
        action: "create",
        resourceType: "product",
        resourceId: "prod-1",
        actorId: "user-1",
        actorRole: "admin",
      })

      expect(result).toEqual({ id: "log-1" })
      expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({
        tenant_id: "t1",
        action: "create",
        resource_type: "product",
        resource_id: "prod-1",
        actor_id: "user-1",
        actor_role: "admin",
      }))
    })

    it("uses default data classification when not provided", async () => {
      const createSpy = jest.spyOn(service as any, "createAuditLogs").mockResolvedValue({ id: "log-1" })

      await service.logAction({
        tenantId: "t1",
        action: "update",
        resourceType: "order",
        resourceId: "ord-1",
      })

      expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({
        data_classification: "internal",
        actor_id: null,
      }))
    })

    it("stores previous and new values for change tracking", async () => {
      const createSpy = jest.spyOn(service as any, "createAuditLogs").mockResolvedValue({ id: "log-1" })

      await service.logAction({
        tenantId: "t1",
        action: "update",
        resourceType: "product",
        resourceId: "prod-1",
        previousValues: { price: 100 },
        newValues: { price: 200 },
      })

      expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({
        previous_values: { price: 100 },
        new_values: { price: 200 },
      }))
    })
  })

  describe("getAuditTrail", () => {
    it("returns logs filtered by tenant", async () => {
      jest.spyOn(service, "listAuditLogs" as any).mockResolvedValue([
        { id: "log-1", tenant_id: "t1", action: "create", created_at: "2025-01-15T00:00:00Z" },
        { id: "log-2", tenant_id: "t1", action: "update", created_at: "2025-01-16T00:00:00Z" },
      ])

      const result = await service.getAuditTrail("t1")

      expect(result).toHaveLength(2)
    })

    it("filters by resource type", async () => {
      const listSpy = jest.spyOn(service, "listAuditLogs" as any).mockResolvedValue([])

      await service.getAuditTrail("t1", { resourceType: "product" })

      expect(listSpy).toHaveBeenCalledWith(expect.objectContaining({
        tenant_id: "t1",
        resource_type: "product",
      }))
    })

    it("filters by date range", async () => {
      jest.spyOn(service, "listAuditLogs" as any).mockResolvedValue([
        { id: "log-1", created_at: "2025-01-10T00:00:00Z" },
        { id: "log-2", created_at: "2025-01-15T00:00:00Z" },
        { id: "log-3", created_at: "2025-02-01T00:00:00Z" },
      ])

      const result = await service.getAuditTrail("t1", {
        from: new Date("2025-01-01"),
        to: new Date("2025-01-31"),
      })

      expect(result).toHaveLength(2)
    })

    it("filters by actor ID", async () => {
      const listSpy = jest.spyOn(service, "listAuditLogs" as any).mockResolvedValue([])

      await service.getAuditTrail("t1", { actorId: "user-1" })

      expect(listSpy).toHaveBeenCalledWith(expect.objectContaining({
        actor_id: "user-1",
      }))
    })

    it("filters by data classification", async () => {
      const listSpy = jest.spyOn(service, "listAuditLogs" as any).mockResolvedValue([])

      await service.getAuditTrail("t1", { dataClassification: "confidential" })

      expect(listSpy).toHaveBeenCalledWith(expect.objectContaining({
        data_classification: "confidential",
      }))
    })
  })

  describe("getResourceHistory", () => {
    it("returns audit logs for a specific resource", async () => {
      jest.spyOn(service, "listAuditLogs" as any).mockResolvedValue([
        { id: "log-1", resource_type: "product", resource_id: "prod-1" },
        { id: "log-2", resource_type: "product", resource_id: "prod-1" },
      ])

      const result = await service.getResourceHistory("t1", "product", "prod-1")

      expect(result).toHaveLength(2)
    })

    it("returns empty array when no history exists", async () => {
      jest.spyOn(service, "listAuditLogs" as any).mockResolvedValue([])

      const result = await service.getResourceHistory("t1", "product", "nonexistent")

      expect(result).toEqual([])
    })
  })
})
