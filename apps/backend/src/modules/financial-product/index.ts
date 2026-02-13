import FinancialProductModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const FINANCIAL_PRODUCT_MODULE = "financialProduct"

export default Module(FINANCIAL_PRODUCT_MODULE, {
  service: FinancialProductModuleService,
})
