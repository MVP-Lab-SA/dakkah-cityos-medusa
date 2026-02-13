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
        async listGymMemberships(_filter: any): Promise<any> { return [] }
        async retrieveGymMembership(_id: string): Promise<any> { return null }
        async createGymMemberships(_data: any): Promise<any> { return {} }
        async updateGymMemberships(_data: any): Promise<any> { return {} }
        async listClassSchedules(_filter: any): Promise<any> { return [] }
        async retrieveClassSchedule(_id: string): Promise<any> { return null }
        async listClassBookings(_filter: any): Promise<any> { return [] }
        async retrieveClassBooking(_id: string): Promise<any> { return null }
        async createClassBookings(_data: any): Promise<any> { return {} }
        async updateClassBookings(_data: any): Promise<any> { return {} }
        async listTrainerProfiles(_filter: any): Promise<any> { return [] }
        async listWellnessPlans(_filter: any): Promise<any> { return [] }
        async createWellnessPlans(_data: any): Promise<any> { return {} }
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

import FitnessModuleService from "../../../src/modules/fitness/service"

describe("FitnessModuleService", () => {
  let service: FitnessModuleService

  beforeEach(() => {
    service = new FitnessModuleService()
    jest.clearAllMocks()
  })

  describe("createMembership", () => {
    it("creates a membership with correct end date", async () => {
      const createSpy = jest.spyOn(service as any, "createGymMemberships").mockResolvedValue({ id: "mem-1" })

      await service.createMembership("member-1", {
        planType: "premium",
        startDate: new Date("2025-01-01"),
        durationMonths: 3,
        price: 99.99,
      })

      expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({
        member_id: "member-1",
        plan_type: "premium",
        duration_months: 3,
        status: "active",
      }))
      const callArgs = createSpy.mock.calls[0][0]
      const endDate = new Date(callArgs.end_date)
      expect(endDate.getMonth()).toBe(3)
    })

    it("throws when plan type is missing", async () => {
      await expect(service.createMembership("member-1", {
        planType: "",
        startDate: new Date(),
        durationMonths: 3,
        price: 50,
      })).rejects.toThrow("Plan type is required")
    })

    it("throws when duration is zero or negative", async () => {
      await expect(service.createMembership("member-1", {
        planType: "basic",
        startDate: new Date(),
        durationMonths: 0,
        price: 50,
      })).rejects.toThrow("Duration must be greater than zero")
    })

    it("throws when price is negative", async () => {
      await expect(service.createMembership("member-1", {
        planType: "basic",
        startDate: new Date(),
        durationMonths: 1,
        price: -10,
      })).rejects.toThrow("Price must be a non-negative number")
    })
  })

  describe("checkMembershipStatus", () => {
    it("returns active for a valid membership", async () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 30)

      jest.spyOn(service, "listGymMemberships" as any).mockResolvedValue([
        { id: "mem-1", status: "active", end_date: futureDate.toISOString(), created_at: new Date().toISOString() },
      ])

      const result = await service.checkMembershipStatus("member-1")

      expect(result.active).toBe(true)
      expect(result.daysRemaining).toBeGreaterThan(0)
    })

    it("returns expired for a past membership", async () => {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 10)

      jest.spyOn(service, "listGymMemberships" as any).mockResolvedValue([
        { id: "mem-1", status: "active", end_date: pastDate.toISOString(), created_at: new Date().toISOString() },
      ])

      const result = await service.checkMembershipStatus("member-1")

      expect(result.active).toBe(false)
      expect(result.expired).toBe(true)
    })

    it("returns inactive when no memberships exist", async () => {
      jest.spyOn(service, "listGymMemberships" as any).mockResolvedValue([])

      const result = await service.checkMembershipStatus("member-1")

      expect(result.active).toBe(false)
      expect(result.membership).toBeNull()
    })
  })

  describe("getClassAvailability", () => {
    it("returns correct availability counts", async () => {
      jest.spyOn(service, "retrieveClassSchedule" as any).mockResolvedValue({
        id: "class-1",
        max_capacity: 20,
      })
      jest.spyOn(service, "listClassBookings" as any).mockResolvedValue([
        { id: "b1", status: "confirmed" },
        { id: "b2", status: "confirmed" },
        { id: "b3", status: "attended" },
      ])

      const result = await service.getClassAvailability("class-1")

      expect(result.capacity).toBe(20)
      expect(result.booked).toBe(3)
      expect(result.available).toBe(17)
      expect(result.isFull).toBe(false)
    })

    it("reports full when at capacity", async () => {
      jest.spyOn(service, "retrieveClassSchedule" as any).mockResolvedValue({
        id: "class-1",
        max_capacity: 2,
      })
      jest.spyOn(service, "listClassBookings" as any).mockResolvedValue([
        { id: "b1", status: "confirmed" },
        { id: "b2", status: "confirmed" },
      ])

      const result = await service.getClassAvailability("class-1")

      expect(result.available).toBe(0)
      expect(result.isFull).toBe(true)
    })

    it("defaults to capacity of 20 when not specified", async () => {
      jest.spyOn(service, "retrieveClassSchedule" as any).mockResolvedValue({
        id: "class-1",
      })
      jest.spyOn(service, "listClassBookings" as any).mockResolvedValue([])

      const result = await service.getClassAvailability("class-1")

      expect(result.capacity).toBe(20)
    })
  })

  describe("recordWorkout", () => {
    it("records a workout for an active member", async () => {
      jest.spyOn(service, "checkMembershipStatus" as any).mockResolvedValue({ active: true })
      const createSpy = jest.spyOn(service as any, "createWellnessPlans").mockResolvedValue({ id: "w-1" })

      await service.recordWorkout("member-1", {
        exerciseType: "cardio",
        duration: 45,
        caloriesBurned: 300,
      })

      expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({
        member_id: "member-1",
        exercise_type: "cardio",
        duration_minutes: 45,
        calories_burned: 300,
        type: "workout_log",
        status: "completed",
      }))
    })

    it("throws when membership is not active", async () => {
      jest.spyOn(service, "checkMembershipStatus" as any).mockResolvedValue({ active: false })

      await expect(service.recordWorkout("member-1", {
        exerciseType: "cardio",
        duration: 45,
      })).rejects.toThrow("Active membership is required")
    })

    it("throws when exercise type is missing", async () => {
      await expect(service.recordWorkout("member-1", {
        exerciseType: "",
        duration: 45,
      })).rejects.toThrow("Exercise type is required")
    })

    it("throws when duration is zero or negative", async () => {
      await expect(service.recordWorkout("member-1", {
        exerciseType: "cardio",
        duration: 0,
      })).rejects.toThrow("Duration must be greater than zero")
    })
  })
})
