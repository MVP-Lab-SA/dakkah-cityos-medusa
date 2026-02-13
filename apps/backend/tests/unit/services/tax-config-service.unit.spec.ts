jest.mock("@medusajs/framework/utils", () => {
  const chainable = () => {
    const chain: any = { primaryKey: () => chain, nullable: () => chain, default: () => chain, unique: () => chain }
    return chain
  }
  return {
    MedusaService: () => class MockMedusaBase {
      async listTaxRules(_f: any): Promise<any> { return [] }
      async listTaxExemptions(_f: any): Promise<any> { return [] }
      async createTaxExemptions(_data: any): Promise<any> { return null }
      async retrieveTaxExemption(_id: string): Promise<any> { return null }
      async updateTaxExemptions(_data: any): Promise<any> { return null }
    },
    model: {
      define: () => ({ indexes: () => ({}) }),
      id: chainable, text: chainable, number: chainable, json: chainable,
      enum: () => chainable(), boolean: chainable, dateTime: chainable,
      bigNumber: chainable, float: chainable, array: chainable,
      hasOne: () => chainable(), hasMany: () => chainable(),
      belongsTo: () => chainable(), manyToMany: () => chainable(),
    },
  }
})

import TaxConfigModuleService from "../../../src/modules/tax-config/service"

