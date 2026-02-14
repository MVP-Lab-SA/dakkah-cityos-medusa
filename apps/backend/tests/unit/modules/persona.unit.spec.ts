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
        async listPersonas(_filter: any): Promise<any> { return [] }
        async retrievePersona(_id: string): Promise<any> { return null }
        async createPersonas(_data: any): Promise<any> { return {} }
        async updatePersonas(_data: any): Promise<any> { return {} }
        async listPersonaAssignments(_filter: any): Promise<any> { return [] }
        async createPersonaAssignments(_data: any): Promise<any> { return {} }
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

import PersonaModuleService from "../../../src/modules/persona/service"

describe("PersonaModuleService", () => {
  let service: PersonaModuleService

  beforeEach(() => {
    service = new PersonaModuleService()
    jest.clearAllMocks()
  })

  describe("resolvePersona", () => {
    it("returns the highest priority persona for a user", async () => {
      jest.spyOn(service, "listPersonaAssignments" as any).mockResolvedValue([
        { id: "a1", scope: "tenant-default", persona_id: "p1", priority: 0, status: "active" },
        { id: "a2", scope: "user-default", persona_id: "p2", user_id: "user-1", priority: 0, status: "active" },
      ])
      jest.spyOn(service, "retrievePersona" as any).mockResolvedValue({ id: "p2", name: "User Persona" })

      const result = await service.resolvePersona("tenant-1", "user-1")

      expect(result).toEqual({ id: "p2", name: "User Persona" })
    })

    it("returns null when no assignments exist", async () => {
      jest.spyOn(service, "listPersonaAssignments" as any).mockResolvedValue([])

      const result = await service.resolvePersona("tenant-1", "user-1")

      expect(result).toBeNull()
    })

    it("filters out expired assignments", async () => {
      jest.spyOn(service, "listPersonaAssignments" as any).mockResolvedValue([
        { id: "a1", scope: "user-default", persona_id: "p1", user_id: "user-1", priority: 0, status: "active", ends_at: "2020-01-01" },
      ])

      const result = await service.resolvePersona("tenant-1", "user-1")

      expect(result).toBeNull()
    })

    it("session scope takes precedence over user-default", async () => {
      jest.spyOn(service, "listPersonaAssignments" as any).mockResolvedValue([
        { id: "a1", scope: "user-default", persona_id: "p1", user_id: "user-1", priority: 0, status: "active" },
        { id: "a2", scope: "session", persona_id: "p2", scope_reference: "sess-1", priority: 0, status: "active" },
      ])
      jest.spyOn(service, "retrievePersona" as any).mockResolvedValue({ id: "p2", name: "Session Persona" })

      const result = await service.resolvePersona("tenant-1", "user-1", { sessionId: "sess-1" })

      expect(result).toEqual({ id: "p2", name: "Session Persona" })
    })
  })

  describe("mergePersonaConstraints", () => {
    it("returns defaults when no personas provided", () => {
      const result = service.mergePersonaConstraints([])

      expect(result).toEqual({
        kidSafe: false,
        readOnly: false,
        geoScope: "global",
        maxDataClassification: "restricted",
      })
    })

    it("merges kid_safe flag across personas", () => {
      const result = service.mergePersonaConstraints([
        { constraints: { kid_safe: false } },
        { constraints: { kid_safe: true } },
      ])

      expect(result.kidSafe).toBe(true)
    })

    it("picks narrowest geo scope", () => {
      const result = service.mergePersonaConstraints([
        { constraints: { geo_scope: "city" } },
        { constraints: { geo_scope: "zone" } },
      ])

      expect(result.geoScope).toBe("zone")
    })

    it("picks lowest data classification", () => {
      const result = service.mergePersonaConstraints([
        { constraints: { max_data_classification: "restricted" } },
        { constraints: { max_data_classification: "internal" } },
      ])

      expect(result.maxDataClassification).toBe("internal")
    })
  })

  describe("assignPersona", () => {
    it("creates a persona assignment", async () => {
      const createSpy = jest.spyOn(service as any, "createPersonaAssignments").mockResolvedValue({ id: "assign-1" })

      const result = await service.assignPersona({
        tenantId: "tenant-1",
        personaId: "persona-1",
        userId: "user-1",
        scope: "user-default",
      })

      expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({
        tenant_id: "tenant-1",
        persona_id: "persona-1",
        scope: "user-default",
        status: "active",
      }))
    })
  })

  describe("getPersonaCapabilities", () => {
    it("includes read and write for non-read-only persona", async () => {
      jest.spyOn(service, "retrievePersona" as any).mockResolvedValue({
        id: "p1",
        config: { permissions: ["view_dashboard"], features: ["analytics"] },
        constraints: {},
      })

      const result = await service.getPersonaCapabilities("p1")

      expect(result.capabilities).toContain("read")
      expect(result.capabilities).toContain("write")
      expect(result.capabilities).toContain("view_dashboard")
    })

    it("includes only read for read-only persona", async () => {
      jest.spyOn(service, "retrievePersona" as any).mockResolvedValue({
        id: "p1",
        config: {},
        constraints: { read_only: true },
      })

      const result = await service.getPersonaCapabilities("p1")

      expect(result.capabilities).toContain("read")
      expect(result.capabilities).not.toContain("write")
    })
  })

  describe("validatePersonaAssignment", () => {
    it("returns not eligible when user ID is missing", async () => {
      const result = await service.validatePersonaAssignment("", "p1")

      expect(result.eligible).toBe(false)
      expect(result.reason).toBe("User ID and persona ID are required")
    })

    it("returns not eligible when user already has the persona", async () => {
      jest.spyOn(service, "retrievePersona" as any).mockResolvedValue({ id: "p1" })
      jest.spyOn(service, "listPersonaAssignments" as any)
        .mockResolvedValueOnce([{ id: "a1", status: "active" }])

      const result = await service.validatePersonaAssignment("user-1", "p1")

      expect(result.eligible).toBe(false)
      expect(result.reason).toBe("User already has this persona assigned")
    })

    it("returns eligible for valid assignment", async () => {
      jest.spyOn(service, "retrievePersona" as any).mockResolvedValue({ id: "p1" })
      jest.spyOn(service, "listPersonaAssignments" as any)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])

      const result = await service.validatePersonaAssignment("user-1", "p1")

      expect(result.eligible).toBe(true)
    })
  })
})
