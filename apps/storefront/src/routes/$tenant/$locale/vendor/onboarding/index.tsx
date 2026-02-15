// @ts-nocheck
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/vendor/onboarding/")({
  component: VendorOnboardingStep1,
})

function ProgressIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { number: 1, label: "Business Info" },
    { number: 2, label: "Verification" },
    { number: 3, label: "Complete" },
  ]

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-2">
        {steps.map((step, idx) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  step.number < currentStep
                    ? "bg-ds-success text-white"
                    : step.number === currentStep
                      ? "bg-ds-bg-accent text-ds-text-accent"
                      : "bg-ds-bg-secondary text-ds-text-secondary"
                }`}
              >
                {step.number < currentStep ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span className="mt-1 text-xs text-ds-text-secondary">{step.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`mx-2 mb-5 h-0.5 w-12 sm:w-20 ${
                  step.number < currentStep ? "bg-ds-success" : "bg-ds-bg-secondary"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function VendorOnboardingStep1() {
  const { tenant, locale } = Route.useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    category: "",
    description: "",
    contactEmail: "",
    phone: "",
  })

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    navigate({
      to: "/$tenant/$locale/vendor/onboarding/verification",
      params: { tenant, locale },
    })
  }

  const isValid =
    formData.businessName && formData.businessType && formData.category && formData.contactEmail

  return (
    <div className="min-h-screen bg-ds-bg-secondary">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-ds-text-primary sm:text-3xl">
            Vendor Onboarding
          </h1>
          <p className="mt-2 text-sm text-ds-text-secondary">
            Complete your business profile to start selling
          </p>
        </div>

        <ProgressIndicator currentStep={1} />

        <div className="rounded-xl border border-ds-border-primary bg-ds-bg-primary p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-ds-text-primary">
            Business Information
          </h2>

          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ds-text-primary">
                Business Name *
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => updateField("businessName", e.target.value)}
                placeholder="Enter your business name"
                className="w-full rounded-lg border border-ds-border-primary bg-ds-bg-primary px-4 py-2.5 text-sm text-ds-text-primary placeholder:text-ds-text-secondary focus:border-ds-border-accent focus:outline-none focus:ring-1 focus:ring-ds-border-accent"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ds-text-primary">
                  Business Type *
                </label>
                <select
                  value={formData.businessType}
                  onChange={(e) => updateField("businessType", e.target.value)}
                  className="w-full rounded-lg border border-ds-border-primary bg-ds-bg-primary px-4 py-2.5 text-sm text-ds-text-primary focus:border-ds-border-accent focus:outline-none focus:ring-1 focus:ring-ds-border-accent"
                >
                  <option value="">Select type</option>
                  <option value="sole_proprietor">Sole Proprietor</option>
                  <option value="partnership">Partnership</option>
                  <option value="llc">LLC</option>
                  <option value="corporation">Corporation</option>
                  <option value="nonprofit">Non-Profit</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ds-text-primary">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className="w-full rounded-lg border border-ds-border-primary bg-ds-bg-primary px-4 py-2.5 text-sm text-ds-text-primary focus:border-ds-border-accent focus:outline-none focus:ring-1 focus:ring-ds-border-accent"
                >
                  <option value="">Select category</option>
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion & Apparel</option>
                  <option value="food">Food & Beverage</option>
                  <option value="health">Health & Beauty</option>
                  <option value="home">Home & Garden</option>
                  <option value="services">Professional Services</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ds-text-primary">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Tell us about your business..."
                rows={3}
                className="w-full rounded-lg border border-ds-border-primary bg-ds-bg-primary px-4 py-2.5 text-sm text-ds-text-primary placeholder:text-ds-text-secondary focus:border-ds-border-accent focus:outline-none focus:ring-1 focus:ring-ds-border-accent resize-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ds-text-primary">
                  Contact Email *
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => updateField("contactEmail", e.target.value)}
                  placeholder="you@business.com"
                  className="w-full rounded-lg border border-ds-border-primary bg-ds-bg-primary px-4 py-2.5 text-sm text-ds-text-primary placeholder:text-ds-text-secondary focus:border-ds-border-accent focus:outline-none focus:ring-1 focus:ring-ds-border-accent"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ds-text-primary">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full rounded-lg border border-ds-border-primary bg-ds-bg-primary px-4 py-2.5 text-sm text-ds-text-primary placeholder:text-ds-text-secondary focus:border-ds-border-accent focus:outline-none focus:ring-1 focus:ring-ds-border-accent"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleNext}
              disabled={!isValid}
              className="inline-flex items-center gap-2 rounded-lg bg-ds-bg-accent px-6 py-2.5 text-sm font-medium text-ds-text-accent transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Step
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
