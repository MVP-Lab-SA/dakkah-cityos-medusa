import { MedusaService } from "@medusajs/framework/utils"
import AttorneyProfile from "./models/attorney-profile"
import LegalCase from "./models/legal-case"
import LegalConsultation from "./models/consultation"
import RetainerAgreement from "./models/retainer-agreement"

class LegalModuleService extends MedusaService({
  AttorneyProfile,
  LegalCase,
  LegalConsultation,
  RetainerAgreement,
}) {
  /**
   * Create a new legal case for a client with the specified case type.
   */
  async createCase(clientId: string, caseType: string): Promise<any> {
    const caseNumber = `CASE-${Date.now().toString(36).toUpperCase()}`
    const legalCase = await (this as any).createLegalCases({
      client_id: clientId,
      case_type: caseType,
      case_number: caseNumber,
      status: "open",
      opened_at: new Date(),
    })
    return legalCase
  }

  /**
   * Assign an attorney to a case. Validates the attorney exists and the case is open.
   */
  async assignAttorney(caseId: string, attorneyId: string): Promise<any> {
    const legalCase = await this.retrieveLegalCase(caseId)
    if (legalCase.status === "closed") {
      throw new Error("Cannot assign attorney to a closed case")
    }
    const attorney = await this.retrieveAttorneyProfile(attorneyId)
    return await (this as any).updateLegalCases({
      id: caseId,
      attorney_id: attorneyId,
      attorney_name: attorney.name,
      assigned_at: new Date(),
    })
  }

  /**
   * Update the status of a legal case with validation of allowed transitions.
   */
  async updateCaseStatus(caseId: string, status: string): Promise<any> {
    const legalCase = await this.retrieveLegalCase(caseId)
    if (legalCase.status === "closed" && status !== "reopened") {
      throw new Error("Closed cases can only be reopened")
    }
    return await (this as any).updateLegalCases({
      id: caseId,
      status,
      updated_at: new Date(),
    })
  }

  /**
   * Generate an invoice for a legal case based on consultations and retainer agreements.
   */
  async generateInvoice(caseId: string): Promise<any> {
    const legalCase = await this.retrieveLegalCase(caseId)
    const consultations = await this.listLegalConsultations({ case_id: caseId }) as any
    const consultList = Array.isArray(consultations) ? consultations : [consultations].filter(Boolean)
    const totalHours = consultList.reduce((sum: number, c: any) => sum + Number(c.duration_hours || 0), 0)
    // @ts-expect-error - LegalCase doesn't have hourly_rate property
    const hourlyRate = Number(legalCase.hourly_rate || 250)
    const totalAmount = totalHours * hourlyRate
    return {
      caseId,
      caseNumber: legalCase.case_number,
      totalHours,
      hourlyRate,
      totalAmount,
      consultations: consultList.length,
      generatedAt: new Date(),
    }
  }
}

export default LegalModuleService
