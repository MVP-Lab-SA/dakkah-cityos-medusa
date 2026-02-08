import { useGovernance } from "@/lib/hooks/use-governance"
import type { GovernanceAuthority, GovernancePolicy } from "@/lib/types/cityos"

interface GovernancePoliciesProps {
  tenantId: string
}

export function GovernancePolicies({ tenantId }: GovernancePoliciesProps) {
  const { data, isLoading } = useGovernance(tenantId)

  if (isLoading) {
    return (
      <div className="border rounded-lg p-6 animate-pulse">
        <div className="h-5 bg-muted rounded w-1/3 mb-4"></div>
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-muted rounded"></div>)}</div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-6">
        <h3 className="font-semibold text-lg mb-4">Effective Policies</h3>
        <PolicyDisplay policies={data.effective_policies} />
      </div>

      {data.authorities && data.authorities.length > 0 && (
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">Authority Chain</h3>
          <div className="space-y-3">
            {data.authorities.map((authority) => (
              <AuthorityCard key={authority.id} authority={authority} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function PolicyDisplay({ policies }: { policies: GovernancePolicy }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {policies.data_residency && (
        <div className="border rounded p-4">
          <h4 className="font-medium mb-2">Data Residency</h4>
          <div className="text-sm space-y-1 text-muted-foreground">
            {policies.data_residency.storage_location && <p>Storage: {policies.data_residency.storage_location}</p>}
            <p>Cross-border: {policies.data_residency.cross_border_allowed ? "Allowed" : "Restricted"}</p>
            <p>Encryption: {policies.data_residency.encryption_required ? "Required" : "Optional"}</p>
          </div>
        </div>
      )}
      {policies.commerce && (
        <div className="border rounded p-4">
          <h4 className="font-medium mb-2">Commerce</h4>
          <div className="text-sm space-y-1 text-muted-foreground">
            {policies.commerce.max_transaction_amount && <p>Max transaction: ${policies.commerce.max_transaction_amount}</p>}
            {policies.commerce.allowed_currencies && <p>Currencies: {policies.commerce.allowed_currencies.join(", ")}</p>}
            <p>Tax inclusive: {policies.commerce.tax_inclusive ? "Yes" : "No"}</p>
            <p>KYC required: {policies.commerce.require_kyc ? "Yes" : "No"}</p>
          </div>
        </div>
      )}
      {policies.privacy && (
        <div className="border rounded p-4">
          <h4 className="font-medium mb-2">Privacy</h4>
          <div className="text-sm space-y-1 text-muted-foreground">
            {policies.privacy.data_retention_days && <p>Data retention: {policies.privacy.data_retention_days} days</p>}
            <p>Consent required: {policies.privacy.consent_required ? "Yes" : "No"}</p>
            <p>Anonymization: {policies.privacy.anonymization_required ? "Required" : "Optional"}</p>
          </div>
        </div>
      )}
      {policies.content_moderation && (
        <div className="border rounded p-4">
          <h4 className="font-medium mb-2">Content Moderation</h4>
          <div className="text-sm space-y-1 text-muted-foreground">
            <p>Auto approve: {policies.content_moderation.auto_approve ? "Yes" : "No"}</p>
            <p>Review required: {policies.content_moderation.require_review ? "Yes" : "No"}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function AuthorityCard({ authority }: { authority: GovernanceAuthority }) {
  const levelStyles: Record<string, string> = {
    region: "bg-purple-100 text-purple-800",
    country: "bg-blue-100 text-blue-800",
    authority: "bg-green-100 text-green-800",
    department: "bg-orange-100 text-orange-800",
  }

  return (
    <div className="border rounded p-4 flex items-center justify-between">
      <div>
        <p className="font-medium">{authority.name}</p>
        <span className={`text-xs px-2 py-0.5 rounded ${levelStyles[authority.jurisdiction_level] || "bg-gray-100"}`}>
          {authority.jurisdiction_level}
        </span>
      </div>
      <span className={`text-xs px-2 py-0.5 rounded ${authority.is_active ? "bg-green-100 text-green-800" : "bg-gray-100"}`}>
        {authority.is_active ? "Active" : "Inactive"}
      </span>
    </div>
  )
}
