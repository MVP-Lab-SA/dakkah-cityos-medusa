import { Link } from "@tanstack/react-router"
import { formatPrice } from "@/lib/utils/price"
import { BuildingStorefront, User, CreditCard, DocumentText, ChevronRight } from "@medusajs/icons"

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
  countryCode: string
}

export function CompanyOverview({ company, stats, currencyCode, countryCode }: CompanyOverviewProps) {
  const quickLinks = [
    {
      label: "Team Members",
      href: `/${countryCode}/business/team`,
      icon: User,
      value: `${stats.memberCount} members`,
    },
    {
      label: "Pending Approvals",
      href: `/${countryCode}/business/approvals`,
      icon: DocumentText,
      value: `${stats.pendingApprovals} pending`,
      highlight: stats.pendingApprovals > 0,
    },
    {
      label: "Company Orders",
      href: `/${countryCode}/business/orders`,
      icon: BuildingStorefront,
      value: `${stats.ordersThisMonth} this month`,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Company Header */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-zinc-900 flex items-center justify-center">
            <BuildingStorefront className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">{company.name}</h1>
            <p className="text-zinc-500">Business Account</p>
          </div>
        </div>
      </div>

      {/* Credit & Spending */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {company.credit_limit && (
          <div className="bg-white rounded-xl border border-zinc-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <CreditCard className="w-5 h-5 text-zinc-600" />
              <span className="text-sm font-medium text-zinc-600">Credit Limit</span>
            </div>
            <p className="text-2xl font-bold text-zinc-900">
              {formatPrice(company.credit_limit, currencyCode)}
            </p>
          </div>
        )}
        {company.available_credit !== undefined && (
          <div className="bg-white rounded-xl border border-zinc-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <CreditCard className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-zinc-600">Available Credit</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {formatPrice(company.available_credit, currencyCode)}
            </p>
          </div>
        )}
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <DocumentText className="w-5 h-5 text-zinc-600" />
            <span className="text-sm font-medium text-zinc-600">Spent This Month</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900">
            {formatPrice(stats.spentThisMonth, currencyCode)}
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        {quickLinks.map((link, index) => (
          <Link
            key={link.href}
            to={link.href}
            className={`flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors ${
              index < quickLinks.length - 1 ? "border-b border-zinc-100" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                link.highlight ? "bg-yellow-100" : "bg-zinc-100"
              }`}>
                <link.icon className={`w-5 h-5 ${
                  link.highlight ? "text-yellow-600" : "text-zinc-600"
                }`} />
              </div>
              <div>
                <p className="font-medium text-zinc-900">{link.label}</p>
                <p className={`text-sm ${link.highlight ? "text-yellow-600 font-medium" : "text-zinc-500"}`}>
                  {link.value}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-400" />
          </Link>
        ))}
      </div>
    </div>
  )
}
