import { ExecArgs } from "@medusajs/framework/types"

const subscriptionPlans = [
  {
    handle: "wellness-essentials",
    name: "Wellness Essentials",
    description: "Monthly wellness box with 3-5 carefully curated products to support your daily wellness routine.",
    price: "49",
    currency_code: "usd",
    billing_interval: "month",
    billing_interval_count: 1,
    trial_period_days: 0,
    is_active: true,
    features: JSON.stringify([
      "3-5 full-size wellness products",
      "Free shipping on all boxes",
      "10% member discount on store",
      "Access to exclusive products",
      "Cancel anytime",
    ]),
    metadata: {
      tier: "starter",
      popular: false,
    },
  },
  {
    handle: "premium-ritual",
    name: "Premium Ritual",
    description: "Our most popular plan - quarterly luxury wellness experience with 8-10 premium products and exclusive perks.",
    price: "149",
    currency_code: "usd",
    billing_interval: "month",
    billing_interval_count: 3,
    trial_period_days: 0,
    is_active: true,
    features: JSON.stringify([
      "8-10 premium wellness products",
      "Exclusive limited-edition items",
      "15% member discount on store",
      "Free expedited shipping",
      "Personal wellness consultation",
      "Early access to new products",
    ]),
    metadata: {
      tier: "premium",
      popular: true,
    },
  },
  {
    handle: "annual-wellness",
    name: "Annual Wellness Journey",
    description: "Best value - commit to a year of wellness with monthly boxes and maximum savings.",
    price: "39",
    currency_code: "usd",
    billing_interval: "month",
    billing_interval_count: 1,
    trial_period_days: 14,
    is_active: true,
    features: JSON.stringify([
      "4-6 full-size products monthly",
      "20% member discount on store",
      "Free shipping always",
      "Quarterly bonus products",
      "VIP customer support",
      "Annual wellness gift box",
      "Exclusive member events",
    ]),
    metadata: {
      tier: "annual",
      popular: false,
      commitment_months: 12,
    },
  },
  {
    handle: "corporate-wellness",
    name: "Corporate Wellness",
    description: "Wellness program for teams and offices. Customizable wellness boxes for employee wellness initiatives.",
    price: "299",
    currency_code: "usd",
    billing_interval: "month",
    billing_interval_count: 1,
    trial_period_days: 30,
    is_active: true,
    features: JSON.stringify([
      "10-15 products per delivery",
      "Customizable product selection",
      "Branded packaging available",
      "Dedicated account manager",
      "Bulk pricing discounts",
      "Wellness workshop credits",
      "Employee wellness portal",
    ]),
    metadata: {
      tier: "corporate",
      popular: false,
      min_employees: 10,
    },
  },
]

export default async function seedSubscriptions({ container }: ExecArgs) {
  const subscriptionModule = container.resolve("subscription") as any

  console.log("Seeding subscription plans...")

  for (const planData of subscriptionPlans) {
    try {
      // Check if plan already exists
      const existing = await subscriptionModule.listSubscriptionPlans({ handle: planData.handle })
      const existingList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

      if (existingList.length > 0) {
        console.log(`  - Plan ${planData.handle} already exists, skipping`)
        continue
      }

      await subscriptionModule.createSubscriptionPlans(planData)
      console.log(`  - Created plan: ${planData.name}`)
    } catch (error: any) {
      console.error(`  - Failed to create plan ${planData.handle}: ${error.message}`)
    }
  }

  console.log(`Seeded ${subscriptionPlans.length} subscription plans`)
}
