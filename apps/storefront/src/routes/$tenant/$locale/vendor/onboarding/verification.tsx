// @ts-nocheck
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState } from "react"

export const Route = createFileRoute(
  "/$tenant/$locale/vendor/onboarding/verification"
)({
  component: VendorOnboardingStep2,
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
                    ? "bg-green-600 text-white"
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
                  step.number < currentStep ? "bg-green-600" : "bg-ds-bg-secondary"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function VendorOnboardingStep2() {
  const { tenant, locale } = Route.useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    taxId: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    acceptTerms: false,
  })

  const [licenseFile, setLicenseFile] = useState<string | null>(null)

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleBack = () => {
    navigate({
      to: "/$tenant/$locale/vendor/onboarding",
      params: { tenant, locale },
    })
  }

  const handleNext = () => {
    navigate({
      to: "/$tenant/$locale/vendor/onboarding/complete",
      params: { tenant, locale },
    })
  }

  const isValid = formData.taxId && formData.streetAddress && formData.city && formData.acceptTerms

  return (
    <div className="min-h-screen bg-ds-bg-secondary">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-ds-text-primary sm:text-3xl">
            Vendor Onboarding
          </h1>
          <p className="mt-2 text-sm text-ds-text-secondary">
            Verify your business details
          </p>
        </div>

        <ProgressIndicator currentStep={2} />

        <div className="rounded-xl border border-ds-border-primary bg-ds-bg-primary p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-ds-text-primary">
            Verification Details
          </h2>

          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ds-text-primary">
                Business License
              </label>
              <div className="rounded-lg border-2 border-dashed border-ds-border-primary p-6 text-center transition-colors hover:border-ds-border-accent">
                {licenseFile ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-ds-text-primary">{licenseFile}</span>
                    <button
                      onClick={() => setLicenseFile(null)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <svg className="mx-auto h-8 w-8 text-ds-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mt-2 text-sm text-ds-text-secondary">
                      Drag & drop your business license or{" "}
                      <button
                        onClick={() => setLicenseFile("business_license.pdf")}
                        className="text-ds-text-accent hover:underline"
                      >
                        browse files
                      </button>
                    </p>
                    <p className="mt-1 text-xs text-ds-text-secondary">
                      PDF, JPG, or PNG up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ds-text-primary">
                Tax ID / EIN *
              </label>
              <input
                type="text"
                value={formData.taxId}
                onChange={(e) => updateField("taxId", e.target.value)}
                placeholder="XX-XXXXXXX"
                className="w-full rounded-lg border border-ds-border-primary bg-ds-bg-primary px-4 py-2.5 text-sm text-ds-text-primary placeholder:text-ds-text-secondary focus:border-ds-border-accent focus:outline-none focus:ring-1 focus:ring-ds-border-accent"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-ds-text-primary">
                Business Address *
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  value={formData.streetAddress}
                  onChange={(e) => updateField("streetAddress", e.target.value)}
                  placeholder="Street address"
                  className="w-full rounded-lg border border-ds-border-primary bg-ds-bg-primary px-4 py-2.5 text-sm text-ds-text-primary placeholder:text-ds-text-secondary focus:border-ds-border-accent focus:outline-none focus:ring-1 focus:ring-ds-border-accent"
                />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    placeholder="City"
                    className="rounded-lg border border-ds-border-primary bg-ds-bg-primary px-4 py-2.5 text-sm text-ds-text-primary placeholder:text-ds-text-secondary focus:border-ds-border-accent focus:outline-none focus:ring-1 focus:ring-ds-border-accent"
                  />
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    placeholder="State"
                    className="rounded-lg border border-ds-border-primary bg-ds-bg-primary px-4 py-2.5 text-sm text-ds-text-primary placeholder:text-ds-text-secondary focus:border-ds-border-accent focus:outline-none focus:ring-1 focus:ring-ds-border-accent"
                  />
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => updateField("postalCode", e.target.value)}
                    placeholder="Postal code"
                    className="rounded-lg border border-ds-border-primary bg-ds-bg-primary px-4 py-2.5 text-sm text-ds-text-primary placeholder:text-ds-text-secondary focus:border-ds-border-accent focus:outline-none focus:ring-1 focus:ring-ds-border-accent"
                  />
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    placeholder="Country"
                    className="rounded-lg border border-ds-border-primary bg-ds-bg-primary px-4 py-2.5 text-sm text-ds-text-primary placeholder:text-ds-text-secondary focus:border-ds-border-accent focus:outline-none focus:ring-1 focus:ring-ds-border-accent"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-ds-border-primary bg-ds-bg-secondary p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => updateField("acceptTerms", e.target.checked)}
                  className="mt-0.5 rounded border-ds-border-primary text-ds-text-accent focus:ring-ds-border-accent"
                />
                <span className="text-sm text-ds-text-primary">
                  I agree to the{" "}
                  <a href="#" className="text-ds-text-accent hover:underline">
                    Vendor Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-ds-text-accent hover:underline">
                    Marketplace Policies
                  </a>
                  . I confirm that the information provided is accurate. *
                </span>
              </label>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-lg border border-ds-border-primary px-6 py-2.5 text-sm font-medium text-ds-text-primary transition-colors hover:bg-ds-bg-secondary"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
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
