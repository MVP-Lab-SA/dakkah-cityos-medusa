import { MedusaService } from "@medusajs/framework/utils"
import Tenant from "./models/tenant"
import { TenantBilling, TenantUsageRecord, TenantInvoice } from "./models/tenant-billing"
import { TenantSettings } from "./models/tenant-settings"
import { TenantUser } from "./models/tenant-user"

/**
 * Tenant Module Service
 * Manages CityOS tenant operations, billing, settings, and team members
 */
class TenantModuleService extends MedusaService({
  Tenant,
  TenantBilling,
  TenantUsageRecord,
  TenantInvoice,
  TenantSettings,
  TenantUser,
}) {
  // ============ Tenant Lookup ============

  /**
   * Retrieve tenant by subdomain
   */
  async retrieveTenantBySubdomain(subdomain: string) {
    const tenants = await this.listTenants({
      subdomain,
      status: ["active", "trial"],
    }) as any
    const list = Array.isArray(tenants) ? tenants : [tenants].filter(Boolean)
    return list[0] || null
  }

  /**
   * Retrieve tenant by custom domain
   */
  async retrieveTenantByDomain(domain: string) {
    const tenants = await this.listTenants({
      custom_domain: domain,
      status: ["active", "trial"],
    }) as any
    const list = Array.isArray(tenants) ? tenants : [tenants].filter(Boolean)
    return list[0] || null
  }

  /**
   * Retrieve tenant by handle
   */
  async retrieveTenantByHandle(handle: string) {
    const tenants = await this.listTenants({ handle }) as any
    const list = Array.isArray(tenants) ? tenants : [tenants].filter(Boolean)
    return list[0] || null
  }

  /**
   * List tenants by CityOS hierarchy
   */
  async listTenantsByHierarchy(filters: {
    country_id?: string
    scope_type?: "theme" | "city"
    scope_id?: string
    category_id?: string
    subcategory_id?: string
  }) {
    return await this.listTenants(filters)
  }

  /**
   * Activate tenant (end trial, move to active)
   */
  async activateTenant(tenant_id: string) {
    return await (this as any).updateTenants({
      id: tenant_id,
      status: "active",
      trial_ends_at: null,
    })
  }

  /**
   * Suspend tenant
   */
  async suspendTenant(tenant_id: string, reason?: string) {
    return await (this as any).updateTenants({
      id: tenant_id,
      status: "suspended",
      metadata: { suspension_reason: reason },
    })
  }

  // ============ Tenant Onboarding ============

  /**
   * Create tenant with initial setup
   */
  async createTenantWithSetup(data: {
    name: string;
    handle: string;
    subdomain: string;
    email: string;
    ownerId: string;
    subscriptionTier?: string;
    trialDays?: number;
  }): Promise<any> {
    // Create tenant
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + (data.trialDays || 14));

    const tenant = await (this as any).createTenants({
      name: data.name,
      handle: data.handle,
      subdomain: data.subdomain,
      billing_email: data.email,
      subscription_tier: data.subscriptionTier || "basic",
      status: "trial",
      trial_ends_at: trialEndsAt,
    });

    // Create default settings
    await (this as any).createTenantSettings({
      tenant_id: tenant.id,
    });

    // Create billing record
    await (this as any).createTenantBillings({
      tenant_id: tenant.id,
      subscription_status: "trialing",
      current_period_start: new Date(),
      current_period_end: trialEndsAt,
    });

    // Add owner as tenant user
    await (this as any).createTenantUsers({
      tenant_id: tenant.id,
      user_id: data.ownerId,
      role: "owner",
      status: "active",
    });

    return tenant;
  }

  // ============ Billing Management ============

  /**
   * Get tenant billing
   */
  async getTenantBilling(tenantId: string): Promise<any> {
    const billings = await this.listTenantBillings({ tenant_id: tenantId }) as any;
    const list = Array.isArray(billings) ? billings : [billings].filter(Boolean);
    return list[0] || null;
  }

  /**
   * Update subscription
   */
  async updateSubscription(
    tenantId: string,
    planId: string,
    planName: string,
    planType: "monthly" | "yearly",
    basePrice: number
  ): Promise<any> {
    const billing = await this.getTenantBilling(tenantId);
    if (!billing) throw new Error("Billing not found");

    const periodEnd = new Date();
    if (planType === "monthly") {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }

    return await (this as any).updateTenantBillings({
      id: billing.id,
      plan_id: planId,
      plan_name: planName,
      plan_type: planType,
      base_price: basePrice,
      subscription_status: "active",
      current_period_start: new Date(),
      current_period_end: periodEnd,
    });
  }

  /**
   * Record usage
   */
  async recordUsage(
    tenantId: string,
    usageType: string,
    quantity: number,
    referenceType?: string,
    referenceId?: string
  ): Promise<any> {
    const billing = await this.getTenantBilling(tenantId);
    if (!billing) throw new Error("Billing not found");

    const unitPrice = billing.usage_price_per_unit || 0;
    const totalCost = quantity * Number(unitPrice);

    // Create usage record
    const record = await (this as any).createTenantUsageRecords({
      tenant_id: tenantId,
      billing_id: billing.id,
      usage_type: usageType,
      quantity,
      unit_price: unitPrice,
      total_cost: totalCost,
      recorded_at: new Date(),
      period_start: billing.current_period_start,
      period_end: billing.current_period_end,
      reference_type: referenceType,
      reference_id: referenceId,
    });

    // Update current usage
    await (this as any).updateTenantBillings({
      id: billing.id,
      current_usage: (billing.current_usage || 0) + quantity,
      current_usage_cost: Number(billing.current_usage_cost || 0) + totalCost,
    });

    return record;
  }

  /**
   * Get usage summary for period
   */
  async getUsageSummary(tenantId: string, periodStart: Date, periodEnd: Date): Promise<any> {
    const records = await this.listTenantUsageRecords({
      tenant_id: tenantId,
    }) as any;

    const list = (Array.isArray(records) ? records : [records].filter(Boolean))
      .filter((r: any) => {
        const recordedAt = new Date(r.recorded_at);
        return recordedAt >= periodStart && recordedAt <= periodEnd;
      });

    const summary: Record<string, { quantity: number; cost: number }> = {};

    for (const record of list) {
      const type = record.usage_type;
      if (!summary[type]) {
        summary[type] = { quantity: 0, cost: 0 };
      }
      summary[type].quantity += record.quantity;
      summary[type].cost += Number(record.total_cost || 0);
    }

    return summary;
  }

  /**
   * Generate invoice
   */
  async generateInvoice(tenantId: string): Promise<any> {
    const billing = await this.getTenantBilling(tenantId);
    if (!billing) throw new Error("Billing not found");

    const tenant = await this.retrieveTenant(tenantId);

    // Get usage for period
    const usageSummary = await this.getUsageSummary(
      tenantId,
      billing.current_period_start,
      billing.current_period_end
    );

    const usageAmount = Object.values(usageSummary).reduce(
      (sum: number, u: any) => sum + (u.cost || 0), 0
    ) as number;

    const totalAmount = Number(billing.base_price || 0) + usageAmount;

    // Generate invoice number
    const invoiceNumber = `INV-${tenant.handle?.toUpperCase() || "T"}-${Date.now().toString(36).toUpperCase()}`;

    const lineItems = [
      {
        description: `${billing.plan_name || "Subscription"} (${billing.plan_type})`,
        quantity: 1,
        unit_price: billing.base_price,
        total: billing.base_price,
      },
      ...Object.entries(usageSummary).map(([type, data]: [string, any]) => ({
        description: `${type} usage`,
        quantity: data.quantity,
        unit_price: billing.usage_price_per_unit,
        total: data.cost,
      })),
    ];

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    return await (this as any).createTenantInvoices({
      tenant_id: tenantId,
      billing_id: billing.id,
      invoice_number: invoiceNumber,
      period_start: billing.current_period_start,
      period_end: billing.current_period_end,
      currency_code: billing.currency_code,
      base_amount: billing.base_price,
      usage_amount: usageAmount,
      total_amount: totalAmount,
      status: "open",
      due_date: dueDate,
      line_items: lineItems,
    });
  }

  // ============ Team Management ============

  /**
   * Invite user to tenant
   */
  async inviteUser(
    tenantId: string,
    email: string,
    role: string,
    invitedById: string
  ): Promise<any> {
    const invitationToken = Math.random().toString(36).substring(2) + Date.now().toString(36);

    return await (this as any).createTenantUsers({
      tenant_id: tenantId,
      user_id: `pending_${email}`, // Will be updated when accepted
      role,
      status: "invited",
      invitation_token: invitationToken,
      invitation_sent_at: new Date(),
      invited_by_id: invitedById,
    });
  }

  /**
   * Accept invitation
   */
  async acceptInvitation(invitationToken: string, userId: string): Promise<any> {
    const users = await this.listTenantUsers({ invitation_token: invitationToken }) as any;
    const list = Array.isArray(users) ? users : [users].filter(Boolean);
    
    if (list.length === 0) {
      throw new Error("Invalid invitation token");
    }

    const tenantUser = list[0];

    return await (this as any).updateTenantUsers({
      id: tenantUser.id,
      user_id: userId,
      status: "active",
      invitation_accepted_at: new Date(),
      invitation_token: null,
    });
  }

  /**
   * Get tenant team members
   */
  async getTenantTeam(tenantId: string): Promise<any[]> {
    const users = await this.listTenantUsers({ tenant_id: tenantId }) as any;
    return Array.isArray(users) ? users : [users].filter(Boolean);
  }

  /**
   * Check user permission
   */
  async hasPermission(
    tenantId: string,
    userId: string,
    resource: string,
    action: string
  ): Promise<boolean> {
    const users = await this.listTenantUsers({
      tenant_id: tenantId,
      user_id: userId,
      status: "active",
    }) as any;

    const list = Array.isArray(users) ? users : [users].filter(Boolean);
    if (list.length === 0) return false;

    const tenantUser = list[0];

    // Owner has all permissions
    if (tenantUser.role === "owner") return true;

    // Admin has all permissions except ownership transfer
    if (tenantUser.role === "admin" && action !== "transfer_ownership") return true;

    // Check custom permissions
    const permissions = tenantUser.permissions || {};
    const resourcePermissions = permissions[resource] || [];
    
    return resourcePermissions.includes(action) || resourcePermissions.includes("*");
  }

  // ============ Settings Management ============

  /**
   * Get tenant settings
   */
  async getTenantSettings(tenantId: string): Promise<any> {
    const settings = await this.listTenantSettings({ tenant_id: tenantId }) as any;
    const list = Array.isArray(settings) ? settings : [settings].filter(Boolean);
    return list[0] || null;
  }

  /**
   * Update or create tenant settings
   */
  async upsertTenantSettings(tenantId: string, updates: any): Promise<any> {
    const settings = await this.getTenantSettings(tenantId);
    
    if (!settings) {
      return await (this as any).createTenantSettings({
        tenant_id: tenantId,
        ...updates,
      });
    }

    return await (this as any).updateTenantSettingss({
      id: settings.id,
      ...updates,
    });
  }

  // ============ Limits & Quotas ============

  /**
   * Check if tenant is within limits
   */
  async checkTenantLimits(tenantId: string): Promise<{
    withinLimits: boolean;
    violations: string[];
  }> {
    const billing = await this.getTenantBilling(tenantId);
    if (!billing) return { withinLimits: true, violations: [] };

    const violations: string[] = [];

    // Check product limit
    if (billing.max_products) {
      // Would need to query product count - simplified
      // if (productCount > billing.max_products) violations.push("max_products")
    }

    // Check order limit
    if (billing.max_orders_per_month && billing.current_usage > billing.max_orders_per_month) {
      violations.push("max_orders_per_month");
    }

    // Check team member limit
    if (billing.max_team_members) {
      const team = await this.getTenantTeam(tenantId);
      if (team.length > billing.max_team_members) {
        violations.push("max_team_members");
      }
    }

    return {
      withinLimits: violations.length === 0,
      violations,
    };
  }
}

export default TenantModuleService
