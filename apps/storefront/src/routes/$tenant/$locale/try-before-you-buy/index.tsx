import { createFileRoute, Link } from "@tanstack/react-router"
import { t } from "@/lib/i18n"
import { TBYBProgramCard, type TBYBProgram } from "@/components/tbyb/tbyb-program-card"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/try-before-you-buy/")({
  component: TryBeforeYouBuyPage,
})

function TryBeforeYouBuyPage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [programs] = useState<TBYBProgram[]>([])
  const isLoading = false

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-ds-card border-b border-ds-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-ds-muted-foreground mb-4">
            <Link to={`${prefix}` as any} className="hover:text-ds-foreground transition-colors">
              {t(locale, "common.home")}
            </Link>
            <span>/</span>
            <span className="text-ds-foreground">{t(locale, "tbyb.title")}</span>
          </div>
          <h1 className="text-3xl font-bold text-ds-foreground">
            {t(locale, "tbyb.browse_programs")}
          </h1>
          <p className="mt-2 text-ds-muted-foreground">
            {t(locale, "tbyb.subtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12">
          <h2 className="text-xl font-bold text-ds-foreground text-center mb-8">
            {t(locale, "tbyb.how_it_works")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "1", key: "tbyb.step_1" },
              { step: "2", key: "tbyb.step_2" },
              { step: "3", key: "tbyb.step_3" },
            ].map((s) => (
              <div key={s.step} className="bg-ds-background border border-ds-border rounded-xl p-6 text-center">
                <div className="w-10 h-10 rounded-full bg-ds-primary text-ds-primary-foreground flex items-center justify-center mx-auto text-lg font-bold mb-4">
                  {s.step}
                </div>
                <p className="text-sm text-ds-foreground font-medium">
                  {t(locale, s.key)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-ds-background border border-ds-border rounded-xl overflow-hidden">
                <div className="aspect-[16/9] bg-ds-muted animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 bg-ds-muted rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-ds-muted rounded animate-pulse" />
                  <div className="h-10 w-full bg-ds-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : programs.length === 0 ? (
          <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
            <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-ds-foreground mb-2">
              {t(locale, "tbyb.no_programs")}
            </h3>
            <p className="text-ds-muted-foreground text-sm">
              {t(locale, "tbyb.no_programs_desc")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {programs.map((program) => (
              <TBYBProgramCard
                key={program.id}
                program={program}
                locale={locale}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
