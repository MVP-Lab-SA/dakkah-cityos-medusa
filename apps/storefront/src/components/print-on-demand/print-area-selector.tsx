import { t } from "@/lib/i18n"

export interface PrintArea {
  id: string
  name: string
  width: number
  height: number
  maxDpi?: number
}

export function PrintAreaSelector({
  areas,
  selectedAreaId,
  locale,
  onSelect,
}: {
  areas: PrintArea[]
  selectedAreaId?: string
  locale: string
  onSelect?: (areaId: string) => void
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-ds-foreground">
        {t(locale, "printOnDemand.select_print_area")}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {areas.map((area) => (
          <button
            key={area.id}
            type="button"
            onClick={() => onSelect?.(area.id)}
            className={`p-4 rounded-xl border-2 text-start transition-colors ${
              selectedAreaId === area.id
                ? "border-ds-primary bg-ds-primary/5"
                : "border-ds-border hover:border-ds-ring"
            }`}
          >
            <p className="font-medium text-ds-foreground">{area.name}</p>
            <p className="text-sm text-ds-muted-foreground mt-1">
              {area.width} × {area.height} {t(locale, "printOnDemand.dimensions_unit")}
            </p>
            {area.maxDpi && (
              <p className="text-xs text-ds-muted-foreground mt-0.5">
                {t(locale, "printOnDemand.max_dpi")}: {area.maxDpi}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
