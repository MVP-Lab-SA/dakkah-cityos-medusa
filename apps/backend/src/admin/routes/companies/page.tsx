import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Badge, Input, toast, Label } from "@medusajs/ui"
import { BuildingStorefront, Plus, PencilSquare, CurrencyDollar, DocumentText, CheckCircle, XCircle } from "@medusajs/icons"
import { useState } from "react"
import { useCompanies, useCreateCompany, useUpdateCompany, Company } from "../../hooks/use-companies"
import { usePurchaseOrders, useApprovePurchaseOrder, useRejectPurchaseOrder, PurchaseOrder } from "../../hooks/use-companies"
import { DataTable } from "../../components/tables/data-table"
import { StatusBadge, TierBadge } from "../../components/common"
import { StatsGrid } from "../../components/charts/stats-grid"
import { ConfirmModal } from "../../components/modals/confirm-modal"
import { FormDrawer } from "../../components/forms/form-drawer"

const CompaniesPage = () => {
  const [activeTab, setActiveTab] = useState<"companies" | "purchase-orders">("companies")
  const [showCreateDrawer, setShowCreateDrawer] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [approvingPO, setApprovingPO] = useState<PurchaseOrder | null>(null)
  const [rejectingPO, setRejectingPO] = useState<PurchaseOrder | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    tax_id: "",
    tier: "bronze" as "bronze" | "silver" | "gold" | "platinum",
    credit_limit: 0,
  })

  const { data: companiesData, isLoading: loadingCompanies } = useCompanies()
  const { data: posData, isLoading: loadingPOs } = usePurchaseOrders()
  
  const createCompany = useCreateCompany()
  const updateCompany = useUpdateCompany()
  const approvePO = useApprovePurchaseOrder()
  const rejectPO = useRejectPurchaseOrder()

  const companies = companiesData?.companies || []
  const purchaseOrders = posData?.purchase_orders || []

  const stats = [
    { label: "Total Companies", value: companies.length, icon: <BuildingStorefront className="w-5 h-5" /> },
    { label: "Active", value: companies.filter(c => c.status === "active").length, color: "green" as const },
    { label: "Total Credit Extended", value: `$${companies.reduce((sum, c) => sum + (c.credit_limit - c.credit_balance), 0).toLocaleString()}`, icon: <CurrencyDollar className="w-5 h-5" /> },
    { label: "Pending POs", value: purchaseOrders.filter(po => po.status === "pending_approval").length, color: "orange" as const },
  ]

  const handleCreateCompany = async () => {
    try {
      await createCompany.mutateAsync(formData)
      toast.success("Company created successfully")
      setShowCreateDrawer(false)
      resetForm()
    } catch (error) {
      toast.error("Failed to create company")
    }
  }

  const handleUpdateCompany = async () => {
    if (!editingCompany) return
    try {
      await updateCompany.mutateAsync({ id: editingCompany.id, ...formData })
      toast.success("Company updated successfully")
      setEditingCompany(null)
      resetForm()
    } catch (error) {
      toast.error("Failed to update company")
    }
  }

  const handleApprovePO = async () => {
    if (!approvingPO) return
    try {
      await approvePO.mutateAsync({ id: approvingPO.id })
      toast.success("Purchase order approved")
      setApprovingPO(null)
    } catch (error) {
      toast.error("Failed to approve purchase order")
    }
  }

  const handleRejectPO = async () => {
    if (!rejectingPO) return
    try {
      await rejectPO.mutateAsync({ id: rejectingPO.id, reason: "Rejected by admin" })
      toast.success("Purchase order rejected")
      setRejectingPO(null)
    } catch (error) {
      toast.error("Failed to reject purchase order")
    }
  }

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", tax_id: "", tier: "bronze", credit_limit: 0 })
  }

  const openEditDrawer = (company: Company) => {
    setFormData({
      name: company.name,
      email: company.email,
      phone: company.phone || "",
      tax_id: company.tax_id || "",
      tier: company.tier,
      credit_limit: company.credit_limit,
    })
    setEditingCompany(company)
  }

  const companyColumns = [
    { key: "name", header: "Company", sortable: true, cell: (c: Company) => (
      <div>
        <Text className="font-medium">{c.name}</Text>
        <Text className="text-ui-fg-muted text-sm">{c.email}</Text>
      </div>
    )},
    { key: "tier", header: "Tier", cell: (c: Company) => <TierBadge tier={c.tier} /> },
    { key: "status", header: "Status", cell: (c: Company) => <StatusBadge status={c.status} /> },
    { key: "credit_limit", header: "Credit Limit", sortable: true, cell: (c: Company) => `$${c.credit_limit.toLocaleString()}` },
    { key: "credit_balance", header: "Available Credit", cell: (c: Company) => `$${c.credit_balance.toLocaleString()}` },
    { key: "actions", header: "", width: "80px", cell: (c: Company) => (
      <Button variant="transparent" size="small" onClick={() => openEditDrawer(c)}>
        <PencilSquare className="w-4 h-4" />
      </Button>
    )},
  ]

  const poColumns = [
    { key: "po_number", header: "PO Number", sortable: true },
    { key: "company", header: "Company", cell: (po: PurchaseOrder) => po.company?.name || "-" },
    { key: "total", header: "Total", sortable: true, cell: (po: PurchaseOrder) => `$${po.total.toLocaleString()}` },
    { key: "status", header: "Status", cell: (po: PurchaseOrder) => <StatusBadge status={po.status} /> },
    { key: "created_at", header: "Created", sortable: true, cell: (po: PurchaseOrder) => new Date(po.created_at).toLocaleDateString() },
    { key: "actions", header: "", width: "120px", cell: (po: PurchaseOrder) => po.status === "pending_approval" ? (
      <div className="flex gap-1">
        <Button variant="secondary" size="small" onClick={() => setApprovingPO(po)}>
          <CheckCircle className="w-4 h-4 text-ui-tag-green-icon" />
        </Button>
        <Button variant="secondary" size="small" onClick={() => setRejectingPO(po)}>
          <XCircle className="w-4 h-4 text-ui-tag-red-icon" />
        </Button>
      </div>
    ) : null },
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div>
            <Heading level="h1">B2B Commerce</Heading>
            <Text className="text-ui-fg-muted">Manage companies, purchase orders, and credit</Text>
          </div>
          <Button onClick={() => setShowCreateDrawer(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Company
          </Button>
        </div>
      </div>

      <div className="p-6">
        <StatsGrid stats={stats} columns={4} />
      </div>

      <div className="px-6 pb-6">
        {/* Simple tabs */}
        <div className="flex gap-4 border-b border-ui-border-base mb-4">
          <button
            className={`pb-2 px-1 ${activeTab === "companies" ? "border-b-2 border-ui-fg-base font-medium" : "text-ui-fg-muted"}`}
            onClick={() => setActiveTab("companies")}
          >
            <div className="flex items-center gap-2">
              <BuildingStorefront className="w-4 h-4" />
              Companies ({companies.length})
            </div>
          </button>
          <button
            className={`pb-2 px-1 ${activeTab === "purchase-orders" ? "border-b-2 border-ui-fg-base font-medium" : "text-ui-fg-muted"}`}
            onClick={() => setActiveTab("purchase-orders")}
          >
            <div className="flex items-center gap-2">
              <DocumentText className="w-4 h-4" />
              Purchase Orders ({purchaseOrders.length})
            </div>
          </button>
        </div>

        {activeTab === "companies" && (
          <DataTable
            data={companies}
            columns={companyColumns}
            searchable
            searchPlaceholder="Search companies..."
            searchKeys={["name", "email"]}
            loading={loadingCompanies}
            emptyMessage="No companies found"
          />
        )}

        {activeTab === "purchase-orders" && (
          <DataTable
            data={purchaseOrders}
            columns={poColumns}
            searchable
            searchPlaceholder="Search POs..."
            searchKeys={["po_number"]}
            loading={loadingPOs}
            emptyMessage="No purchase orders found"
          />
        )}
      </div>

      {/* Create/Edit Company Drawer */}
      <FormDrawer
        open={showCreateDrawer || !!editingCompany}
        onOpenChange={(open) => {
          if (!open) {
            setShowCreateDrawer(false)
            setEditingCompany(null)
            resetForm()
          }
        }}
        title={editingCompany ? "Edit Company" : "Create Company"}
        description={editingCompany ? "Update company details" : "Add a new B2B company"}
        onSubmit={editingCompany ? handleUpdateCompany : handleCreateCompany}
        submitLabel={editingCompany ? "Update" : "Create"}
        loading={createCompany.isPending || updateCompany.isPending}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Company Name</Label>
            <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Acme Corporation" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="contact@acme.com" />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+1 555 123 4567" />
          </div>
          <div>
            <Label htmlFor="tax_id">Tax ID</Label>
            <Input id="tax_id" value={formData.tax_id} onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })} placeholder="XX-XXXXXXX" />
          </div>
          <div>
            <Label htmlFor="tier">Tier</Label>
            <select
              id="tier"
              value={formData.tier}
              onChange={(e) => setFormData({ ...formData, tier: e.target.value as any })}
              className="w-full border border-ui-border-base rounded-md px-3 py-2 bg-ui-bg-base"
            >
              <option value="bronze">Bronze</option>
              <option value="silver">Silver</option>
              <option value="gold">Gold</option>
              <option value="platinum">Platinum</option>
            </select>
          </div>
          <div>
            <Label htmlFor="credit_limit">Credit Limit ($)</Label>
            <Input id="credit_limit" type="number" value={formData.credit_limit} onChange={(e) => setFormData({ ...formData, credit_limit: Number(e.target.value) })} placeholder="10000" />
          </div>
        </div>
      </FormDrawer>

      <ConfirmModal
        open={!!approvingPO}
        onOpenChange={() => setApprovingPO(null)}
        title="Approve Purchase Order"
        description={`Are you sure you want to approve PO ${approvingPO?.po_number}?`}
        onConfirm={handleApprovePO}
        confirmLabel="Approve"
        loading={approvePO.isPending}
      />

      <ConfirmModal
        open={!!rejectingPO}
        onOpenChange={() => setRejectingPO(null)}
        title="Reject Purchase Order"
        description={`Are you sure you want to reject PO ${rejectingPO?.po_number}?`}
        onConfirm={handleRejectPO}
        confirmLabel="Reject"
        variant="danger"
        loading={rejectPO.isPending}
      />
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Companies",
  icon: BuildingStorefront,
})

export default CompaniesPage
