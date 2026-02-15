import { createFileRoute } from "@tanstack/react-router"
import { AgeGate } from "@/components/identity/age-gate"
import { AgeVerificationStatus } from "@/components/identity/age-verification-status"
import { DOBVerifier } from "@/components/identity/dob-verifier"
import { t } from "@/lib/i18n"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/verify/age")({
  component: AgeVerificationPage,
  head: () => ({
    meta: [
      { title: "Age Verification | Dakkah CityOS" },
      { name: "description", content: "Verify your age on Dakkah CityOS" },
    ],
  }),
})

function AgeVerificationPage() {
  const { locale } = Route.useParams()
  const [verified, setVerified] = useState(false)
  const [status, setStatus] = useState<"pending" | "verified" | "failed">("pending")

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-ds-foreground mb-2">
          {t(locale, "ageVerification.page_title")}
        </h1>
        <p className="text-ds-muted-foreground mb-8">
          {t(locale, "ageVerification.page_desc")}
        </p>

        <div className="space-y-6">
          <AgeVerificationStatus
            status={status}
            minimumAge={18}
            method="dob"
            locale={locale}
            onRetry={() => setStatus("pending")}
          />

          {!verified && status !== "verified" && (
            <DOBVerifier
              minimumAge={18}
              locale={locale}
              showAge
              onVerified={() => {
                setVerified(true)
                setStatus("verified")
              }}
              onDenied={() => setStatus("failed")}
            />
          )}

          {!verified && (
            <div className="mt-8">
              <AgeGate
                minimumAge={18}
                method="checkbox"
                onVerified={() => {
                  setVerified(true)
                  setStatus("verified")
                }}
                onDenied={() => setStatus("failed")}
              >
                <div className="bg-ds-card border border-ds-border rounded-lg p-6 text-center">
                  <p className="text-ds-foreground">
                    {t(locale, "ageVerification.content_unlocked")}
                  </p>
                </div>
              </AgeGate>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
