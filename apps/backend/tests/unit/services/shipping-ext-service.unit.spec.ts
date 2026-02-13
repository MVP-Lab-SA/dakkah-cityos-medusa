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
        async listShippingRates(_filter: any): Promise<any> { return [] }
        async retrieveShippingRate(_id: string): Promise<any> { return null }
        async createShippingRates(_data: any): Promise<any> { return {} }
        async updateShippingRates(_data: any): Promise<any> { return {} }
        async listCarrierConfigs(_filter: any): Promise<any> { return [] }
        async retrieveCarrierConfig(_id: string): Promise<any> { return null }
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

import ShippingExtensionModuleService from "../../../src/modules/shipping-extension/service"

describe("ShippingExtensionModuleService", () => {
  let service: ShippingExtensionModuleService

  beforeEach(() => {
    service = new ShippingExtensionModuleService()
    jest.clearAllMocks()
  })

  describe("calculateShippingRate", () => {
    it("returns applicable rates filtered by weight and zone", async () => {
      jest.spyOn(service, "listShippingRates" as any).mockResolvedValue([
        { id: "r1", carrier_name: "FedEx", service_type: "express", base_rate: 10, per_kg_rate: 2, min_weight: 0, max_weight: 50, estimated_days_min: 1, estimated_days_max: 3 },
        { id: "r2", carrier_name: "UPS", service_type: "standard", base_rate: 5, per_kg_rate: 1, min_weight: 0, max_weight: 20, estimated_days_min: 3, estimated_days_max: 7 },
      ])

      const result = await service.calculateShippingRate({
        originZone: "US-EAST",
        destinationZone: "US-WEST",
        weight: 10,
      })

      expect(result).toHaveLength(2)
      expect(result[0].total_cost).toBe(30)
      expect(result[1].total_cost).toBe(15)
    })

    it("throws when weight is not positive", async () => {
      await expect(service.calculateShippingRate({
        originZone: "US-EAST",
        destinationZone: "US-WEST",
        weight: 0,
      })).rejects.toThrow("Weight must be a positive number")
    })

    it("throws when no rates match", async () => {
      jest.spyOn(service, "listShippingRates" as any).mockResolvedValue([
        { id: "r1", min_weight: 50, max_weight: 100, service_type: "express" },
      ])

      await expect(service.calculateShippingRate({
        originZone: "US-EAST",
        destinationZone: "US-WEST",
        weight: 5,
      })).rejects.toThrow("No shipping rates available for the given parameters")
    })

    it("uses volumetric weight when dimensions are provided", async () => {
      jest.spyOn(service, "listShippingRates" as any).mockResolvedValue([
        { id: "r1", carrier_name: "DHL", service_type: "express", base_rate: 10, per_kg_rate: 2, min_weight: 0, max_weight: 100, estimated_days_min: 1, estimated_days_max: 2 },
      ])

      const result = await service.calculateShippingRate({
        originZone: "EU",
        destinationZone: "US",
        weight: 5,
        dimensions: { length: 50, width: 50, height: 50 },
      })

      expect(result[0].total_cost).toBe(10 + 2 * 25)
    })
  })

  describe("createShipment", () => {
    it("creates a shipment with an active carrier", async () => {
      jest.spyOn(service, "retrieveCarrierConfig" as any).mockResolvedValue({
        id: "carrier-1",
        carrier_name: "FedEx",
        is_active: true,
      })
      const createSpy = jest.spyOn(service as any, "createShippingRates").mockResolvedValue({ id: "ship-1" })

      await service.createShipment("order-1", {
        carrierId: "carrier-1",
        trackingNumber: "TRACK123",
        items: [{ productId: "p1", quantity: 2 }],
      })

      expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({
        tracking_number: "TRACK123",
        status: "created",
      }))
    })

    it("throws when tracking number is missing", async () => {
      await expect(service.createShipment("order-1", {
        carrierId: "carrier-1",
        trackingNumber: "",
        items: [{ productId: "p1", quantity: 1 }],
      })).rejects.toThrow("Tracking number is required")
    })

    it("throws when carrier is inactive", async () => {
      jest.spyOn(service, "retrieveCarrierConfig" as any).mockResolvedValue({
        id: "carrier-1",
        is_active: false,
      })

      await expect(service.createShipment("order-1", {
        carrierId: "carrier-1",
        trackingNumber: "TRACK123",
        items: [{ productId: "p1", quantity: 1 }],
      })).rejects.toThrow("Selected carrier is not currently active")
    })
  })

  describe("updateTrackingStatus", () => {
    it("updates status with a valid status value", async () => {
      jest.spyOn(service, "retrieveShippingRate" as any).mockResolvedValue({ id: "ship-1" })
      const updateSpy = jest.spyOn(service as any, "updateShippingRates").mockResolvedValue({ id: "ship-1", status: "in_transit" })

      await service.updateTrackingStatus("ship-1", "in_transit", "Chicago Hub")

      expect(updateSpy).toHaveBeenCalledWith(expect.objectContaining({
        status: "in_transit",
        current_location: "Chicago Hub",
      }))
    })

    it("throws when status is invalid", async () => {
      await expect(service.updateTrackingStatus("ship-1", "flying"))
        .rejects.toThrow("Invalid status. Must be one of:")
    })
  })

  describe("getShipmentTimeline", () => {
    it("builds a timeline from shipment data", async () => {
      jest.spyOn(service, "retrieveShippingRate" as any).mockResolvedValue({
        id: "ship-1",
        carrier_name: "FedEx",
        tracking_number: "TRACK123",
        status: "in_transit",
        created_at: new Date("2025-01-01"),
        last_updated_at: new Date("2025-01-03"),
        current_location: "Chicago",
        last_update_notes: "Departed hub",
      })

      const result = await service.getShipmentTimeline("ship-1")

      expect(result.shipment_id).toBe("ship-1")
      expect(result.timeline).toHaveLength(2)
      expect(result.timeline[0].status).toBe("created")
      expect(result.timeline[1].status).toBe("in_transit")
    })
  })

  describe("estimateDeliveryDate", () => {
    it("calculates estimated delivery dates from rate data", async () => {
      jest.spyOn(service, "listShippingRates" as any).mockResolvedValue([
        { id: "r1", estimated_days_min: 3, estimated_days_max: 5 },
      ])

      const result = await service.estimateDeliveryDate("US-EAST", "US-WEST", "standard")

      expect(result.origin_zone).toBe("US-EAST")
      expect(result.destination_zone).toBe("US-WEST")
      expect(result.estimated_days_min).toBe(3)
      expect(result.estimated_days_max).toBe(5)
      expect(result.estimated_min_date).toBeInstanceOf(Date)
      expect(result.estimated_max_date).toBeInstanceOf(Date)
    })

    it("throws when no rates found for route", async () => {
      jest.spyOn(service, "listShippingRates" as any).mockResolvedValue([])

      await expect(service.estimateDeliveryDate("UNKNOWN", "NOWHERE", "express"))
        .rejects.toThrow("No shipping rates found for the given route and method")
    })
  })
})
