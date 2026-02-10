import { Link } from "@tanstack/react-router"
import { formatPrice } from "@/lib/utils/price"
import { BuildingStorefront, User, CreditCard, DocumentText, ChevronRight } from "@medusajs/icons"
import { useTenantPrefix } from "@/lib/context/tenant-context"

interface CompanyOverviewProps {
  company: {
    id: string
    name: string
    credit_limit?: number
    spending_limit?: number
    available_credit?: number
  }
  stats: {
    memberCount: number
    pendingApprovals: number
    ordersThisMonth: number
    spentThisMonth: number
  }
  currencyCode: string
}

export function CompanyOverview({ company, stats, currencyCode }: CompanyOverviewProps) {
  const prefix = useTenantPrefix()
  const quickLinks = [
    {
      label: "Team Members",
      href: `${prefix}/business/team`,
      icon: User,
      value: `${stats.memberCount} members`,
    },
    {
      label: "Pending Approvals",
      href: `${prefix}/business/approvals`,
      icon: DocumentText,
      value: `${stats.pendingApprovals} pending`,
      highlight: stats.pendingApprovals > 0,
    },
    {
      label: "Company Orders",
      href: `${prefix}/business/orders`,
      icon: BuildingStorefront,
      value: `${stats.ordersThisMonth} this month`,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Company Header */}
      <div className="bg-ds-background rounded-xl border border-ds-border p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-ds-primary flex items-center justify-center">
            <BuildingStorefront className="w-8 h-8 text-ds-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ds-foreground">{company.name}</h1>
            <p className="text-ds-muted-foreground">Business Account</p>
          </div>
        </div>
      </div>

      {/* Credit & Spending */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {company.credit_limit && (
          <div className="bg-ds-background rounded-xl border border-ds-border p-6">
            <div className="flex items-center gap-3 mb-3">
              <CreditCard className="w-5 h-5 text-ds-muted-foreground" />
              <span className="text-sm font-medium text-ds-muted-foreground">Credit Limit</span>
            </div>
            <p className="text-2xl font-bold text-ds-foreground">
              {formatPrice(company.credit_limit, currencyCode)}
            </p>
          </div>
        )}
        {company.available_credit !== undefined && (
          <div className="bg-ds-background rounded-xl border border-ds-border p-6">
            <div className="flex items-center gap-3 mb-3">
              <CreditCard className="w-5 h-5 text-ds-success" />
              <span className="text-sm font-medium text-ds-muted-foreground">Available Credit</span>
            </div>
            <p className="text-2xl font-bold text-ds-success">
              {formatPrice(company.available_credit, currencyCode)}
            </p>
          </div>
        )}
        <div className="bg-ds-background rounded-xl border border-ds-border p-6">
          <div className="flex items-center gap-3 mb-3">
            <DocumentText className="w-5 h-5 text-ds-muted-foreground" />
            <span className="text-sm font-medium text-ds-muted-foreground">Spent This Month</span>
          </div>
          <p className="text-2xl font-bold text-ds-foreground">
            {formatPrice(stats.spentThisMonth, currencyCode)}
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-ds-background rounded-xl border border-ds-border overflow-hidden">
        {quickLinks.map((link, index) => (
          <Link
            key={link.href}
            to={link.href}
            className={`flex items-center justify-between p-4 hover:bg-ds-muted transition-colors ${
              index < quickLinks.length - 1 ? "border-b border-ds-border" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                link.highlight ? "bg-ds-warning" : "bg-ds-muted"
              }`}>
                <link.icon className={`w-5 h-5 ${
                  link.highlight ? "text-ds-warning" : "text-ds-muted-foreground"
                }`} />
              </div>
              <div>
                <p className="font-medium text-ds-foreground">{link.label}</p>
                <p className={`text-sm ${link.highlight ? "text-ds-warning font-medium" : "text-ds-muted-foreground"}`}>
                  {link.value}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-ds-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  )
}
