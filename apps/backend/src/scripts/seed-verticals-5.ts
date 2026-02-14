// @ts-nocheck
import { ExecArgs } from "@medusajs/framework/types"

export default async function seedVerticals5({ container }: ExecArgs) {
  console.log("========================================")
  console.log("Seeding Vertical Modules - Batch 5")
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
  const customerIds = {
    mohammed: "cus_01KGZ2JS53BEYQAQ28YYZEMPKC",
    fatima: "cus_01KGZ2JS5P4S10CEF14VAYEZZ7",
    ahmed: "cus_01KGZ2JS6ET997Q1HXY8BBNQ0F",
  }
  const userIds = [
    "user_01KGX7H20X40WWRDJE1GHVS8J8",
    "user_01KGZ2E9HD9KV8SX8G2416HT2S",
  ]

  const trainerProfileIds = ["01KH0ZQ9B7BKMYSADDFDW9DVE6", "01KH0ZQ9B8MS0KX73FSTEFNT4X"]
  const gymMembershipId = "01KH0ZQ9BNYHQFNSMHNY76NV7Y"
  const classScheduleIds = ["01KH0ZQ9AS7J3Q44NC2WXRCC5S", "01KH0ZQ9AWRNT53FDJ85YH2AME"]
  const gigListingIds = ["01KH0ZQ9A26M89JRBTF9R7VKCB", "01KH0ZQ9A4ZJNKHKPZ46NSMR0J", "01KH0ZQ9A4V8XQXC2H2YYHX4GV"]
  const freshProductIds = ["01KH0ZR1ANQEFCVK6Z876GJCYV", "01KH0ZR1AVCHJ1XEWJFTG53A99", "01KH0ZR1B0Q13PESNM85SRM12B"]
  const practitionerIds = ["01KH0ZPJQJ396WAVHXHW6B4GPE", "01KH0ZPJQQGB7X1E9VWQM0JC5Q"]
  const appointmentIds = ["appt_01", "appt_02"]
  const pharmacyProductIds = ["01KH0ZPJR2TPF7EFBCAJ591ZHJ", "01KH0ZPJR73G6DSQFYN2Y1SWF8", "01KH0ZPJR97VTZH15Z0988XMAZ"]
  const attorneyProfileIds = ["01KH0ZQ9CD62S8XBSD3M083VXD", "01KH0ZQ9CEVW7PJ7N8F94ZH98R"]
  const legalCaseIds = ["case_01", "case_02"]
  const membershipTierIds = ["01KH0ZR1CFRWBTBJZEYK5CDJ22", "01KH0ZR1CCQ108AXA2FS1VGAXP", "01KH0ZR1CGJN2B6XV1JJWYTT94"]
  const parkingZoneIds = ["01KH0ZR14M9F1KWHZR4Z5P2RTM", "01KH0ZR14RCXB9578E9JQWHGHH", "01KH0ZR14TE46Q2BV482RKY2RS"]
  const petProfileIds = ["01KH0ZR16Y2Z0DQFC9CH35GTYJ", "01KH0ZR174MVV3W098TE4RPNWJ"]
  const propertyListingIds = ["01KH0ZPJWHDE7CDMNQ2ZC666M6", "01KH0ZPJWNPZV5XW9ZF9V30GE5", "01KH0ZPJWPCWKYQC1342HRSHB7"]

  const now = new Date().toISOString()
  const future1 = new Date(Date.now() + 30 * 86400000).toISOString()
  const future2 = new Date(Date.now() + 60 * 86400000).toISOString()
  const future3 = new Date(Date.now() + 90 * 86400000).toISOString()
  const past1 = new Date(Date.now() - 7 * 86400000).toISOString()
  const past2 = new Date(Date.now() - 14 * 86400000).toISOString()
  const past3 = new Date(Date.now() - 30 * 86400000).toISOString()
  const past4 = new Date(Date.now() - 60 * 86400000).toISOString()

  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0]
  const dayAfter = new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0]

  const rawNum = (val: number) => JSON.stringify({ value: String(val), precision: 20 })
  const j = (obj: any) => JSON.stringify(obj).replace(/'/g, "''")

  // ============================================================
  // 1. CHECK_IN (3 rows)
  // check_in_method: scan, manual, online
  // ============================================================
  console.log("Step 1/21: Seeding check_in...")
  try {
    await dataSource.raw(`
      INSERT INTO check_in (id, tenant_id, event_id, ticket_id, checked_in_by, checked_in_at, check_in_method, device_id, notes, metadata, created_at, updated_at)
      VALUES
        ('seed5_checkin_01', '${tenantId}', '${gymMembershipId}', 'ticket_gym_01', '${userIds[0]}', '${past1}', 'scan', 'device_riyadh_01', 'Morning gym session check-in', '${j({ facility: "Kingdom Tower Gym", city: "Riyadh" })}', '${now}', '${now}'),
        ('seed5_checkin_02', '${tenantId}', '${gymMembershipId}', 'ticket_gym_02', '${userIds[0]}', '${past2}', 'manual', 'device_riyadh_02', 'Evening workout check-in', '${j({ facility: "Kingdom Tower Gym", city: "Riyadh" })}', '${now}', '${now}'),
        ('seed5_checkin_03', '${tenantId}', '${gymMembershipId}', 'ticket_gym_03', '${userIds[1]}', '${past3}', 'online', 'device_jeddah_01', 'Jeddah branch check-in', '${j({ facility: "Red Sea Fitness Center", city: "Jeddah" })}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  Created 3 check_in rows")
  } catch (err: any) {
    console.log(`  check_in error: ${err.detail || err.constraint || err.message?.substring(0, 200)}`)
  }

  // ============================================================
  // 2. WELLNESS_PLAN (2 rows)
  // plan_type: fitness, nutrition, weight_loss, muscle_gain, flexibility, rehabilitation, holistic
  // status: active, completed, paused, cancelled
  // ============================================================
  console.log("Step 2/21: Seeding wellness_plan...")
  try {
    await dataSource.raw(`
      INSERT INTO wellness_plan (id, tenant_id, customer_id, trainer_id, title, plan_type, status, goals, duration_weeks, workout_schedule, nutrition_guidelines, progress_notes, start_date, end_date, metadata, created_at, updated_at)
      VALUES
        ('seed5_wellness_01', '${tenantId}', '${customerIds.mohammed}', '${trainerProfileIds[0]}',
          'Advanced Muscle Building Program', 'muscle_gain', 'active',
          '${j(["Gain 5kg muscle mass", "Improve lifting strength", "Reduce body fat to 12%"])}',
          12,
          '${j({ sunday: ["chest", "triceps"], monday: ["back", "biceps"], tuesday: "rest", wednesday: ["legs", "shoulders"], thursday: ["full_body"], friday: "rest", saturday: ["cardio", "abs"] })}',
          '${j({ daily_calories: 2800, protein_grams: 180, carbs_grams: 300, fat_grams: 80, meals_per_day: 5, supplements: ["whey protein", "creatine", "multivitamin"] })}',
          '${j([{ date: past2, note: "Excellent chest performance, weight increase 2.5kg" }])}',
          '${past3}', '${future2}',
          '${j({ level: "advanced", city: "Riyadh" })}',
          '${now}', '${now}'),
        ('seed5_wellness_02', '${tenantId}', '${customerIds.fatima}', '${trainerProfileIds[1]}',
          'Fitness and Weight Loss Plan', 'weight_loss', 'active',
          '${j(["Lose 8kg", "Improve cardiovascular fitness", "Increase flexibility"])}',
          8,
          '${j({ sunday: ["cardio", "yoga"], monday: ["hiit"], tuesday: ["pilates"], wednesday: "rest", thursday: ["cardio", "strength"], friday: "rest", saturday: ["yoga", "stretching"] })}',
          '${j({ daily_calories: 1800, protein_grams: 100, carbs_grams: 180, fat_grams: 60, meals_per_day: 4, supplements: ["omega-3", "vitamin D"] })}',
          '${j([{ date: past1, note: "Great progress, lost 2kg in first week" }])}',
          '${past2}', '${future1}',
          '${j({ level: "intermediate", city: "Jeddah" })}',
          '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  Created 2 wellness_plan rows")
  } catch (err: any) {
    console.log(`  wellness_plan error: ${err.detail || err.constraint || err.message?.substring(0, 200)}`)
  }

  // ============================================================
  // 3. CLASS_BOOKING (skip if exists)
  // status: booked, checked_in, completed, cancelled, no_show
  // ============================================================
  console.log("Step 3/21: Checking class_booking...")
  try {
    const result = await dataSource.raw(`SELECT COUNT(*) as cnt FROM class_booking`)
    const cnt = parseInt(result.rows[0].cnt)
    if (cnt > 0) {
      console.log(`  class_booking already has ${cnt} rows, skipping`)
    } else {
      await dataSource.raw(`
        INSERT INTO class_booking (id, tenant_id, schedule_id, customer_id, status, booked_at, checked_in_at, metadata, created_at, updated_at)
        VALUES
          ('seed5_classbk_01', '${tenantId}', '${classScheduleIds[0]}', '${customerIds.mohammed}', 'booked', '${past1}', NULL, '${j({ source: "app" })}', '${now}', '${now}'),
          ('seed5_classbk_02', '${tenantId}', '${classScheduleIds[1]}', '${customerIds.fatima}', 'completed', '${past2}', '${past1}', '${j({ source: "web" })}', '${now}', '${now}'),
          ('seed5_classbk_03', '${tenantId}', '${classScheduleIds[0]}', '${customerIds.ahmed}', 'booked', '${past1}', NULL, '${j({ source: "app" })}', '${now}', '${now}')
        ON CONFLICT (id) DO NOTHING
      `)
      console.log("  Created 3 class_booking rows")
    }
  } catch (err: any) {
    console.log(`  class_booking error: ${err.detail || err.constraint || err.message?.substring(0, 200)}`)
  }

  // ============================================================
  // 4. FREELANCE_CONTRACT (3 rows)
  // contract_type: fixed, hourly, retainer
  // status: draft, active, paused, completed, cancelled, disputed
  // ============================================================
  console.log("Step 4/21: Seeding freelance_contract...")
  try {
    await dataSource.raw(`
      INSERT INTO freelance_contract (id, tenant_id, client_id, freelancer_id, gig_id, title, description, contract_type, total_amount, currency_code, status, starts_at, ends_at, terms, metadata, raw_total_amount, created_at, updated_at)
      VALUES
        ('seed5_fcontract_01', '${tenantId}', '${customerIds.mohammed}', 'freelancer_design_01', '${gigListingIds[0]}',
          'Real Estate Website Development', 'Full responsive website with admin dashboard and property management system',
          'fixed', 8500, 'sar', 'active', '${past3}', '${future1}',
          '${j({ milestones: [{ name: "Design", amount: 2500 }, { name: "Development", amount: 4000 }, { name: "Testing", amount: 2000 }], payment_terms: "milestone_based" })}',
          '${j({ project_type: "web_development" })}',
          '${rawNum(8500)}', '${now}', '${now}'),
        ('seed5_fcontract_02', '${tenantId}', '${customerIds.fatima}', 'freelancer_translation_01', '${gigListingIds[1]}',
          'Legal Contract Translation AR-EN', 'Translation of 50 pages of legal contracts and commercial documents',
          'fixed', 3750, 'sar', 'completed', '${past4}', '${past1}',
          '${j({ deliverables: "50 translated and certified pages", revision_rounds: 2, payment_terms: "50_50" })}',
          '${j({ project_type: "legal_translation" })}',
          '${rawNum(3750)}', '${now}', '${now}'),
        ('seed5_fcontract_03', '${tenantId}', '${customerIds.ahmed}', 'freelancer_photo_01', '${gigListingIds[2]}',
          'E-commerce Product Photography', 'Professional photography of 100 products with editing for online store',
          'fixed', 5000, 'sar', 'active', '${past2}', '${future1}',
          '${j({ items_count: 100, includes_editing: true, delivery_format: "JPEG + RAW", payment_terms: "milestone_based" })}',
          '${j({ project_type: "product_photography" })}',
          '${rawNum(5000)}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  Created 3 freelance_contract rows")
  } catch (err: any) {
    console.log(`  freelance_contract error: ${err.detail || err.constraint || err.message?.substring(0, 200)}`)
  }

  // ============================================================
  // 5. FREELANCE_DISPUTE (2 rows)
  // status: filed, mediation, escalated, resolved, closed
  // ============================================================
  console.log("Step 5/21: Seeding freelance_dispute...")
  try {
    await dataSource.raw(`
      INSERT INTO freelance_dispute (id, tenant_id, contract_id, filed_by, filed_against, reason, description, evidence_urls, status, resolution, resolved_by, resolved_at, refund_amount, metadata, raw_refund_amount, created_at, updated_at)
      VALUES
        ('seed5_fdispute_01', '${tenantId}', 'seed5_fcontract_02', '${customerIds.fatima}', 'freelancer_translation_01',
          'quality', 'Translation quality does not meet agreed standards with multiple linguistic errors in legal documents',
          '${j(["https://cdn.dakkah.sa/evidence/translation_errors.pdf"])}',
          'resolved', '20 percent deduction and retranslation of affected pages', '${userIds[0]}', '${past1}', 750,
          '${j({ dispute_type: "quality", category: "translation" })}',
          '${rawNum(750)}', '${now}', '${now}'),
        ('seed5_fdispute_02', '${tenantId}', 'seed5_fcontract_03', '${customerIds.ahmed}', 'freelancer_photo_01',
          'non_delivery', 'First batch delivery delayed by two weeks past the agreed deadline',
          '${j(["https://cdn.dakkah.sa/evidence/timeline_proof.pdf"])}',
          'filed', NULL, NULL, NULL, NULL,
          '${j({ dispute_type: "delivery_delay", category: "photography" })}',
          NULL, '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  Created 2 freelance_dispute rows")
  } catch (err: any) {
    console.log(`  freelance_dispute error: ${err.detail || err.constraint || err.message?.substring(0, 200)}`)
  }

  // ============================================================
  // 6. CITIZEN_PROFILE (3 rows)
  // ============================================================
  console.log("Step 6/21: Seeding citizen_profile...")
  try {
    await dataSource.raw(`
      INSERT INTO citizen_profile (id, tenant_id, customer_id, national_id, full_name, date_of_birth, address, phone, email, preferred_language, registered_services, total_requests, metadata, created_at, updated_at)
      VALUES
        ('seed5_citizen_01', '${tenantId}', '${customerIds.mohammed}', '1087654321', 'Mohammed Al-Dosari', '1990-03-15',
          '${j({ street: "King Fahd Road", district: "Al Olaya", city: "Riyadh", postal_code: "11564", country: "SA" })}',
          '+966501234567', 'mohammed@dakkah.sa', 'ar',
          '${j(["infrastructure", "licensing", "permits"])}', 5,
          '${j({ verified: true, absher_linked: true })}', '${now}', '${now}'),
        ('seed5_citizen_02', '${tenantId}', '${customerIds.fatima}', '1098765432', 'Fatima Al-Qahtani', '1995-07-22',
          '${j({ street: "Tahlia Street", district: "Sulaimaniyah", city: "Riyadh", postal_code: "12241", country: "SA" })}',
          '+966509876543', 'fatima@dakkah.sa', 'ar',
          '${j(["sanitation", "permits"])}', 3,
          '${j({ verified: true, absher_linked: true })}', '${now}', '${now}'),
        ('seed5_citizen_03', '${tenantId}', '${customerIds.ahmed}', '1076543210', 'Ahmed Al-Otaibi', '1988-11-08',
          '${j({ street: "Prince Sultan Road", district: "Al Rawdah", city: "Jeddah", postal_code: "23433", country: "SA" })}',
          '+966551234567', 'ahmed@dakkah.sa', 'ar',
          '${j(["infrastructure", "traffic"])}', 7,
          '${j({ verified: true, absher_linked: false })}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  Created 3 citizen_profile rows")
  } catch (err: any) {
    console.log(`  citizen_profile error: ${err.detail || err.constraint || err.message?.substring(0, 200)}`)
  }

  // ============================================================
  // 7. MUNICIPAL_LICENSE (3 rows)
  // license_type: business, trade, professional, vehicle, pet, firearm, alcohol, food_handling
  // status: active, expired, suspended, revoked
  // ============================================================
  console.log("Step 7/21: Seeding municipal_license...")
  try {
    await dataSource.raw(`
      INSERT INTO municipal_license (id, tenant_id, holder_id, license_type, license_number, status, issued_at, expires_at, renewal_date, fee, currency_code, conditions, issuing_authority, metadata, raw_fee, created_at, updated_at)
      VALUES
        ('seed5_mlicense_01', '${tenantId}', 'seed5_citizen_01', 'trade', 'ML-TRADE-2026-0001', 'active', '${past3}', '${future3}', '${future2}', 5000, 'sar',
          '${j(["Comply with safety standards", "Annual renewal mandatory"])}',
          'Riyadh Municipality',
          '${j({ business_name: "Al-Dosari Trading Co", activity: "General trade" })}',
          '${rawNum(5000)}', '${now}', '${now}'),
        ('seed5_mlicense_02', '${tenantId}', 'seed5_citizen_02', 'food_handling', 'ML-FOOD-2026-0001', 'active', '${past2}', '${future2}', '${future1}', 3500, 'sar',
          '${j(["Valid health certificate", "Quarterly inspection", "Comply with SFDA standards"])}',
          'Riyadh Municipality',
          '${j({ business_name: "Al-Qahtani Restaurant", activity: "Food services" })}',
          '${rawNum(3500)}', '${now}', '${now}'),
        ('seed5_mlicense_03', '${tenantId}', 'seed5_citizen_03', 'business', 'ML-CONST-2026-0001', 'active', '${now}', '${future3}', NULL, 8000, 'sar',
          '${j(["Valid building permit", "Risk insurance", "Certified supervising engineer"])}',
          'Jeddah Municipality',
          '${j({ business_name: "Al-Otaibi Contracting", activity: "Construction" })}',
          '${rawNum(8000)}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  Created 3 municipal_license rows")
  } catch (err: any) {
    console.log(`  municipal_license error: ${err.detail || err.constraint || err.message?.substring(0, 200)}`)
  }

  // ============================================================
  // 8. FINE (2 rows)
  // fine_type: traffic, parking, building_code, environmental, noise, other
  // status: issued, contested, paid, overdue, waived
  // ============================================================
  console.log("Step 8/21: Seeding fine...")
  try {
    await dataSource.raw(`
      INSERT INTO fine (id, tenant_id, citizen_id, fine_type, fine_number, description, amount, currency_code, status, issued_at, due_date, paid_at, payment_reference, location, evidence, metadata, raw_amount, created_at, updated_at)
      VALUES
        ('seed5_fine_01', '${tenantId}', 'seed5_citizen_03', 'traffic', 'FINE-TRF-2026-0001',
          'Speeding violation on King Fahd Road - 140 km/h in 120 km/h zone',
          500, 'sar', 'paid', '${past2}', '${past1}', '${past1}', 'PAY-SADAD-2026-001',
          '${j({ lat: 24.7136, lng: 46.6753, address: "King Fahd Road, Riyadh" })}',
          '${j({ camera_id: "CAM-KFR-042", speed_recorded: 140, speed_limit: 120 })}',
          '${j({ violation_code: "TRF-001" })}',
          '${rawNum(500)}', '${now}', '${now}'),
        ('seed5_fine_02', '${tenantId}', 'seed5_citizen_01', 'building_code', 'FINE-MUN-2026-0001',
          'Non-compliance with cleanliness regulations - unauthorized construction waste',
          2000, 'sar', 'issued', '${past1}', '${future1}', NULL, NULL,
          '${j({ lat: 24.6938, lng: 46.685, address: "Tahlia Street, Riyadh" })}',
          '${j({ inspector_id: "INS-RYD-015", photos: ["https://cdn.dakkah.sa/evidence/violation_01.jpg"] })}',
          '${j({ violation_code: "MUN-003" })}',
          '${rawNum(2000)}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  Created 2 fine rows")
  } catch (err: any) {
    console.log(`  fine error: ${err.detail || err.constraint || err.message?.substring(0, 200)}`)
  }

  // ============================================================
  // 9. DELIVERY_SLOT (4 rows)
  // slot_type: standard, express, scheduled
  // ============================================================
  console.log("Step 9/21: Seeding delivery_slot...")
  try {
    await dataSource.raw(`
      INSERT INTO delivery_slot (id, tenant_id, slot_date, start_time, end_time, slot_type, max_orders, current_orders, delivery_fee, currency_code, is_available, cutoff_time, metadata, raw_delivery_fee, created_at, updated_at)
      VALUES
        ('seed5_dslot_01', '${tenantId}', '${tomorrow}', '09:00', '12:00', 'standard', 20, 5, 15, 'sar', true, '08:00', '${j({ zone: "Riyadh North", city: "Riyadh" })}', '${rawNum(15)}', '${now}', '${now}'),
        ('seed5_dslot_02', '${tenantId}', '${tomorrow}', '14:00', '17:00', 'standard', 25, 10, 12, 'sar', true, '13:00', '${j({ zone: "Riyadh South", city: "Riyadh" })}', '${rawNum(12)}', '${now}', '${now}'),
        ('seed5_dslot_03', '${tenantId}', '${tomorrow}', '19:00', '22:00', 'express', 15, 14, 20, 'sar', true, '18:00', '${j({ zone: "Riyadh Central", city: "Riyadh" })}', '${rawNum(20)}', '${now}', '${now}'),
        ('seed5_dslot_04', '${tenantId}', '${dayAfter}', '09:00', '12:00', 'scheduled', 20, 0, 10, 'sar', true, '08:00', '${j({ zone: "Jeddah North", city: "Jeddah" })}', '${rawNum(10)}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  Created 4 delivery_slot rows")
  } catch (err: any) {
    console.log(`  delivery_slot error: ${err.detail || err.constraint || err.message?.substring(0, 200)}`)
  }

  // ============================================================
  // 10. SUBSTITUTION_RULE (2 rows)
  // ============================================================
  console.log("Step 10/21: Seeding substitution_rule...")
  try {
    await dataSource.raw(`
      INSERT INTO substitution_rule (id, tenant_id, original_product_id, substitute_product_id, priority, is_auto_substitute, price_match, max_price_difference_pct, customer_approval_required, is_active, metadata, created_at, updated_at)
      VALUES
        ('seed5_subrule_01', '${tenantId}', '${freshProductIds[0]}', '${freshProductIds[1]}', 1, true, true, 10, false, true, '${j({ reason: "Same category and quality - red apple for green apple" })}', '${now}', '${now}'),
        ('seed5_subrule_02', '${tenantId}', '${freshProductIds[1]}', '${freshProductIds[2]}', 2, false, false, 15, true, true, '${j({ reason: "Similar product different price - requires customer approval" })}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  Created 2 substitution_rule rows")
  } catch (err: any) {
    console.log(`  substitution_rule error: ${err.detail || err.constraint || err.message?.substring(0, 200)}`)
  }

  // ============================================================
  // 11. MEDICAL_RECORD (3 rows)
  // record_type: consultation, diagnosis, procedure, lab_result, imaging, vaccination, allergy, medication
  // access_level: patient, practitioner, specialist, admin
  // ============================================================
  console.log("Step 11/21: Seeding medical_record...")
  try {
    await dataSource.raw(`
      INSERT INTO medical_record (id, tenant_id, patient_id, record_type, practitioner_id, appointment_id, title, description, data, attachments, is_confidential, access_level, recorded_at, metadata, created_at, updated_at)
      VALUES
        ('seed5_medrec_01', '${tenantId}', '${customerIds.mohammed}', 'consultation', '${practitionerIds[0]}', '${appointmentIds[0]}',
          'Routine Cardiac Examination', 'Comprehensive heart and cardiovascular exam - normal results with 6-month follow-up recommended',
          '${j({ blood_pressure: "120/80", heart_rate: 72, ecg: "normal", cholesterol: { total: 190, hdl: 55, ldl: 120 } })}',
          '${j([{ name: "ECG_report.pdf", url: "https://cdn.dakkah.sa/records/ecg_001.pdf" }])}',
          false, 'practitioner', '${past2}',
          '${j({ department: "cardiology", hospital: "King Faisal Specialist Hospital" })}',
          '${now}', '${now}'),
        ('seed5_medrec_02', '${tenantId}', '${customerIds.fatima}', 'lab_result', '${practitionerIds[1]}', '${appointmentIds[1]}',
          'Complete Blood Panel Results', 'Routine blood test results - all values within normal range',
          '${j({ cbc: { wbc: 7.5, rbc: 4.8, hemoglobin: 13.2, platelets: 250 }, blood_sugar: { fasting: 95 }, thyroid: { tsh: 2.1 } })}',
          '${j([{ name: "lab_results.pdf", url: "https://cdn.dakkah.sa/records/lab_001.pdf" }])}',
          false, 'patient', '${past1}',
          '${j({ department: "dermatology", hospital: "Al Habib Hospital" })}',
          '${now}', '${now}'),
        ('seed5_medrec_03', '${tenantId}', '${customerIds.ahmed}', 'diagnosis', '${practitionerIds[0]}', NULL,
          'Hypertension Stage 1 Diagnosis', 'Stage 1 hypertension diagnosis with treatment plan including lifestyle changes and medication',
          '${j({ condition: "hypertension_stage_1", blood_pressure_avg: "145/92", risk_factors: ["family_history", "sedentary_lifestyle"], treatment_plan: "lifestyle_modification_and_medication" })}',
          NULL,
          true, 'specialist', '${past3}',
          '${j({ department: "cardiology", hospital: "King Fahad Hospital" })}',
          '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  Created 3 medical_record rows")
  } catch (err: any) {
    console.log(`  medical_record error: ${err.detail || err.constraint || err.message?.substring(0, 200)}`)
  }

  // ============================================================
  // 12. PRESCRIPTION (2 rows)
  // status: issued, dispensed, partially_dispensed, expired, cancelled
  // ============================================================
  console.log("Step 12/21: Seeding prescription...")
  try {
    await dataSource.raw(`
      INSERT INTO prescription (id, tenant_id, practitioner_id, patient_id, appointment_id, prescription_number, status, medications, diagnosis, notes, issued_at, valid_until, dispensed_at, dispensed_by, pharmacy_id, is_refillable, refill_count, max_refills, metadata, created_at, updated_at)
      VALUES
        ('seed5_rx_01', '${tenantId}', '${practitionerIds[0]}', '${customerIds.ahmed}', NULL, 'RX-2026-0001', 'dispensed',
          '${j([{ name: "Amlodipine", dosage: "5mg", frequency: "Once daily", duration: "3 months" }, { name: "Hydrochlorothiazide", dosage: "12.5mg", frequency: "Once daily morning", duration: "3 months" }])}',
          'Stage 1 Hypertension', 'Monitor blood pressure daily and follow up after one month',
          '${past3}', '${future2}', '${past3}', 'Al Nahdi Pharmacy', '${pharmacyProductIds[0]}',
          true, 1, 3,
          '${j({ priority: "routine", hospital: "King Fahad Hospital" })}',
          '${now}', '${now}'),
        ('seed5_rx_02', '${tenantId}', '${practitionerIds[1]}', '${customerIds.fatima}', '${appointmentIds[1]}', 'RX-2026-0002', 'issued',
          '${j([{ name: "Tretinoin Cream", dosage: "0.025%", frequency: "Once nightly", duration: "6 weeks" }, { name: "Sunscreen SPF50", dosage: "Topical", frequency: "Every morning", duration: "Ongoing" }])}',
          'Mild Acne', 'Avoid direct sun exposure during treatment',
          '${past1}', '${future1}', NULL, NULL, NULL,
          false, 0, 0,
          '${j({ priority: "routine", hospital: "Al Habib Hospital" })}',
          '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  Created 2 prescription rows")
  } catch (err: any) {
    console.log(`  prescription error: ${err.detail || err.constraint || err.message?.substring(0, 200)}`)
  }

  // ============================================================
  // 13. LAB_ORDER (2 rows)
  // status: ordered, sample_collected, processing, results_ready, reviewed, cancelled
  // priority: routine, urgent, stat
  // ============================================================
  console.log("Step 13/21: Seeding lab_order...")
  try {
    await dataSource.raw(`
      INSERT INTO lab_order (id, tenant_id, practitioner_id, patient_id, order_number, tests, status, priority, fasting_required, sample_type, collected_at, results, results_reviewed_by, results_reviewed_at, lab_name, notes, metadata, created_at, updated_at)
      VALUES
        ('seed5_lab_01', '${tenantId}', '${practitionerIds[0]}', '${customerIds.mohammed}', 'LAB-2026-0001',
          '${j([{ name: "Comprehensive Lipid Panel", code: "LIPID_PANEL" }, { name: "Kidney Function", code: "RENAL_FUNC" }, { name: "HbA1c", code: "HBA1C" }])}',
          'reviewed', 'routine', true, 'blood', '${past2}',
          '${j({ lipid_panel: { total_cholesterol: 195, hdl: 52, ldl: 125, triglycerides: 140 }, renal: { creatinine: 0.9, bun: 14, gfr: 95 }, hba1c: 5.4 })}',
          '${practitionerIds[0]}', '${past1}', 'Al Borg Laboratories', 'Normal results, no urgent follow-up needed',
          '${j({ department: "cardiology" })}',
          '${now}', '${now}'),
        ('seed5_lab_02', '${tenantId}', '${practitionerIds[1]}', '${customerIds.fatima}', 'LAB-2026-0002',
          '${j([{ name: "Complete Blood Count", code: "CBC" }, { name: "Thyroid Function", code: "THYROID" }, { name: "Vitamin D", code: "VIT_D" }])}',
          'processing', 'routine', false, 'blood', '${past1}',
          NULL, NULL, NULL, 'Al Mokhtar Laboratories', 'Awaiting results',
          '${j({ department: "dermatology" })}',
          '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  Created 2 lab_order rows")
  } catch (err: any) {
    console.log(`  lab_order error: ${err.detail || err.constraint || err.message?.substring(0, 200)}`)
  }

  // ============================================================
  // 14. LEGAL_CONSULTATION (3 rows)
  // consultation_type: initial, follow_up, strategy, settlement, mediation
  // status: scheduled, in_progress, completed, cancelled, no_show
  // ============================================================
  console.log("Step 14/21: Seeding legal_consultation...")
  try {
    await dataSource.raw(`
      INSERT INTO legal_consultation (id, tenant_id, attorney_id, client_id, case_id, consultation_type, status, scheduled_at, duration_minutes, is_virtual, virtual_link, fee, currency_code, notes, action_items, completed_at, metadata, raw_fee, created_at, updated_at)
      VALUES
        ('seed5_lcons_01', '${tenantId}', '${attorneyProfileIds[0]}', '${customerIds.mohammed}', '${legalCaseIds[0]}',
          'initial', 'completed', '${past2}', 60, false, NULL, 800, 'sar',
          'Initial consultation on commercial real estate dispute - shop lease contract',
          '${j(["Review lease agreement", "Gather supporting documents", "Prepare warning letter"])}',
          '${past2}',
          '${j({ office_location: "Riyadh - Al Olaya", consultation_number: "CONS-2026-001" })}',
          '${rawNum(800)}', '${now}', '${now}'),
        ('seed5_lcons_02', '${tenantId}', '${attorneyProfileIds[1]}', '${customerIds.fatima}', '${legalCaseIds[1]}',
          'follow_up', 'completed', '${past1}', 45, true, 'https://meet.dakkah.sa/legal-cons-002', 600, 'sar',
          'Follow-up on labor case - reviewing case developments and next steps',
          '${j(["Submit claim statement", "Attend conciliation session", "Prepare response brief"])}',
          '${past1}',
          '${j({ consultation_number: "CONS-2026-002" })}',
          '${rawNum(600)}', '${now}', '${now}'),
        ('seed5_lcons_03', '${tenantId}', '${attorneyProfileIds[0]}', '${customerIds.ahmed}', NULL,
          'strategy', 'scheduled', '${future1}', 30, true, 'https://meet.dakkah.sa/legal-cons-003', 500, 'sar',
          NULL, NULL, NULL,
          '${j({ consultation_number: "CONS-2026-003", topic: "Company formation consultation" })}',
          '${rawNum(500)}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  Created 3 legal_consultation rows")
  } catch (err: any) {
    console.log(`  legal_consultation error: ${err.detail || err.constraint || err.message?.substring(0, 200)}`)
  }

  // ============================================================
  // 15. MEMBERSHIP (3 rows)
  // status: active, expired, suspended, cancelled
  // ============================================================
  console.log("Step 15/21: Seeding membership...")
  try {
    await dataSource.raw(`
      INSERT INTO membership (id, tenant_id, customer_id, tier_id, membership_number, status, joined_at, expires_at, renewed_at, total_points, lifetime_points, total_spent, auto_renew, metadata, raw_total_spent, created_at, updated_at)
      VALUES
        ('seed5_member_01', '${tenantId}', '${customerIds.mohammed}', '${membershipTierIds[0]}', 'MEM-2026-0001', 'active', '${past4}', '${future3}', NULL, 2500, 3200, 15000, true, '${j({ referral_code: "MHMD2026", city: "Riyadh" })}', '${rawNum(15000)}', '${now}', '${now}'),
        ('seed5_member_02', '${tenantId}', '${customerIds.fatima}', '${membershipTierIds[1]}', 'MEM-2026-0002', 'active', '${past3}', '${future2}', '${past1}', 1800, 2100, 9500, true, '${j({ referral_code: "FTMA2026", city: "Riyadh" })}', '${rawNum(9500)}', '${now}', '${now}'),
        ('seed5_member_03', '${tenantId}', '${customerIds.ahmed}', '${membershipTierIds[2]}', 'MEM-2026-0003', 'active', '${past4}', '${future3}', NULL, 5200, 8500, 42000, false, '${j({ referral_code: "AHMD2026", city: "Jeddah" })}', '${rawNum(42000)}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  Created 3 membership rows")
  } catch (err: any) {
    console.log(`  membership error: ${err.detail || err.constraint || err.message?.substring(0, 200)}`)
  }

  // ============================================================
  // 16. PARKING_SESSION (3 rows)
  // status: active, completed, expired, cancelled
  // payment_status: pending, paid, failed
  // ============================================================
  console.log("Step 16/21: Seeding parking_session...")
  try {
    await dataSource.raw(`
      INSERT INTO parking_session (id, tenant_id, zone_id, customer_id, vehicle_plate, spot_number, status, started_at, ended_at, duration_minutes, amount, currency_code, payment_status, payment_reference, is_ev_charging, metadata, raw_amount, created_at, updated_at)
      VALUES
        ('seed5_parking_01', '${tenantId}', '${parkingZoneIds[0]}', '${customerIds.mohammed}', 'ABC 1234', 'A-15', 'completed', '${past1}', '${past1}', 180, 45, 'sar', 'paid', 'PAY-PRK-001', false, '${j({ vehicle_type: "sedan", city: "Riyadh" })}', '${rawNum(45)}', '${now}', '${now}'),
        ('seed5_parking_02', '${tenantId}', '${parkingZoneIds[1]}', '${customerIds.fatima}', 'RST 5678', 'B-22', 'active', '${now}', NULL, NULL, NULL, 'sar', 'pending', NULL, false, '${j({ vehicle_type: "suv", city: "Riyadh" })}', NULL, '${now}', '${now}'),
        ('seed5_parking_03', '${tenantId}', '${parkingZoneIds[2]}', '${customerIds.ahmed}', 'AMN 9012', 'V-05', 'completed', '${past2}', '${past1}', 1440, 150, 'sar', 'paid', 'PAY-PRK-003', true, '${j({ vehicle_type: "ev", city: "Riyadh", airport_terminal: 1 })}', '${rawNum(150)}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  Created 3 parking_session rows")
  } catch (err: any) {
    console.log(`  parking_session error: ${err.detail || err.constraint || err.message?.substring(0, 200)}`)
  }

  // ============================================================
  // 17. PET_PRODUCT (3 rows)
  // category: food, treats, toys, accessories, health, grooming, housing
  // age_group: puppy_kitten, adult, senior, all_ages
  // ============================================================
  console.log("Step 17/21: Seeding pet_product...")
  try {
    await dataSource.raw(`
      INSERT INTO pet_product (id, tenant_id, product_id, name, category, species_tags, breed_specific, age_group, weight_range, ingredients, nutritional_info, is_prescription_required, price, currency_code, is_active, metadata, raw_price, created_at, updated_at)
      VALUES
        ('seed5_petprod_01', '${tenantId}', NULL, 'Royal Canin Persian Adult Cat Food', 'food',
          '${j(["cat"])}', 'Persian', 'adult',
          '${j({ min_kg: 3, max_kg: 7 })}',
          '${j(["Dried chicken", "Rice", "Animal fat", "Vegetable fiber", "Fish oil"])}',
          '${j({ protein: "30%", fat: "22%", fiber: "5%", moisture: "6.5%" })}',
          false, 185, 'sar', true,
          '${j({ brand: "Royal Canin", weight_kg: 4, origin: "France" })}',
          '${rawNum(185)}', '${now}', '${now}'),
        ('seed5_petprod_02', '${tenantId}', NULL, 'KONG Classic Dog Toy Medium', 'toys',
          '${j(["dog"])}', NULL, 'all_ages',
          '${j({ min_kg: 7, max_kg: 16 })}',
          NULL, NULL,
          false, 75, 'sar', true,
          '${j({ brand: "KONG", size: "medium", color: "red", material: "natural_rubber" })}',
          '${rawNum(75)}', '${now}', '${now}'),
        ('seed5_petprod_03', '${tenantId}', NULL, 'Frontline Plus Flea and Tick Treatment for Cats', 'health',
          '${j(["cat"])}', NULL, 'adult',
          '${j({ min_kg: 1, max_kg: 10 })}',
          '${j(["Fipronil", "S-Methoprene"])}',
          NULL,
          true, 120, 'sar', true,
          '${j({ brand: "Frontline Plus", doses: 3, duration_months: 3 })}',
          '${rawNum(120)}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  Created 3 pet_product rows")
  } catch (err: any) {
    console.log(`  pet_product error: ${err.detail || err.constraint || err.message?.substring(0, 200)}`)
  }

  // ============================================================
  // 18. VET_APPOINTMENT (2 rows)
  // ============================================================
  console.log("Step 18/21: Seeding vet_appointment...")
  try {
    await dataSource.raw(`
      INSERT INTO vet_appointment (id, tenant_id, pet_id, owner_id, vet_id, clinic_name, appointment_type, status, scheduled_at, duration_minutes, reason, diagnosis, treatment, prescriptions, cost, currency_code, follow_up_date, metadata, raw_cost, created_at, updated_at)
      VALUES
        ('seed5_vetappt_01', '${tenantId}', '${petProfileIds[0]}', '${customerIds.mohammed}', 'vet_dr_ali', 'Al Rifq Veterinary Clinic', 'checkup', 'completed', '${past2}', 30,
          'Annual checkup and vaccinations', 'Excellent general health, ideal weight', 'Triple vaccine and preventive deworming',
          '${j([{ name: "Triple Vaccine", dosage: "1ml" }, { name: "Drontal", dosage: "1 tablet" }])}',
          350, 'sar', '${future3}',
          '${j({ clinic_city: "Riyadh", vet_license: "SCFHS-VET-001" })}',
          '${rawNum(350)}', '${now}', '${now}'),
        ('seed5_vetappt_02', '${tenantId}', '${petProfileIds[1]}', '${customerIds.fatima}', 'vet_dr_sara', 'Jeddah Veterinary Center', 'emergency', 'completed', '${past1}', 60,
          'Repeated vomiting and appetite loss', 'Mild gastroenteritis', 'IV fluid therapy and anti-emetic treatment',
          '${j([{ name: "Metoclopramide", dosage: "0.5mg/kg" }, { name: "Saline Solution", dosage: "IV 100ml" }])}',
          600, 'sar', '${future1}',
          '${j({ clinic_city: "Jeddah", vet_license: "SCFHS-VET-002", emergency: true })}',
          '${rawNum(600)}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  Created 2 vet_appointment rows")
  } catch (err: any) {
    console.log(`  vet_appointment error: ${err.detail || err.constraint || err.message?.substring(0, 200)}`)
  }

  // ============================================================
  // 19. LEASE_AGREEMENT (2 rows)
  // ============================================================
  console.log("Step 19/21: Seeding lease_agreement...")
  try {
    await dataSource.raw(`
      INSERT INTO lease_agreement (id, tenant_id, listing_id, landlord_id, tenant_customer_id, status, start_date, end_date, monthly_rent, currency_code, deposit_amount, deposit_status, payment_day, terms, signed_at, metadata, raw_monthly_rent, raw_deposit_amount, created_at, updated_at)
      VALUES
        ('seed5_lease_01', '${tenantId}', '${propertyListingIds[0]}', '${userIds[0]}', '${customerIds.mohammed}', 'active', '${past3}', '${future3}', 8500, 'sar', 17000, 'held', 1,
          '${j({ utilities_included: false, maintenance_responsibility: "landlord_structural", pet_policy: "not_allowed", termination_notice_days: 60, annual_increase_pct: 5 })}',
          '${past3}',
          '${j({ property_type: "apartment", bedrooms: 3, city: "Riyadh", district: "Al Olaya", ejar_contract: "EJAR-2026-001" })}',
          '${rawNum(8500)}', '${rawNum(17000)}', '${now}', '${now}'),
        ('seed5_lease_02', '${tenantId}', '${propertyListingIds[1]}', '${userIds[1]}', '${customerIds.ahmed}', 'active', '${past4}', '${future2}', 15000, 'sar', 30000, 'held', 15,
          '${j({ utilities_included: true, maintenance_responsibility: "landlord_all", pet_policy: "allowed_with_deposit", termination_notice_days: 90, annual_increase_pct: 3, furnished: true })}',
          '${past4}',
          '${j({ property_type: "villa", bedrooms: 5, city: "Jeddah", district: "Al Shati", ejar_contract: "EJAR-2026-002" })}',
          '${rawNum(15000)}', '${rawNum(30000)}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  Created 2 lease_agreement rows")
  } catch (err: any) {
    console.log(`  lease_agreement error: ${err.detail || err.constraint || err.message?.substring(0, 200)}`)
  }

  // ============================================================
  // 20. PROPERTY_VALUATION (2 rows)
  // ============================================================
  console.log("Step 20/21: Seeding property_valuation...")
  try {
    await dataSource.raw(`
      INSERT INTO property_valuation (id, tenant_id, listing_id, valuator_id, valuation_type, estimated_value, currency_code, valuation_date, methodology, comparables, notes, valid_until, metadata, raw_estimated_value, created_at, updated_at)
      VALUES
        ('seed5_propval_01', '${tenantId}', '${propertyListingIds[0]}', 'valuator_001', 'market', 1850000, 'sar', '${past2}',
          'Market comparison - analysis of similar sales in same neighborhood',
          '${j([{ address: "Similar apt - Al Olaya", sold_price: 1900000, date: "2025-12" }, { address: "Similar apt - Al Malqa", sold_price: 1780000, date: "2026-01" }])}',
          'Property in excellent condition, prime location adds value',
          '${future2}',
          '${j({ valuator_name: "Eng. Abdulrahman Al-Mutairi", license: "TAQEEM-2026-001", city: "Riyadh" })}',
          '${rawNum(1850000)}', '${now}', '${now}'),
        ('seed5_propval_02', '${tenantId}', '${propertyListingIds[2]}', 'valuator_002', 'investment', 3200000, 'sar', '${past1}',
          'Investment return analysis and future cash flow projections',
          '${j([{ address: "Similar villa - Al Shati", sold_price: 3500000, date: "2025-11" }, { address: "Similar villa - Al Hamra", sold_price: 2950000, date: "2026-01" }])}',
          'Expected annual ROI 7 percent with value appreciation from nearby development projects',
          '${future1}',
          '${j({ valuator_name: "Dr. Sarah Al-Ghamdi", license: "TAQEEM-2026-002", city: "Jeddah" })}',
          '${rawNum(3200000)}', '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  Created 2 property_valuation rows")
  } catch (err: any) {
    console.log(`  property_valuation error: ${err.detail || err.constraint || err.message?.substring(0, 200)}`)
  }

  // ============================================================
  // 21. PROPERTY_DOCUMENT (3 rows)
  // document_type: title_deed, floor_plan, inspection, contract, insurance, tax, utility, other
  // ============================================================
  console.log("Step 21/21: Seeding property_document...")
  try {
    await dataSource.raw(`
      INSERT INTO property_document (id, tenant_id, listing_id, lease_id, document_type, title, file_url, file_type, uploaded_by, is_verified, verified_by, expires_at, metadata, created_at, updated_at)
      VALUES
        ('seed5_propdoc_01', '${tenantId}', '${propertyListingIds[0]}', 'seed5_lease_01', 'title_deed', 'Title Deed - Al Olaya Apartment', 'https://cdn.dakkah.sa/docs/title_deed_001.pdf', 'pdf', '${userIds[0]}', true, '${userIds[1]}', NULL,
          '${j({ deed_number: "DEED-RYD-2026-001", notary: "First Notary Office Riyadh", city: "Riyadh" })}',
          '${now}', '${now}'),
        ('seed5_propdoc_02', '${tenantId}', '${propertyListingIds[0]}', NULL, 'floor_plan', 'Floor Plan - 3BR Apartment', 'https://cdn.dakkah.sa/docs/floor_plan_001.pdf', 'pdf', '${userIds[0]}', true, '${userIds[1]}', NULL,
          '${j({ area_sqm: 185, rooms: 3, bathrooms: 2, floor: 5 })}',
          '${now}', '${now}'),
        ('seed5_propdoc_03', '${tenantId}', '${propertyListingIds[2]}', NULL, 'inspection', 'Building Inspection Report - Al Shati Villa', 'https://cdn.dakkah.sa/docs/inspection_001.pdf', 'pdf', 'inspector_001', true, '${userIds[1]}', '${future2}',
          '${j({ inspector_name: "Eng. Fahad Al-Shahri", rating: "excellent", city: "Jeddah" })}',
          '${now}', '${now}')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("  Created 3 property_document rows")
  } catch (err: any) {
    console.log(`  property_document error: ${err.detail || err.constraint || err.message?.substring(0, 200)}`)
  }

  console.log("\n========================================")
  console.log("Seed Verticals 5 Complete!")
  console.log("========================================")
}
