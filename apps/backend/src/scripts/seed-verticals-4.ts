// @ts-nocheck
import { ExecArgs } from "@medusajs/framework/types"

export default async function seedVerticals4({ container }: ExecArgs) {
  console.log("========================================")
  console.log("Seeding Vertical Modules - Batch 4")
  console.log("========================================\n")

  const dataSource = container.resolve("__pg_connection__")

  let tenantId = "01KGZ2JRYX607FWMMYQNQRKVWS"
  try {
    const tenantService = container.resolve("tenant") as any
    const tenants = await tenantService.listTenants({ handle: "dakkah" })
    const tenantList = Array.isArray(tenants) ? tenants : [tenants].filter(Boolean)
    if (tenantList.length > 0 && tenantList[0]?.id) {
      tenantId = tenantList[0].id
      console.log(`Using Dakkah tenant: ${tenantId}`)
    }
  } catch (e: any) {
    console.log(`Using fallback tenant ID: ${tenantId}`)
  }
  const storeId = "store_01KGX5ERB6T6XX9Z8N1PXD1P69"
  const customerIds = [
    "cus_01KGZ2JS53BEYQAQ28YYZEMPKC",
    "cus_01KGZ2JS5P4S10CEF14VAYEZZ7",
    "cus_01KGZ2JS6ET997Q1HXY8BBNQ0F",
    "cus_01KH138M33QS3EKDPGE21ATSH4",
  ]
  const userIds = [
    "user_01KGX7H20X40WWRDJE1GHVS8J8",
    "user_01KGZ2E9HD9KV8SX8G2416HT2S",
  ]
  const vendorIds = [
    "01KGZ2JS6VVN97NXBHNP0S4BKY",
    "01KGZ2JS77VF4PV6F9X4RG4MKJ",
  ]
  const campaignIds = [
    "01KH0ZR1DGDEM4QTQEY6ZPVGYF",
    "01KH0ZR1DJMQG4C2S1Z2V9QNEW",
  ]
  const placementIds = [
    "01KH0ZR1DT53CFC5JEYMCXQ999",
    "01KH0ZR1DXQC1XARDWR69V9FCJ",
  ]
  const affiliateIds = [
    "01KH0ZR1E929YCJ40368BBRJ5S",
    "01KH0ZR1EFHAVGFTBBXZGWEXZE",
  ]
  const referralLinkIds = [
    "01KH0ZR1EN2KJ7RNP1YHRSZSAV",
    "01KH0ZR1EQCKHPQBBZ6W2GW4WV",
    "01KH0ZR1ESD655AMF3EZ2S75YB",
  ]
  const auctionListingIds = [
    "01KH0ZPJYWS5R4T9AGVT4AZDRZ",
    "01KH0ZPJZ3QMXZVC6F42NHRQZJ",
    "01KH0ZPJZ4ME1DZ0ZG1XTNFRSB",
  ]
  const vehicleListingIds = [
    "01KH0ZR1BT8CQ1W06C9G6E18ZF",
    "01KH0ZR1BY99AGJRHNM497V4VQ",
    "01KH0ZR1BZYB555XEB7W7D4PDN",
  ]
  const classifiedListingIds = [
    "01KH0ZQ920JG9HSBZA4JBA8VDE",
    "01KH0ZQ920STKB258S9QZGG632",
    "01KH0ZQ921RVT8QHV69TTDDNS9",
  ]
  const crowdfundCampaignIds = [
    "01KH0ZR18RZJSK59HR1GX0ZMNR",
    "01KH0ZR194JD0N9WRJCJYFA4RE",
  ]
  const digitalAssetIds = [
    "01KH0ZWRXTY0QPFAWY03FKH4CZ",
    "01KH0ZWRXVPRAM4C35M9R0EVNH",
    "01KH0ZWRY16SCH4YKKBBGTEM8M",
  ]
  const courseIds = [
    "01KH0ZPJV48PHMMWQG5ZV4XD0A",
    "01KH0ZPJVCRJS3A4P2VX1T613H",
  ]
  const insuranceProductIds = [
    "01KH0ZR1875K1YVQB7H94A5N9B",
    "01KH0ZR18A7P4JE8VMFSVFRN9X",
  ]
  const loanProductIds = [
    "01KH0ZR17TDF3RJ18KGCRV509Z",
    "01KH0ZR17Y39H7NAPGCKPARECF",
  ]
  const rewardTierIds = [
    "01KH0ZR19DR1BHZ6JYX1GW9Q1G",
    "01KH0ZR19JCN1GTFBBC7FEXNZ7",
  ]
  const classScheduleIds = [
    "01KH0ZQ9AS7J3Q44NC2WXRCC5S",
    "01KH0ZQ9AWRNT53FDJ85YH2AME",
  ]

  const now = new Date().toISOString()
  const future1 = new Date(Date.now() + 30 * 86400000).toISOString()
  const future2 = new Date(Date.now() + 60 * 86400000).toISOString()
  const future3 = new Date(Date.now() + 90 * 86400000).toISOString()
  const past1 = new Date(Date.now() - 7 * 86400000).toISOString()
  const past2 = new Date(Date.now() - 14 * 86400000).toISOString()
  const past3 = new Date(Date.now() - 30 * 86400000).toISOString()

  const rawNum = (val: number) => JSON.stringify({ value: String(val), precision: 20 })

  // ============================================================
  // 1. AD_ACCOUNT (2 rows)
  // ============================================================
  console.log("1/41 Seeding ad_account...")
  try {
    await dataSource.raw(`
      INSERT INTO ad_account (id, tenant_id, advertiser_id, account_name, balance, currency_code, total_spent, total_deposited, status, auto_recharge, auto_recharge_amount, auto_recharge_threshold, metadata, created_at, updated_at)
      VALUES
        ('seed4_ad_account_1', '${tenantId}', '${vendorIds[0]}', 'حساب إعلانات الرياض تك', 15000, 'sar', 8500, 23500, 'active', true, 5000, 2000, '{"company":"Riyadh Tech Solutions"}', '${now}', '${now}'),
        ('seed4_ad_account_2', '${tenantId}', '${vendorIds[1]}', 'حساب تسويق المدينة الذكية', 7500, 'sar', 12000, 19500, 'active', false, null, null, '{"company":"CityOS Marketing"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ ad_account seeded")
  } catch (err: any) {
    console.log(`  ✗ ad_account error: ${err.message}`)
  }

  // ============================================================
  // 2. AD_CREATIVE (3 rows)
  // ============================================================
  console.log("2/41 Seeding ad_creative...")
  try {
    await dataSource.raw(`
      INSERT INTO ad_creative (id, tenant_id, campaign_id, placement_id, creative_type, title, body_text, image_url, video_url, click_url, cta_text, product_ids, is_approved, approved_by, approved_at, metadata, created_at, updated_at)
      VALUES
        ('seed4_ad_creative_1', '${tenantId}', '${campaignIds[0]}', '${placementIds[0]}', 'image', 'عروض رمضان الحصرية', 'خصومات تصل إلى 50% على جميع المنتجات خلال شهر رمضان المبارك', 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800', null, 'https://cityos.sa/ramadan-sale', 'تسوق الآن', null, true, '${userIds[0]}', '${past1}', '{"format":"banner_1200x628"}', '${now}', '${now}'),
        ('seed4_ad_creative_2', '${tenantId}', '${campaignIds[0]}', '${placementIds[1]}', 'video', 'جولة في المدينة الذكية', 'اكتشف مستقبل الحياة الذكية في مدينة نيوم', null, 'https://images.unsplash.com/video-1600066890217-bc25e11b5e4f?w=800', 'https://cityos.sa/smart-city', 'شاهد المزيد', null, true, '${userIds[0]}', '${past1}', '{"duration_seconds":30}', '${now}', '${now}'),
        ('seed4_ad_creative_3', '${tenantId}', '${campaignIds[1]}', '${placementIds[0]}', 'product_card', 'أفضل الإلكترونيات', 'تشكيلة واسعة من الأجهزة الإلكترونية بأسعار منافسة', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800', null, 'https://cityos.sa/electronics', 'اطلب الآن', '["prod_01","prod_02"]', false, null, null, '{"category":"electronics"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ ad_creative seeded")
  } catch (err: any) {
    console.log(`  ✗ ad_creative error: ${err.message}`)
  }

  // ============================================================
  // 3. CLICK_TRACKING (3 rows)
  // ============================================================
  console.log("3/41 Seeding click_tracking...")
  try {
    await dataSource.raw(`
      INSERT INTO click_tracking (id, tenant_id, link_id, affiliate_id, ip_address, user_agent, referrer, landed_at, converted, conversion_order_id, conversion_amount, metadata, created_at, updated_at)
      VALUES
        ('seed4_click_tracking_1', '${tenantId}', '${referralLinkIds[0]}', '${affiliateIds[0]}', '185.23.45.67', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)', 'https://twitter.com', '${past2}', true, 'order_seed4_001', 350, '{"campaign":"ramadan_promo"}', '${now}', '${now}'),
        ('seed4_click_tracking_2', '${tenantId}', '${referralLinkIds[1]}', '${affiliateIds[0]}', '91.108.12.34', 'Mozilla/5.0 (Windows NT 10.0; Win64)', 'https://instagram.com', '${past1}', false, null, null, '{"campaign":"summer_sale"}', '${now}', '${now}'),
        ('seed4_click_tracking_3', '${tenantId}', '${referralLinkIds[2]}', '${affiliateIds[1]}', '176.44.23.89', 'Mozilla/5.0 (Macintosh; Intel Mac OS X)', 'https://google.com', '${past1}', true, 'order_seed4_002', 520, '{"campaign":"eid_offers"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ click_tracking seeded")
  } catch (err: any) {
    console.log(`  ✗ click_tracking error: ${err.message}`)
  }

  // ============================================================
  // 4. IMPRESSION_LOG (3 rows)
  // ============================================================
  console.log("4/41 Seeding impression_log...")
  try {
    await dataSource.raw(`
      INSERT INTO impression_log (id, tenant_id, campaign_id, creative_id, placement_id, viewer_id, impression_type, ip_address, user_agent, referrer, revenue, currency_code, occurred_at, metadata, created_at, updated_at)
      VALUES
        ('seed4_impression_log_1', '${tenantId}', '${campaignIds[0]}', 'seed4_ad_creative_1', '${placementIds[0]}', '${customerIds[0]}', 'view', '185.23.45.67', 'Mozilla/5.0 (iPhone)', 'https://cityos.sa', 0.15, 'sar', '${past2}', '{"page":"homepage"}', '${now}', '${now}'),
        ('seed4_impression_log_2', '${tenantId}', '${campaignIds[0]}', 'seed4_ad_creative_2', '${placementIds[1]}', '${customerIds[1]}', 'click', '91.108.12.34', 'Mozilla/5.0 (Windows)', 'https://cityos.sa/products', 1.50, 'sar', '${past1}', '{"page":"product_listing"}', '${now}', '${now}'),
        ('seed4_impression_log_3', '${tenantId}', '${campaignIds[1]}', 'seed4_ad_creative_3', '${placementIds[0]}', '${customerIds[2]}', 'conversion', '176.44.23.89', 'Mozilla/5.0 (Mac)', 'https://cityos.sa/checkout', 25.00, 'sar', '${past1}', '{"order_id":"order_seed4_003"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ impression_log seeded")
  } catch (err: any) {
    console.log(`  ✗ impression_log error: ${err.message}`)
  }

  // ============================================================
  // 5. COMMISSION_RULE (2 rows)
  // ============================================================
  console.log("5/41 Seeding commission_rule...")
  try {
    await dataSource.raw(`
      INSERT INTO commission_rule (id, tenant_id, store_id, vendor_id, priority, name, description, commission_type, commission_percentage, commission_flat_amount, tiers, conditions, valid_from, valid_to, status, applies_to, metadata, created_at, updated_at)
      VALUES
        ('seed4_commission_rule_1', '${tenantId}', '${storeId}', '${vendorIds[0]}', 10, 'عمولة إلكترونيات أساسية', 'عمولة 12% على جميع منتجات الإلكترونيات', 'percentage', 12, null, null, '{"product_categories":["electronics"]}', '${past3}', '${future3}', 'active', 'specific_categories', '{"category":"electronics"}', '${now}', '${now}'),
        ('seed4_commission_rule_2', '${tenantId}', '${storeId}', null, 5, 'عمولة عامة للمنصة', 'عمولة 8% على جميع المنتجات لجميع البائعين', 'percentage', 8, null, null, null, '${past3}', null, 'active', 'all_products', '{"default_rule":true}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ commission_rule seeded")
  } catch (err: any) {
    console.log(`  ✗ commission_rule error: ${err.message}`)
  }

  // ============================================================
  // 6. COMMISSION_TRANSACTION (3 rows)
  // ============================================================
  console.log("6/41 Seeding commission_transaction...")
  try {
    await dataSource.raw(`
      INSERT INTO commission_transaction (id, tenant_id, store_id, vendor_id, order_id, line_item_id, commission_rule_id, payout_id, transaction_type, order_subtotal, order_tax, order_shipping, order_total, commission_rate, commission_flat, commission_amount, platform_fee_rate, platform_fee_amount, net_amount, status, payout_status, transaction_date, approved_at, paid_at, notes, metadata, created_at, updated_at)
      VALUES
        ('seed4_comm_txn_1', '${tenantId}', '${storeId}', '${vendorIds[0]}', 'order_seed4_001', 'li_001', 'seed4_commission_rule_1', null, 'sale', 1500, 225, 25, 1750, 12, null, 210, 2, 35, 1505, 'approved', 'pending_payout', '${past2}', '${past1}', null, 'بيع جهاز إلكتروني', '{"product":"Samsung Galaxy S24"}', '${now}', '${now}'),
        ('seed4_comm_txn_2', '${tenantId}', '${storeId}', '${vendorIds[0]}', 'order_seed4_002', 'li_002', 'seed4_commission_rule_2', null, 'sale', 800, 120, 15, 935, 8, null, 74.8, 2, 18.7, 841.5, 'approved', 'pending_payout', '${past1}', '${now}', null, 'بيع ملابس رجالية', '{"product":"Thobe Premium"}', '${now}', '${now}'),
        ('seed4_comm_txn_3', '${tenantId}', '${storeId}', '${vendorIds[1]}', 'order_seed4_003', 'li_003', 'seed4_commission_rule_2', null, 'sale', 2200, 330, 0, 2530, 8, null, 202.4, 2, 50.6, 2277, 'paid', 'paid', '${past3}', '${past2}', '${past1}', 'بيع عطور فاخرة', '{"product":"Oud Collection"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ commission_transaction seeded")
  } catch (err: any) {
    console.log(`  ✗ commission_transaction error: ${err.message}`)
  }

  // ============================================================
  // 7. REFERRAL (2 rows)
  // ============================================================
  console.log("7/41 Seeding referral...")
  try {
    await dataSource.raw(`
      INSERT INTO referral (id, tenant_id, referrer_customer_id, referred_customer_id, referral_code, status, reward_type, reward_value, reward_given, expires_at, completed_at, metadata, created_at, updated_at)
      VALUES
        ('seed4_referral_1', '${tenantId}', '${customerIds[0]}', '${customerIds[2]}', 'REF-MOHAMMED-2026', 'completed', 'points', 500, true, '${future2}', '${past1}', '{"source":"whatsapp"}', '${now}', '${now}'),
        ('seed4_referral_2', '${tenantId}', '${customerIds[1]}', '${customerIds[3]}', 'REF-FATIMA-2026', 'pending', 'discount', 10, false, '${future2}', null, '{"source":"email"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ referral seeded")
  } catch (err: any) {
    console.log(`  ✗ referral error: ${err.message}`)
  }

  // ============================================================
  // 8. AFFILIATE_COMMISSION (2 rows)
  // ============================================================
  console.log("8/41 Seeding affiliate_commission...")
  try {
    await dataSource.raw(`
      INSERT INTO affiliate_commission (id, tenant_id, affiliate_id, order_id, click_id, order_amount, commission_amount, currency_code, status, approved_at, paid_at, payout_id, metadata, created_at, updated_at)
      VALUES
        ('seed4_aff_comm_1', '${tenantId}', '${affiliateIds[0]}', 'order_seed4_001', 'seed4_click_tracking_1', 350, 35, 'sar', 'approved', '${past1}', null, null, '{"campaign":"ramadan_promo"}', '${now}', '${now}'),
        ('seed4_aff_comm_2', '${tenantId}', '${affiliateIds[1]}', 'order_seed4_002', 'seed4_click_tracking_3', 520, 52, 'sar', 'paid', '${past2}', '${past1}', 'payout_seed4_001', '{"campaign":"eid_offers"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ affiliate_commission seeded")
  } catch (err: any) {
    console.log(`  ✗ affiliate_commission error: ${err.message}`)
  }

  // ============================================================
  // 9. BID (4 rows)
  // ============================================================
  console.log("9/41 Seeding bid...")
  try {
    await dataSource.raw(`
      INSERT INTO bid (id, tenant_id, auction_id, customer_id, amount, is_auto_bid, max_auto_bid, status, placed_at, metadata, created_at, updated_at)
      VALUES
        ('seed4_bid_1', '${tenantId}', '${auctionListingIds[0]}', '${customerIds[0]}', 5000, false, null, 'outbid', '${past3}', '{"device":"mobile"}', '${now}', '${now}'),
        ('seed4_bid_2', '${tenantId}', '${auctionListingIds[0]}', '${customerIds[1]}', 6500, false, null, 'winning', '${past2}', '{"device":"desktop"}', '${now}', '${now}'),
        ('seed4_bid_3', '${tenantId}', '${auctionListingIds[1]}', '${customerIds[2]}', 12000, true, 15000, 'winning', '${past2}', '{"auto_bid_rule":"seed4_auto_bid_1"}', '${now}', '${now}'),
        ('seed4_bid_4', '${tenantId}', '${auctionListingIds[2]}', '${customerIds[3]}', 3200, false, null, 'won', '${past1}', '{"device":"mobile"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ bid seeded")
  } catch (err: any) {
    console.log(`  ✗ bid error: ${err.message}`)
  }

  // ============================================================
  // 10. AUCTION_RESULT (2 rows)
  // ============================================================
  console.log("10/41 Seeding auction_result...")
  try {
    await dataSource.raw(`
      INSERT INTO auction_result (id, tenant_id, auction_id, winner_customer_id, winning_bid_id, final_price, currency_code, order_id, payment_status, settled_at, metadata, created_at, updated_at)
      VALUES
        ('seed4_auction_result_1', '${tenantId}', '${auctionListingIds[0]}', '${customerIds[1]}', 'seed4_bid_2', 6500, 'sar', 'order_auction_001', 'paid', '${past1}', '{"item":"سجادة حرير فارسية أصلية"}', '${now}', '${now}'),
        ('seed4_auction_result_2', '${tenantId}', '${auctionListingIds[2]}', '${customerIds[3]}', 'seed4_bid_4', 3200, 'sar', 'order_auction_002', 'pending', null, '{"item":"ساعة رولكس كلاسيكية"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ auction_result seeded")
  } catch (err: any) {
    console.log(`  ✗ auction_result error: ${err.message}`)
  }

  // ============================================================
  // 11. AUCTION_ESCROW (2 rows)
  // ============================================================
  console.log("11/41 Seeding auction_escrow...")
  try {
    await dataSource.raw(`
      INSERT INTO auction_escrow (id, tenant_id, auction_id, customer_id, amount, currency_code, status, payment_reference, held_at, released_at, metadata, created_at, updated_at)
      VALUES
        ('seed4_auction_escrow_1', '${tenantId}', '${auctionListingIds[0]}', '${customerIds[1]}', 6500, 'sar', 'released', 'PAY-ESC-001-SA', '${past2}', '${past1}', '{"bank":"الراجحي"}', '${now}', '${now}'),
        ('seed4_auction_escrow_2', '${tenantId}', '${auctionListingIds[2]}', '${customerIds[3]}', 3200, 'sar', 'held', 'PAY-ESC-002-SA', '${past1}', null, '{"bank":"الأهلي"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ auction_escrow seeded")
  } catch (err: any) {
    console.log(`  ✗ auction_escrow error: ${err.message}`)
  }

  // ============================================================
  // 12. AUTO_BID_RULE (2 rows)
  // ============================================================
  console.log("12/41 Seeding auto_bid_rule...")
  try {
    await dataSource.raw(`
      INSERT INTO auto_bid_rule (id, tenant_id, auction_id, customer_id, max_amount, increment_amount, is_active, total_bids_placed, metadata, created_at, updated_at)
      VALUES
        ('seed4_auto_bid_1', '${tenantId}', '${auctionListingIds[1]}', '${customerIds[2]}', 15000, 500, true, 3, '{"strategy":"aggressive"}', '${now}', '${now}'),
        ('seed4_auto_bid_2', '${tenantId}', '${auctionListingIds[2]}', '${customerIds[0]}', 5000, 200, false, 1, '{"strategy":"conservative"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ auto_bid_rule seeded")
  } catch (err: any) {
    console.log(`  ✗ auto_bid_rule error: ${err.message}`)
  }

  // ============================================================
  // 13. SERVICE_CENTER (2 rows)
  // ============================================================
  console.log("13/41 Seeding service_center...")
  try {
    await dataSource.raw(`
      INSERT INTO service_center (id, tenant_id, name, address_line1, address_line2, city, state, postal_code, country_code, phone, email, specializations, is_active, capacity_per_day, current_load, metadata, created_at, updated_at)
      VALUES
        ('seed4_svc_center_1', '${tenantId}', 'مركز الرياض لخدمات السيارات', 'طريق الملك فهد، حي العليا', 'بجوار برج المملكة', 'Riyadh', 'Riyadh', '11564', 'sa', '+966112223344', 'service@riyadh-auto.sa', '["oil_change","tire","brake","engine","ac"]', true, 25, 8, '{"rating":4.8}', '${now}', '${now}'),
        ('seed4_svc_center_2', '${tenantId}', 'مركز النخبة للصيانة المتقدمة', 'شارع التخصصي، حي الملقا', null, 'Riyadh', 'Riyadh', '13524', 'sa', '+966115556677', 'info@elite-auto.sa', '["engine","transmission","electrical","hybrid","ev"]', true, 15, 5, '{"rating":4.9,"premium":true}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ service_center seeded")
  } catch (err: any) {
    console.log(`  ✗ service_center error: ${err.message}`)
  }

  // ============================================================
  // 14. PART_CATALOG (3 rows)
  // ============================================================
  console.log("14/41 Seeding part_catalog...")
  try {
    await dataSource.raw(`
      INSERT INTO part_catalog (id, tenant_id, name, part_number, oem_number, description, category, compatible_makes, compatible_models, compatible_years, price, currency_code, stock_quantity, condition, weight_kg, dimensions, supplier, is_active, metadata, created_at, updated_at)
      VALUES
        ('seed4_part_catalog_1', '${tenantId}', 'فلتر زيت تويوتا أصلي', 'PC-OIL-TOY-001', 'OEM-90915-YZZD4', 'فلتر زيت أصلي لسيارات تويوتا كامري وكورولا', 'filters', '["Toyota"]', '["Camry","Corolla","RAV4"]', '[2020,2021,2022,2023,2024]', 45, 'sar', 150, 'new', 0.3, '{"length_cm":10,"width_cm":10,"height_cm":12}', 'الوكيل المعتمد', true, '{"best_seller":true}', '${now}', '${now}'),
        ('seed4_part_catalog_2', '${tenantId}', 'بطانات فرامل هيونداي سيراميك', 'PC-BRK-HYN-001', 'OEM-58101-D3A10', 'بطانات فرامل أمامية سيراميك عالية الأداء', 'brakes', '["Hyundai","Kia"]', '["Tucson","Sportage","Sonata"]', '[2019,2020,2021,2022,2023]', 280, 'sar', 75, 'new', 1.2, '{"length_cm":15,"width_cm":12,"height_cm":5}', 'قطع غيار الخليج', true, null, '${now}', '${now}'),
        ('seed4_part_catalog_3', '${tenantId}', 'بطارية بوش AGM 80Ah', 'PC-BAT-BSH-001', 'OEM-0092S50110', 'بطارية بوش AGM عالية الأداء للسيارات الحديثة', 'electrical', '["Toyota","Hyundai","Nissan","Honda"]', '["Camry","Accord","Altima","Sonata"]', '[2018,2019,2020,2021,2022,2023,2024]', 850, 'sar', 30, 'new', 22.5, '{"length_cm":31,"width_cm":17,"height_cm":19}', 'بوش السعودية', true, '{"warranty_months":36}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ part_catalog seeded")
  } catch (err: any) {
    console.log(`  ✗ part_catalog error: ${err.message}`)
  }

  // ============================================================
  // 15. SPARE_PART (3 rows)
  // ============================================================
  console.log("15/41 Seeding spare_part...")
  try {
    await dataSource.raw(`
      INSERT INTO spare_part (id, tenant_id, name, sku, description, compatible_products, price, raw_price, currency_code, stock_quantity, reorder_level, supplier, is_active, metadata, created_at, updated_at)
      VALUES
        ('seed4_spare_part_1', '${tenantId}', 'شمعات إشعال NGK إيريديوم', 'SP-SPK-NGK-001', 'شمعات إشعال إيريديوم عالية الأداء - طقم 4 قطع', '["Toyota Camry","Honda Accord"]', 120, '${rawNum(120)}', 'sar', 200, 50, 'NGK السعودية', true, '{"pack_size":4}', '${now}', '${now}'),
        ('seed4_spare_part_2', '${tenantId}', 'سير مكيف كونتيننتال', 'SP-BLT-CNT-001', 'سير مكيف مقاوم للحرارة العالية', '["Hyundai Tucson","Kia Sportage"]', 85, '${rawNum(85)}', 'sar', 100, 25, 'كونتيننتال الشرق الأوسط', true, null, '${now}', '${now}'),
        ('seed4_spare_part_3', '${tenantId}', 'فلتر هواء مكيف بوش', 'SP-ACF-BSH-001', 'فلتر هواء مكيف بالكربون النشط لتنقية الهواء', '["Toyota","Lexus","Hyundai"]', 65, '${rawNum(65)}', 'sar', 300, 75, 'بوش السعودية', true, '{"carbon_activated":true}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ spare_part seeded")
  } catch (err: any) {
    console.log(`  ✗ spare_part error: ${err.message}`)
  }

  // ============================================================
  // 16. REPAIR_ORDER (2 rows)
  // ============================================================
  console.log("16/41 Seeding repair_order...")
  try {
    await dataSource.raw(`
      INSERT INTO repair_order (id, tenant_id, claim_id, service_center_id, status, diagnosis, repair_notes, parts_used, estimated_cost, actual_cost, currency_code, estimated_completion, completed_at, tracking_number, metadata, raw_estimated_cost, raw_actual_cost, created_at, updated_at)
      VALUES
        ('seed4_repair_order_1', '${tenantId}', 'claim_auto_001', 'seed4_svc_center_1', 'in_progress', 'تآكل بطانات الفرامل الأمامية', 'تم فحص نظام الفرامل بالكامل - يحتاج تغيير بطانات وأقراص أمامية', '["seed4_spare_part_1","seed4_part_catalog_2"]', 1200, null, 'sar', '${future1}', null, 'RO-2026-00451', '{"vehicle":"Toyota Camry 2023"}', '${rawNum(1200)}', null, '${now}', '${now}'),
        ('seed4_repair_order_2', '${tenantId}', 'claim_auto_002', 'seed4_svc_center_2', 'completed', 'خلل في نظام التبريد', 'تم تغيير ثرموستات ومبرد المحرك وإعادة تعبئة سائل التبريد', '["seed4_spare_part_2"]', 950, 880, 'sar', '${past1}', '${past1}', 'RO-2026-00452', '{"vehicle":"Hyundai Tucson 2022"}', '${rawNum(950)}', '${rawNum(880)}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ repair_order seeded")
  } catch (err: any) {
    console.log(`  ✗ repair_order error: ${err.message}`)
  }

  // ============================================================
  // 17. TRADE_IN (2 rows)
  // ============================================================
  console.log("17/41 Seeding trade_in...")
  try {
    await dataSource.raw(`
      INSERT INTO trade_in (id, tenant_id, customer_id, listing_id, make, model_name, year, mileage_km, condition, vin, description, photos, estimated_value, offered_value, accepted_value, currency_code, status, appraised_by, appraised_at, metadata, created_at, updated_at)
      VALUES
        ('seed4_trade_in_1', '${tenantId}', '${customerIds[0]}', '${vehicleListingIds[0]}', 'Toyota', 'Camry', 2021, 45000, 'good', 'JTDBR32E610012345', 'سيارة بحالة جيدة، صيانة دورية في الوكالة، بدون حوادث', '["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400"]', 75000, 72000, 72000, 'sar', 'accepted', '${userIds[0]}', '${past1}', '{"color":"أبيض لؤلؤي"}', '${now}', '${now}'),
        ('seed4_trade_in_2', '${tenantId}', '${customerIds[1]}', '${vehicleListingIds[1]}', 'Hyundai', 'Tucson', 2022, 28000, 'excellent', 'KMHJ3812MNU123456', 'سيارة ممتازة، فل كامل مع بانوراما وملاحة، ضمان ساري', '["https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400"]', 95000, null, null, 'sar', 'appraising', null, null, '{"color":"رمادي فلكي"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ trade_in seeded")
  } catch (err: any) {
    console.log(`  ✗ trade_in error: ${err.message}`)
  }

  // ============================================================
  // 18. VEHICLE_SERVICE (2 rows)
  // ============================================================
  console.log("18/41 Seeding vehicle_service...")
  try {
    await dataSource.raw(`
      INSERT INTO vehicle_service (id, tenant_id, vehicle_listing_id, customer_id, service_type, status, description, scheduled_at, completed_at, estimated_cost, actual_cost, currency_code, service_center, technician, parts_used, notes, metadata, created_at, updated_at)
      VALUES
        ('seed4_veh_svc_1', '${tenantId}', '${vehicleListingIds[0]}', '${customerIds[0]}', 'oil_change', 'completed', 'تغيير زيت المحرك والفلتر - صيانة 45,000 كم', '${past2}', '${past2}', 250, 230, 'sar', 'مركز الرياض لخدمات السيارات', 'فهد العتيبي', '["seed4_part_catalog_1"]', 'تم استخدام زيت موبيل 1 5W-30', '{"mileage_at_service":45000}', '${now}', '${now}'),
        ('seed4_veh_svc_2', '${tenantId}', '${vehicleListingIds[1]}', '${customerIds[1]}', 'inspection', 'scheduled', 'فحص شامل قبل البيع - 200 نقطة فحص', '${future1}', null, 350, null, 'sar', 'مركز النخبة للصيانة المتقدمة', null, null, 'فحص شامل معتمد للبيع', '{"inspection_type":"pre_sale"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ vehicle_service seeded")
  } catch (err: any) {
    console.log(`  ✗ vehicle_service error: ${err.message}`)
  }

  // ============================================================
  // 19. BOOKING (3 rows)
  // ============================================================
  console.log("19/41 Seeding booking...")
  try {
    const bookingStart1 = new Date(Date.now() + 3 * 86400000).toISOString()
    const bookingEnd1 = new Date(Date.now() + 3 * 86400000 + 3600000).toISOString()
    const bookingStart2 = new Date(Date.now() + 5 * 86400000).toISOString()
    const bookingEnd2 = new Date(Date.now() + 5 * 86400000 + 5400000).toISOString()
    const bookingStart3 = new Date(Date.now() + 7 * 86400000).toISOString()
    const bookingEnd3 = new Date(Date.now() + 7 * 86400000 + 7200000).toISOString()

    await dataSource.raw(`
      INSERT INTO booking (id, booking_number, tenant_id, customer_id, customer_name, customer_email, customer_phone, service_product_id, provider_id, start_time, end_time, timezone, status, attendee_count, location_type, currency_code, subtotal, discount_total, tax_total, total, payment_status, metadata, created_at, updated_at)
      VALUES
        ('seed4_booking_1', 'BK-2026-00101', '${tenantId}', '${customerIds[0]}', 'محمد الأحمدي', 'mohammed@dakkah.sa', '+966501112233', 'svc_prod_seed4_1', null, '${bookingStart1}', '${bookingEnd1}', 'Asia/Riyadh', 'confirmed', 1, 'in_person', 'sar', 200, 0, 30, 230, 'paid', '{"service":"استشارة قانونية"}', '${now}', '${now}'),
        ('seed4_booking_2', 'BK-2026-00102', '${tenantId}', '${customerIds[1]}', 'فاطمة الزهراني', 'fatima@dakkah.sa', '+966502223344', 'svc_prod_seed4_2', null, '${bookingStart2}', '${bookingEnd2}', 'Asia/Riyadh', 'pending', 2, 'virtual', 'sar', 350, 50, 45, 345, 'unpaid', '{"service":"حصة يوغا خاصة"}', '${now}', '${now}'),
        ('seed4_booking_3', 'BK-2026-00103', '${tenantId}', '${customerIds[2]}', 'أحمد القحطاني', 'ahmed@dakkah.sa', '+966503334455', 'svc_prod_seed4_3', null, '${bookingStart3}', '${bookingEnd3}', 'Asia/Riyadh', 'confirmed', 1, 'in_person', 'sar', 500, 0, 75, 575, 'deposit_paid', '{"service":"صيانة سيارة شاملة"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ booking seeded")
  } catch (err: any) {
    console.log(`  ✗ booking error: ${err.message}`)
  }

  // ============================================================
  // 20. BOOKING_ITEM (3 rows)
  // ============================================================
  console.log("20/41 Seeding booking_item...")
  try {
    await dataSource.raw(`
      INSERT INTO booking_item (id, booking_id, service_product_id, title, description, duration_minutes, quantity, unit_price, subtotal, discount_amount, tax_amount, total, provider_id, metadata, created_at, updated_at)
      VALUES
        ('seed4_bk_item_1', 'seed4_booking_1', 'svc_prod_seed4_1', 'استشارة قانونية أولية', 'جلسة استشارية مع محامي متخصص في القانون التجاري', 60, 1, 200, 200, 0, 30, 230, null, null, '${now}', '${now}'),
        ('seed4_bk_item_2', 'seed4_booking_2', 'svc_prod_seed4_2', 'حصة يوغا خاصة', 'حصة يوغا فردية مع مدربة معتمدة', 90, 2, 175, 350, 50, 45, 345, null, '{"level":"intermediate"}', '${now}', '${now}'),
        ('seed4_bk_item_3', 'seed4_booking_3', 'svc_prod_seed4_3', 'صيانة سيارة 50,000 كم', 'صيانة شاملة تشمل تغيير الزيت والفلاتر وفحص شامل', 120, 1, 500, 500, 0, 75, 575, null, '{"mileage":50000}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ booking_item seeded")
  } catch (err: any) {
    console.log(`  ✗ booking_item error: ${err.message}`)
  }

  // ============================================================
  // 21. AVAILABILITY (2 rows)
  // ============================================================
  console.log("21/41 Seeding availability...")
  try {
    const weeklySchedule = JSON.stringify({
      sunday: [{ start: "09:00", end: "17:00" }],
      monday: [{ start: "09:00", end: "17:00" }],
      tuesday: [{ start: "09:00", end: "17:00" }],
      wednesday: [{ start: "09:00", end: "17:00" }],
      thursday: [{ start: "09:00", end: "14:00" }],
      friday: [],
      saturday: [],
    })
    const weeklySchedule2 = JSON.stringify({
      sunday: [{ start: "10:00", end: "20:00" }],
      monday: [{ start: "10:00", end: "20:00" }],
      tuesday: [{ start: "10:00", end: "20:00" }],
      wednesday: [{ start: "10:00", end: "20:00" }],
      thursday: [{ start: "10:00", end: "22:00" }],
      friday: [{ start: "16:00", end: "22:00" }],
      saturday: [{ start: "10:00", end: "22:00" }],
    })

    await dataSource.raw(`
      INSERT INTO availability (id, tenant_id, owner_type, owner_id, schedule_type, weekly_schedule, timezone, effective_from, effective_to, slot_duration_minutes, slot_increment_minutes, is_active, metadata, created_at, updated_at)
      VALUES
        ('seed4_availability_1', '${tenantId}', 'provider', 'provider_seed4_1', 'weekly_recurring', '${weeklySchedule.replace(/'/g, "''")}', 'Asia/Riyadh', '${past3}', '${future3}', 60, 60, true, '{"provider_name":"د. خالد المطيري"}', '${now}', '${now}'),
        ('seed4_availability_2', '${tenantId}', 'service', 'svc_prod_seed4_2', 'weekly_recurring', '${weeklySchedule2.replace(/'/g, "''")}', 'Asia/Riyadh', '${past3}', '${future3}', 30, 30, true, '{"service_name":"حصص اللياقة البدنية"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ availability seeded")
  } catch (err: any) {
    console.log(`  ✗ availability error: ${err.message}`)
  }

  // ============================================================
  // 22. AVAILABILITY_EXCEPTION (2 rows)
  // ============================================================
  console.log("22/41 Seeding availability_exception...")
  try {
    const eidStart = new Date(2026, 5, 6).toISOString()
    const eidEnd = new Date(2026, 5, 10).toISOString()
    const nationalDay = new Date(2026, 8, 23).toISOString()
    const nationalDayEnd = new Date(2026, 8, 23, 23, 59).toISOString()

    await dataSource.raw(`
      INSERT INTO availability_exception (id, availability_id, tenant_id, exception_type, start_date, end_date, all_day, special_hours, title, reason, is_recurring, recurrence_rule, metadata, created_at, updated_at)
      VALUES
        ('seed4_avail_exc_1', 'seed4_availability_1', '${tenantId}', 'holiday', '${eidStart}', '${eidEnd}', true, null, 'إجازة عيد الفطر', 'إجازة عيد الفطر المبارك', true, 'FREQ=YEARLY', '{"holiday":"eid_al_fitr"}', '${now}', '${now}'),
        ('seed4_avail_exc_2', 'seed4_availability_2', '${tenantId}', 'special_hours', '${nationalDay}', '${nationalDayEnd}', false, '[{"start":"16:00","end":"20:00"}]', 'اليوم الوطني السعودي', 'ساعات عمل مخفضة بمناسبة اليوم الوطني', true, 'FREQ=YEARLY', '{"holiday":"saudi_national_day"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ availability_exception seeded")
  } catch (err: any) {
    console.log(`  ✗ availability_exception error: ${err.message}`)
  }

  // ============================================================
  // 23. BOOKING_REMINDER (2 rows)
  // ============================================================
  console.log("23/41 Seeding booking_reminder...")
  try {
    const reminder1Time = new Date(Date.now() + 2 * 86400000).toISOString()
    const reminder2Time = new Date(Date.now() + 4 * 86400000).toISOString()

    await dataSource.raw(`
      INSERT INTO booking_reminder (id, booking_id, tenant_id, reminder_type, send_before_minutes, scheduled_for, status, sent_at, delivered_at, opened_at, error_message, retry_count, recipient_email, recipient_phone, subject, message, metadata, created_at, updated_at)
      VALUES
        ('seed4_bk_reminder_1', 'seed4_booking_1', '${tenantId}', 'email', 1440, '${reminder1Time}', 'scheduled', null, null, null, null, 0, 'mohammed@dakkah.sa', '+966501112233', 'تذكير بموعدك غداً', 'مرحباً محمد، نذكرك بموعد الاستشارة القانونية غداً الساعة 10:00 صباحاً', '{"template":"booking_reminder_24h"}', '${now}', '${now}'),
        ('seed4_bk_reminder_2', 'seed4_booking_2', '${tenantId}', 'sms', 60, '${reminder2Time}', 'scheduled', null, null, null, null, 0, 'fatima@dakkah.sa', '+966502223344', 'تذكير بحصة اليوغا', 'مرحباً فاطمة، حصة اليوغا بعد ساعة. رابط الاجتماع: https://meet.dakkah.sa/yoga', '{"template":"booking_reminder_1h"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ booking_reminder seeded")
  } catch (err: any) {
    console.log(`  ✗ booking_reminder error: ${err.message}`)
  }

  // ============================================================
  // 24. LISTING_CATEGORY (5 rows)
  // ============================================================
  console.log("24/41 Seeding listing_category...")
  try {
    await dataSource.raw(`
      INSERT INTO listing_category (id, tenant_id, name, handle, parent_id, description, icon, display_order, is_active, metadata, created_at, updated_at)
      VALUES
        ('seed4_list_cat_1', '${tenantId}', 'إلكترونيات', 'electronics', null, 'أجهزة إلكترونية وحواسيب وهواتف ذكية', 'laptop', 1, true, '{"ar_name":"إلكترونيات","en_name":"Electronics"}', '${now}', '${now}'),
        ('seed4_list_cat_2', '${tenantId}', 'مركبات', 'vehicles', null, 'سيارات ودراجات نارية وقطع غيار', 'car', 2, true, '{"ar_name":"مركبات","en_name":"Vehicles"}', '${now}', '${now}'),
        ('seed4_list_cat_3', '${tenantId}', 'عقارات', 'real-estate', null, 'شقق وفلل وأراضي للبيع والإيجار', 'home', 3, true, '{"ar_name":"عقارات","en_name":"Real Estate"}', '${now}', '${now}'),
        ('seed4_list_cat_4', '${tenantId}', 'خدمات', 'services', null, 'خدمات مهنية وحرفية ومنزلية', 'briefcase', 4, true, '{"ar_name":"خدمات","en_name":"Services"}', '${now}', '${now}'),
        ('seed4_list_cat_5', '${tenantId}', 'أزياء', 'fashion', null, 'ملابس وأحذية وإكسسوارات', 'shirt', 5, true, '{"ar_name":"أزياء","en_name":"Fashion"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ listing_category seeded")
  } catch (err: any) {
    console.log(`  ✗ listing_category error: ${err.message}`)
  }

  // ============================================================
  // 25. LISTING_IMAGE (4 rows)
  // ============================================================
  console.log("25/41 Seeding listing_image...")
  try {
    await dataSource.raw(`
      INSERT INTO listing_image (id, listing_id, url, alt_text, display_order, is_primary, metadata, created_at, updated_at)
      VALUES
        ('seed4_list_img_1', '${classifiedListingIds[0]}', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', 'طقم كنب فاخر - صورة أمامية', 1, true, '{"size":"800x600"}', '${now}', '${now}'),
        ('seed4_list_img_2', '${classifiedListingIds[0]}', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800', 'طقم كنب فاخر - زاوية جانبية', 2, false, '{"size":"800x600"}', '${now}', '${now}'),
        ('seed4_list_img_3', '${classifiedListingIds[1]}', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', 'MacBook Pro - منظر علوي', 1, true, '{"size":"800x600"}', '${now}', '${now}'),
        ('seed4_list_img_4', '${classifiedListingIds[2]}', 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800', 'تويوتا كامري 2023 - منظر أمامي', 1, true, '{"size":"800x600"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ listing_image seeded")
  } catch (err: any) {
    console.log(`  ✗ listing_image error: ${err.message}`)
  }

  // ============================================================
  // 26. LISTING_OFFER (3 rows)
  // ============================================================
  console.log("26/41 Seeding listing_offer...")
  try {
    await dataSource.raw(`
      INSERT INTO listing_offer (id, tenant_id, listing_id, buyer_id, amount, currency_code, message, status, counter_amount, responded_at, expires_at, metadata, created_at, updated_at)
      VALUES
        ('seed4_list_offer_1', '${tenantId}', '${classifiedListingIds[0]}', '${customerIds[1]}', 4000, 'sar', 'هل الكنب قابل للتفاوض؟ أقدر أدفع 4000 ريال نقداً', 'pending', null, null, '${future1}', null, '${now}', '${now}'),
        ('seed4_list_offer_2', '${tenantId}', '${classifiedListingIds[1]}', '${customerIds[2]}', 11000, 'sar', 'أبي الماك بوك بسعر 11,000 - أقدر أستلمه اليوم', 'rejected', null, '${past1}', '${future1}', '{"rejection_reason":"السعر نهائي"}', '${now}', '${now}'),
        ('seed4_list_offer_3', '${tenantId}', '${classifiedListingIds[2]}', '${customerIds[0]}', 110000, 'sar', 'هل ممكن نتفاوض على سعر الكامري؟', 'accepted', 112000, '${past1}', '${future1}', '{"agreed_price":112000}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ listing_offer seeded")
  } catch (err: any) {
    console.log(`  ✗ listing_offer error: ${err.message}`)
  }

  // ============================================================
  // 27. LISTING_FLAG (2 rows)
  // ============================================================
  console.log("27/41 Seeding listing_flag...")
  try {
    await dataSource.raw(`
      INSERT INTO listing_flag (id, tenant_id, listing_id, reporter_id, reason, description, status, reviewed_by, reviewed_at, action_taken, metadata, created_at, updated_at)
      VALUES
        ('seed4_list_flag_1', '${tenantId}', '${classifiedListingIds[1]}', '${customerIds[3]}', 'scam', 'السعر أقل من سعر السوق بكثير - قد يكون احتيال', 'reviewed', '${userIds[0]}', '${past1}', 'تم التحقق - الإعلان سليم', '{"verified":true}', '${now}', '${now}'),
        ('seed4_list_flag_2', '${tenantId}', '${classifiedListingIds[0]}', '${customerIds[2]}', 'duplicate', 'نفس الإعلان منشور مرتين بصور مختلفة', 'pending', null, null, null, null, '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ listing_flag seeded")
  } catch (err: any) {
    console.log(`  ✗ listing_flag error: ${err.message}`)
  }

  // ============================================================
  // 28. CAMPAIGN_UPDATE (3 rows)
  // ============================================================
  console.log("28/41 Seeding campaign_update...")
  try {
    await dataSource.raw(`
      INSERT INTO campaign_update (id, tenant_id, campaign_id, title, content, update_type, is_public, media_urls, metadata, created_at, updated_at)
      VALUES
        ('seed4_camp_update_1', '${tenantId}', '${crowdfundCampaignIds[0]}', 'وصلنا 50% من الهدف!', 'الحمد لله وصلنا لنصف المبلغ المستهدف خلال أسبوعين فقط. شكراً لكل الداعمين!', 'milestone', true, '["https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800"]', '{"milestone_pct":50}', '${now}', '${now}'),
        ('seed4_camp_update_2', '${tenantId}', '${crowdfundCampaignIds[0]}', 'تحديث تقني مهم', 'أنهينا تطوير النموذج الأولي وبدأنا مرحلة الاختبار مع المستخدمين الأوائل', 'general', true, null, '{"phase":"testing"}', '${now}', '${now}'),
        ('seed4_camp_update_3', '${tenantId}', '${crowdfundCampaignIds[1]}', 'تأخير بسيط في التسليم', 'نود إعلامكم بتأخير أسبوعين في التسليم بسبب تأخر بعض المواد الخام. نعتذر عن ذلك.', 'delay', true, null, '{"new_eta":"2026-04-15"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ campaign_update seeded")
  } catch (err: any) {
    console.log(`  ✗ campaign_update error: ${err.message}`)
  }

  // ============================================================
  // 29. MILESTONE (3 rows) - freelance milestones
  // ============================================================
  console.log("29/41 Seeding milestone...")
  try {
    await dataSource.raw(`
      INSERT INTO milestone (id, tenant_id, contract_id, title, description, amount, currency_code, due_date, status, deliverables, submitted_at, approved_at, paid_at, revision_notes, metadata, raw_amount, created_at, updated_at)
      VALUES
        ('seed4_milestone_1', '${tenantId}', 'contract_seed4_1', 'تصميم واجهة المستخدم', 'تصميم كامل لواجهة المستخدم مع 15 شاشة تفاعلية', 5000, 'sar', '${future1}', 'approved', '["تصميمات Figma","دليل الألوان والخطوط"]', '${past2}', '${past1}', null, null, null, '${rawNum(5000)}', '${now}', '${now}'),
        ('seed4_milestone_2', '${tenantId}', 'contract_seed4_1', 'تطوير الواجهة الأمامية', 'برمجة الواجهة الأمامية باستخدام React و Tailwind', 8000, 'sar', '${future2}', 'in_progress', '["كود المصدر","توثيق API"]', null, null, null, null, null, '${rawNum(8000)}', '${now}', '${now}'),
        ('seed4_milestone_3', '${tenantId}', 'contract_seed4_1', 'اختبار وتسليم نهائي', 'اختبار شامل وإصلاح الأخطاء والتسليم النهائي', 3000, 'sar', '${future3}', 'pending', '["تقرير الاختبار","النسخة النهائية"]', null, null, null, null, null, '${rawNum(3000)}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ milestone seeded")
  } catch (err: any) {
    console.log(`  ✗ milestone error: ${err.message}`)
  }

  // ============================================================
  // 30. BACKER (3 rows)
  // ============================================================
  console.log("30/41 Seeding backer...")
  try {
    await dataSource.raw(`
      INSERT INTO backer (id, tenant_id, campaign_id, customer_id, total_pledged, currency_code, pledge_count, is_repeat_backer, first_backed_at, metadata, created_at, updated_at)
      VALUES
        ('seed4_backer_1', '${tenantId}', '${crowdfundCampaignIds[0]}', '${customerIds[0]}', 1000, 'sar', 1, false, '${past3}', '{"name":"محمد الأحمدي"}', '${now}', '${now}'),
        ('seed4_backer_2', '${tenantId}', '${crowdfundCampaignIds[0]}', '${customerIds[1]}', 2500, 'sar', 2, true, '${past2}', '{"name":"فاطمة الزهراني"}', '${now}', '${now}'),
        ('seed4_backer_3', '${tenantId}', '${crowdfundCampaignIds[1]}', '${customerIds[2]}', 500, 'sar', 1, false, '${past1}', '{"name":"أحمد القحطاني"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ backer seeded")
  } catch (err: any) {
    console.log(`  ✗ backer error: ${err.message}`)
  }

  // ============================================================
  // 31. PLEDGE (3 rows)
  // ============================================================
  console.log("31/41 Seeding pledge...")
  try {
    await dataSource.raw(`
      INSERT INTO pledge (id, tenant_id, campaign_id, backer_id, reward_tier_id, amount, currency_code, status, payment_reference, anonymous, message, fulfilled_at, refunded_at, metadata, created_at, updated_at)
      VALUES
        ('seed4_pledge_1', '${tenantId}', '${crowdfundCampaignIds[0]}', 'seed4_backer_1', '${rewardTierIds[0]}', 1000, 'sar', 'confirmed', 'PAY-PLG-001', false, 'أتمنى لكم التوفيق! مشروع رائع', null, null, null, '${now}', '${now}'),
        ('seed4_pledge_2', '${tenantId}', '${crowdfundCampaignIds[0]}', 'seed4_backer_2', '${rewardTierIds[1]}', 2500, 'sar', 'confirmed', 'PAY-PLG-002', false, 'دعم كامل للابتكار السعودي', null, null, '{"upgraded_tier":true}', '${now}', '${now}'),
        ('seed4_pledge_3', '${tenantId}', '${crowdfundCampaignIds[1]}', 'seed4_backer_3', null, 500, 'sar', 'pending', 'PAY-PLG-003', true, null, null, null, null, '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ pledge seeded")
  } catch (err: any) {
    console.log(`  ✗ pledge error: ${err.message}`)
  }

  // ============================================================
  // 32. DOWNLOAD_LICENSE (3 rows)
  // ============================================================
  console.log("32/41 Seeding download_license...")
  try {
    await dataSource.raw(`
      INSERT INTO download_license (id, tenant_id, asset_id, customer_id, order_id, license_key, status, download_count, max_downloads, first_downloaded_at, last_downloaded_at, expires_at, revoked_at, revoke_reason, metadata, created_at, updated_at)
      VALUES
        ('seed4_dl_license_1', '${tenantId}', '${digitalAssetIds[0]}', '${customerIds[0]}', 'order_seed4_dl_001', 'LIC-EBOOK-2026-XK9M4', 'active', 2, 5, '${past2}', '${past1}', '${future3}', null, null, '{"product":"دليل ريادة الأعمال"}', '${now}', '${now}'),
        ('seed4_dl_license_2', '${tenantId}', '${digitalAssetIds[1]}', '${customerIds[1]}', 'order_seed4_dl_002', 'LIC-COURSE-2026-YP7N2', 'active', 1, 3, '${past1}', '${past1}', '${future3}', null, null, '{"product":"دورة تطوير الويب"}', '${now}', '${now}'),
        ('seed4_dl_license_3', '${tenantId}', '${digitalAssetIds[2]}', '${customerIds[2]}', 'order_seed4_dl_003', 'LIC-SOFT-2026-ZR3Q8', 'active', 0, 2, null, null, '${future2}', null, null, '{"product":"SmartStock Pro"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ download_license seeded")
  } catch (err: any) {
    console.log(`  ✗ download_license error: ${err.message}`)
  }

  // ============================================================
  // 33. ASSIGNMENT (3 rows)
  // ============================================================
  console.log("33/41 Seeding assignment...")
  try {
    await dataSource.raw(`
      INSERT INTO assignment (id, tenant_id, course_id, lesson_id, student_id, title, instructions, submission_url, submission_text, submitted_at, status, grade, max_grade, feedback, graded_by, graded_at, due_date, metadata, created_at, updated_at)
      VALUES
        ('seed4_assignment_1', '${tenantId}', '${courseIds[0]}', null, '${customerIds[0]}', 'مشروع تطبيق ويب متكامل', 'قم ببناء تطبيق ويب يعرض قائمة المنتجات مع إمكانية البحث والتصفية باستخدام React', 'https://github.com/student/project1', null, '${past1}', 'graded', 92, 100, 'عمل ممتاز! التصميم احترافي والكود نظيف. يحتاج تحسين في معالجة الأخطاء', '${userIds[1]}', '${past1}', '${past2}', '{"type":"project"}', '${now}', '${now}'),
        ('seed4_assignment_2', '${tenantId}', '${courseIds[0]}', null, '${customerIds[1]}', 'اختبار أساسيات JavaScript', 'أجب على 20 سؤال حول أساسيات JavaScript وDOM', null, 'إجابات الاختبار مرفقة', '${past1}', 'submitted', null, 100, null, null, null, '${past1}', '{"type":"quiz","questions":20}', '${now}', '${now}'),
        ('seed4_assignment_3', '${tenantId}', '${courseIds[1]}', null, '${customerIds[2]}', 'تقرير بحثي عن الذكاء الاصطناعي', 'اكتب تقريراً من 3000 كلمة عن تطبيقات الذكاء الاصطناعي في المملكة العربية السعودية', null, null, null, 'pending', null, 100, null, null, null, '${future1}', '{"type":"research","min_words":3000}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ assignment seeded")
  } catch (err: any) {
    console.log(`  ✗ assignment error: ${err.message}`)
  }

  // ============================================================
  // 34. CLASS_BOOKING (2 rows)
  // ============================================================
  console.log("34/41 Seeding class_booking...")
  try {
    await dataSource.raw(`
      INSERT INTO class_booking (id, tenant_id, schedule_id, customer_id, status, booked_at, checked_in_at, cancelled_at, cancellation_reason, waitlist_position, metadata, created_at, updated_at)
      VALUES
        ('seed4_class_bk_1', '${tenantId}', '${classScheduleIds[0]}', '${customerIds[0]}', 'confirmed', '${past1}', null, null, null, null, '{"course_name":"دورة تطوير الويب الشاملة"}', '${now}', '${now}'),
        ('seed4_class_bk_2', '${tenantId}', '${classScheduleIds[1]}', '${customerIds[1]}', 'checked_in', '${past2}', '${past1}', null, null, null, '{"course_name":"أساسيات الذكاء الاصطناعي"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ class_booking seeded")
  } catch (err: any) {
    console.log(`  ✗ class_booking error: ${err.message}`)
  }

  // ============================================================
  // 35. ACCOUNT_HOLDER (3 rows)
  // ============================================================
  console.log("35/41 Seeding account_holder...")
  try {
    await dataSource.raw(`
      INSERT INTO account_holder (id, provider_id, external_id, email, data, metadata, created_at, updated_at)
      VALUES
        ('seed4_acct_holder_1', 'pp_system_default', '${customerIds[0]}', 'mohammed@dakkah.sa', '{"name":"محمد الأحمدي","national_id":"1098765432","bank":"الراجحي","iban":"SA0380000000608010167519"}', '{"kyc_verified":true}', '${now}', '${now}'),
        ('seed4_acct_holder_2', 'pp_system_default', '${customerIds[1]}', 'fatima@dakkah.sa', '{"name":"فاطمة الزهراني","national_id":"1087654321","bank":"الأهلي","iban":"SA4420000001234567891234"}', '{"kyc_verified":true}', '${now}', '${now}'),
        ('seed4_acct_holder_3', 'pp_system_default', '${customerIds[2]}', 'ahmed@dakkah.sa', '{"name":"أحمد القحطاني","national_id":"1076543210","bank":"الإنماء","iban":"SA5505000068201234567890"}', '{"kyc_verified":false}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ account_holder seeded")
  } catch (err: any) {
    console.log(`  ✗ account_holder error: ${err.message}`)
  }

  // ============================================================
  // 36. INVESTMENT_PLAN (2 rows)
  // ============================================================
  console.log("36/41 Seeding investment_plan...")
  try {
    await dataSource.raw(`
      INSERT INTO investment_plan (id, tenant_id, name, description, plan_type, min_investment, currency_code, expected_return_pct, risk_level, lock_in_months, is_shariah_compliant, features, terms, is_active, metadata, created_at, updated_at)
      VALUES
        ('seed4_invest_plan_1', '${tenantId}', 'صندوق المرابحة الآمن', 'صندوق استثماري متوافق مع الشريعة الإسلامية يعتمد على عقود المرابحة مع عوائد مستقرة', 'savings', 5000, 'sar', 5.5, 'low', 12, true, '["عوائد شهرية","سحب مرن بعد فترة الحد الأدنى","بدون رسوم إدارية"]', '["الحد الأدنى للاستثمار 5,000 ريال","فترة الإقفال 12 شهر"]', true, '{"provider":"البنك الأهلي السعودي"}', '${now}', '${now}'),
        ('seed4_invest_plan_2', '${tenantId}', 'محفظة الأسهم السعودية المتنوعة', 'محفظة استثمارية متنوعة في الأسهم السعودية المتوافقة مع الشريعة في قطاعات متعددة', 'mutual_fund', 10000, 'sar', 12.5, 'moderate', 6, true, '["تنويع في 30+ شركة","إدارة احترافية","تقارير ربع سنوية"]', '["الحد الأدنى 10,000 ريال","رسوم إدارة 1.5% سنوياً"]', true, '{"provider":"الراجحي المالية"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ investment_plan seeded")
  } catch (err: any) {
    console.log(`  ✗ investment_plan error: ${err.message}`)
  }

  // ============================================================
  // 37. INSURANCE_POLICY (2 rows)
  // ============================================================
  console.log("37/41 Seeding insurance_policy...")
  try {
    await dataSource.raw(`
      INSERT INTO insurance_policy (id, tenant_id, product_id, holder_id, policy_number, status, premium_amount, currency_code, payment_frequency, coverage_amount, deductible, start_date, end_date, beneficiaries, documents, auto_renew, last_payment_at, next_payment_at, metadata, created_at, updated_at)
      VALUES
        ('seed4_ins_policy_1', '${tenantId}', '${insuranceProductIds[0]}', '${customerIds[0]}', 'POL-HLTH-2026-00101', 'active', 1200, 'sar', 'monthly', 500000, 500, '${past3}', '${future3}', '["محمد الأحمدي","سارة الأحمدي","يوسف الأحمدي"]', '["contract.pdf","id_copy.pdf"]', true, '${past1}', '${future1}', '{"type":"family_health","class":"VIP"}', '${now}', '${now}'),
        ('seed4_ins_policy_2', '${tenantId}', '${insuranceProductIds[1]}', '${customerIds[1]}', 'POL-AUTO-2026-00201', 'active', 3500, 'sar', 'annually', 200000, 1000, '${past3}', '${future3}', null, '["contract.pdf","vehicle_reg.pdf"]', true, '${past3}', '${future3}', '{"type":"comprehensive_auto","vehicle":"Toyota Camry 2023"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ insurance_policy seeded")
  } catch (err: any) {
    console.log(`  ✗ insurance_policy error: ${err.message}`)
  }

  // ============================================================
  // 38. INSURANCE_CLAIM (2 rows) - healthcare insurance claims
  // ============================================================
  console.log("38/41 Seeding insurance_claim...")
  try {
    await dataSource.raw(`
      INSERT INTO insurance_claim (id, tenant_id, patient_id, appointment_id, claim_number, insurance_provider, policy_number, claim_amount, approved_amount, currency_code, status, diagnosis_codes, procedure_codes, submitted_at, reviewed_at, denial_reason, paid_at, metadata, raw_claim_amount, raw_approved_amount, created_at, updated_at)
      VALUES
        ('seed4_ins_claim_1', '${tenantId}', '${customerIds[0]}', 'appt_seed4_001', 'CLM-2026-SA-00101', 'بوبا العربية', 'POL-HLTH-2026-00101', 2500, 2200, 'sar', 'approved', '["J06.9","R50.9"]', '["99213","87880"]', '${past2}', '${past1}', null, '${past1}', '{"hospital":"مستشفى المملكة"}', '${rawNum(2500)}', '${rawNum(2200)}', '${now}', '${now}'),
        ('seed4_ins_claim_2', '${tenantId}', '${customerIds[1]}', 'appt_seed4_002', 'CLM-2026-SA-00102', 'التعاونية للتأمين', 'POL-AUTO-2026-00201', 8500, null, 'sar', 'submitted', '["S52.5"]', '["27235","29881"]', '${past1}', null, null, null, '{"hospital":"مستشفى الحبيب"}', '${rawNum(8500)}', null, '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ insurance_claim seeded")
  } catch (err: any) {
    console.log(`  ✗ insurance_claim error: ${err.message}`)
  }

  // ============================================================
  // 39. LOAN_APPLICATION (2 rows)
  // ============================================================
  console.log("39/41 Seeding loan_application...")
  try {
    await dataSource.raw(`
      INSERT INTO loan_application (id, tenant_id, loan_product_id, applicant_id, application_number, requested_amount, approved_amount, currency_code, term_months, interest_rate, monthly_payment, status, purpose, income_details, documents, credit_score, submitted_at, approved_at, approved_by, disbursed_at, rejection_reason, metadata, created_at, updated_at)
      VALUES
        ('seed4_loan_app_1', '${tenantId}', '${loanProductIds[0]}', '${customerIds[0]}', 'LOAN-2026-SA-00101', 150000, 150000, 'sar', 60, 4.5, 2795, 'approved', 'شراء سيارة جديدة', '{"monthly_salary":18000,"employer":"أرامكو السعودية","employment_years":5}', '["salary_cert.pdf","id_copy.pdf","bank_statement.pdf"]', 780, '${past3}', '${past2}', '${userIds[0]}', '${past1}', null, '{"product":"تمويل سيارات","shariah_compliant":true}', '${now}', '${now}'),
        ('seed4_loan_app_2', '${tenantId}', '${loanProductIds[1]}', '${customerIds[2]}', 'LOAN-2026-SA-00102', 500000, null, 'sar', 240, null, null, 'under_review', 'تمويل عقاري لشراء شقة', '{"monthly_salary":22000,"employer":"STC","employment_years":8}', '["salary_cert.pdf","id_copy.pdf","property_deed.pdf"]', 720, '${past1}', null, null, null, null, '{"product":"تمويل عقاري","shariah_compliant":true}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ loan_application seeded")
  } catch (err: any) {
    console.log(`  ✗ loan_application error: ${err.message}`)
  }

  // ============================================================
  // 40. CREDIT_LINE (2 rows) - cart credit lines
  // ============================================================
  console.log("40/41 Seeding credit_line...")
  try {
    await dataSource.raw(`
      INSERT INTO credit_line (id, cart_id, reference, reference_id, amount, raw_amount, metadata, created_at, updated_at)
      VALUES
        ('seed4_credit_line_1', 'cart_seed4_001', 'store_credit', '${customerIds[0]}', 500, '${rawNum(500)}', '{"source":"referral_reward","description":"رصيد من برنامج الإحالة"}', '${now}', '${now}'),
        ('seed4_credit_line_2', 'cart_seed4_002', 'loyalty_points', '${customerIds[1]}', 250, '${rawNum(250)}', '{"source":"points_redemption","description":"استبدال نقاط الولاء"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ credit_line seeded")
  } catch (err: any) {
    console.log(`  ✗ credit_line error: ${err.message}`)
  }

  // ============================================================
  // 41. POINTS_LEDGER (3 rows)
  // ============================================================
  console.log("41/41 Seeding points_ledger...")
  try {
    await dataSource.raw(`
      INSERT INTO points_ledger (id, tenant_id, membership_id, transaction_type, points, balance_after, source, reference_type, reference_id, description, expires_at, metadata, created_at, updated_at)
      VALUES
        ('seed4_points_1', '${tenantId}', 'membership_seed4_1', 'earn', 500, 500, 'purchase', 'order', 'order_seed4_001', 'نقاط مكتسبة من عملية شراء إلكترونيات', '${future3}', '{"order_total":1750}', '${now}', '${now}'),
        ('seed4_points_2', '${tenantId}', 'membership_seed4_1', 'earn', 250, 750, 'referral', 'referral', 'seed4_referral_1', 'نقاط مكافأة إحالة صديق', '${future3}', '{"referred_customer":"أحمد"}', '${now}', '${now}'),
        ('seed4_points_3', '${tenantId}', 'membership_seed4_1', 'redeem', -200, 550, 'redemption', 'order', 'order_seed4_003', 'استبدال نقاط للحصول على خصم', null, '{"discount_applied":200}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ points_ledger seeded")
  } catch (err: any) {
    console.log(`  ✗ points_ledger error: ${err.message}`)
  }

  console.log("\n========================================")
  console.log("Seed Verticals Batch 4 Complete!")
  console.log("========================================")
}
