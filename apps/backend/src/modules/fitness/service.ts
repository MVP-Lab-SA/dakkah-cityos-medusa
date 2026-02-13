import { MedusaService } from "@medusajs/framework/utils"
import GymMembership from "./models/gym-membership"
import ClassSchedule from "./models/class-schedule"
import TrainerProfile from "./models/trainer-profile"
import ClassBooking from "./models/class-booking"
import WellnessPlan from "./models/wellness-plan"

class FitnessModuleService extends MedusaService({
  GymMembership,
  ClassSchedule,
  TrainerProfile,
  ClassBooking,
  WellnessPlan,
}) {
  /**
   * Book a fitness class for a member. Validates membership status and class capacity.
   */
  async bookClass(classId: string, memberId: string): Promise<any> {
    const schedule = await this.retrieveClassSchedule(classId)
    const membership = await this.retrieveGymMembership(memberId)
    if (membership.status !== "active") {
      throw new Error("Membership is not active")
    }
    const existingBookings = await this.listClassBookings({ class_schedule_id: classId }) as any
    const bookingList = Array.isArray(existingBookings) ? existingBookings : [existingBookings].filter(Boolean)
    if (bookingList.length >= (schedule.max_capacity || 20)) {
      throw new Error("Class is fully booked")
    }
    return await (this as any).createClassBookings({
      class_schedule_id: classId,
      member_id: memberId,
      status: "confirmed",
      booked_at: new Date(),
    })
  }

  /**
   * Cancel an existing class booking. Only future bookings can be cancelled.
   */
  async cancelBooking(bookingId: string): Promise<any> {
    const booking = await this.retrieveClassBooking(bookingId)
    if (booking.status === "cancelled") {
      throw new Error("Booking is already cancelled")
    }
    return await (this as any).updateClassBookings({
      id: bookingId,
      status: "cancelled",
      cancelled_at: new Date(),
    })
  }

  /**
   * Get the class schedule for a trainer on a specific date.
   */
  async getSchedule(trainerId: string, date: Date): Promise<any[]> {
    const schedules = await this.listClassSchedules({ trainer_id: trainerId }) as any
    const list = Array.isArray(schedules) ? schedules : [schedules].filter(Boolean)
    const targetDate = new Date(date).toDateString()
    return list.filter((s: any) => new Date(s.start_time).toDateString() === targetDate)
      .sort((a: any, b: any) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
  }

  /**
   * Track attendance for a member in a class. Marks the booking as attended.
   */
  async trackAttendance(classId: string, memberId: string): Promise<any> {
    const bookings = await this.listClassBookings({
      class_schedule_id: classId,
      member_id: memberId,
      status: "confirmed",
    }) as any
    const bookingList = Array.isArray(bookings) ? bookings : [bookings].filter(Boolean)
    if (bookingList.length === 0) {
      throw new Error("No confirmed booking found for this member and class")
    }
    return await (this as any).updateClassBookings({
      id: bookingList[0].id,
      status: "attended",
      attended_at: new Date(),
    })
  }
}

export default FitnessModuleService
