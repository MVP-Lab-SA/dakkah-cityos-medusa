import { MedusaService } from "@medusajs/framework/utils";
import Company from "./models/company";
import CompanyUser from "./models/company-user";

/**
 * Company Service
 * 
 * Manages B2B company accounts and user memberships.
 */
class CompanyModuleService extends MedusaService({
  Company,
  CompanyUser,
}) {
  /**
   * Check if company has available credit
   */
  async hasAvailableCredit(companyId: string, amount: bigint): Promise<boolean> {
    const company = await this.retrieveCompany(companyId);
    const available = BigInt(company.credit_limit) - BigInt(company.credit_used);
    return available >= amount;
  }

  /**
   * Reserve credit for an order
   */
  async reserveCredit(companyId: string, amount: bigint): Promise<void> {
    const company = await this.retrieveCompany(companyId);
    const available = BigInt(company.credit_limit) - BigInt(company.credit_used);
    
    if (available < amount) {
      throw new Error(`Insufficient credit. Available: ${available}, Required: ${amount}`);
    }

    await this.updateCompanies(companyId, {
      credit_used: (BigInt(company.credit_used) + amount).toString(),
    });
  }

  /**
   * Release reserved credit (order cancelled/refunded)
   */
  async releaseCredit(companyId: string, amount: bigint): Promise<void> {
    const company = await this.retrieveCompany(companyId);
    const newUsed = BigInt(company.credit_used) - amount;
    
    await this.updateCompanies(companyId, {
      credit_used: (newUsed > 0n ? newUsed : 0n).toString(),
    });
  }

  /**
   * Check if user can approve an order amount
   */
  async canUserApprove(companyUserId: string, amount: bigint): Promise<boolean> {
    const companyUser = await this.retrieveCompanyUser(companyUserId);
    
    // Admins and approvers can approve
    if (!["admin", "approver"].includes(companyUser.role)) {
      return false;
    }

    // Check approval limit
    if (companyUser.approval_limit) {
      return amount <= BigInt(companyUser.approval_limit);
    }

    // No limit set = can approve any amount
    return true;
  }

  /**
   * Check if user has spending limit available
   */
  async hasSpendingLimitAvailable(companyUserId: string, amount: bigint): Promise<boolean> {
    const companyUser = await this.retrieveCompanyUser(companyUserId);
    
    // No limit = always available
    if (!companyUser.spending_limit) {
      return true;
    }

    // Check period spend
    const limit = BigInt(companyUser.spending_limit);
    const spent = BigInt(companyUser.current_period_spend);
    
    return (limit - spent) >= amount;
  }

  /**
   * Record user spending
   */
  async recordSpending(companyUserId: string, amount: bigint): Promise<void> {
    const companyUser = await this.retrieveCompanyUser(companyUserId);
    
    await this.updateCompanyUsers(companyUserId, {
      current_period_spend: (BigInt(companyUser.current_period_spend) + amount).toString(),
    });
  }

  /**
   * Get company users by role
   */
  async getCompanyUsersByRole(companyId: string, role: string) {
    return await this.listCompanyUsers({
      company_id: companyId,
      role,
      status: "active",
    });
  }

  /**
   * Get potential approvers for an amount
   */
  async getPotentialApprovers(companyId: string, amount: bigint) {
    const [users] = await this.listCompanyUsers({
      company_id: companyId,
      role: ["admin", "approver"],
      status: "active",
    });

    return users.filter(user => {
      if (!user.approval_limit) return true;
      return BigInt(user.approval_limit) >= amount;
    });
  }
}

export default CompanyModuleService;
