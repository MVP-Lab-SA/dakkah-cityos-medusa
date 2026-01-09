import { defineLink } from "@medusajs/framework/utils";
import CompanyModule from "../modules/company";
import { Modules } from "@medusajs/framework/utils";

/**
 * Link Company to Customer (through CompanyUser)
 */
export default defineLink(
  CompanyModule.linkable.companyUser,
  {
    linkable: Modules.CUSTOMER,
    foreignKey: "customer_id",
  }
);
