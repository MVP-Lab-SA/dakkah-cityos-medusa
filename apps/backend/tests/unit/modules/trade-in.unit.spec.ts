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
        async listTradeIns(_filter: any): Promise<any> { return [] }
        async retrieveTradeIn(_id: string): Promise<any> { return null }
        async createTradeIns(_data: any): Promise<any> { return {} }
        async updateTradeIns(_data: any): Promise<any> { return {} }
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

import TradeInModuleService from "../../../src/modules/trade-in/service"

describe("TradeInModuleService", () => {
  let service: TradeInModuleService

  beforeEach(() => {
    service = new TradeInModuleService()
    jest.clearAllMocks()
  })

  describe("submitTradeIn", () => {
    it("submits a trade-in with valid condition", async () => {
      const createSpy = jest.spyOn(service as any, "createTradeIns").mockResolvedValue({
        id: "ti-1", status: "submitted",
      })

      const result = await service.submitTradeIn({
        customerId: "cust-1",
        productId: "prod-1",
        condition: "good",
        description: "Minor scratches on screen",
      })

      expect(result.status).toBe("submitted")
      expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({
        customer_id: "cust-1",
        condition: "good",
        status: "submitted",
      }))
    })

    it("throws when condition is invalid", async () => {
      await expect(service.submitTradeIn({
        customerId: "cust-1",
        productId: "prod-1",
        condition: "broken",
        description: "Not working",
      })).rejects.toThrow("Condition must be one of:")
    })

    it("throws when description is empty", async () => {
      await expect(service.submitTradeIn({
        customerId: "cust-1",
        productId: "prod-1",
        condition: "good",
        description: "",
      })).rejects.toThrow("Description is required")
    })
  })

  describe("evaluateTradeIn", () => {
    it("evaluates a submitted trade-in", async () => {
      jest.spyOn(service, "retrieveTradeIn" as any).mockResolvedValue({
        id: "ti-1", status: "submitted",
      })
      const updateSpy = jest.spyOn(service as any, "updateTradeIns").mockResolvedValue({
        id: "ti-1", status: "evaluated", estimated_value: 15000,
      })

      const result = await service.evaluateTradeIn("ti-1", 15000, "Good condition device")

      expect(result.status).toBe("evaluated")
      expect(updateSpy).toHaveBeenCalledWith(expect.objectContaining({
        status: "evaluated",
        estimated_value: 15000,
        evaluation_notes: "Good condition device",
      }))
    })

    it("throws when estimated value is negative", async () => {
      await expect(service.evaluateTradeIn("ti-1", -100))
        .rejects.toThrow("Estimated value cannot be negative")
    })

    it("throws when trade-in is not in submitted status", async () => {
      jest.spyOn(service, "retrieveTradeIn" as any).mockResolvedValue({
        id: "ti-1", status: "evaluated",
      })

      await expect(service.evaluateTradeIn("ti-1", 5000))
        .rejects.toThrow("Trade-in is not in submitted status")
    })
  })

  describe("approveTradeIn", () => {
    it("approves an evaluated trade-in", async () => {
      jest.spyOn(service, "retrieveTradeIn" as any).mockResolvedValue({
        id: "ti-1", status: "evaluated",
      })
      const updateSpy = jest.spyOn(service as any, "updateTradeIns").mockResolvedValue({
        id: "ti-1", status: "approved", final_value: 14000,
      })

      const result = await service.approveTradeIn("ti-1", 14000)

      expect(result.status).toBe("approved")
      expect(updateSpy).toHaveBeenCalledWith(expect.objectContaining({
        status: "approved",
        final_value: 14000,
      }))
    })

    it("throws when final value is negative", async () => {
      await expect(service.approveTradeIn("ti-1", -500))
        .rejects.toThrow("Final value cannot be negative")
    })

    it("throws when trade-in is not evaluated", async () => {
      jest.spyOn(service, "retrieveTradeIn" as any).mockResolvedValue({
        id: "ti-1", status: "submitted",
      })

      await expect(service.approveTradeIn("ti-1", 5000))
        .rejects.toThrow("Trade-in must be evaluated before approval")
    })
  })

  describe("rejectTradeIn", () => {
    it("rejects a submitted trade-in", async () => {
      jest.spyOn(service, "retrieveTradeIn" as any).mockResolvedValue({
        id: "ti-1", status: "submitted",
      })
      const updateSpy = jest.spyOn(service as any, "updateTradeIns").mockResolvedValue({
        id: "ti-1", status: "rejected",
      })

      const result = await service.rejectTradeIn("ti-1", "Device too damaged")

      expect(result.status).toBe("rejected")
      expect(updateSpy).toHaveBeenCalledWith(expect.objectContaining({
        status: "rejected",
        rejection_reason: "Device too damaged",
      }))
    })

    it("throws when trade-in cannot be rejected from current status", async () => {
      jest.spyOn(service, "retrieveTradeIn" as any).mockResolvedValue({
        id: "ti-1", status: "completed",
      })

      await expect(service.rejectTradeIn("ti-1", "reason"))
        .rejects.toThrow("Trade-in cannot be rejected from current status")
    })
  })

  describe("getCustomerTradeIns", () => {
    it("returns trade-ins for a customer", async () => {
      jest.spyOn(service, "listTradeIns" as any).mockResolvedValue([
        { id: "ti-1", status: "submitted" },
        { id: "ti-2", status: "completed" },
      ])

      const result = await service.getCustomerTradeIns("cust-1")

      expect(result).toHaveLength(2)
    })
  })
})
