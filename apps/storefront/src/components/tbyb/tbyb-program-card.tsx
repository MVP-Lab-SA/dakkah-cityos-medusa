import { t } from "@/lib/i18n"

export interface TBYBProgram {
  id: string
  title: string
  description?: string
  trialDays: number
  maxItems?: number
  returnShippingFree?: boolean
  thumbnail?: string
}

export function TBYBProgramCard({
  program,
  locale,
  onEnroll,
}: {
  program: TBYBProgram
  locale: string
  onEnroll?: (id: string) => void
}) {
  return (
    <div className="bg-ds-background border border-ds-border rounded-xl overflow-hidden hover:border-ds-ring transition-colors">
      {program.thumbnail && (
        <div className="aspect-[16/9] bg-ds-muted overflow-hidden">
          <img
            src={program.thumbnail}
            alt={program.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-ds-foreground">{program.title}</h3>
          {program.description && (
            <p className="text-sm text-ds-muted-foreground mt-1">{program.description}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-ds-primary/10 text-ds-primary rounded-lg text-sm font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {program.trialDays} {t(locale, "tbyb.days_trial")}
          </div>

          {program.maxItems && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-ds-muted text-ds-muted-foreground rounded-lg text-sm">
              {t(locale, "tbyb.up_to")} {program.maxItems} {t(locale, "tbyb.items")}
            </div>
          )}

          {program.returnShippingFree && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-ds-success/10 text-ds-success rounded-lg text-sm font-medium">
              {t(locale, "tbyb.free_returns")}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onEnroll?.(program.id)}
          className="w-full px-4 py-2.5 text-sm font-medium rounded-lg bg-ds-primary text-ds-primary-foreground hover:bg-ds-primary/90 transition-colors"
        >
          {t(locale, "tbyb.enroll_now")}
        </button>
      </div>
    </div>
  )
}
