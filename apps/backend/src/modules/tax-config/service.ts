import { MedusaService } from "@medusajs/framework/utils";
import TaxRule from "./models/tax-rule";
import TaxExemption from "./models/tax-exemption";

type TaxRuleRecord = {
  id: string;
  tenant_id: string;
  name: string;
  description: string | null;
  country_code: string;
  region_code: string | null;
  city: string | null;
  postal_code_pattern: string | null;
  tax_rate: number;
  tax_type: string;
  applies_to: string;
  category: string | null;
  priority: number;
  status: string;
  valid_from: Date | string | null;
  valid_to: Date | string | null;
  metadata: Record<string, unknown> | null;
  effective_rate?: number;
};

type TaxExemptionRecord = {
  id: string;
  tenant_id: string;
  entity_type: string;
  entity_id: string;
  tax_rule_id: string | null;
  exemption_type: string;
  exemption_rate: number | null;
  certificate_number: string | null;
  valid_from: Date | string;
  valid_to: Date | string | null;
  status: string;
  metadata: Record<string, unknown> | null;
};

interface TaxConfigServiceBase {
  listTaxRules(filters: Record<string, unknown>): Promise<TaxRuleRecord[]>;
  listTaxExemptions(
    filters: Record<string, unknown>,
  ): Promise<TaxExemptionRecord[]>;
  createTaxExemptions(
    data: Record<string, unknown>,
  ): Promise<TaxExemptionRecord>;
  updateTaxExemptions(
    data: { id: string } & Record<string, unknown>,
  ): Promise<TaxExemptionRecord>;
  retrieveTaxExemption(id: string): Promise<TaxExemptionRecord>;
}

