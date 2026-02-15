import { usePersonas } from "@/lib/hooks/use-personas"
import type { Persona, PersonaAxis } from "@/lib/types/cityos"

interface PersonaDisplayProps {
  tenantId: string
}

export function PersonaDisplay({ tenantId }: PersonaDisplayProps) {
  const { data, isLoading } = usePersonas(tenantId)

  if (isLoading) {
    return (
      <div className="border rounded-lg p-6 animate-pulse">
        <div className="h-5 bg-muted rounded w-1/3 mb-4"></div>
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-muted rounded"></div>)}</div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      {data.resolved_persona && (
        <div className="border-2 border-ds-info rounded-lg p-6 bg-ds-info">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold text-lg">Active Persona</h3>
            <span className="bg-ds-info text-ds-info text-xs px-2 py-0.5 rounded">Resolved</span>
          </div>
          <PersonaCard persona={data.resolved_persona} highlighted />
        </div>
      )}

      {data.personas && data.personas.length > 0 && (
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">Available Personas</h3>
          <div className="space-y-3">
            {data.personas.map((persona) => (
              <PersonaCard key={persona.id} persona={persona} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function PersonaCard({ persona, highlighted }: { persona: Persona; highlighted?: boolean }) {
  const axisLabels: Record<PersonaAxis, string> = {
    demographics: "Demographics",
    psychographics: "Psychographics",
    behavioral: "Behavioral",
    contextual: "Contextual",
    transactional: "Transactional",
    engagement: "Engagement",
  }

  const precedenceColors: Record<string, string> = {
    "tenant-default": "bg-ds-muted text-ds-foreground",
    "user-default": "bg-ds-info text-ds-info",
    membership: "bg-ds-success text-ds-success",
    surface: "bg-ds-accent/10 text-ds-accent",
    session: "bg-ds-warning/15 text-ds-warning",
  }

  const axes = Object.entries(persona.axes || {}) as [PersonaAxis, any][]

  return (
    <div className={`border rounded p-4 ${highlighted ? "border-ds-info" : ""}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium">{persona.name}</h4>
        <div className="flex gap-2">
          <span className={`text-xs px-2 py-0.5 rounded ${precedenceColors[persona.precedence ?? ""] || "bg-ds-muted"}`}>
            {persona.precedence ?? "default"} ({persona.precedence_weight ?? 0})
          </span>
          {!persona.is_active && <span className="text-xs px-2 py-0.5 bg-ds-destructive text-ds-destructive rounded">Inactive</span>}
        </div>
      </div>
      {persona.description && <p className="text-sm text-muted-foreground mb-2">{persona.description}</p>}
      {axes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {axes.map(([axis]) => (
            <span key={axis} className="text-xs bg-muted px-2 py-0.5 rounded">
              {axisLabels[axis] || axis}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
