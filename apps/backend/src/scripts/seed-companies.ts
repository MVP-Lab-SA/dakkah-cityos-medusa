import { ExecArgs } from "@medusajs/framework/types"

const companies = [
  {
    name: "Serenity Spa & Resort",
    legal_name: "Serenity Hospitality Group LLC",
    tax_id: "12-3456789",
    industry: "hospitality",
    company_size: "medium",
    website: "https://serenity-spa.dakkah.sa",
    credit_limit: "50000",
    credit_used: "12500",
    payment_terms: "net_30",
    status: "active",
    is_verified: true,
    billing_address: JSON.stringify({
      first_name: "Accounting",
      last_name: "Department",
      address_1: "100 Serenity Way",
      city: "Palm Springs",
      province: "CA",
      postal_code: "92262",
      country_code: "US",
    }),
    shipping_address: JSON.stringify({
      first_name: "Receiving",
      last_name: "Department",
      address_1: "100 Serenity Way",
      city: "Palm Springs",
      province: "CA",
      postal_code: "92262",
      country_code: "US",
    }),
  },
  {
    name: "Wellness Works Corporate",
    legal_name: "Wellness Works Inc",
    tax_id: "98-7654321",
    industry: "corporate",
    company_size: "large",
    website: "https://wellnessworks.dakkah.sa",
    credit_limit: "100000",
    credit_used: "45000",
    payment_terms: "net_60",
    status: "active",
    is_verified: true,
    billing_address: JSON.stringify({
      first_name: "Finance",
      last_name: "Team",
      address_1: "500 Corporate Blvd",
      address_2: "Suite 400",
      city: "San Francisco",
      province: "CA",
      postal_code: "94105",
      country_code: "US",
    }),
    shipping_address: JSON.stringify({
      first_name: "Office",
      last_name: "Manager",
      address_1: "500 Corporate Blvd",
      address_2: "Suite 400",
      city: "San Francisco",
      province: "CA",
      postal_code: "94105",
      country_code: "US",
    }),
  },
  {
    name: "Mountain View Yoga Studio",
    legal_name: "Mountain View Yoga LLC",
    tax_id: "45-6789012",
    industry: "fitness",
    company_size: "small",
    website: "https://mountainviewyoga.dakkah.sa",
    credit_limit: "15000",
    credit_used: "3200",
    payment_terms: "net_15",
    status: "active",
    is_verified: true,
    billing_address: JSON.stringify({
      first_name: "Sarah",
      last_name: "Chen",
      address_1: "234 Mountain View Ave",
      city: "Boulder",
      province: "CO",
      postal_code: "80302",
      country_code: "US",
    }),
    shipping_address: JSON.stringify({
      first_name: "Sarah",
      last_name: "Chen",
      address_1: "234 Mountain View Ave",
      city: "Boulder",
      province: "CO",
      postal_code: "80302",
      country_code: "US",
    }),
  },
  {
    name: "Tranquil Health Clinic",
    legal_name: "Tranquil Health Services PA",
    tax_id: "67-8901234",
    industry: "healthcare",
    company_size: "medium",
    website: "https://tranquilhealth.dakkah.sa",
    credit_limit: "75000",
    credit_used: "28000",
    payment_terms: "net_45",
    status: "active",
    is_verified: true,
    billing_address: JSON.stringify({
      first_name: "Billing",
      last_name: "Office",
      address_1: "789 Health Center Dr",
      city: "Austin",
      province: "TX",
      postal_code: "78701",
      country_code: "US",
    }),
    shipping_address: JSON.stringify({
      first_name: "Supply",
      last_name: "Room",
      address_1: "789 Health Center Dr",
      city: "Austin",
      province: "TX",
      postal_code: "78701",
      country_code: "US",
    }),
  },
]

export default async function seedCompanies({ container }: ExecArgs) {
  const companyModule = container.resolve("company") as any

  console.log("Seeding B2B companies...")

  for (const companyData of companies) {
    try {
      // Check if company already exists by name
      const existing = await companyModule.listCompanies({ name: companyData.name })
      const existingList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

      if (existingList.length > 0) {
        console.log(`  - Company ${companyData.name} already exists, skipping`)
        continue
      }

      await companyModule.createCompanies(companyData)
      console.log(`  - Created company: ${companyData.name}`)
    } catch (error: any) {
      console.error(`  - Failed to create company ${companyData.name}: ${error.message}`)
    }
  }

  console.log(`Seeded ${companies.length} B2B companies`)
}
