import { MedusaService } from "@medusajs/framework/utils"
import Practitioner from "./models/practitioner"
import HealthcareAppointment from "./models/healthcare-appointment"
import Prescription from "./models/prescription"
import LabOrder from "./models/lab-order"
import MedicalRecord from "./models/medical-record"
import PharmacyProduct from "./models/pharmacy-product"
import InsuranceClaim from "./models/insurance-claim"

class HealthcareModuleService extends MedusaService({
  Practitioner,
  HealthcareAppointment,
  Prescription,
  LabOrder,
  MedicalRecord,
  PharmacyProduct,
  InsuranceClaim,
}) {
  /**
   * Book an appointment with a healthcare provider for a patient on a given date.
   * Validates provider availability before creating the appointment.
   */
  async bookAppointment(providerId: string, patientId: string, date: Date): Promise<any> {
    const provider = await this.retrievePractitioner(providerId)
    const isAvailable = await this.checkProviderAvailability(providerId, date)
    if (!isAvailable) {
      throw new Error("Provider is not available at the requested time")
    }
    const appointment = await (this as any).createHealthcareAppointments({
      practitioner_id: providerId,
      patient_id: patientId,
      appointment_date: date,
      status: "scheduled",
      provider_name: provider.name,
    })
    return appointment
  }

  /**
   * Check whether a provider has availability on a given date.
   * Returns true if no conflicting appointments exist.
   */
  async checkProviderAvailability(providerId: string, date: Date): Promise<boolean> {
    const appointments = await this.listHealthcareAppointments({
      practitioner_id: providerId,
      status: ["scheduled", "confirmed", "in_progress"],
    }) as any
    const list = Array.isArray(appointments) ? appointments : [appointments].filter(Boolean)
    const targetDate = new Date(date).toDateString()
    const conflicts = list.filter((a: any) =>
      new Date(a.appointment_date).toDateString() === targetDate
    )
    return conflicts.length === 0
  }

  /**
   * Retrieve the full medical history for a patient including records, prescriptions, and lab orders.
   */
  async getPatientHistory(patientId: string): Promise<any> {
    const records = await this.listMedicalRecords({ patient_id: patientId }) as any
    const prescriptions = await this.listPrescriptions({ patient_id: patientId }) as any
    const labOrders = await this.listLabOrders({ patient_id: patientId }) as any
    const appointments = await this.listHealthcareAppointments({ patient_id: patientId }) as any
    return {
      records: Array.isArray(records) ? records : [records].filter(Boolean),
      prescriptions: Array.isArray(prescriptions) ? prescriptions : [prescriptions].filter(Boolean),
      labOrders: Array.isArray(labOrders) ? labOrders : [labOrders].filter(Boolean),
      appointments: Array.isArray(appointments) ? appointments : [appointments].filter(Boolean),
    }
  }

  /**
   * Cancel a scheduled appointment. Only appointments not yet completed can be cancelled.
   */
  async cancelAppointment(appointmentId: string): Promise<any> {
    const appointment = await this.retrieveHealthcareAppointment(appointmentId)
    if (["completed", "cancelled"].includes(appointment.status)) {
      throw new Error("Appointment cannot be cancelled from current status")
    }
    const updated = await (this as any).updateHealthcareAppointments({
      id: appointmentId,
      status: "cancelled",
      cancelled_at: new Date(),
    })
    return updated
  }
}

export default HealthcareModuleService
