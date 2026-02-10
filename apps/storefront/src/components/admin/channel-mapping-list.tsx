import { useSalesChannelMappings } from "@/lib/hooks/use-tenant-admin"
import type { SalesChannelMapping } from "@/lib/types/tenant-admin"

export function ChannelMappingList() {
  const { data, isLoading } = useSalesChannelMappings()

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
      <h2 className="text-xl font-bold">Sales Channel Mappings</h2>
      {mappings.length === 0 ? (
        <div className="text-center py-8 border rounded-lg text-muted-foreground">
          No channel mappings configured
        </div>
      ) : (
        <div className="border rounded-lg divide-y">
          {mappings.map((mapping: SalesChannelMapping) => (
            <div key={mapping.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{mapping.channel_name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <ChannelTypeBadge type={mapping.channel_type} />
                  <span className="text-xs text-muted-foreground font-mono">
                    {mapping.medusa_sales_channel_id}
                  </span>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs ${mapping.is_active ? "bg-ds-success text-ds-success" : "bg-ds-muted"}`}>
                {mapping.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ChannelTypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    web: "bg-ds-info text-ds-info",
    mobile: "bg-ds-accent/10 text-ds-accent",
    pos: "bg-ds-success text-ds-success",
    marketplace: "bg-orange-100 text-orange-800",
    social: "bg-pink-100 text-pink-800",
  }
  return <span className={`text-xs px-2 py-0.5 rounded ${styles[type] || "bg-ds-muted"}`}>{type}</span>
}
