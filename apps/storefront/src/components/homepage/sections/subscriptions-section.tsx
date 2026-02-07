import { Link } from "@tanstack/react-router"
import { Check, Repeat } from "lucide-react"

interface SubscriptionsSectionProps {
  countryCode: string
  config: Record<string, any>
}

export function SubscriptionsSection({ countryCode, config }: SubscriptionsSectionProps) {
  return (
    <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-6">
              <Repeat className="h-5 w-5" />
              <span className="text-sm font-medium">Subscribe & Save</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {config.title || "Never Run Out Again"}
            </h2>
            <p className="text-lg text-white/90 mb-8">
              {config.subtitle || "Set up a subscription for your favorite products and enjoy automatic deliveries at a discounted price."}
            </p>
            <ul className="space-y-3 mb-8">
              {(config.benefits || [
                "Save up to 15% on every order",
                "Free shipping on all subscriptions",
                "Pause or cancel anytime",
                "Flexible delivery schedules"
              ]).map((benefit: string, index: number) => (
                <li key={index} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-300" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <Link
              to={`/${countryCode}/subscriptions`}
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-indigo-600 font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              Explore Subscriptions
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-6xl font-bold mb-2">15%</div>
                <div className="text-xl">Off Every Order</div>
                <div className="mt-4 text-white/70">
                  When you subscribe
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
