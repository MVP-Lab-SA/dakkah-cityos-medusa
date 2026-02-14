// @ts-nocheck
import { ExecArgs } from "@medusajs/framework/types"

export default async function seedVerticals6({ container }: ExecArgs) {
  console.log("========================================")
  console.log("Seeding Vertical Modules - Batch 6")
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
  ]
  const userIds = [
    "user_01KGX7H20X40WWRDJE1GHVS8J8",
    "user_01KGZ2E9HD9KV8SX8G2416HT2S",
  ]
  const vendorIds = [
    "01KGZ2JS6VVN97NXBHNP0S4BKY",
    "01KGZ2JS77VF4PV6F9X4RG4MKJ",
  ]
  const productIds = [
    "prod_01KGXWKES2EXC229RZKX079154",
    "prod_01KGXWM9R1ZFT783EKQHPKWG05",
    "prod_01KGXWM9XVS8C58TJK1R2HM6RD",
    "prod_01KGXWMA376G4K0PCG14387E28",
    "prod_01KGXWMA7S5BH9BM2NW672BXX4",
    "prod_01KGXWMAFPH978N1QQ89KKG8HA",
  ]

  const rentalProductIds = [
    "01KH0ZPJZKBVS63BKJ24C927CK",
    "01KH0ZPJZP9EWPNJ30M1T60S6F",
    "01KH0ZPJZT7NG9KKXPEH0W8FY0",
  ]
  const restaurantIds = [
    "01KH0ZPJBRYPJNW64606KYBGH4",
    "01KH0ZPJJ6JEAC6G74CBRAY2PQ",
  ]
  const modifierGroupId = "01KH0ZPJKNG2VGT3WYCNQJ0K8M"
  const menuIds = [
    "01KH0ZPJJF63JY1CZ91NMZCV5J",
    "01KH0ZPJJW195FXR3XRYTZSA7G",
  ]
  const liveStreamIds = [
    "01KH0ZR19Z8ZHWEA8HF32B9PBE",
    "01KH0ZR1A2FMEZ3WC7E19X73AM",
  ]
  const subscriptionPlanIds = ["subplan_01", "subplan_02"]
  const travelPropertyIds = ["tp_riyadh_01", "tp_jeddah_01"]
  const roomTypeIds = ["rt_deluxe_01", "rt_standard_01"]
  const utilityAccountIds = [
    "01KH0ZR15CGF6ACAS8EMBRQYAT",
    "01KH0ZR1657YP8MZPZKFFEAHRP",
  ]
  const warrantyPlanIds = [
    "01KH0ZR1D1NFQXCK9N7GP4XGAQ",
    "01KH0ZR1D51EQ697T78N0T16NB",
  ]
  const warrantyClaimIds = ["wclaim_01", "wclaim_02"]
  const rewardTierIds = [
    "01KH0ZR19DR1BHZ6JYX1GW9Q1G",
    "01KH0ZR19JCN1GTFBBC7FEXNZ7",
    "01KH0ZR19KG60AAPYR0F2WG3RK",
  ]
  const affiliateIds = [
    "01KH0ZR1E929YCJ40368BBRJ5S",
    "01KH0ZR1EFHAVGFTBBXZGWEXZE",
  ]
  const charityOrgIds = [
    "01KH0ZQ9CT0B3N3HW72X3TS4EJ",
    "01KH0ZQ9D2FZWZ5DQTBZQGJ8Y0",
  ]
  const donationCampaignIds = [
    "01KH0ZQ9DCA4KGYTXXTA13HNG1",
    "01KH0ZQ9DD6G72BKJP3KE660ZP",
  ]
  const eventIds = [
    "01KH0ZPJXK4XENBERV48AMGGT6",
    "01KH0ZPJXV0XKX7DSXDT2882VB",
  ]
  const venueIds = [
    "01KH0ZPJX1HVRSXZ679VDGEGAT",
    "01KH0ZPJXBYYGBHREFMM3F45AC",
  ]
  const ticketTypeIds = [
    "01KH0ZPJY33S4WK4YXGJ1Z3WV1",
    "01KH0ZPJY637GVQ2YXYBJ4G26Q",
  ]

  const now = new Date().toISOString()
  const past7d = new Date(Date.now() - 7 * 86400000).toISOString()
  const past14d = new Date(Date.now() - 14 * 86400000).toISOString()
  const past30d = new Date(Date.now() - 30 * 86400000).toISOString()
  const past60d = new Date(Date.now() - 60 * 86400000).toISOString()
  const past90d = new Date(Date.now() - 90 * 86400000).toISOString()
  const future7d = new Date(Date.now() + 7 * 86400000).toISOString()
  const future14d = new Date(Date.now() + 14 * 86400000).toISOString()
  const future30d = new Date(Date.now() + 30 * 86400000).toISOString()
  const future60d = new Date(Date.now() + 60 * 86400000).toISOString()
  const future90d = new Date(Date.now() + 90 * 86400000).toISOString()
  const future180d = new Date(Date.now() + 180 * 86400000).toISOString()
  const future365d = new Date(Date.now() + 365 * 86400000).toISOString()

  // ============================================================
  // 1. RENTAL_PERIOD (3 rows)
  // ============================================================
  console.log("Step 1: Seeding rental_period...")
  try {
    await dataSource.raw(`
      INSERT INTO rental_period (id, tenant_id, rental_product_id, period_type, start_date, end_date, price_multiplier, is_blocked, reason, metadata, created_at, updated_at)
      VALUES
        ('seed6_rp_01', '${tenantId}', '${rentalProductIds[0]}', 'peak', '${now}', '${future90d}', 1.5, false, 'موسم الصيف - زيادة الطلب', '{"season":"summer"}', '${now}', '${now}'),
        ('seed6_rp_02', '${tenantId}', '${rentalProductIds[1]}', 'off_peak', '${past90d}', '${past30d}', 0.8, false, 'فترة هدوء - أسعار مخفضة', '{"discount":"20%"}', '${now}', '${now}'),
        ('seed6_rp_03', '${tenantId}', '${rentalProductIds[2]}', 'holiday', '${future30d}', '${future60d}', 2.0, false, 'إجازة اليوم الوطني السعودي', '{"holiday":"national_day"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 3 rental periods")
  } catch (err: any) {
    console.log(`  ✗ rental_period error: ${err.message}`)
  }

  // ============================================================
  // 2. RENTAL_AGREEMENT (2 rows)
  // ============================================================
  console.log("Step 2: Seeding rental_agreement...")
  try {
    await dataSource.raw(`
      INSERT INTO rental_agreement (id, tenant_id, rental_product_id, customer_id, order_id, status, start_date, end_date, actual_return_date, total_price, deposit_paid, deposit_refunded, late_fees, currency_code, terms_accepted, notes, metadata, created_at, updated_at)
      VALUES
        ('seed6_ra_01', '${tenantId}', '${rentalProductIds[0]}', '${customerIds[0]}', null, 'active', '${past14d}', '${future14d}', null, 1500, 500, null, null, 'sar', true, 'استئجار كاميرا احترافية لتصوير زفاف', '{"purpose":"wedding_photography"}', '${now}', '${now}'),
        ('seed6_ra_02', '${tenantId}', '${rentalProductIds[1]}', '${customerIds[1]}', null, 'returned', '${past60d}', '${past30d}', '${past30d}', 2200, 700, 650, 0, 'sar', true, 'استئجار معدات مكتبية لمعرض تجاري', '{"purpose":"trade_show"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 2 rental agreements")
  } catch (err: any) {
    console.log(`  ✗ rental_agreement error: ${err.message}`)
  }

  // ============================================================
  // 3. RENTAL_RETURN (2 rows)
  // ============================================================
  console.log("Step 3: Seeding rental_return...")
  try {
    await dataSource.raw(`
      INSERT INTO rental_return (id, tenant_id, agreement_id, inspected_by, condition_on_return, inspection_notes, damage_description, damage_fee, deposit_deduction, deposit_refund, returned_at, metadata, created_at, updated_at)
      VALUES
        ('seed6_rr_01', '${tenantId}', 'seed6_ra_02', '${userIds[0]}', 'good', 'المعدات بحالة جيدة مع استخدام طبيعي بسيط', null, null, 50, 650, '${past30d}', '{"inspection_time_minutes":15}', '${now}', '${now}'),
        ('seed6_rr_02', '${tenantId}', 'seed6_ra_02', '${userIds[1]}', 'fair', 'خدوش سطحية على الغلاف الخارجي', 'خدوش بسيطة على السطح الخارجي للجهاز', 150, 200, 500, '${past30d}', '{"inspection_time_minutes":25}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 2 rental returns")
  } catch (err: any) {
    console.log(`  ✗ rental_return error: ${err.message}`)
  }

  // ============================================================
  // 4. DAMAGE_CLAIM (2 rows)
  // ============================================================
  console.log("Step 4: Seeding damage_claim...")
  try {
    await dataSource.raw(`
      INSERT INTO damage_claim (id, tenant_id, agreement_id, return_id, description, evidence_urls, estimated_cost, actual_cost, currency_code, status, resolution_notes, resolved_at, metadata, created_at, updated_at)
      VALUES
        ('seed6_dc_01', '${tenantId}', 'seed6_ra_02', 'seed6_rr_02', 'خدوش على السطح الخارجي للجهاز بسبب سوء التخزين', '["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400"]', 200, 150, 'sar', 'resolved', 'تم خصم رسوم الإصلاح من التأمين وإصلاح الخدوش', '${past7d}', '{"repair_type":"surface_polish"}', '${now}', '${now}'),
        ('seed6_dc_02', '${tenantId}', 'seed6_ra_01', null, 'تلف بسيط في كابل الشحن المرفق', '["https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400"]', 80, null, 'sar', 'reviewing', null, null, '{"item":"charging_cable"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 2 damage claims")
  } catch (err: any) {
    console.log(`  ✗ damage_claim error: ${err.message}`)
  }

  // ============================================================
  // 5. MODIFIER (4 rows)
  // ============================================================
  console.log("Step 5: Seeding modifier...")
  try {
    await dataSource.raw(`
      INSERT INTO modifier (id, tenant_id, group_id, name, price_adjustment, currency_code, is_available, is_default, calories, display_order, metadata, created_at, updated_at)
      VALUES
        ('seed6_mod_01', '${tenantId}', '${modifierGroupId}', 'حجم صغير', 0, 'sar', true, false, 250, 1, '{"size":"small"}', '${now}', '${now}'),
        ('seed6_mod_02', '${tenantId}', '${modifierGroupId}', 'حجم وسط', 5, 'sar', true, true, 450, 2, '{"size":"medium"}', '${now}', '${now}'),
        ('seed6_mod_03', '${tenantId}', '${modifierGroupId}', 'حجم كبير', 12, 'sar', true, false, 650, 3, '{"size":"large"}', '${now}', '${now}'),
        ('seed6_mod_04', '${tenantId}', '${modifierGroupId}', 'إضافة جبنة', 8, 'sar', true, false, 120, 4, '{"extra":"cheese"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 4 modifiers")
  } catch (err: any) {
    console.log(`  ✗ modifier error: ${err.message}`)
  }

  // ============================================================
  // 6. ROOM - Travel rooms (3 rows)
  // ============================================================
  console.log("Step 6: Seeding room (travel)...")
  try {
    await dataSource.raw(`
      INSERT INTO room (id, tenant_id, property_id, room_type_id, room_number, floor, status, is_smoking, is_accessible, notes, metadata, created_at, updated_at)
      VALUES
        ('seed6_room_01', '${tenantId}', '${travelPropertyIds[0]}', '${roomTypeIds[0]}', '501', '5', 'available', false, false, 'غرفة ديلوكس بإطلالة على المدينة', '{"view":"city","wing":"east"}', '${now}', '${now}'),
        ('seed6_room_02', '${tenantId}', '${travelPropertyIds[0]}', '${roomTypeIds[0]}', '502', '5', 'occupied', false, true, 'غرفة مهيأة لذوي الاحتياجات الخاصة', '{"view":"garden","wing":"east","ada_compliant":true}', '${now}', '${now}'),
        ('seed6_room_03', '${tenantId}', '${travelPropertyIds[1]}', '${roomTypeIds[1]}', '201', '2', 'available', false, false, 'غرفة قياسية بإطلالة على البحر', '{"view":"sea","wing":"west"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 3 rooms")
  } catch (err: any) {
    console.log(`  ✗ room error: ${err.message}`)
  }

  // ============================================================
  // 7. GUEST_PROFILE (2 rows)
  // ============================================================
  console.log("Step 7: Seeding guest_profile...")
  try {
    await dataSource.raw(`
      INSERT INTO guest_profile (id, tenant_id, customer_id, preferences, loyalty_tier, total_stays, total_nights, total_spent, nationality, passport_number, dietary_requirements, special_needs, metadata, created_at, updated_at)
      VALUES
        ('seed6_gp_01', '${tenantId}', '${customerIds[0]}', '{"room_temp":"22C","pillow":"firm","floor_pref":"high","minibar":true}', 'gold', 8, 22, 35000, 'SA', 'A12345678', 'حلال فقط - لا مكسرات', null, '{"frequent_guest":true}', '${now}', '${now}'),
        ('seed6_gp_02', '${tenantId}', '${customerIds[1]}', '{"room_temp":"24C","pillow":"soft","floor_pref":"low","quiet_room":true}', 'silver', 4, 10, 18000, 'SA', 'B98765432', 'حلال - نباتي', 'غرفة هادئة بعيدة عن المصعد', '{"family_traveler":true}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 2 guest profiles")
  } catch (err: any) {
    console.log(`  ✗ guest_profile error: ${err.message}`)
  }

  // ============================================================
  // 8. KITCHEN_ORDER (2 rows)
  // ============================================================
  console.log("Step 8: Seeding kitchen_order...")
  try {
    await dataSource.raw(`
      INSERT INTO kitchen_order (id, tenant_id, restaurant_id, order_id, station, status, priority, items, notes, estimated_prep_time, actual_prep_time, started_at, completed_at, metadata, created_at, updated_at)
      VALUES
        ('seed6_ko_01', '${tenantId}', '${restaurantIds[0]}', 'order_seed6_001', 'main_kitchen', 'preparing', 'rush', '${JSON.stringify([{ name: "بروستد دجاج", qty: 2, mods: ["حار"] }, { name: "وجبة ربيان", qty: 1, mods: [] }]).replace(/'/g, "''")}', 'العميل يطلب سرعة التحضير', 15, null, '${now}', null, '{"table":"T5","server":"أحمد"}', '${now}', '${now}'),
        ('seed6_ko_02', '${tenantId}', '${restaurantIds[1]}', 'order_seed6_002', 'grill_station', 'ready', 'normal', '${JSON.stringify([{ name: "كبسة لحم", qty: 1, mods: ["بدون بصل"] }, { name: "جريش", qty: 1, mods: [] }]).replace(/'/g, "''")}', null, 30, 28, '${past7d}', '${past7d}', '{"table":"T12","server":"فهد"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 2 kitchen orders")
  } catch (err: any) {
    console.log(`  ✗ kitchen_order error: ${err.message}`)
  }

  // ============================================================
  // 9. REVIEW (5 rows)
  // ============================================================
  console.log("Step 9: Seeding review...")
  try {
    await dataSource.raw(`
      INSERT INTO review (id, rating, title, content, customer_id, customer_name, customer_email, product_id, vendor_id, order_id, is_verified_purchase, is_approved, helpful_count, images, metadata, created_at, updated_at)
      VALUES
        ('seed6_rev_01', 5, 'ممتاز جداً!', 'تيشيرت بجودة عالية جداً، القماش ممتاز والتصميم أنيق. أنصح بالشراء بشدة.', '${customerIds[0]}', 'محمد', 'mohammed@example.com', '${productIds[0]}', '${vendorIds[0]}', null, true, true, 12, '[]', '{"verified":true}', '${now}', '${now}'),
        ('seed6_rev_02', 4, 'منتج جيد', 'هودي مريح جداً وجودة القماش ممتازة. المقاس مناسب تماماً. خصمت نجمة بسبب تأخر التوصيل.', '${customerIds[1]}', 'فاطمة', 'fatima@example.com', '${productIds[1]}', '${vendorIds[0]}', null, true, true, 8, '[]', '{"verified":true}', '${now}', '${now}'),
        ('seed6_rev_03', 5, 'أفضل كوب!', 'كوب عملي وجميل، يحافظ على حرارة المشروبات لفترة طويلة. هدية مثالية.', '${customerIds[2]}', 'أحمد', 'ahmed@example.com', '${productIds[2]}', '${vendorIds[1]}', null, true, true, 15, '[]', '{"verified":true}', '${now}', '${now}'),
        ('seed6_rev_04', 3, 'مقبول', 'حقيبة توت عادية، الخياطة جيدة لكن التصميم بسيط. السعر مناسب للجودة.', '${customerIds[0]}', 'محمد', 'mohammed@example.com', '${productIds[3]}', '${vendorIds[1]}', null, true, true, 3, '[]', '{"verified":true}', '${now}', '${now}'),
        ('seed6_rev_05', 4, 'سماعات رائعة', 'جودة الصوت ممتازة والبطارية تدوم طويلاً. العزل جيد جداً. سعر مناسب مقارنة بالمنافسين.', '${customerIds[1]}', 'فاطمة', 'fatima@example.com', '${productIds[5]}', '${vendorIds[0]}', null, true, true, 20, '[]', '{"verified":true}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 5 reviews")
  } catch (err: any) {
    console.log(`  ✗ review error: ${err.message}`)
  }

  // ============================================================
  // 10. INFLUENCER_CAMPAIGN (2 rows)
  // ============================================================
  console.log("Step 10: Seeding influencer_campaign...")
  try {
    await dataSource.raw(`
      INSERT INTO influencer_campaign (id, tenant_id, name, description, affiliate_id, status, campaign_type, budget, currency_code, starts_at, ends_at, deliverables, performance_metrics, metadata, created_at, updated_at)
      VALUES
        ('seed6_ic_01', '${tenantId}', 'حملة مراجعة سماعات لاسلكية', 'حملة مراجعة منتج مع مؤثر تقني متخصص في الأجهزة الإلكترونية', '${affiliateIds[0]}', 'active', 'review', 5000, 'sar', '${past14d}', '${future30d}', '${JSON.stringify(["فيديو مراجعة على يوتيوب", "3 ستوريز انستغرام", "بوست تويتر"]).replace(/'/g, "''")}', '${JSON.stringify({ views: 25000, clicks: 1200, conversions: 45 }).replace(/'/g, "''")}', '{"influencer":"تقني_سعودي","platform":"youtube"}', '${now}', '${now}'),
        ('seed6_ic_02', '${tenantId}', 'حملة تصوير أزياء موسم الشتاء', 'حملة تصوير وترويج مجموعة الشتاء مع مؤثرة أزياء', '${affiliateIds[1]}', 'draft', 'sponsored_post', 8000, 'sar', '${future7d}', '${future60d}', '${JSON.stringify(["5 بوستات انستغرام", "2 ريلز", "ستوري يومي لمدة أسبوع"]).replace(/'/g, "''")}', null, '{"influencer":"فاشونيستا_الرياض","platform":"instagram"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 2 influencer campaigns")
  } catch (err: any) {
    console.log(`  ✗ influencer_campaign error: ${err.message}`)
  }

  // ============================================================
  // 11. LIVE_PRODUCT (3 rows)
  // ============================================================
  console.log("Step 11: Seeding live_product...")
  try {
    await dataSource.raw(`
      INSERT INTO live_product (id, tenant_id, stream_id, product_id, variant_id, featured_at, flash_price, flash_quantity, flash_sold, currency_code, display_order, is_active, metadata, created_at, updated_at)
      VALUES
        ('seed6_lp_01', '${tenantId}', '${liveStreamIds[0]}', '${productIds[0]}', null, '${now}', 79, 50, 12, 'sar', 1, true, '{"highlight":"عرض خاص على التيشيرتات"}', '${now}', '${now}'),
        ('seed6_lp_02', '${tenantId}', '${liveStreamIds[0]}', '${productIds[5]}', null, '${now}', 199, 30, 8, 'sar', 2, true, '{"highlight":"سماعات بسعر مخفض"}', '${now}', '${now}'),
        ('seed6_lp_03', '${tenantId}', '${liveStreamIds[1]}', '${productIds[1]}', null, '${past7d}', 149, 40, 25, 'sar', 1, false, '{"highlight":"هوديز شتوية"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 3 live products")
  } catch (err: any) {
    console.log(`  ✗ live_product error: ${err.message}`)
  }

  // ============================================================
  // 12. SOCIAL_SHARE (3 rows)
  // ============================================================
  console.log("Step 12: Seeding social_share...")
  try {
    await dataSource.raw(`
      INSERT INTO social_share (id, tenant_id, product_id, sharer_id, platform, share_url, click_count, conversion_count, revenue_generated, shared_at, metadata, created_at, updated_at)
      VALUES
        ('seed6_ss_01', '${tenantId}', '${productIds[0]}', '${customerIds[0]}', 'whatsapp', 'https://store.example.sa/p/tshirt?ref=wh_01', 45, 5, 475, '${past7d}', '{"campaign":"summer_share"}', '${now}', '${now}'),
        ('seed6_ss_02', '${tenantId}', '${productIds[5]}', '${customerIds[1]}', 'instagram', 'https://store.example.sa/p/earbuds?ref=ig_01', 120, 12, 2388, '${past14d}', '{"campaign":"tech_share"}', '${now}', '${now}'),
        ('seed6_ss_03', '${tenantId}', '${productIds[1]}', '${customerIds[2]}', 'twitter', 'https://store.example.sa/p/hoodie?ref=tw_01', 30, 3, 447, '${past30d}', '{"campaign":"winter_collection"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 3 social shares")
  } catch (err: any) {
    console.log(`  ✗ social_share error: ${err.message}`)
  }

  // ============================================================
  // 13. SUBSCRIPTION (3 rows)
  // ============================================================
  console.log("Step 13: Seeding subscription...")
  try {
    await dataSource.raw(`
      INSERT INTO subscription (id, customer_id, status, start_date, end_date, current_period_start, current_period_end, trial_start, trial_end, canceled_at, billing_interval, billing_interval_count, billing_anchor_day, payment_collection_method, payment_provider_id, payment_method_id, currency_code, subtotal, tax_total, total, max_retry_attempts, retry_count, last_retry_at, next_retry_at, tenant_id, store_id, metadata, created_at, updated_at)
      VALUES
        ('seed6_sub_01', '${customerIds[0]}', 'active', '${past90d}', '${future365d}', '${past30d}', '${future30d}', null, null, null, 'monthly', 1, 1, 'charge_automatically', null, null, 'sar', 99, 15, 114, 3, 0, null, null, '${tenantId}', '${storeId}', '{"plan":"basic","auto_renew":true}', '${now}', '${now}'),
        ('seed6_sub_02', '${customerIds[1]}', 'active', '${past60d}', '${future365d}', '${past30d}', '${future30d}', '${past60d}', '${past30d}', null, 'monthly', 1, 15, 'charge_automatically', null, null, 'sar', 199, 30, 229, 3, 0, null, null, '${tenantId}', '${storeId}', '{"plan":"premium","auto_renew":true}', '${now}', '${now}'),
        ('seed6_sub_03', '${customerIds[2]}', 'active', '${past30d}', '${future365d}', '${past30d}', '${future90d}', null, null, null, 'quarterly', 1, 1, 'send_invoice', null, null, 'sar', 499, 75, 574, 3, 0, null, null, '${tenantId}', '${storeId}', '{"plan":"enterprise","auto_renew":true}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 3 subscriptions")
  } catch (err: any) {
    console.log(`  ✗ subscription error: ${err.message}`)
  }

  // ============================================================
  // 14. SUBSCRIPTION_ITEM (3 rows)
  // ============================================================
  console.log("Step 14: Seeding subscription_item...")
  try {
    await dataSource.raw(`
      INSERT INTO subscription_item (id, subscription_id, product_id, variant_id, product_title, variant_title, quantity, unit_price, subtotal, tax_total, total, billing_interval, billing_interval_count, tenant_id, metadata, created_at, updated_at)
      VALUES
        ('seed6_si_01', 'seed6_sub_01', '${productIds[0]}', 'var_tshirt_01', 'تيشيرت شهري', 'مقاس L - أسود', 1, 99, 99, 15, 114, null, null, '${tenantId}', '{"delivery":"monthly"}', '${now}', '${now}'),
        ('seed6_si_02', 'seed6_sub_02', '${productIds[4]}', 'var_bottle_01', 'قارورة ماء شهرية', 'ستانلس ستيل - 750ml', 2, 99, 199, 30, 229, null, null, '${tenantId}', '{"delivery":"monthly"}', '${now}', '${now}'),
        ('seed6_si_03', 'seed6_sub_03', '${productIds[5]}', 'var_earbuds_01', 'سماعات ربع سنوية', 'لون أبيض', 1, 499, 499, 75, 574, null, null, '${tenantId}', '{"delivery":"quarterly"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 3 subscription items")
  } catch (err: any) {
    console.log(`  ✗ subscription_item error: ${err.message}`)
  }

  // ============================================================
  // 15. SUBSCRIPTION_EVENT (3 rows)
  // ============================================================
  console.log("Step 15: Seeding subscription_event...")
  try {
    await dataSource.raw(`
      INSERT INTO subscription_event (id, subscription_id, tenant_id, event_type, event_data, triggered_by, triggered_by_id, occurred_at, billing_cycle_id, order_id, metadata, created_at, updated_at)
      VALUES
        ('seed6_se_01', 'seed6_sub_01', '${tenantId}', 'created', '{"plan":"basic","amount":114,"currency":"sar"}', 'customer', '${customerIds[0]}', '${past90d}', null, null, '{"source":"storefront"}', '${now}', '${now}'),
        ('seed6_se_02', 'seed6_sub_01', '${tenantId}', 'renewed', '{"period_start":"${past30d}","period_end":"${future30d}","amount":114}', 'system', null, '${past30d}', null, null, '{"auto_renewal":true}', '${now}', '${now}'),
        ('seed6_se_03', 'seed6_sub_02', '${tenantId}', 'payment_succeeded', '{"amount":229,"currency":"sar","payment_method":"card_visa"}', 'system', null, '${past30d}', null, null, '{"processor":"stripe"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 3 subscription events")
  } catch (err: any) {
    console.log(`  ✗ subscription_event error: ${err.message}`)
  }

  // ============================================================
  // 16. TRAVEL_RESERVATION (3 rows)
  // ============================================================
  console.log("Step 16: Seeding travel_reservation...")
  try {
    await dataSource.raw(`
      INSERT INTO travel_reservation (id, tenant_id, property_id, room_type_id, room_id, guest_id, order_id, confirmation_number, check_in_date, check_out_date, nights, adults, children, status, total_price, currency_code, special_requests, cancelled_at, cancellation_reason, metadata, created_at, updated_at)
      VALUES
        ('seed6_tr_01', '${tenantId}', '${travelPropertyIds[0]}', '${roomTypeIds[0]}', 'seed6_room_01', '${customerIds[0]}', null, 'CONF-RYD-20260201', '${future7d}', '${future14d}', 7, 2, 1, 'confirmed', 19600, 'sar', 'سرير إضافي للطفل - إطلالة على المدينة', null, null, '{"booking_source":"website","loyalty_points_used":500}', '${now}', '${now}'),
        ('seed6_tr_02', '${tenantId}', '${travelPropertyIds[1]}', '${roomTypeIds[1]}', 'seed6_room_03', '${customerIds[1]}', null, 'CONF-JED-20260215', '${future14d}', '${future30d}', 14, 2, 2, 'pending', 38500, 'sar', 'غرفة مطلة على البحر - حمام سباحة خاص', null, null, '{"booking_source":"phone","vip":true}', '${now}', '${now}'),
        ('seed6_tr_03', '${tenantId}', '${travelPropertyIds[0]}', '${roomTypeIds[0]}', 'seed6_room_02', '${customerIds[2]}', null, 'CONF-RYD-20260118', '${past14d}', '${past7d}', 7, 1, 0, 'checked_out', 14000, 'sar', 'غرفة مهيأة لذوي الاحتياجات الخاصة', null, null, '{"booking_source":"app","business_trip":true}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 3 travel reservations")
  } catch (err: any) {
    console.log(`  ✗ travel_reservation error: ${err.message}`)
  }

  // ============================================================
  // 17. METER_READING (3 rows)
  // ============================================================
  console.log("Step 17: Seeding meter_reading...")
  try {
    await dataSource.raw(`
      INSERT INTO meter_reading (id, tenant_id, account_id, reading_value, reading_date, reading_type, previous_reading, consumption, unit, submitted_by, is_verified, photo_url, metadata, created_at, updated_at)
      VALUES
        ('seed6_mr_01', '${tenantId}', '${utilityAccountIds[0]}', 15230, '${past30d}', 'smart_meter', 14800, 430, 'kWh', null, true, null, '{"meter_id":"SM-RYD-0451","tariff":"residential"}', '${now}', '${now}'),
        ('seed6_mr_02', '${tenantId}', '${utilityAccountIds[0]}', 15680, '${now}', 'smart_meter', 15230, 450, 'kWh', null, true, null, '{"meter_id":"SM-RYD-0451","tariff":"residential"}', '${now}', '${now}'),
        ('seed6_mr_03', '${tenantId}', '${utilityAccountIds[1]}', 8420, '${past30d}', 'manual', 8100, 320, 'm3', '${userIds[0]}', false, 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400', '{"meter_id":"WM-JED-1023","tariff":"commercial"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 3 meter readings")
  } catch (err: any) {
    console.log(`  ✗ meter_reading error: ${err.message}`)
  }

  // ============================================================
  // 18. USAGE_RECORD (3 rows)
  // ============================================================
  console.log("Step 18: Seeding usage_record...")
  try {
    await dataSource.raw(`
      INSERT INTO usage_record (id, tenant_id, account_id, period_start, period_end, usage_value, unit, usage_type, cost, currency_code, tier, metadata, created_at, updated_at)
      VALUES
        ('seed6_ur_01', '${tenantId}', '${utilityAccountIds[0]}', '${past60d}', '${past30d}', 430, 'kWh', 'consumption', 86, 'sar', 'tier_1', '{"rate_per_unit":0.20,"subsidy_applied":true}', '${now}', '${now}'),
        ('seed6_ur_02', '${tenantId}', '${utilityAccountIds[0]}', '${past30d}', '${now}', 450, 'kWh', 'peak', 135, 'sar', 'tier_2', '{"rate_per_unit":0.30,"peak_hours":"12:00-18:00"}', '${now}', '${now}'),
        ('seed6_ur_03', '${tenantId}', '${utilityAccountIds[1]}', '${past30d}', '${now}', 320, 'm3', 'consumption', 192, 'sar', 'commercial', '{"rate_per_unit":0.60,"sewage_included":true}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 3 usage records")
  } catch (err: any) {
    console.log(`  ✗ usage_record error: ${err.message}`)
  }

  // ============================================================
  // 19. VENDOR_PRODUCT (4 rows)
  // ============================================================
  console.log("Step 19: Seeding vendor_product...")
  try {
    await dataSource.raw(`
      INSERT INTO vendor_product (id, vendor_id, product_id, tenant_id, is_primary_vendor, attribution_percentage, status, approved_by_id, approved_at, rejection_reason, manage_inventory, vendor_sku, vendor_cost, suggested_price, fulfillment_method, lead_time_days, commission_override, commission_rate, commission_type, metadata, created_at, updated_at)
      VALUES
        ('seed6_vp_01', '${vendorIds[0]}', '${productIds[0]}', '${tenantId}', true, 100, 'approved', '${userIds[0]}', '${past30d}', null, true, 'VND1-TSH-001', 35, 95, 'vendor_ships', 3, false, null, null, '{"category":"apparel"}', '${now}', '${now}'),
        ('seed6_vp_02', '${vendorIds[0]}', '${productIds[1]}', '${tenantId}', true, 100, 'approved', '${userIds[0]}', '${past30d}', null, true, 'VND1-HOD-001', 55, 149, 'vendor_ships', 3, false, null, null, '{"category":"apparel"}', '${now}', '${now}'),
        ('seed6_vp_03', '${vendorIds[1]}', '${productIds[2]}', '${tenantId}', true, 100, 'approved', '${userIds[1]}', '${past14d}', null, true, 'VND2-MUG-001', 12, 39, 'platform_ships', 2, true, 8, 'percentage', '{"category":"accessories"}', '${now}', '${now}'),
        ('seed6_vp_04', '${vendorIds[1]}', '${productIds[5]}', '${tenantId}', true, 100, 'pending_approval', null, null, null, true, 'VND2-EAR-001', 80, 249, 'vendor_ships', 5, false, null, null, '{"category":"electronics"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 4 vendor products")
  } catch (err: any) {
    console.log(`  ✗ vendor_product error: ${err.message}`)
  }

  // ============================================================
  // 20. VENDOR_USER (2 rows)
  // ============================================================
  console.log("Step 20: Seeding vendor_user...")
  try {
    await dataSource.raw(`
      INSERT INTO vendor_user (id, vendor_id, user_id, role, permissions, status, invitation_token, invitation_sent_at, invitation_accepted_at, metadata, created_at, updated_at)
      VALUES
        ('seed6_vu_01', '${vendorIds[0]}', '${userIds[0]}', 'owner', '${JSON.stringify(["products.manage", "orders.manage", "analytics.view", "settings.manage", "payouts.view"]).replace(/'/g, "''")}', 'active', null, null, '${past90d}', '{"joined_from":"admin_invite"}', '${now}', '${now}'),
        ('seed6_vu_02', '${vendorIds[1]}', '${userIds[1]}', 'admin', '${JSON.stringify(["products.manage", "orders.manage", "analytics.view"]).replace(/'/g, "''")}', 'active', null, '${past60d}', '${past60d}', '{"joined_from":"vendor_portal"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 2 vendor users")
  } catch (err: any) {
    console.log(`  ✗ vendor_user error: ${err.message}`)
  }

  // ============================================================
  // 21. VENDOR_ORDER (2 rows)
  // ============================================================
  console.log("Step 21: Seeding vendor_order...")
  try {
    await dataSource.raw(`
      INSERT INTO vendor_order (id, vendor_id, order_id, tenant_id, vendor_order_number, status, currency_code, subtotal, shipping_total, tax_total, discount_total, total, commission_amount, platform_fee, net_amount, payout_status, payout_id, fulfillment_status, shipping_method, tracking_number, tracking_url, shipped_at, delivered_at, shipping_address, vendor_notes, internal_notes, metadata, created_at, updated_at)
      VALUES
        ('seed6_vo_01', '${vendorIds[0]}', 'order_seed6_001', '${tenantId}', 'VO-2026-0001', 'processing', 'sar', 244, 15, 37, 0, 296, 29, 6, 261, 'pending', null, 'not_fulfilled', 'aramex_express', null, null, null, null, '${JSON.stringify({ first_name: "محمد", last_name: "الأحمدي", address_1: "شارع الملك فهد", city: "الرياض", postal_code: "11564", country_code: "SA" }).replace(/'/g, "''")}', 'سيتم الشحن خلال 24 ساعة', null, '{"priority":"normal"}', '${now}', '${now}'),
        ('seed6_vo_02', '${vendorIds[1]}', 'order_seed6_002', '${tenantId}', 'VO-2026-0002', 'delivered', 'sar', 288, 20, 43, 0, 351, 28, 7, 316, 'paid', 'payout_seed6_01', 'fulfilled', 'smsa_express', 'SMSA-1234567890', 'https://tracking.smsa.com/SMSA-1234567890', '${past7d}', '${past7d}', '${JSON.stringify({ first_name: "فاطمة", last_name: "القحطاني", address_1: "حي النزهة", city: "جدة", postal_code: "23511", country_code: "SA" }).replace(/'/g, "''")}', null, 'تم التسليم بنجاح', '{"priority":"normal"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 2 vendor orders")
  } catch (err: any) {
    console.log(`  ✗ vendor_order error: ${err.message}`)
  }

  // ============================================================
  // 22. VENDOR_ORDER_ITEM (2 rows)
  // ============================================================
  console.log("Step 22: Seeding vendor_order_item...")
  try {
    await dataSource.raw(`
      INSERT INTO vendor_order_item (id, vendor_order_id, line_item_id, product_id, variant_id, title, sku, thumbnail, quantity, fulfilled_quantity, returned_quantity, unit_price, subtotal, discount_amount, tax_amount, total, vendor_cost, commission_amount, net_amount, status, metadata, created_at, updated_at)
      VALUES
        ('seed6_voi_01', 'seed6_vo_01', 'li_seed6_001', '${productIds[0]}', null, 'تيشيرت قطني ممتاز', 'VND1-TSH-001', null, 2, 0, 0, 95, 190, 0, 29, 219, 70, 23, 196, 'pending', '{"size":"L","color":"أسود"}', '${now}', '${now}'),
        ('seed6_voi_02', 'seed6_vo_02', 'li_seed6_002', '${productIds[2]}', null, 'كوب سيراميك فاخر', 'VND2-MUG-001', null, 3, 3, 0, 39, 117, 0, 18, 135, 36, 11, 124, 'delivered', '{"design":"arabic_calligraphy"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 2 vendor order items")
  } catch (err: any) {
    console.log(`  ✗ vendor_order_item error: ${err.message}`)
  }

  // ============================================================
  // 23. SERVICE_CENTER (2 rows)
  // ============================================================
  console.log("Step 23: Seeding service_center...")
  try {
    await dataSource.raw(`
      INSERT INTO service_center (id, tenant_id, name, address_line1, address_line2, city, state, postal_code, country_code, phone, email, specializations, is_active, capacity_per_day, current_load, metadata, created_at, updated_at)
      VALUES
        ('seed6_sc_01', '${tenantId}', 'مركز خدمة الرياض - العليا', 'شارع العليا، برج المملكة', 'الدور الأرضي، محل رقم 5', 'الرياض', 'منطقة الرياض', '11564', 'SA', '+966112345001', 'service.riyadh@example.sa', '${JSON.stringify(["electronics", "appliances", "mobile_devices"]).replace(/'/g, "''")}', true, 25, 12, '{"parking_available":true,"working_hours":"09:00-21:00"}', '${now}', '${now}'),
        ('seed6_sc_02', '${tenantId}', 'مركز خدمة جدة - الكورنيش', 'كورنيش جدة، مجمع البحر الأحمر', null, 'جدة', 'منطقة مكة المكرمة', '23511', 'SA', '+966126789002', 'service.jeddah@example.sa', '${JSON.stringify(["electronics", "home_equipment", "warranty_repairs"]).replace(/'/g, "''")}', true, 20, 8, '{"parking_available":true,"working_hours":"10:00-22:00"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 2 service centers")
  } catch (err: any) {
    console.log(`  ✗ service_center error: ${err.message}`)
  }

  // ============================================================
  // 24. SPARE_PART (3 rows)
  // ============================================================
  console.log("Step 24: Seeding spare_part...")
  try {
    await dataSource.raw(`
      INSERT INTO spare_part (id, tenant_id, name, sku, description, compatible_products, price, currency_code, stock_quantity, reorder_level, supplier, is_active, metadata, created_at, updated_at)
      VALUES
        ('seed6_sp_01', '${tenantId}', 'بطارية سماعات لاسلكية', 'SP-BAT-EAR-001', 'بطارية ليثيوم أيون بديلة للسماعات اللاسلكية 300mAh', '${JSON.stringify([productIds[5]]).replace(/'/g, "''")}', 45, 'sar', 150, 20, 'Saudi Battery Co.', true, '{"warranty_months":6}', '${now}', '${now}'),
        ('seed6_sp_02', '${tenantId}', 'غطاء حماية قارورة ماء', 'SP-COV-BOT-001', 'غطاء سيليكون واقي لقارورة الماء الحرارية', '${JSON.stringify([productIds[4]]).replace(/'/g, "''")}', 25, 'sar', 300, 50, 'Gulf Accessories Ltd.', true, '{"colors":["black","blue","green"]}', '${now}', '${now}'),
        ('seed6_sp_03', '${tenantId}', 'وسادات أذن بديلة', 'SP-PAD-EAR-001', 'وسادات أذن من الميموري فوم للسماعات اللاسلكية', '${JSON.stringify([productIds[5]]).replace(/'/g, "''")}', 35, 'sar', 200, 30, 'AudioTech Parts Inc.', true, '{"sizes":["S","M","L"]}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 3 spare parts")
  } catch (err: any) {
    console.log(`  ✗ spare_part error: ${err.message}`)
  }

  // ============================================================
  // 25. LOYALTY_PROGRAM (2 rows)
  // ============================================================
  console.log("Step 25: Seeding loyalty_program...")
  try {
    await dataSource.raw(`
      INSERT INTO loyalty_program (id, tenant_id, name, description, points_per_currency, currency_code, tier_config, is_active, metadata, created_at, updated_at)
      VALUES
        ('seed6_loy_01', '${tenantId}', 'برنامج نقاط المتجر', 'اكسب نقاط مع كل عملية شراء واستبدلها بخصومات وهدايا حصرية', 1, 'sar', '${JSON.stringify({ tiers: [{ name: "برونزي", min_points: 0, multiplier: 1 }, { name: "فضي", min_points: 500, multiplier: 1.5 }, { name: "ذهبي", min_points: 2000, multiplier: 2 }, { name: "بلاتيني", min_points: 5000, multiplier: 3 }] }).replace(/'/g, "''")}', true, '{"welcome_bonus":50}', '${now}', '${now}'),
        ('seed6_loy_02', '${tenantId}', 'برنامج ولاء VIP', 'برنامج خاص لعملاء VIP مع مزايا حصرية ونقاط مضاعفة', 2, 'sar', '${JSON.stringify({ tiers: [{ name: "VIP فضي", min_points: 0, multiplier: 2 }, { name: "VIP ذهبي", min_points: 3000, multiplier: 3 }, { name: "VIP ماسي", min_points: 10000, multiplier: 5 }] }).replace(/'/g, "''")}', true, '{"invitation_only":true}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 2 loyalty programs")
  } catch (err: any) {
    console.log(`  ✗ loyalty_program error: ${err.message}`)
  }

  // ============================================================
  // 26. LOYALTY_POINTS_LEDGER (4 rows)
  // ============================================================
  console.log("Step 26: Seeding loyalty_points_ledger...")
  try {
    await dataSource.raw(`
      INSERT INTO loyalty_points_ledger (id, tenant_id, customer_id, program_id, transaction_type, points, balance_after, reference_type, reference_id, description, expires_at, metadata, created_at, updated_at)
      VALUES
        ('seed6_lpl_01', '${tenantId}', '${customerIds[0]}', 'seed6_loy_01', 'earn', 114, 114, 'order', 'order_seed6_001', 'نقاط مكتسبة من طلب #001', '${future365d}', '{"order_total":114}', '${now}', '${now}'),
        ('seed6_lpl_02', '${tenantId}', '${customerIds[0]}', 'seed6_loy_01', 'earn', 296, 410, 'order', 'order_seed6_003', 'نقاط مكتسبة من طلب #003', '${future365d}', '{"order_total":296}', '${now}', '${now}'),
        ('seed6_lpl_03', '${tenantId}', '${customerIds[0]}', 'seed6_loy_01', 'redeem', -100, 310, 'discount', 'disc_seed6_01', 'استبدال نقاط بخصم 100 ريال', null, '{"discount_value":100}', '${now}', '${now}'),
        ('seed6_lpl_04', '${tenantId}', '${customerIds[1]}', 'seed6_loy_01', 'bonus', 50, 50, 'welcome', null, 'نقاط ترحيبية للعميل الجديد', '${future180d}', '{"bonus_type":"welcome"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 4 loyalty points ledger entries")
  } catch (err: any) {
    console.log(`  ✗ loyalty_points_ledger error: ${err.message}`)
  }

  // ============================================================
  // 27. WISHLIST (2 rows)
  // ============================================================
  console.log("Step 27: Seeding wishlist...")
  try {
    await dataSource.raw(`
      INSERT INTO wishlist (id, tenant_id, customer_id, name, is_public, is_default, metadata, created_at, updated_at)
      VALUES
        ('seed6_wl_01', '${tenantId}', '${customerIds[0]}', 'قائمة أمنياتي', false, true, '{"auto_notify_price_drop":true}', '${now}', '${now}'),
        ('seed6_wl_02', '${tenantId}', '${customerIds[1]}', 'هدايا العيد', true, false, '{"occasion":"eid","share_code":"EID2026"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 2 wishlists")
  } catch (err: any) {
    console.log(`  ✗ wishlist error: ${err.message}`)
  }

  // ============================================================
  // 28. WISHLIST_ITEM (4 rows)
  // ============================================================
  console.log("Step 28: Seeding wishlist_item...")
  try {
    await dataSource.raw(`
      INSERT INTO wishlist_item (id, wishlist_id, product_id, variant_id, added_price, notes, priority, metadata, created_at, updated_at)
      VALUES
        ('seed6_wi_01', 'seed6_wl_01', '${productIds[1]}', null, 149, 'أريد اللون الأسود مقاس XL', 1, '{"color":"black","size":"XL"}', '${now}', '${now}'),
        ('seed6_wi_02', 'seed6_wl_01', '${productIds[5]}', null, 249, 'انتظار تخفيض السعر', 2, '{"target_price":199}', '${now}', '${now}'),
        ('seed6_wi_03', 'seed6_wl_02', '${productIds[2]}', null, 39, 'هدية لأمي', 1, '{"gift_for":"mother"}', '${now}', '${now}'),
        ('seed6_wi_04', 'seed6_wl_02', '${productIds[4]}', null, 89, 'هدية لأبي', 2, '{"gift_for":"father"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 4 wishlist items")
  } catch (err: any) {
    console.log(`  ✗ wishlist_item error: ${err.message}`)
  }

  // ============================================================
  // 29. REWARD (3 rows)
  // ============================================================
  console.log("Step 29: Seeding reward...")
  try {
    await dataSource.raw(`
      INSERT INTO reward (id, tenant_id, name, description, reward_type, points_required, value, currency_code, available_quantity, redeemed_count, min_tier_level, is_active, valid_from, valid_until, image_url, metadata, created_at, updated_at)
      VALUES
        ('seed6_rwd_01', '${tenantId}', 'خصم 50 ريال', 'احصل على خصم 50 ريال على طلبك القادم', 'discount', 200, 50, 'sar', 100, 15, 0, true, '${past30d}', '${future180d}', 'https://images.unsplash.com/photo-1585399776694-d9b5b55fac6c?w=400', '{"min_order":150}', '${now}', '${now}'),
        ('seed6_rwd_02', '${tenantId}', 'شحن مجاني', 'شحن مجاني على أي طلب بدون حد أدنى', 'service', 150, 25, 'sar', 200, 45, 1, true, '${past30d}', '${future180d}', 'https://images.unsplash.com/photo-1516534775068-bb57d19bec1e?w=400', '{"applies_to":"all_orders"}', '${now}', '${now}'),
        ('seed6_rwd_03', '${tenantId}', 'ترقية عضوية VIP', 'ترقية فورية إلى عضوية VIP لمدة 3 أشهر', 'upgrade', 500, null, 'sar', 50, 5, 2, true, '${past30d}', '${future365d}', 'https://images.unsplash.com/photo-1549887534-7929be5b4df5?w=400', '{"vip_duration_months":3}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 3 rewards")
  } catch (err: any) {
    console.log(`  ✗ reward error: ${err.message}`)
  }

  // ============================================================
  // 30. DONATION (3 rows)
  // ============================================================
  console.log("Step 30: Seeding donation...")
  try {
    await dataSource.raw(`
      INSERT INTO donation (id, tenant_id, campaign_id, charity_id, donor_id, amount, currency_code, donation_type, status, is_anonymous, donor_name, donor_email, message, payment_reference, tax_receipt_id, recurring_id, completed_at, metadata, created_at, updated_at)
      VALUES
        ('seed6_don_01', '${tenantId}', '${donationCampaignIds[0]}', '${charityOrgIds[0]}', '${customerIds[0]}', 500, 'sar', 'one_time', 'completed', false, 'محمد الأحمدي', 'mohammed@example.com', 'بارك الله في جهودكم', 'PAY-2026-001', 'TR-001', null, '${past7d}', '{"source":"website"}', '${now}', '${now}'),
        ('seed6_don_02', '${tenantId}', '${donationCampaignIds[0]}', '${charityOrgIds[0]}', '${customerIds[1]}', 100, 'sar', 'monthly', 'completed', false, 'فاطمة القحطاني', 'fatima@example.com', 'صدقة جارية', 'PAY-2026-002', 'TR-002', 'rec_seed6_01', '${past14d}', '{"source":"app","recurring":true}', '${now}', '${now}'),
        ('seed6_don_03', '${tenantId}', '${donationCampaignIds[1]}', '${charityOrgIds[1]}', null, 1000, 'sar', 'one_time', 'completed', true, null, null, null, 'PAY-2026-003', null, null, '${past30d}', '{"source":"anonymous"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 3 donations")
  } catch (err: any) {
    console.log(`  ✗ donation error: ${err.message}`)
  }

  // ============================================================
  // 31. IMPACT_REPORT (2 rows)
  // ============================================================
  console.log("Step 31: Seeding impact_report...")
  try {
    await dataSource.raw(`
      INSERT INTO impact_report (id, tenant_id, charity_id, campaign_id, title, content, report_period_start, report_period_end, metrics, images, is_published, published_at, metadata, created_at, updated_at)
      VALUES
        ('seed6_ir_01', '${tenantId}', '${charityOrgIds[0]}', '${donationCampaignIds[0]}', 'تقرير أثر حملة كفالة الأيتام - الربع الأول 2026', 'تم كفالة 150 يتيماً خلال الربع الأول من عام 2026 بفضل تبرعاتكم السخية. شملت الكفالة توفير المستلزمات الدراسية والملابس والمواد الغذائية الشهرية.', '${past90d}', '${past30d}', '${JSON.stringify({ orphans_sponsored: 150, total_donations: 75000, donors_count: 320, meals_provided: 4500 }).replace(/'/g, "''")}', '["https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800"]', true, '${past7d}', '{"quarter":"Q1_2026"}', '${now}', '${now}'),
        ('seed6_ir_02', '${tenantId}', '${charityOrgIds[1]}', '${donationCampaignIds[1]}', 'تقرير مشروع بناء المدارس - فبراير 2026', 'تم الانتهاء من بناء مدرستين في المناطق النائية وتجهيزهما بالكامل. استفاد من المشروع أكثر من 400 طالب وطالبة.', '${past60d}', '${past30d}', '${JSON.stringify({ schools_built: 2, students_benefited: 400, classrooms: 16, teachers_hired: 12 }).replace(/'/g, "''")}', '["https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800"]', true, '${past14d}', '{"project":"school_building"}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 2 impact reports")
  } catch (err: any) {
    console.log(`  ✗ impact_report error: ${err.message}`)
  }

  // ============================================================
  // 32. CERTIFICATE (2 rows)
  // ============================================================
  console.log("Step 32: Seeding certificate...")
  try {
    await dataSource.raw(`
      INSERT INTO certificate (id, tenant_id, enrollment_id, course_id, student_id, certificate_number, title, issued_at, expires_at, credential_url, verification_code, skills, metadata, created_at, updated_at)
      VALUES
        ('seed6_cert_01', '${tenantId}', 'enr_seed6_01', 'course_seed6_01', '${customerIds[0]}', 'CERT-2026-SA-00451', 'شهادة إتمام دورة تطوير تطبيقات الويب', '${past7d}', null, 'https://verify.example.sa/cert/CERT-2026-SA-00451', 'VER-A1B2C3D4', '${JSON.stringify(["React", "Node.js", "TypeScript", "PostgreSQL"]).replace(/'/g, "''")}', '{"grade":"excellent","score":95}', '${now}', '${now}'),
        ('seed6_cert_02', '${tenantId}', 'enr_seed6_02', 'course_seed6_02', '${customerIds[1]}', 'CERT-2026-SA-00452', 'شهادة إتمام دورة التسويق الرقمي', '${past14d}', '${future365d}', 'https://verify.example.sa/cert/CERT-2026-SA-00452', 'VER-E5F6G7H8', '${JSON.stringify(["SEO", "Google Ads", "Social Media Marketing", "Analytics"]).replace(/'/g, "''")}', '{"grade":"very_good","score":88}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 2 certificates")
  } catch (err: any) {
    console.log(`  ✗ certificate error: ${err.message}`)
  }

  // ============================================================
  // 33. TICKET (4 rows)
  // ============================================================
  console.log("Step 33: Seeding ticket...")
  try {
    await dataSource.raw(`
      INSERT INTO ticket (id, tenant_id, event_id, ticket_type_id, order_id, customer_id, attendee_name, attendee_email, barcode, qr_data, status, seat_info, checked_in_at, transferred_to, transferred_at, metadata, created_at, updated_at)
      VALUES
        ('seed6_tkt_01', '${tenantId}', '${eventIds[0]}', '${ticketTypeIds[0]}', null, '${customerIds[0]}', 'محمد الأحمدي', 'mohammed@example.com', 'TKT-2026-00001-A', 'https://tickets.example.sa/qr/TKT-2026-00001-A', 'valid', '${JSON.stringify({ section: "VIP", row: "A", seat: "5" }).replace(/'/g, "''")}', null, null, null, '{"purchased_at":"${past7d}"}', '${now}', '${now}'),
        ('seed6_tkt_02', '${tenantId}', '${eventIds[0]}', '${ticketTypeIds[0]}', null, '${customerIds[0]}', 'سارة الأحمدي', 'sara@example.com', 'TKT-2026-00002-A', 'https://tickets.example.sa/qr/TKT-2026-00002-A', 'valid', '${JSON.stringify({ section: "VIP", row: "A", seat: "6" }).replace(/'/g, "''")}', null, null, null, '{"purchased_at":"${past7d}","companion_ticket":true}', '${now}', '${now}'),
        ('seed6_tkt_03', '${tenantId}', '${eventIds[1]}', '${ticketTypeIds[1]}', null, '${customerIds[1]}', 'فاطمة القحطاني', 'fatima@example.com', 'TKT-2026-00003-B', 'https://tickets.example.sa/qr/TKT-2026-00003-B', 'valid', '${JSON.stringify({ section: "عادي", row: "D", seat: "12" }).replace(/'/g, "''")}', null, null, null, '{"purchased_at":"${past14d}"}', '${now}', '${now}'),
        ('seed6_tkt_04', '${tenantId}', '${eventIds[1]}', '${ticketTypeIds[1]}', null, '${customerIds[2]}', 'أحمد العمري', 'ahmed@example.com', 'TKT-2026-00004-B', 'https://tickets.example.sa/qr/TKT-2026-00004-B', 'used', '${JSON.stringify({ section: "عادي", row: "E", seat: "8" }).replace(/'/g, "''")}', '${past7d}', null, null, '{"purchased_at":"${past30d}","checked_in":true}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 4 tickets")
  } catch (err: any) {
    console.log(`  ✗ ticket error: ${err.message}`)
  }

  // ============================================================
  // 34. SEAT_MAP (2 rows)
  // ============================================================
  console.log("Step 34: Seeding seat_map...")
  try {
    await dataSource.raw(`
      INSERT INTO seat_map (id, tenant_id, venue_id, event_id, name, layout, total_seats, metadata, created_at, updated_at)
      VALUES
        ('seed6_sm_01', '${tenantId}', '${venueIds[0]}', '${eventIds[0]}', 'خريطة مقاعد القاعة الرئيسية', '${JSON.stringify({ sections: [{ name: "VIP", rows: 5, seats_per_row: 10, price_tier: "premium" }, { name: "عادي", rows: 15, seats_per_row: 20, price_tier: "standard" }, { name: "بلكونة", rows: 5, seats_per_row: 15, price_tier: "economy" }] }).replace(/'/g, "''")}', 425, '{"version":1,"last_updated":"${now}"}', '${now}', '${now}'),
        ('seed6_sm_02', '${tenantId}', '${venueIds[1]}', '${eventIds[1]}', 'خريطة مقاعد المسرح المفتوح', '${JSON.stringify({ sections: [{ name: "أمامي", rows: 8, seats_per_row: 12, price_tier: "premium" }, { name: "خلفي", rows: 10, seats_per_row: 15, price_tier: "standard" }] }).replace(/'/g, "''")}', 246, '{"version":1,"last_updated":"${now}","outdoor":true}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  ✓ Created 2 seat maps")
  } catch (err: any) {
    console.log(`  ✗ seat_map error: ${err.message}`)
  }

  console.log("\n========================================")
  console.log("Seed Batch 6 Complete!")
  console.log("========================================")
}
