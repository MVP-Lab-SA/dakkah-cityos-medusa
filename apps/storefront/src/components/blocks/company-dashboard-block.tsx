import React, { useState } from 'react'

interface CompanyDashboardBlockProps {
  showSpend?: boolean
  showOrders?: boolean
  showTeam?: boolean
  showBudget?: boolean
  period?: 'monthly' | 'quarterly' | 'yearly'
}

const teamMembers = [
  { name: 'Sarah Chen', role: 'Admin', email: 's.chen@company.com', avatar: 'SC' },
  { name: 'James Wilson', role: 'Buyer', email: 'j.wilson@company.com', avatar: 'JW' },
  { name: 'Maria Garcia', role: 'Manager', email: 'm.garcia@company.com', avatar: 'MG' },
  { name: 'Ahmed Hassan', role: 'Buyer', email: 'a.hassan@company.com', avatar: 'AH' },
]

const recentActivity = [
  { action: 'Purchase Order #PO-847 submitted', user: 'James Wilson', time: '2 hours ago' },
  { action: 'Invoice #INV-1203 paid', user: 'Sarah Chen', time: '5 hours ago' },
  { action: 'New team member added', user: 'Maria Garcia', time: '1 day ago' },
  { action: 'Budget limit updated', user: 'Sarah Chen', time: '2 days ago' },
  { action: 'Purchase Order #PO-845 approved', user: 'Maria Garcia', time: '3 days ago' },
]

const periodData: Record<string, { spend: number; orders: number; orderValue: number; budget: number; budgetUsed: number }> = {
  monthly: { spend: 12450, orders: 23, orderValue: 541, budget: 25000, budgetUsed: 12450 },
  quarterly: { spend: 38200, orders: 67, orderValue: 570, budget: 75000, budgetUsed: 38200 },
  yearly: { spend: 142800, orders: 245, orderValue: 583, budget: 300000, budgetUsed: 142800 },
}

export const CompanyDashboardBlock: React.FC<CompanyDashboardBlockProps> = ({
  showSpend = true,
  showOrders = true,
  showTeam = true,
  showBudget = true,
  period: defaultPeriod = 'monthly',
}) => {
  const [period, setPeriod] = useState(defaultPeriod)
  const data = periodData[period]

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-ds-foreground">
            Company Dashboard
          </h2>
          <div className="flex items-center gap-1 p-1 bg-ds-muted rounded-lg">
            {(['monthly', 'quarterly', 'yearly'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                  period === p
                    ? 'bg-ds-background text-ds-foreground shadow-sm'
                    : 'text-ds-muted-foreground hover:text-ds-foreground'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {showSpend && (
            <div className="border border-ds-border rounded-lg p-5 bg-ds-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-ds-primary/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-ds-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xs text-ds-muted-foreground">Total Spend</p>
              </div>
              <p className="text-2xl font-bold text-ds-foreground">${data.spend.toLocaleString()}</p>
              <p className="text-xs text-ds-success mt-1">+12.5% vs last period</p>
            </div>
          )}

          {showOrders && (
            <>
              <div className="border border-ds-border rounded-lg p-5 bg-ds-card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-ds-secondary/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-ds-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-xs text-ds-muted-foreground">Total Orders</p>
                </div>
                <p className="text-2xl font-bold text-ds-foreground">{data.orders}</p>
                <p className="text-xs text-ds-muted-foreground mt-1">Avg. ${data.orderValue}/order</p>
              </div>
              <div className="border border-ds-border rounded-lg p-5 bg-ds-card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-ds-warning/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-ds-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xs text-ds-muted-foreground">Pending Approval</p>
                </div>
                <p className="text-2xl font-bold text-ds-foreground">5</p>
                <p className="text-xs text-ds-warning mt-1">3 require urgent review</p>
              </div>
            </>
          )}

          {showBudget && (
            <div className="border border-ds-border rounded-lg p-5 bg-ds-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-ds-success/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-ds-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-xs text-ds-muted-foreground">Budget Utilization</p>
              </div>
              <p className="text-2xl font-bold text-ds-foreground">
                {Math.round((data.budgetUsed / data.budget) * 100)}%
              </p>
              <div className="w-full h-2 bg-ds-muted rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-ds-primary rounded-full"
                  style={{ width: `${(data.budgetUsed / data.budget) * 100}%` }}
                />
              </div>
              <p className="text-xs text-ds-muted-foreground mt-1">
                ${(data.budget - data.budgetUsed).toLocaleString()} remaining
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {showTeam && (
            <div className="border border-ds-border rounded-lg bg-ds-card">
              <div className="px-5 py-4 border-b border-ds-border">
                <h3 className="text-sm font-semibold text-ds-foreground">Team Members</h3>
              </div>
              <div className="divide-y divide-ds-border">
                {teamMembers.map((member) => (
                  <div key={member.email} className="flex items-center gap-3 px-5 py-3">
                    <div className="w-8 h-8 rounded-full bg-ds-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-ds-primary">{member.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ds-foreground truncate">{member.name}</p>
                      <p className="text-xs text-ds-muted-foreground truncate">{member.email}</p>
                    </div>
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-ds-muted text-ds-muted-foreground">
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border border-ds-border rounded-lg bg-ds-card">
            <div className="px-5 py-4 border-b border-ds-border">
              <h3 className="text-sm font-semibold text-ds-foreground">Recent Activity</h3>
            </div>
            <div className="divide-y divide-ds-border">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 px-5 py-3">
                  <div className="w-2 h-2 rounded-full bg-ds-primary mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ds-foreground">{activity.action}</p>
                    <p className="text-xs text-ds-muted-foreground">
                      {activity.user} · {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
