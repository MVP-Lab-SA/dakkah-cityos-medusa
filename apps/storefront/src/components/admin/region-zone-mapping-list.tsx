import { useRegionZoneMappings } from "@/lib/hooks/use-tenant-admin"
import type { RegionZoneMapping } from "@/lib/types/tenant-admin"

export function RegionZoneMappingList() {
  const { data, isLoading } = useRegionZoneMappings()

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border rounded p-4 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  const mappings = data?.mappings || []

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Region Zone Mappings</h2>
      {mappings.length === 0 ? (
        <div className="text-center py-8 border rounded-lg text-muted-foreground">
          No region zone mappings configured
        </div>
      ) : (
        <div className="border rounded-lg divide-y">
          {mappings.map((mapping: RegionZoneMapping) => (
            <div key={mapping.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ZoneBadge zone={mapping.residency_zone} />
                  <span className="font-medium">{mapping.data_storage_location}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs ${mapping.is_active ? "bg-green-100 text-green-800" : "bg-gray-100"}`}>
                  {mapping.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-4">
                <span>Countries: {mapping.country_codes.join(", ").toUpperCase()}</span>
                <span>Cross-border: {mapping.cross_border_allowed ? "Allowed" : "Restricted"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ZoneBadge({ zone }: { zone: string }) {
  const styles: Record<string, string> = {
    GCC: "bg-green-100 text-green-800",
    EU: "bg-blue-100 text-blue-800",
    MENA: "bg-orange-100 text-orange-800",
    APAC: "bg-purple-100 text-purple-800",
    AMERICAS: "bg-red-100 text-red-800",
    GLOBAL: "bg-gray-100 text-gray-800",
  }
  return <span className={`text-xs px-2 py-0.5 rounded font-medium ${styles[zone] || "bg-gray-100"}`}>{zone}</span>
}
