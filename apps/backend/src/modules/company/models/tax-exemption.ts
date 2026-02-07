import { model } from "@medusajs/framework/utils"

export const TaxExemption = model.define("tax_exemption", {
  id: model.id().primaryKey(),
  company_id: model.text(),
  tenant_id: model.text().nullable(),
  
  // Certificate Info
  certificate_number: model.text(),
  certificate_type: model.enum([
    "resale",
    "nonprofit",
    "government",
    "manufacturer",
    "agricultural",
    "educational",
    "medical",
    "religious",
    "other"
  ]),
  
  // Issuing Authority
  issuing_state: model.text().nullable(), // State/Province code
  issuing_country: model.text().nullable(),
  issuing_authority: model.text().nullable(),
  
  // Validity
  issue_date: model.dateTime(),
  expiration_date: model.dateTime().nullable(),
  is_permanent: model.boolean().default(false),
  
  // Status
  status: model.enum([
    "pending_verification",
    "verified",
    "rejected",
    "expired",
    "revoked"
  ]).default("pending_verification"),
  
  // Verification
  verified_by_id: model.text().nullable(),
  verified_at: model.dateTime().nullable(),
  verification_notes: model.text().nullable(),
  rejection_reason: model.text().nullable(),
  
  // Coverage
  exemption_percentage: model.bigNumber().default(100), // 100 = full exemption
  applicable_categories: model.json().nullable(), // Product category IDs
  applicable_regions: model.json().nullable(), // Region IDs
  
  // Documents
  certificate_file_url: model.text().nullable(),
  supporting_documents: model.json().nullable(), // Array of file URLs
  
  // Audit
  last_used_at: model.dateTime().nullable(),
  usage_count: model.number().default(0),
  
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["company_id"] },
  { on: ["tenant_id"] },
  { on: ["status"] },
  { on: ["expiration_date"] },
  { on: ["certificate_number"] },
])
