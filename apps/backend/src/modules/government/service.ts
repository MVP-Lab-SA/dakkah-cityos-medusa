import { MedusaService } from "@medusajs/framework/utils"
import ServiceRequest from "./models/service-request"
import Permit from "./models/permit"
import MunicipalLicense from "./models/municipal-license"
import Fine from "./models/fine"
import CitizenProfile from "./models/citizen-profile"

class GovernmentModuleService extends MedusaService({
  ServiceRequest,
  Permit,
  MunicipalLicense,
  Fine,
  CitizenProfile,
}) {
  /**
   * Submit a new government service application for a citizen.
   */
  async submitApplication(serviceId: string, applicantId: string, data: Record<string, any>): Promise<any> {
    const citizen = await this.retrieveCitizenProfile(applicantId)
    const applicationNumber = `APP-${Date.now().toString(36).toUpperCase()}`
    const request = await (this as any).createServiceRequests({
      service_id: serviceId,
      citizen_id: applicantId,
      status: "submitted",
      applicant_name: citizen.full_name,
      ...data,
    })
    return request
  }

  /**
   * Review a submitted application and record an approval or rejection decision.
   */
  async reviewApplication(applicationId: string, decision: "approved" | "rejected"): Promise<any> {
    const application = await this.retrieveServiceRequest(applicationId)
    if (application.status !== "submitted" && application.status !== "acknowledged") {
      throw new Error("Application is not in a reviewable state")
    }
    const updated = await (this as any).updateServiceRequests({
      id: applicationId,
      status: decision === "approved" ? "resolved" : "rejected",
      decision,
    })
    if (decision === "approved") {
      await (this as any).createPermits({
        service_request_id: applicationId,
        citizen_id: application.citizen_id,
        status: "active",
        issued_at: new Date(),
      })
    }
    return updated
  }

  /**
   * Track the current status and history of a government application.
   */
  async trackApplication(applicationId: string): Promise<any> {
    const application = await this.retrieveServiceRequest(applicationId)
    const permits = await this.listPermits({ service_request_id: applicationId }) as any
    const permitList = Array.isArray(permits) ? permits : [permits].filter(Boolean)
    return {
      status: application.status,
      permits: permitList,
    }
  }

  /**
   * Calculate fees for a government service based on its type and configuration.
   */
  async calculateFees(serviceId: string): Promise<{ baseFee: number; processingFee: number; totalFee: number }> {
    const fines = await this.listFines({ service_id: serviceId }) as any
    const fineList = Array.isArray(fines) ? fines : [fines].filter(Boolean)
    const baseFee = fineList.reduce((sum: number, f: any) => sum + Number(f.amount || 0), 0)
    const processingFee = baseFee * 0.05
    return { baseFee, processingFee, totalFee: baseFee + processingFee }
  }
}

export default GovernmentModuleService
