// @ts-nocheck
import { MedusaService } from "@medusajs/framework/utils"
import TaxRule from "./models/tax-rule.js"
import TaxExemption from "./models/tax-exemption.js"

class TaxConfigModuleService extends MedusaService({
  TaxRule,
  TaxExemption,
}) {
  async calculateTax(data: {
    tenantId: string
    countryCode: string
    regionCode?: string
    city?: string
    postalCode?: string
    appliesTo?: string
    category?: string
    amount: number
    entityType?: string
    entityId?: string
  }): Promise<{ taxAmount: number; taxRate: number; rules: any[] }> {
    const rules = await this.getApplicableRules({
      tenantId: data.tenantId,
      countryCode: data.countryCode,
      regionCode: data.regionCode,
      city: data.city,
      postalCode: data.postalCode,
      appliesTo: data.appliesTo,
      category: data.category,
    })

    if (rules.length === 0) {
      return { taxAmount: 0, taxRate: 0, rules: [] }
    }

    let effectiveRate = 0
    const appliedRules: any[] = []

    for (const rule of rules) {
      if (rule.tax_type === "exempt") {
        return { taxAmount: 0, taxRate: 0, rules: [rule] }
      }

      let ruleRate = rule.tax_rate

      if (data.entityType && data.entityId) {
        const exemption = await this.getActiveExemption(
          data.tenantId,
          data.entityType,
          data.entityId,
          rule.id
        )

        if (exemption) {
          if (exemption.exemption_type === "full") {
            ruleRate = 0
          } else if (exemption.exemption_type === "partial" && exemption.exemption_rate) {
            ruleRate = ruleRate * (1 - exemption.exemption_rate / 100)
          }
        }
      }

      effectiveRate += ruleRate
      appliedRules.push({ ...rule, effective_rate: ruleRate })
    }

    const taxAmount = Math.round(data.amount * (effectiveRate / 100) * 100) / 100

    return {
      taxAmount,
      taxRate: effectiveRate,
      rules: appliedRules,
    }
  }

  async getApplicableRules(data: {
    tenantId: string
    countryCode: string
    regionCode?: string
    city?: string
    postalCode?: string
    appliesTo?: string
    category?: string
  }) {
    const allRules = await this.listTaxRules({
      tenant_id: data.tenantId,
      country_code: data.countryCode,
      status: "active",
    })

    const ruleList = Array.isArray(allRules) ? allRules : [allRules].filter(Boolean)
    const now = new Date()

    const filtered = ruleList.filter((rule: any) => {
      if (rule.valid_from && new Date(rule.valid_from) > now) return false
      if (rule.valid_to && new Date(rule.valid_to) < now) return false

      if (rule.region_code && data.regionCode && rule.region_code !== data.regionCode) return false
      if (rule.city && data.city && rule.city.toLowerCase() !== data.city.toLowerCase()) return false

      if (rule.postal_code_pattern && data.postalCode) {
        try {
          const regex = new RegExp(rule.postal_code_pattern)
          if (!regex.test(data.postalCode)) return false
        } catch {
          return false
        }
      }

      if (rule.applies_to !== "all" && data.appliesTo && rule.applies_to !== data.appliesTo) return false
      if (rule.category && data.category && rule.category !== data.category) return false

      return true
    })

    return filtered.sort((a: any, b: any) => (b.priority || 0) - (a.priority || 0))
  }

  async addExemption(data: {
    tenantId: string
    entityType: string
    entityId: string
    taxRuleId?: string
    exemptionType: string
    exemptionRate?: number
    certificateNumber?: string
    validFrom: Date
    validTo?: Date
    metadata?: Record<string, unknown>
  }) {
    if (data.exemptionType === "partial" && !data.exemptionRate) {
      throw new Error("Partial exemptions require an exemption rate")
    }

    return await (this as any).createTaxExemptions({
      tenant_id: data.tenantId,
      entity_type: data.entityType,
      entity_id: data.entityId,
      tax_rule_id: data.taxRuleId || null,
      exemption_type: data.exemptionType,
      exemption_rate: data.exemptionRate || null,
      certificate_number: data.certificateNumber || null,
      valid_from: data.validFrom,
      valid_to: data.validTo || null,
      status: "active",
      metadata: data.metadata || null,
    })
  }

  async validateExemption(exemptionId: string): Promise<{ valid: boolean; reason?: string }> {
    const exemption = await this.retrieveTaxExemption(exemptionId)

    if (exemption.status === "revoked") {
      return { valid: false, reason: "Exemption has been revoked" }
    }

    if (exemption.status === "expired") {
      return { valid: false, reason: "Exemption has expired" }
    }

    const now = new Date()
    if (new Date(exemption.valid_from) > now) {
      return { valid: false, reason: "Exemption is not yet valid" }
    }

    if (exemption.valid_to && new Date(exemption.valid_to) < now) {
      await (this as any).updateTaxExemptions({
        id: exemptionId,
        status: "expired",
      })
      return { valid: false, reason: "Exemption has expired" }
    }

    return { valid: true }
  }

  private async getActiveExemption(
    tenantId: string,
    entityType: string,
    entityId: string,
    taxRuleId?: string
  ) {
    const filters: Record<string, any> = {
      tenant_id: tenantId,
      entity_type: entityType,
      entity_id: entityId,
      status: "active",
    }

    if (taxRuleId) {
      filters.tax_rule_id = taxRuleId
    }

    const exemptions = await this.listTaxExemptions(filters)
    const list = Array.isArray(exemptions) ? exemptions : [exemptions].filter(Boolean)

    const now = new Date()
    return list.find((e: any) => {
      if (new Date(e.valid_from) > now) return false
      if (e.valid_to && new Date(e.valid_to) < now) return false
      return true
    }) || null
  }
}

export default TaxConfigModuleService
