// @ts-nocheck
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { withAuth } from "@/components/auth/auth-guard"
import { useState } from "react"

export const Route = createFileRoute(
  "/$tenant/$locale/vendor/onboarding/complete"
)({
  component: withAuth(VendorOnboardingStep3),
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

function VendorOnboardingStep3() {
  const { tenant, locale } = Route.useParams()
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleBack = () => {
    navigate({
      to: "/$tenant/$locale/vendor/onboarding/verification",
      params: { tenant, locale },
    })
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-ds-bg-secondary">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
          <div className="rounded-xl border border-ds-border-primary bg-ds-bg-primary p-8 shadow-sm text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ds-success/15">
              <svg className="h-8 w-8 text-ds-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-ds-text-primary">
              Application Submitted!
            </h2>
            <p className="mt-3 text-sm text-ds-text-secondary max-w-md mx-auto">
              Thank you for applying to become a vendor. Our team will review your
              application and get back to you within 2-3 business days.
            </p>
            <div className="mt-6 rounded-lg bg-ds-bg-secondary p-4">
              <p className="text-xs text-ds-text-secondary">
                Application Reference
              </p>
              <p className="mt-1 text-sm font-mono font-medium text-ds-text-primary">
                VND-{Date.now().toString(36).toUpperCase()}
              </p>
            </div>
            <button
              onClick={() =>
                navigate({
                  to: "/$tenant/$locale/vendor",
                  params: { tenant, locale },
                })
              }
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-ds-bg-accent px-6 py-2.5 text-sm font-medium text-ds-text-accent transition-opacity hover:opacity-90"
            >
              Go to Vendor Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ds-bg-secondary">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-ds-text-primary sm:text-3xl">
            Vendor Onboarding
          </h1>
          <p className="mt-2 text-sm text-ds-text-secondary">
            Review and submit your application
          </p>
        </div>

        <ProgressIndicator currentStep={3} />

        <div className="rounded-xl border border-ds-border-primary bg-ds-bg-primary p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-ds-text-primary">
            Application Summary
          </h2>

          <div className="space-y-4">
            <div className="rounded-lg border border-ds-border-primary p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-ds-text-primary">
                  Business Information
                </h3>
                <button
                  onClick={() =>
                    navigate({
                      to: "/$tenant/$locale/vendor/onboarding",
                      params: { tenant, locale },
                    })
                  }
                  className="text-xs text-ds-text-accent hover:underline"
                >
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-ds-text-secondary">Business Name</p>
                  <p className="font-medium text-ds-text-primary">—</p>
                </div>
                <div>
                  <p className="text-ds-text-secondary">Business Type</p>
                  <p className="font-medium text-ds-text-primary">—</p>
                </div>
                <div>
                  <p className="text-ds-text-secondary">Category</p>
                  <p className="font-medium text-ds-text-primary">—</p>
                </div>
                <div>
                  <p className="text-ds-text-secondary">Contact Email</p>
                  <p className="font-medium text-ds-text-primary">—</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-ds-border-primary p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-ds-text-primary">
                  Verification Details
                </h3>
                <button
                  onClick={handleBack}
                  className="text-xs text-ds-text-accent hover:underline"
                >
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-ds-text-secondary">Tax ID</p>
                  <p className="font-medium text-ds-text-primary">—</p>
                </div>
                <div>
                  <p className="text-ds-text-secondary">Business License</p>
                  <p className="font-medium text-ds-text-primary">—</p>
                </div>
                <div className="col-span-2">
                  <p className="text-ds-text-secondary">Address</p>
                  <p className="font-medium text-ds-text-primary">—</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-ds-success/30 bg-ds-success/10 p-4">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-ds-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-ds-success">
                    Terms & Conditions Accepted
                  </p>
                  <p className="mt-0.5 text-xs text-ds-success">
                    You agreed to the Vendor Terms of Service and Marketplace Policies.
                  </p>
                </div>
              </div>
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
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-ds-success px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ds-success/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
