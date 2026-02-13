import { defineLink } from "@medusajs/framework/utils"
import CompanyModule from "../modules/company.js"
import InvoiceModule from "../modules/invoice.js"

export default defineLink(
  CompanyModule.linkable.company,
  InvoiceModule.linkable.invoice
)