class TaxConfigModuleService extends MedusaService({
  TaxRule,
  TaxExemption,
}) {
  async calculateTax(data: {
    tenantId: string;
    countryCode: string;
    regionCode?: string;
    city?: string;
    postalCode?: string;
    appliesTo?: string;
    category?: string;
    amount: number;
    entityType?: string;
    entityId?: string;
  }): Promise<{ taxAmount: number; taxRate: number; rules: TaxRuleRecord[] }> {
    const rules = await this.getApplicableRules({
      tenantId: data.tenantId,
      countryCode: data.countryCode,
      regionCode: data.regionCode,
      city: data.city,
      postalCode: data.postalCode,
      appliesTo: data.appliesTo,
      category: data.category,
    });

    if (rules.length === 0) {
      return { taxAmount: 0, taxRate: 0, rules: [] };
    }

    let effectiveRate = 0;
    const appliedRules: TaxRuleRecord[] = [];

    for (const rule of rules) {
      if (rule.tax_type === "exempt") {
        return { taxAmount: 0, taxRate: 0, rules: [rule] };
      }

      let ruleRate = rule.tax_rate;

      if (data.entityType && data.entityId) {
        const exemption = await this.getActiveExemption(
          data.tenantId,
          data.entityType,
          data.entityId,
          rule.id,
        );

        if (exemption) {
          if (exemption.exemption_type === "full") {
            ruleRate = 0;
          } else if (
            exemption.exemption_type === "partial" &&
            exemption.exemption_rate
          ) {
            ruleRate = ruleRate * (1 - exemption.exemption_rate / 100);
          }
        }
      }

      effectiveRate += ruleRate;
      appliedRules.push({ ...rule, effective_rate: ruleRate });
    }

    const taxAmount =
      Math.round(data.amount * (effectiveRate / 100) * 100) / 100;

    return {
      taxAmount,
      taxRate: effectiveRate,
      rules: appliedRules,
    };
  }

  async getApplicableRules(data: {
    tenantId: string;
    countryCode: string;
    regionCode?: string;
    city?: string;
    postalCode?: string;
    appliesTo?: string;
    category?: string;
  }): Promise<TaxRuleRecord[]> {
    const allRules = await (
      this as unknown as TaxConfigServiceBase
    ).listTaxRules({
      tenant_id: data.tenantId,
      country_code: data.countryCode,
      status: "active",
    });

    const now = new Date();

    const filtered = allRules.filter((rule) => {
      if (rule.valid_from && new Date(rule.valid_from) > now) return false;
      if (rule.valid_to && new Date(rule.valid_to) < now) return false;

      if (
        rule.region_code &&
        data.regionCode &&
        rule.region_code !== data.regionCode
      )
        return false;
      if (
        rule.city &&
        data.city &&
        rule.city.toLowerCase() !== data.city.toLowerCase()
      )
        return false;

      if (rule.postal_code_pattern && data.postalCode) {
        try {
          const regex = new RegExp(rule.postal_code_pattern);
          if (!regex.test(data.postalCode)) return false;
        } catch {
          return false;
        }
      }

      if (
        rule.applies_to !== "all" &&
        data.appliesTo &&
        rule.applies_to !== data.appliesTo
      )
        return false;
      if (rule.category && data.category && rule.category !== data.category)
        return false;

      return true;
    });

    return filtered.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  async addExemption(data: {
    tenantId: string;
    entityType: string;
    entityId: string;
    taxRuleId?: string;
    exemptionType: string;
    exemptionRate?: number;
    certificateNumber?: string;
    validFrom: Date;
    validTo?: Date;
    metadata?: Record<string, unknown>;
  }): Promise<TaxExemptionRecord> {
    if (data.exemptionType === "partial" && !data.exemptionRate) {
      throw new Error("Partial exemptions require an exemption rate");
    }

    return (this as unknown as TaxConfigServiceBase).createTaxExemptions({
      tenant_id: data.tenantId,
      entity_type: data.entityType,
      entity_id: data.entityId,
      tax_rule_id: data.taxRuleId ?? null,
      exemption_type: data.exemptionType,
      exemption_rate: data.exemptionRate ?? null,
      certificate_number: data.certificateNumber ?? null,
      valid_from: data.validFrom,
      valid_to: data.validTo ?? null,
      status: "active",
      metadata: data.metadata ?? null,
    });
  }

  async validateExemption(
    exemptionId: string,
  ): Promise<{ valid: boolean; reason?: string }> {
    const exemption = await (
      this as unknown as TaxConfigServiceBase
    ).retrieveTaxExemption(exemptionId);

    if (exemption.status === "revoked") {
      return { valid: false, reason: "Exemption has been revoked" };
    }

    if (exemption.status === "expired") {
      return { valid: false, reason: "Exemption has expired" };
    }

    const now = new Date();
    if (new Date(exemption.valid_from) > now) {
      return { valid: false, reason: "Exemption is not yet valid" };
    }

    if (exemption.valid_to && new Date(exemption.valid_to) < now) {
      await (this as unknown as TaxConfigServiceBase).updateTaxExemptions({
        id: exemptionId,
        status: "expired",
      });
      return { valid: false, reason: "Exemption has expired" };
    }

    return { valid: true };
  }

  private async getActiveExemption(
    tenantId: string,
    entityType: string,
    entityId: string,
    taxRuleId?: string,
  ): Promise<TaxExemptionRecord | null> {
    const filters: Record<string, unknown> = {
      tenant_id: tenantId,
      entity_type: entityType,
      entity_id: entityId,
      status: "active",
    };

    if (taxRuleId) {
      filters.tax_rule_id = taxRuleId;
    }

    const exemptions = await (
      this as unknown as TaxConfigServiceBase
    ).listTaxExemptions(filters);

    const now = new Date();
    return (
      exemptions.find((e) => {
        if (new Date(e.valid_from) > now) return false;
        if (e.valid_to && new Date(e.valid_to) < now) return false;
        return true;
      }) ?? null
    );
  }

  async getTaxSummary(
    tenantId: string,
    regionId?: string,
  ): Promise<{
    tenantId: string;
    totalRules: number;
    regions: number;
    byRegion: Record<string, TaxRuleRecord[]>;
  }> {
    const filters: Record<string, unknown> = {
      tenant_id: tenantId,
      status: "active",
    };
    if (regionId) {
      filters.region_code = regionId;
    }

    const ruleList = await (
      this as unknown as TaxConfigServiceBase
    ).listTaxRules(filters);

    const byRegion: Record<string, TaxRuleRecord[]> = {};
    for (const rule of ruleList) {
      const region = rule.region_code ?? rule.country_code ?? "global";
      if (!byRegion[region]) {
        byRegion[region] = [];
      }
      byRegion[region].push(rule);
    }

    return {
      tenantId,
      totalRules: ruleList.length,
      regions: Object.keys(byRegion).length,
      byRegion,
    };
  }

  async validateTaxId(
    taxId: string,
    countryCode: string,
  ): Promise<{ valid: boolean; format: string; reason?: string }> {
    if (!taxId || !countryCode) {
      return {
        valid: false,
        format: "unknown",
        reason: "Tax ID and country code are required",
      };
    }

    const cleaned = taxId.replace(/[\s\-\.]/g, "").toUpperCase();

    const patterns: Record<string, { regex: RegExp; format: string }> = {
      GB: {
        regex: /^GB\d{9}$|^GB\d{12}$|^GBGD\d{3}$|^GBHA\d{3}$/,
        format: "VAT",
      },
      DE: { regex: /^DE\d{9}$/, format: "VAT" },
      FR: { regex: /^FR[A-Z0-9]{2}\d{9}$/, format: "VAT" },
      IT: { regex: /^IT\d{11}$/, format: "VAT" },
      ES: { regex: /^ES[A-Z0-9]\d{7}[A-Z0-9]$/, format: "VAT" },
      US: { regex: /^\d{2}\-?\d{7}$/, format: "TIN" },
      IN: { regex: /^\d{2}[A-Z]{5}\d{4}[A-Z]\d[A-Z][A-Z0-9]$/, format: "GST" },
      AU: { regex: /^\d{11}$/, format: "ABN" },
      CA: { regex: /^\d{9}RT\d{4}$/, format: "GST" },
    };

    const upper = countryCode.toUpperCase();
    const pattern = patterns[upper];

    if (!pattern) {
      return {
        valid: cleaned.length >= 5 && cleaned.length <= 20,
        format: "unknown",
      };
    }

    const valid = pattern.regex.test(cleaned);
    return {
      valid,
      format: pattern.format,
      reason: valid
        ? undefined
        : `Invalid ${pattern.format} format for ${upper}`,
    };
  }

  async getApplicableExemptions(
    customerId: string,
    tenantId: string,
  ): Promise<{
    customerId: string;
    tenantId: string;
    exemptions: TaxExemptionRecord[];
    count: number;
  }> {
    const exemptions = await (
      this as unknown as TaxConfigServiceBase
    ).listTaxExemptions({
      tenant_id: tenantId,
      entity_type: "customer",
      entity_id: customerId,
      status: "active",
    });

    const now = new Date();
    const active = exemptions.filter((e) => {
      if (new Date(e.valid_from) > now) return false;
      if (e.valid_to && new Date(e.valid_to) < now) return false;
      return true;
    });

    return {
      customerId,
      tenantId,
      exemptions: active,
      count: active.length,
    };
  }

  async getEffectiveTaxRate(
    tenantId: string,
    region: string,
    productCategory?: string,
  ): Promise<{
    effectiveRate: number;
    rules: TaxRuleRecord[];
    region: string;
    category: string | null;
  }> {
    const allRules = await (
      this as unknown as TaxConfigServiceBase
    ).listTaxRules({
      tenant_id: tenantId,
      status: "active",
    });

    const now = new Date();
    const applicable = allRules
      .filter((rule) => {
        if (rule.valid_from && new Date(rule.valid_from) > now) return false;
        if (rule.valid_to && new Date(rule.valid_to) < now) return false;

        const ruleRegion = rule.region_code ?? rule.country_code ?? "";
        if (ruleRegion && ruleRegion !== region) return false;

        if (
          productCategory &&
          rule.category &&
          rule.category !== productCategory
        )
          return false;

        return true;
      })
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));

    let effectiveRate = 0;
    for (const rule of applicable) {
      if (rule.tax_type === "exempt") {
        return {
          effectiveRate: 0,
          rules: [rule],
          region,
          category: productCategory ?? null,
        };
      }
      effectiveRate += Number(rule.tax_rate || 0);
    }

    return {
      effectiveRate,
      rules: applicable,
      region,
      category: productCategory ?? null,
    };
  }

  async validateTaxExemption(
    customerId: string,
    tenantId: string,
  ): Promise<{
    hasValidExemption: boolean;
    exemptions: TaxExemptionRecord[];
    expiringSoon: TaxExemptionRecord[];
  }> {
    const exemptions = await (
      this as unknown as TaxConfigServiceBase
    ).listTaxExemptions({
      tenant_id: tenantId,
      entity_type: "customer",
      entity_id: customerId,
    });

    const now = new Date();
    const thirtyDaysFromNow = new Date(
      now.getTime() + 30 * 24 * 60 * 60 * 1000,
    );

    const valid: TaxExemptionRecord[] = [];
    const expiringSoon: TaxExemptionRecord[] = [];

    for (const exemption of exemptions) {
      if (exemption.status !== "active") continue;
      if (new Date(exemption.valid_from) > now) continue;
      if (exemption.valid_to && new Date(exemption.valid_to) < now) continue;

      valid.push(exemption);

      if (
        exemption.valid_to &&
        new Date(exemption.valid_to) <= thirtyDaysFromNow
      ) {
        expiringSoon.push(exemption);
      }
    }

    return {
      hasValidExemption: valid.length > 0,
      exemptions: valid,
      expiringSoon,
    };
  }

  async generateTaxReport(
    tenantId: string,
    dateRange: { start: Date; end: Date },
  ): Promise<{
    tenantId: string;
    dateRange: { start: string; end: string };
    totalRules: number;
    byRegion: Record<
      string,
      { ruleCount: number; rates: number[]; averageRate: number }
    >;
    summary: { totalRegions: number; averageRate: number };
  }> {
    const allRules = await (
      this as unknown as TaxConfigServiceBase
    ).listTaxRules({
      tenant_id: tenantId,
      status: "active",
    });

    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);

    const filtered = allRules.filter((rule) => {
      if (rule.valid_from && new Date(rule.valid_from) > endDate) return false;
      if (rule.valid_to && new Date(rule.valid_to) < startDate) return false;
      return true;
    });

    const byRegion: Record<
      string,
      { ruleCount: number; rates: number[]; averageRate: number }
    > = {};

    for (const rule of filtered) {
      const region = rule.region_code ?? rule.country_code ?? "global";
      if (!byRegion[region]) {
        byRegion[region] = { ruleCount: 0, rates: [], averageRate: 0 };
      }
      byRegion[region].ruleCount++;
      byRegion[region].rates.push(Number(rule.tax_rate || 0));
    }

    let totalRate = 0;
    let totalCount = 0;
    for (const region of Object.keys(byRegion)) {
      const entry = byRegion[region];
      const sum = entry.rates.reduce((a, b) => a + b, 0);
      entry.averageRate =
        entry.rates.length > 0
          ? Math.round((sum / entry.rates.length) * 100) / 100
          : 0;
      totalRate += sum;
      totalCount += entry.rates.length;
    }

    return {
      tenantId,
      dateRange: { start: startDate.toISOString(), end: endDate.toISOString() },
      totalRules: filtered.length,
      byRegion,
      summary: {
        totalRegions: Object.keys(byRegion).length,
        averageRate:
          totalCount > 0 ? Math.round((totalRate / totalCount) * 100) / 100 : 0,
      },
    };
  }
}

export default TaxConfigModuleService;