describe("TaxConfigModuleService", () => {
  let service: TaxConfigModuleService

  beforeEach(() => {
    service = new TaxConfigModuleService()
  })

  describe("calculateTax", () => {
    it("returns zero tax when no rules apply", async () => {
      jest.spyOn(service, "getApplicableRules" as any).mockResolvedValue([])

      const result = await service.calculateTax({
        tenantId: "t-1", countryCode: "US", amount: 1000,
      })

      expect(result).toEqual({ taxAmount: 0, taxRate: 0, rules: [] })
    })

    it("calculates tax from applicable rules", async () => {
      jest.spyOn(service, "getApplicableRules" as any).mockResolvedValue([
        { id: "r-1", tax_rate: 10, tax_type: "standard" },
      ])
      jest.spyOn(service, "listTaxExemptions" as any).mockResolvedValue([])

      const result = await service.calculateTax({
        tenantId: "t-1", countryCode: "US", amount: 1000,
      })

      expect(result.taxAmount).toBe(100)
      expect(result.taxRate).toBe(10)
    })

    it("returns zero for exempt tax type", async () => {
      jest.spyOn(service, "getApplicableRules" as any).mockResolvedValue([
        { id: "r-1", tax_rate: 10, tax_type: "exempt" },
      ])

      const result = await service.calculateTax({
        tenantId: "t-1", countryCode: "US", amount: 1000,
      })

      expect(result.taxAmount).toBe(0)
      expect(result.taxRate).toBe(0)
    })

    it("applies full exemption when entity has one", async () => {
      jest.spyOn(service, "getApplicableRules" as any).mockResolvedValue([
        { id: "r-1", tax_rate: 15, tax_type: "standard" },
      ])
      jest.spyOn(service, "listTaxExemptions" as any).mockResolvedValue([{
        exemption_type: "full", status: "active",
        valid_from: "2020-01-01", valid_to: "2030-12-31",
      }])

      const result = await service.calculateTax({
        tenantId: "t-1", countryCode: "US", amount: 1000,
        entityType: "company", entityId: "comp-1",
      })

      expect(result.taxAmount).toBe(0)
    })

    it("applies partial exemption", async () => {
      jest.spyOn(service, "getApplicableRules" as any).mockResolvedValue([
        { id: "r-1", tax_rate: 20, tax_type: "standard" },
      ])
      jest.spyOn(service, "listTaxExemptions" as any).mockResolvedValue([{
        exemption_type: "partial", exemption_rate: 50, status: "active",
        valid_from: "2020-01-01", valid_to: "2030-12-31",
      }])

      const result = await service.calculateTax({
        tenantId: "t-1", countryCode: "US", amount: 1000,
        entityType: "company", entityId: "comp-1",
      })

      expect(result.taxRate).toBe(10)
      expect(result.taxAmount).toBe(100)
    })

    it("sums rates from multiple rules", async () => {
      jest.spyOn(service, "getApplicableRules" as any).mockResolvedValue([
        { id: "r-1", tax_rate: 5, tax_type: "standard" },
        { id: "r-2", tax_rate: 3, tax_type: "standard" },
      ])
      jest.spyOn(service, "listTaxExemptions" as any).mockResolvedValue([])

      const result = await service.calculateTax({
        tenantId: "t-1", countryCode: "US", amount: 1000,
      })

      expect(result.taxRate).toBe(8)
      expect(result.taxAmount).toBe(80)
    })
  })

  describe("getApplicableRules", () => {
    it("filters rules by tenant and country", async () => {
      const listSpy = jest.spyOn(service, "listTaxRules" as any).mockResolvedValue([
        { id: "r-1", tax_rate: 10, status: "active", applies_to: "all", priority: 1 },
      ])

      const result = await service.getApplicableRules({ tenantId: "t-1", countryCode: "US" })

      expect(listSpy).toHaveBeenCalledWith(expect.objectContaining({
        tenant_id: "t-1", country_code: "US", status: "active",
      }))
      expect(result).toHaveLength(1)
    })

    it("filters out rules with non-matching region code", async () => {
      jest.spyOn(service, "listTaxRules" as any).mockResolvedValue([
        { id: "r-1", tax_rate: 10, region_code: "CA", applies_to: "all" },
        { id: "r-2", tax_rate: 5, region_code: "NY", applies_to: "all" },
      ])

      const result = await service.getApplicableRules({
        tenantId: "t-1", countryCode: "US", regionCode: "NY",
      })

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe("r-2")
    })

    it("filters out expired rules", async () => {
      jest.spyOn(service, "listTaxRules" as any).mockResolvedValue([
        { id: "r-1", tax_rate: 10, valid_to: "2020-01-01", applies_to: "all" },
        { id: "r-2", tax_rate: 5, applies_to: "all" },
      ])

      const result = await service.getApplicableRules({ tenantId: "t-1", countryCode: "US" })

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe("r-2")
    })

    it("sorts rules by priority descending", async () => {
      jest.spyOn(service, "listTaxRules" as any).mockResolvedValue([
        { id: "r-1", tax_rate: 5, priority: 1, applies_to: "all" },
        { id: "r-2", tax_rate: 10, priority: 10, applies_to: "all" },
      ])

      const result = await service.getApplicableRules({ tenantId: "t-1", countryCode: "US" })

      expect(result[0].id).toBe("r-2")
    })
  })

  describe("addExemption", () => {
    it("creates a full exemption", async () => {
      const createSpy = jest.spyOn(service, "createTaxExemptions" as any).mockResolvedValue({ id: "ex-1" })

      const result = await service.addExemption({
        tenantId: "t-1", entityType: "company", entityId: "comp-1",
        exemptionType: "full", validFrom: new Date("2025-01-01"),
      })

      expect(result).toEqual({ id: "ex-1" })
      expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({
        exemption_type: "full", status: "active",
      }))
    })

    it("throws for partial exemption without rate", async () => {
      await expect(service.addExemption({
        tenantId: "t-1", entityType: "company", entityId: "comp-1",
        exemptionType: "partial", validFrom: new Date(),
      })).rejects.toThrow("Partial exemptions require an exemption rate")
    })
  })

  describe("validateExemption", () => {
    it("returns valid for active exemption within date range", async () => {
      jest.spyOn(service, "retrieveTaxExemption" as any).mockResolvedValue({
        status: "active", valid_from: "2020-01-01", valid_to: "2030-12-31",
      })

      const result = await service.validateExemption("ex-1")

      expect(result).toEqual({ valid: true })
    })

    it("returns invalid for revoked exemption", async () => {
      jest.spyOn(service, "retrieveTaxExemption" as any).mockResolvedValue({ status: "revoked" })

      const result = await service.validateExemption("ex-1")

      expect(result).toEqual({ valid: false, reason: "Exemption has been revoked" })
    })

    it("marks expired and returns invalid when valid_to is in the past", async () => {
      jest.spyOn(service, "retrieveTaxExemption" as any).mockResolvedValue({
        status: "active", valid_from: "2020-01-01", valid_to: "2020-12-31",
      })
      const updateSpy = jest.spyOn(service, "updateTaxExemptions" as any).mockResolvedValue({})

      const result = await service.validateExemption("ex-1")

      expect(result.valid).toBe(false)
      expect(result.reason).toBe("Exemption has expired")
      expect(updateSpy).toHaveBeenCalledWith(expect.objectContaining({ status: "expired" }))
    })
  })
})
