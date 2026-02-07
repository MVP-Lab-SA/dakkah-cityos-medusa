// @ts-nocheck
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// POST /store/vendors/register - Register as a new vendor
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const {
    company_name,
    business_email,
    phone,
    website,
    description,
    business_type,
    tax_id,
    address,
    bank_account,
    contact_person,
    product_categories,
    expected_volume,
    existing_sales_channels,
    agree_to_terms,
  } = req.body as any

  if (!agree_to_terms) {
    return res.status(400).json({ message: "You must agree to the terms and conditions" })
  }

  if (!company_name || !business_email) {
    return res.status(400).json({ message: "Company name and email are required" })
  }

  const vendorModule = req.scope.resolve("vendor")

  try {
    // Generate handle from company name
    const handle = company_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")

    // Check if handle already exists
    const existingVendors = await vendorModule.listVendors({ handle })
    if (existingVendors.length > 0) {
      return res.status(400).json({ message: "A vendor with this name already exists" })
    }

    // Create vendor with pending status
    const vendor = await vendorModule.createVendors({
      name: company_name,
      handle,
      email: business_email,
      phone,
      website,
      description,
      status: "pending",
      verification_status: "pending",
      metadata: {
        business_type,
        tax_id,
        address,
        bank_account,
        contact_person,
        product_categories,
        expected_volume,
        existing_sales_channels,
        application_date: new Date().toISOString(),
      },
    })

    // Emit event for admin notification
    const eventBus = req.scope.resolve("event_bus")
    await eventBus.emit("vendor.application_submitted", {
      vendor_id: vendor.id,
      company_name,
      business_email,
    })

    res.status(201).json({
      success: true,
      vendor: {
        id: vendor.id,
        name: vendor.name,
        handle: vendor.handle,
        status: vendor.status,
      },
      message: "Your vendor application has been submitted. We'll review it within 2-3 business days.",
    })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
