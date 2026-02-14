// @ts-nocheck
import { ExecArgs } from "@medusajs/framework/types"

export default async function seedVerticals7({ container }: ExecArgs) {
  console.log("========================================")
  console.log("Seeding Vertical Modules – Batch 7")
  console.log("Tenant/Governance & System Tables")
  console.log("========================================\n")

  const dataSource = container.resolve("__pg_connection__")

  let TENANT_ID = "01KGZ2JRYX607FWMMYQNQRKVWS"
  try {
    const tenantService = container.resolve("tenant") as any
    const tenants = await tenantService.listTenants({ handle: "dakkah" })
    const tenantList = Array.isArray(tenants) ? tenants : [tenants].filter(Boolean)
    if (tenantList.length > 0 && tenantList[0]?.id) {
      TENANT_ID = tenantList[0].id
      console.log(`Using Dakkah tenant: ${TENANT_ID}`)
    }
  } catch (e: any) {
    console.log(`Using fallback tenant ID: ${TENANT_ID}`)
  }
  const CUSTOMER_MOHAMMED = "cus_01KGZ2JS53BEYQAQ28YYZEMPKC"
  const CUSTOMER_FATIMA = "cus_01KGZ2JS5P4S10CEF14VAYEZZ7"
  const CUSTOMER_AHMED = "cus_01KGZ2JS6ET997Q1HXY8BBNQ0F"
  const USER_1 = "user_01KGX7H20X40WWRDJE1GHVS8J8"
  const USER_2 = "user_01KGZ2E9HD9KV8SX8G2416HT2S"
  const STORE_ID = "store_01KGX5ERB6T6XX9Z8N1PXD1P69"
  const SC_1 = "sc_01KGX5ER9665BH4V2DBCFXQPXJ"
  const SC_2 = "sc_01KGZ2CT2MB2HVHRE90ENQJG2B"
  const SC_3 = "sc_01KGZ2CT359RCVV05453DPKV3C"
  const REG_1 = "reg_01KGX7RFT438XP6T1KZ88WX0M0"
  const REG_2 = "reg_01KGXWH7P5HS70N8M5VX573VQ0"
  const REG_3 = "reg_01KGXWH7P6FFCG3S67T8N7VD05"
  const SEEDED_GOV_AUTHORITY_ID = process.env.SEEDED_GOV_AUTHORITY_ID || ""

  let nodeIds: { city?: string; district?: string; zone?: string; facility?: string; asset?: string } = {}
  try {
    const nodes = await dataSource.raw(
      `SELECT id, type FROM node WHERE tenant_id = $1 ORDER BY depth ASC LIMIT 10`,
      [TENANT_ID]
    )
    for (const n of nodes) {
      const t = n.type?.toLowerCase()
      if (t === "city" && !nodeIds.city) nodeIds.city = n.id
      if (t === "district" && !nodeIds.district) nodeIds.district = n.id
      if (t === "zone" && !nodeIds.zone) nodeIds.zone = n.id
      if (t === "facility" && !nodeIds.facility) nodeIds.facility = n.id
      if (t === "asset" && !nodeIds.asset) nodeIds.asset = n.id
    }
    console.log("Resolved node IDs:", JSON.stringify(nodeIds))
  } catch (e: any) {
    console.log(`Could not resolve node IDs: ${e.message}`)
  }

  const now = new Date().toISOString()

  // ============================================================
  // 1. PERSONA (5 rows)
  // ============================================================
  console.log("\n--- 1. Seeding persona (5 rows) ---")
  try {
    await dataSource.raw(`
      INSERT INTO persona (id, tenant_id, name, slug, category, axes, constraints, allowed_workflows, allowed_tools, allowed_surfaces, feature_overrides, priority, status, metadata, created_at, updated_at)
      VALUES
        ('seed7_persona_consumer', $1, 'Consumer', 'consumer', 'consumer',
         '{"behavioral":["browsing","purchasing","reviewing"],"demographic":["age","location","income"],"contextual":["time_of_day","device","location"]}',
         '{"max_orders_per_day":10,"max_cart_value":50000}',
         '["checkout","returns","wishlist","reviews"]',
         '["search","filters","recommendations","chat"]',
         '["web","mobile","kiosk"]',
         null, 0, 'active',
         '{"description":"Default consumer/shopper persona for marketplace browsing and purchasing","is_default":true}',
         $2, $2),

        ('seed7_persona_merchant', $1, 'Merchant', 'merchant', 'business',
         '{"behavioral":["selling","inventory_mgmt","analytics"],"demographic":["business_type","revenue_tier"],"contextual":["store_location","season"]}',
         '{"max_products":5000,"max_daily_orders":500}',
         '["product_management","order_fulfillment","payout_request","analytics"]',
         '["dashboard","inventory","reports","bulk_upload"]',
         '["web","mobile","api"]',
         '{"vendor_dashboard":true,"bulk_operations":true}', 1, 'active',
         '{"description":"Store owner/merchant persona for managing storefronts and products"}',
         $2, $2),

        ('seed7_persona_admin', $1, 'Platform Admin', 'platform-admin', 'platform',
         '{"behavioral":["monitoring","configuring","moderating"],"demographic":["role_level","department"],"contextual":["alert_severity","system_load"]}',
         '{"requires_2fa":true}',
         '["tenant_management","user_management","system_config","audit_review","governance"]',
         '["admin_panel","monitoring","logs","sql_console","feature_flags"]',
         '["web"]',
         '{"full_admin_access":true,"can_impersonate":true}', 2, 'active',
         '{"description":"Full platform administrator with unrestricted system access"}',
         $2, $2),

        ('seed7_persona_service', $1, 'Service Provider', 'service-provider', 'business',
         '{"behavioral":["booking_mgmt","service_delivery","scheduling"],"demographic":["service_category","certification_level"],"contextual":["availability","location_radius"]}',
         '{"max_active_bookings":20,"service_radius_km":50}',
         '["booking_management","availability_setup","service_listing","reviews"]',
         '["calendar","booking_dashboard","earnings","messaging"]',
         '["web","mobile"]',
         '{"booking_module":true,"availability_module":true}', 1, 'active',
         '{"description":"Service provider persona for freelancers, healthcare providers, and booking-based services"}',
         $2, $2),

        ('seed7_persona_gov', $1, 'Government Official', 'government-official', 'cityops',
         '{"behavioral":["oversight","compliance","reporting"],"demographic":["authority_level","jurisdiction"],"contextual":["regulatory_period","audit_cycle"]}',
         '{"data_access":"read_only","requires_audit_trail":true}',
         '["governance_review","compliance_audit","node_inspection","report_generation"]',
         '["governance_dashboard","compliance_reports","node_map","audit_logs"]',
         '["web"]',
         '{"governance_module":true,"audit_module":true,"read_only_commerce":true}', 3, 'active',
         '{"description":"Government official persona for regulatory oversight and city governance"}',
         $2, $2)
      ON CONFLICT (id) DO NOTHING
    `, [TENANT_ID, now])
    console.log("  ✓ persona: 5 rows inserted")
  } catch (e: any) {
    console.log(`  ✗ persona error: ${e.message}`)
  }

  // ============================================================
  // 2. PERSONA_ASSIGNMENT (4 rows)
  // ============================================================
  console.log("\n--- 2. Seeding persona_assignment (4 rows) ---")
  try {
    await dataSource.raw(`
      INSERT INTO persona_assignment (id, tenant_id, persona_id, user_id, scope, scope_reference, priority, status, starts_at, ends_at, metadata, created_at, updated_at)
      VALUES
        ('seed7_pa_mohammed', $1, 'seed7_persona_consumer', $2, 'user-default', null, 0, 'active', null, null, $7::jsonb, $6, $6),
        ('seed7_pa_fatima', $1, 'seed7_persona_merchant', $3, 'user-default', null, 0, 'active', null, null, $8::jsonb, $6, $6),
        ('seed7_pa_ahmed', $1, 'seed7_persona_service', $4, 'user-default', null, 0, 'active', null, null, $9::jsonb, $6, $6),
        ('seed7_pa_admin', $1, 'seed7_persona_admin', $5, 'user-default', null, 10, 'active', null, null, '{"role":"super_admin"}', $6, $6)
      ON CONFLICT (id) DO NOTHING
    `, [TENANT_ID, CUSTOMER_MOHAMMED, CUSTOMER_FATIMA, CUSTOMER_AHMED, USER_1, now,
        JSON.stringify({customer_id: CUSTOMER_MOHAMMED, name: "Mohammed"}),
        JSON.stringify({customer_id: CUSTOMER_FATIMA, name: "Fatima"}),
        JSON.stringify({customer_id: CUSTOMER_AHMED, name: "Ahmed"})])
    console.log("  ✓ persona_assignment: 4 rows inserted")
  } catch (e: any) {
    console.log(`  ✗ persona_assignment error: ${e.message}`)
  }

  // ============================================================
  // 3. CITYOS_STORE (2 rows)
  // ============================================================
  console.log("\n--- 3. Seeding cityos_store (2 rows) ---")
  try {
    await dataSource.raw(`
      INSERT INTO cityos_store (id, tenant_id, handle, name, sales_channel_id, default_region_id, supported_currency_codes, storefront_url, subdomain, custom_domain, theme_config, logo_url, favicon_url, brand_colors, store_type, status, seo_title, seo_description, seo_keywords, cms_site_id, settings, metadata, created_at, updated_at)
      VALUES
        ('seed7_store_main', $1, 'riyadh-marketplace', 'سوق الرياض الإلكتروني', $2, $4,
         '["sar","usd"]',
         'https://marketplace.cityos.sa', 'marketplace', null,
         '{"primaryFont":"IBM Plex Sans Arabic","layout":"modern","rtl":true}',
         'https://images.unsplash.com/photo-1560472355-536de3962603?w=200&q=80',
         'https://images.unsplash.com/photo-1560472355-536de3962603?w=32&q=80',
         '{"primary":"#1B5E20","secondary":"#FFD600","accent":"#00BCD4","background":"#FAFAFA"}',
         'marketplace', 'active',
         'سوق الرياض - تسوق إلكتروني | CityOS Marketplace',
         'أكبر سوق إلكتروني في الرياض - منتجات محلية وعالمية مع توصيل سريع',
         '["marketplace","riyadh","shopping","سوق","الرياض","تسوق"]',
         'cms_site_marketplace_01',
         '{"checkout_enabled":true,"guest_checkout":true,"reviews_enabled":true,"multi_vendor":true}',
         '{"launch_date":"2025-01-15","target_market":"B2C"}',
         $6, $6),

        ('seed7_store_b2b', $1, 'cityos-wholesale', 'CityOS Wholesale Hub', $3, $5,
         '["sar","usd","aed"]',
         'https://wholesale.cityos.sa', 'wholesale', null,
         '{"primaryFont":"Inter","layout":"professional","rtl":false}',
         'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&q=80',
         'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=32&q=80',
         '{"primary":"#0D47A1","secondary":"#FF6F00","accent":"#4CAF50","background":"#F5F5F5"}',
         'b2b', 'active',
         'CityOS Wholesale - B2B Procurement Platform',
         'Enterprise procurement platform for bulk orders, RFQs, and wholesale pricing across Saudi Arabia',
         '["wholesale","b2b","procurement","bulk","enterprise"]',
         'cms_site_wholesale_01',
         '{"checkout_enabled":true,"guest_checkout":false,"reviews_enabled":false,"multi_vendor":true,"require_company":true,"purchase_orders":true}',
         '{"launch_date":"2025-03-01","target_market":"B2B"}',
         $6, $6)
      ON CONFLICT (id) DO NOTHING
    `, [TENANT_ID, SC_1, SC_2, REG_1, REG_2, now])
    console.log("  ✓ cityos_store: 2 rows inserted")
  } catch (e: any) {
    console.log(`  ✗ cityos_store error: ${e.message}`)
  }

  // ============================================================
  // 4. TENANT_SETTINGS (1 row)
  // ============================================================
  console.log("\n--- 4. Seeding tenant_settings (1 row) ---")
  try {
    await dataSource.raw(`
      INSERT INTO tenant_settings (id, tenant_id, timezone, date_format, time_format, default_locale, supported_locales, default_currency, supported_currencies, primary_color, secondary_color, accent_color, font_family, custom_css, email_from_name, email_from_address, email_reply_to, smtp_host, smtp_port, smtp_user, smtp_password, guest_checkout_enabled, require_phone, require_company, min_order_value, max_order_value, track_inventory, allow_backorders, low_stock_threshold, order_number_prefix, order_number_start, auto_archive_days, accepted_payment_methods, payment_capture_method, free_shipping_threshold, default_weight_unit, default_dimension_unit, tax_inclusive_pricing, tax_provider, notify_on_new_order, notify_on_low_stock, notification_emails, google_analytics_id, facebook_pixel_id, google_tag_manager_id, api_rate_limit, webhook_secret, metadata, created_at, updated_at)
      VALUES (
        'seed7_tenant_settings', $1,
        'Asia/Riyadh', 'dd/MM/yyyy', 'hh:mm a',
        'ar', '["ar","en","fr"]',
        'sar', '["sar","usd"]',
        '#1B5E20', '#FFD600', '#00BCD4', 'IBM Plex Sans Arabic',
        null,
        'سوق الرياض', 'noreply@cityos.sa', 'support@cityos.sa',
        null, null, null, null,
        true, true, false,
        10, 100000,
        true, false, 10,
        'RYD', 1000, 90,
        '["credit_card","mada","apple_pay","stc_pay","bank_transfer"]',
        'automatic',
        200, 'kg', 'cm',
        true, null,
        true, true,
        '["admin@cityos.sa","ops@cityos.sa"]',
        null, null, null,
        5000, null,
        '{"vat_rate":0.15,"vat_number":"300012345600003","cr_number":"1010012345"}',
        $2, $2
      )
      ON CONFLICT (id) DO NOTHING
    `, [TENANT_ID, now])
    console.log("  ✓ tenant_settings: 1 row inserted")
  } catch (e: any) {
    console.log(`  ✗ tenant_settings error: ${e.message}`)
  }

  // ============================================================
  // 5. TENANT_USER (3 rows)
  // ============================================================
  console.log("\n--- 5. Seeding tenant_user (3 rows) ---")
  try {
    await dataSource.raw(`
      INSERT INTO tenant_user (id, tenant_id, user_id, role, role_level, assigned_nodes, assigned_node_ids, permissions, status, invitation_token, invitation_sent_at, invitation_accepted_at, invited_by_id, last_active_at, metadata, created_at, updated_at)
      VALUES
        ('seed7_tu_super', $1, $2, 'super-admin', 100,
         null, null,
         '{"all":true}',
         'active', null, null, $5, null, $5,
         '{"name":"محمد الأحمد","email":"mohammed@cityos.sa","title":"Platform Director"}',
         $5, $5),

        ('seed7_tu_admin', $1, $3, 'tenant-admin', 80,
         null, null,
         '{"tenant_management":true,"user_management":true,"billing":true,"analytics":true}',
         'active', null, null, $5, $2, $5,
         '{"name":"فاطمة العلي","email":"fatima@cityos.sa","title":"Operations Manager"}',
         $5, $5),

        ('seed7_tu_operator', $1, $4, 'zone-operator', 40,
         $6, $7,
         '{"node_view":true,"node_edit":true,"bookings":true,"inventory":true}',
         'active', null, null, $5, $2, $5,
         '{"name":"أحمد السالم","email":"ahmed@cityos.sa","title":"Zone Operator"}',
         $5, $5)
      ON CONFLICT (id) DO NOTHING
    `, [
      TENANT_ID, USER_1, USER_2, CUSTOMER_AHMED, now,
      nodeIds.zone ? JSON.stringify([{ id: nodeIds.zone, type: "ZONE" }]) : null,
      nodeIds.zone ? JSON.stringify([nodeIds.zone]) : null
    ])
    console.log("  ✓ tenant_user: 3 rows inserted")
  } catch (e: any) {
    console.log(`  ✗ tenant_user error: ${e.message}`)
  }

  // ============================================================
  // 6. TENANT_BILLING (1 row)
  // ============================================================
  console.log("\n--- 6. Seeding tenant_billing (1 row) ---")
  const billingId = "seed7_billing_main"
  try {
    const periodStart = new Date()
    periodStart.setDate(1)
    const periodEnd = new Date(periodStart)
    periodEnd.setMonth(periodEnd.getMonth() + 1)

    await dataSource.raw(`
      INSERT INTO tenant_billing (id, tenant_id, subscription_status, plan_id, plan_name, plan_type, base_price, currency_code, usage_metering_enabled, usage_price_per_unit, usage_unit_name, included_units, current_period_start, current_period_end, current_usage, current_usage_cost, payment_method_id, stripe_customer_id, stripe_subscription_id, last_invoice_date, last_invoice_amount, next_invoice_date, max_products, max_orders_per_month, max_storage_gb, max_team_members, metadata, created_at, updated_at)
      VALUES (
        $1, $2,
        'active', 'plan_enterprise_v2', 'Enterprise Plan', 'monthly',
        4999, 'sar',
        true, 0.05, 'api_call', 100000,
        $3, $4,
        42750, 2137,
        null, 'cus_stripe_cityos_ryd', 'sub_stripe_cityos_ent',
        $5, 4999, $4,
        50000, 100000, 500, 50,
        '{"contract_type":"annual","discount_pct":20,"account_manager":"سلطان العنزي","support_tier":"priority"}',
        $6, $6
      )
      ON CONFLICT (id) DO NOTHING
    `, [billingId, TENANT_ID, periodStart.toISOString(), periodEnd.toISOString(), new Date(Date.now() - 30 * 86400000).toISOString(), now])
    console.log("  ✓ tenant_billing: 1 row inserted")
  } catch (e: any) {
    console.log(`  ✗ tenant_billing error: ${e.message}`)
  }

  // ============================================================
  // 7. TENANT_INVOICE (2 rows)
  // ============================================================
  console.log("\n--- 7. Seeding tenant_invoice (2 rows) ---")
  try {
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    lastMonth.setDate(1)
    const lastMonthEnd = new Date(lastMonth)
    lastMonthEnd.setMonth(lastMonthEnd.getMonth() + 1)

    const twoMonthsAgo = new Date()
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)
    twoMonthsAgo.setDate(1)
    const twoMonthsAgoEnd = new Date(twoMonthsAgo)
    twoMonthsAgoEnd.setMonth(twoMonthsAgoEnd.getMonth() + 1)

    await dataSource.raw(`
      INSERT INTO tenant_invoice (id, tenant_id, billing_id, invoice_number, period_start, period_end, currency_code, base_amount, usage_amount, discount_amount, tax_amount, total_amount, status, paid_at, payment_method, stripe_invoice_id, invoice_pdf_url, due_date, line_items, metadata, created_at, updated_at)
      VALUES
        ('seed7_inv_01', $1, $2, 'INV-2026-RYD-001',
         $3, $4, 'sar',
         4999, 1850, 0, 1027, 7876,
         'paid', $5, 'mada', 'in_stripe_001',
         'https://cdn.cityos.sa/invoices/INV-2026-RYD-001.pdf',
         $4,
         '[{"description":"Enterprise Plan - Monthly","amount":4999},{"description":"API Overages (37,000 calls)","amount":1850},{"description":"VAT 15%","amount":1027}]',
         '{"payment_reference":"MADA-TXN-98712"}',
         $7, $7),

        ('seed7_inv_02', $1, $2, 'INV-2026-RYD-002',
         $5, $6, 'sar',
         4999, 2137, 0, 1070, 8206,
         'open', null, null, null,
         null,
         $8,
         '[{"description":"Enterprise Plan - Monthly","amount":4999},{"description":"API Overages (42,750 calls)","amount":2137},{"description":"VAT 15%","amount":1070}]',
         null,
         $7, $7)
      ON CONFLICT (id) DO NOTHING
    `, [
      TENANT_ID, billingId,
      twoMonthsAgo.toISOString(), twoMonthsAgoEnd.toISOString(),
      lastMonth.toISOString(), lastMonthEnd.toISOString(),
      now,
      new Date(Date.now() + 15 * 86400000).toISOString()
    ])
    console.log("  ✓ tenant_invoice: 2 rows inserted")
  } catch (e: any) {
    console.log(`  ✗ tenant_invoice error: ${e.message}`)
  }

  // ============================================================
  // 8. TENANT_USAGE_RECORD (3 rows)
  // ============================================================
  console.log("\n--- 8. Seeding tenant_usage_record (3 rows) ---")
  try {
    const periodStart = new Date()
    periodStart.setDate(1)
    const periodEnd = new Date(periodStart)
    periodEnd.setMonth(periodEnd.getMonth() + 1)

    await dataSource.raw(`
      INSERT INTO tenant_usage_record (id, tenant_id, billing_id, usage_type, quantity, unit_price, total_cost, recorded_at, period_start, period_end, reference_type, reference_id, metadata, created_at, updated_at)
      VALUES
        ('seed7_usage_api', $1, $2, 'api_calls', 42750, 0.05, 2137,
         $3, $4, $5, null, null,
         '{"endpoint_breakdown":{"store_api":28500,"admin_api":9200,"webhook":5050}}',
         $3, $3),

        ('seed7_usage_storage', $1, $2, 'storage', 128, 2, 256,
         $3, $4, $5, null, null,
         '{"breakdown":{"product_images":"85GB","documents":"23GB","backups":"20GB"}}',
         $3, $3),

        ('seed7_usage_bw', $1, $2, 'bandwidth', 340, 0.10, 34,
         $3, $4, $5, null, null,
         '{"breakdown":{"cdn":"220GB","api_responses":"85GB","uploads":"35GB"}}',
         $3, $3)
      ON CONFLICT (id) DO NOTHING
    `, [TENANT_ID, billingId, now, periodStart.toISOString(), periodEnd.toISOString()])
    console.log("  ✓ tenant_usage_record: 3 rows inserted")
  } catch (e: any) {
    console.log(`  ✗ tenant_usage_record error: ${e.message}`)
  }

  // ============================================================
  // 9. TRANSLATION (10 rows)
  // ============================================================
  console.log("\n--- 9. Seeding translation (10 rows) ---")
  try {
    await dataSource.raw(`
      INSERT INTO translation (id, tenant_id, locale, namespace, key, value, context, status, metadata, created_at, updated_at)
      VALUES
        ('seed7_tr_01', $1, 'ar', 'common', 'welcome', 'أهلاً وسهلاً', 'Homepage greeting', 'published', null, $2, $2),
        ('seed7_tr_02', $1, 'en', 'common', 'welcome', 'Welcome', 'Homepage greeting', 'published', null, $2, $2),
        ('seed7_tr_03', $1, 'fr', 'common', 'welcome', 'Bienvenue', 'Homepage greeting', 'published', null, $2, $2),
        ('seed7_tr_04', $1, 'ar', 'common', 'add_to_cart', 'أضف إلى السلة', 'Product page CTA', 'published', null, $2, $2),
        ('seed7_tr_05', $1, 'en', 'common', 'add_to_cart', 'Add to Cart', 'Product page CTA', 'published', null, $2, $2),
        ('seed7_tr_06', $1, 'fr', 'common', 'add_to_cart', 'Ajouter au panier', 'Product page CTA', 'published', null, $2, $2),
        ('seed7_tr_07', $1, 'ar', 'checkout', 'proceed_payment', 'المتابعة للدفع', 'Checkout button', 'published', null, $2, $2),
        ('seed7_tr_08', $1, 'en', 'checkout', 'proceed_payment', 'Proceed to Payment', 'Checkout button', 'published', null, $2, $2),
        ('seed7_tr_09', $1, 'ar', 'common', 'search_placeholder', 'ابحث عن منتجات، متاجر، خدمات...', 'Search bar placeholder', 'published', null, $2, $2),
        ('seed7_tr_10', $1, 'en', 'common', 'search_placeholder', 'Search products, stores, services...', 'Search bar placeholder', 'published', null, $2, $2)
      ON CONFLICT (id) DO NOTHING
    `, [TENANT_ID, now])
    console.log("  ✓ translation: 10 rows inserted")
  } catch (e: any) {
    console.log(`  ✗ translation error: ${e.message}`)
  }

  // ============================================================
  // 10. AUDIT_LOG (5 rows)
  // ============================================================
  console.log("\n--- 10. Seeding audit_log (5 rows) ---")
  try {
    await dataSource.raw(`
      INSERT INTO audit_log (id, tenant_id, action, resource_type, resource_id, actor_id, actor_role, actor_email, node_id, changes, previous_values, new_values, ip_address, user_agent, data_classification, metadata, created_at, updated_at)
      VALUES
        ('seed7_audit_01', $1, 'tenant.settings.updated', 'tenant_settings', 'seed7_tenant_settings',
         $2, 'super-admin', 'mohammed@cityos.sa', $5,
         '{"timezone":"UTC → Asia/Riyadh","default_locale":"en → ar"}',
         '{"timezone":"UTC","default_locale":"en"}',
         '{"timezone":"Asia/Riyadh","default_locale":"ar"}',
         '203.0.113.42', 'Mozilla/5.0 CityOS-Admin/2.1', 'internal',
         '{"session_id":"sess_abc123"}', $4, $4),

        ('seed7_audit_02', $1, 'user.invited', 'tenant_user', 'seed7_tu_operator',
         $2, 'super-admin', 'mohammed@cityos.sa', null,
         '{"action":"invited zone operator"}',
         null,
         $8::jsonb,
         '203.0.113.42', 'Mozilla/5.0 CityOS-Admin/2.1', 'internal',
         '{"invitation_method":"email"}', $4, $4),

        ('seed7_audit_03', $1, 'store.created', 'cityos_store', 'seed7_store_main',
         $2, 'super-admin', 'mohammed@cityos.sa', $5,
         '{"action":"created marketplace store"}',
         null,
         '{"name":"سوق الرياض الإلكتروني","store_type":"marketplace"}',
         '203.0.113.42', 'Mozilla/5.0 CityOS-Admin/2.1', 'confidential',
         null, $4, $4),

        ('seed7_audit_04', $1, 'billing.plan_upgraded', 'tenant_billing', $6,
         $3, 'tenant-admin', 'fatima@cityos.sa', null,
         '{"plan":"pro → enterprise"}',
         '{"plan_name":"Pro Plan","base_price":1999}',
         '{"plan_name":"Enterprise Plan","base_price":4999}',
         '198.51.100.15', 'Mozilla/5.0 CityOS-Admin/2.1', 'confidential',
         '{"approval_ref":"APR-2026-001"}', $4, $4),

        ('seed7_audit_05', $1, 'governance.authority_linked', 'governance_authority', $7,
         $2, 'super-admin', 'mohammed@cityos.sa', $5,
         '{"action":"linked governance authority to tenant"}',
         null,
         $9::jsonb,
         '203.0.113.42', 'Mozilla/5.0 CityOS-Admin/2.1', 'restricted',
         '{"compliance_note":"SDAIA data residency requirement"}', $4, $4)
      ON CONFLICT (id) DO NOTHING
    `, [TENANT_ID, USER_1, USER_2, now, nodeIds.city || null, billingId, SEEDED_GOV_AUTHORITY_ID,
        JSON.stringify({user_id: CUSTOMER_AHMED, role: "zone-operator"}),
        JSON.stringify({authority_id: SEEDED_GOV_AUTHORITY_ID, tenant_id: TENANT_ID})])
    console.log("  ✓ audit_log: 5 rows inserted")
  } catch (e: any) {
    console.log(`  ✗ audit_log error: ${e.message}`)
  }

  // ============================================================
  // 11. EVENT_OUTBOX (3 rows)
  // ============================================================
  console.log("\n--- 11. Seeding event_outbox (3 rows) ---")
  try {
    await dataSource.raw(`
      INSERT INTO event_outbox (id, tenant_id, event_type, aggregate_type, aggregate_id, payload, metadata, source, correlation_id, causation_id, actor_id, actor_role, node_id, channel, status, published_at, error, retry_count, created_at, updated_at)
      VALUES
        ('seed7_evt_01', $1, 'store.created', 'cityos_store', 'seed7_store_main',
         $5::jsonb,
         '{"version":"1.0","schema":"cityos.store.v1"}',
         'commerce', 'corr_store_001', null,
         $2, 'super-admin', $4, 'web',
         'published', $3, null, 0, $3, $3),

        ('seed7_evt_02', $1, 'tenant.settings.updated', 'tenant_settings', 'seed7_tenant_settings',
         $6::jsonb,
         '{"version":"1.0","schema":"cityos.tenant.v1"}',
         'commerce', 'corr_settings_001', null,
         $2, 'super-admin', null, 'admin',
         'published', $3, null, 0, $3, $3),

        ('seed7_evt_03', $1, 'billing.invoice.generated', 'tenant_invoice', 'seed7_inv_02',
         '{"invoice_number":"INV-2026-RYD-002","total_amount":8206,"currency":"sar","status":"open"}',
         '{"version":"1.0","schema":"cityos.billing.v1"}',
         'billing', 'corr_invoice_002', null,
         null, 'system', null, 'internal',
         'pending', null, null, 0, $3, $3)
      ON CONFLICT (id) DO NOTHING
    `, [TENANT_ID, USER_1, now, nodeIds.city || null,
        JSON.stringify({store_id: "seed7_store_main", name: "سوق الرياض الإلكتروني", store_type: "marketplace", tenant_id: TENANT_ID}),
        JSON.stringify({tenant_id: TENANT_ID, changes: {timezone: "Asia/Riyadh", locale: "ar", currencies: ["sar", "usd"]}})])
    console.log("  ✓ event_outbox: 3 rows inserted")
  } catch (e: any) {
    console.log(`  ✗ event_outbox error: ${e.message}`)
  }

  // ============================================================
  // 12. VIEW_CONFIGURATION (2 rows)
  // ============================================================
  console.log("\n--- 12. Seeding view_configuration (2 rows) ---")
  try {
    await dataSource.raw(`
      INSERT INTO view_configuration (id, entity, name, user_id, is_system_default, configuration, created_at, updated_at)
      VALUES
        ('seed7_vc_orders', 'order', 'Default Order Dashboard', $1, true,
         '{"columns":["order_number","customer_name","status","total","created_at","fulfillment_status"],"sort":{"field":"created_at","direction":"desc"},"filters":{"status":["pending","processing"]},"page_size":25,"density":"comfortable"}',
         $3, $3),

        ('seed7_vc_products', 'product', 'Product Catalog View', $2, false,
         '{"columns":["title","status","price","inventory_quantity","vendor","category"],"sort":{"field":"title","direction":"asc"},"filters":{"status":["published"]},"page_size":50,"density":"compact","groupBy":"category"}',
         $3, $3)
      ON CONFLICT (id) DO NOTHING
    `, [USER_1, USER_2, now])
    console.log("  ✓ view_configuration: 2 rows inserted")
  } catch (e: any) {
    console.log(`  ✗ view_configuration error: ${e.message}`)
  }

  // ============================================================
  // 13. USER_PREFERENCE (2 rows)
  // ============================================================
  console.log("\n--- 13. Seeding user_preference (2 rows) ---")
  try {
    await dataSource.raw(`
      INSERT INTO user_preference (id, user_id, key, value, created_at, updated_at)
      VALUES
        ('seed7_pref_01', $1, 'ui_settings',
         '{"theme":"dark","language":"ar","direction":"rtl","sidebar_collapsed":false,"notifications":{"email":true,"push":true,"sms":false},"timezone":"Asia/Riyadh","date_format":"dd/MM/yyyy"}',
         $3, $3),

        ('seed7_pref_02', $2, 'ui_settings',
         '{"theme":"light","language":"en","direction":"ltr","sidebar_collapsed":true,"notifications":{"email":true,"push":false,"sms":true},"timezone":"Asia/Riyadh","date_format":"MM/dd/yyyy"}',
         $3, $3)
      ON CONFLICT (id) DO NOTHING
    `, [USER_1, USER_2, now])
    console.log("  ✓ user_preference: 2 rows inserted")
  } catch (e: any) {
    console.log(`  ✗ user_preference error: ${e.message}`)
  }

  // ============================================================
  // 14. SALES_CHANNEL_MAPPING (3 rows)
  // ============================================================
  console.log("\n--- 14. Seeding sales_channel_mapping (3 rows) ---")
  try {
    await dataSource.raw(`
      INSERT INTO sales_channel_mapping (id, tenant_id, channel_type, medusa_sales_channel_id, name, description, node_id, config, is_active, metadata, created_at, updated_at)
      VALUES
        ('seed7_scm_web', $1, 'web', $2,
         'Riyadh Marketplace Web', 'Primary web storefront for B2C marketplace',
         $5,
         '{"storefront_url":"https://marketplace.cityos.sa","checkout_enabled":true,"guest_checkout":true}',
         true, '{"priority":1}', $7, $7),

        ('seed7_scm_mobile', $1, 'mobile', $3,
         'CityOS Mobile App', 'iOS and Android native app channel',
         null,
         '{"app_store_id":"com.cityos.marketplace","push_enabled":true,"deep_linking":true}',
         true, '{"priority":2}', $7, $7),

        ('seed7_scm_b2b', $1, 'api', $4,
         'B2B Wholesale API', 'API-driven channel for enterprise procurement integrations',
         null,
         '{"api_version":"v2","rate_limit":10000,"require_api_key":true,"webhook_url":"https://wholesale.cityos.sa/api/webhook"}',
         true, '{"priority":3}', $7, $7)
      ON CONFLICT (id) DO NOTHING
    `, [TENANT_ID, SC_1, SC_2, SC_3, nodeIds.city || null, null, now])
    console.log("  ✓ sales_channel_mapping: 3 rows inserted")
  } catch (e: any) {
    console.log(`  ✗ sales_channel_mapping error: ${e.message}`)
  }

  // ============================================================
  // 15. REGION_ZONE_MAPPING (3 rows)
  // ============================================================
  console.log("\n--- 15. Seeding region_zone_mapping (3 rows) ---")
  try {
    await dataSource.raw(`
      INSERT INTO region_zone_mapping (id, residency_zone, medusa_region_id, country_codes, policies_override, metadata, created_at, updated_at)
      VALUES
        ('seed7_rzm_gcc', 'GCC', $1,
         '["sa","ae","bh","kw","om","qa"]',
         '{"data_residency":"gcc_only","vat_rate":0.15,"payment_methods":["mada","visa","mastercard","apple_pay","stc_pay"],"shipping_providers":["aramex","smsa","naqel"]}',
         '{"primary_currency":"sar","fallback_currency":"usd"}',
         $4, $4),

        ('seed7_rzm_mena', 'MENA', $2,
         '["eg","jo","lb","iq","ma","tn"]',
         '{"data_residency":"mena_compliant","payment_methods":["visa","mastercard","cod"],"customs_required":true}',
         '{"primary_currency":"usd"}',
         $4, $4),

        ('seed7_rzm_global', 'GLOBAL', $3,
         '["us","gb","de","fr","jp","au","in"]',
         '{"data_residency":"global","payment_methods":["visa","mastercard","paypal"],"customs_required":true,"restricted_products":["electronics_high_value"]}',
         '{"primary_currency":"usd","shipping_surcharge":true}',
         $4, $4)
      ON CONFLICT (id) DO NOTHING
    `, [REG_1, REG_2, REG_3, now])
    console.log("  ✓ region_zone_mapping: 3 rows inserted")
  } catch (e: any) {
    console.log(`  ✗ region_zone_mapping error: ${e.message}`)
  }

  console.log("\n========================================")
  console.log("Seed Verticals 7 – Complete!")
  console.log("========================================")
}
