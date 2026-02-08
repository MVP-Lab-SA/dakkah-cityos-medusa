import { defineLink } from "@medusajs/framework/utils"
import CompanyModule from "../modules/company"
import InvoiceModule from "../modules/invoice"

export default defineLink(
  CompanyModule.linkable.company,
  InvoiceModule.linkable.invoice
)
