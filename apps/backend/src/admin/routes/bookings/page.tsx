import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Badge, Input, toast, Label } from "@medusajs/ui"
import { Calendar, Plus, PencilSquare, CheckCircle, XCircle, User } from "@medusajs/icons"
import { useState } from "react"
import { 
  useBookings, useConfirmBooking, useCancelBooking, useCompleteBooking, useMarkNoShow, Booking,
  useServiceProviders, useCreateServiceProvider, useUpdateServiceProvider, ServiceProvider
} from "../../hooks/use-bookings"
import { DataTable } from "../../components/tables/data-table"
import { StatusBadge } from "../../components/common"
import { StatsGrid } from "../../components/charts/stats-grid"
import { ConfirmModal } from "../../components/modals/confirm-modal"
import { FormDrawer } from "../../components/forms/form-drawer"

const BookingsPage = () => {
  const [activeTab, setActiveTab] = useState<"bookings" | "providers">("bookings")
  const [showProviderDrawer, setShowProviderDrawer] = useState(false)
  const [editingProvider, setEditingProvider] = useState<ServiceProvider | null>(null)
  const [cancelingBooking, setCancelingBooking] = useState<Booking | null>(null)
  const [confirmingBooking, setConfirmingBooking] = useState<Booking | null>(null)

  const [providerFormData, setProviderFormData] = useState({
    name: "", email: "", phone: "", bio: "", is_active: true,
  })

  const { data: bookingsData, isLoading: loadingBookings } = useBookings()
  const { data: providersData, isLoading: loadingProviders } = useServiceProviders()

  const createProvider = useCreateServiceProvider()
  const updateProvider = useUpdateServiceProvider()
  const confirmBooking = useConfirmBooking()
  const cancelBooking = useCancelBooking()
  const completeBooking = useCompleteBooking()
  const markNoShow = useMarkNoShow()

  const bookings = bookingsData?.bookings || []
  const providers = providersData?.providers || []

  const today = new Date().toISOString().split("T")[0]
  const todayBookings = bookings.filter(b => b.booking_date === today)
  const upcomingBookings = bookings.filter(b => b.booking_date > today)

  const stats = [
    { label: "Today's Bookings", value: todayBookings.length, icon: <Calendar className="w-5 h-5" />, color: "blue" as const },
    { label: "Upcoming", value: upcomingBookings.length, color: "green" as const },
    { label: "Pending Confirmation", value: bookings.filter(b => b.status === "pending").length, color: "orange" as const },
    { label: "Active Providers", value: providers.filter(p => p.is_active).length, icon: <User className="w-5 h-5" /> },
  ]

  const handleCreateProvider = async () => {
    try {
      await createProvider.mutateAsync(providerFormData)
      toast.success("Provider created successfully")
      setShowProviderDrawer(false)
      resetProviderForm()
    } catch (error) {
      toast.error("Failed to create provider")
    }
  }

  const handleUpdateProvider = async () => {
    if (!editingProvider) return
    try {
      await updateProvider.mutateAsync({ id: editingProvider.id, ...providerFormData })
      toast.success("Provider updated successfully")
      setEditingProvider(null)
      resetProviderForm()
    } catch (error) {
      toast.error("Failed to update provider")
    }
  }

  const handleConfirmBooking = async () => {
    if (!confirmingBooking) return
    try {
      await confirmBooking.mutateAsync(confirmingBooking.id)
      toast.success("Booking confirmed")
      setConfirmingBooking(null)
    } catch (error) {
      toast.error("Failed to confirm booking")
    }
  }

  const handleCancelBooking = async () => {
    if (!cancelingBooking) return
    try {
      await cancelBooking.mutateAsync({ id: cancelingBooking.id, reason: "Canceled by admin" })
      toast.success("Booking canceled")
      setCancelingBooking(null)
    } catch (error) {
      toast.error("Failed to cancel booking")
    }
  }

  const handleCompleteBooking = async (id: string) => {
    try {
      await completeBooking.mutateAsync({ id })
      toast.success("Booking completed")
    } catch (error) {
      toast.error("Failed to complete booking")
    }
  }

  const handleMarkNoShow = async (id: string) => {
    try {
      await markNoShow.mutateAsync(id)
      toast.success("Marked as no-show")
    } catch (error) {
      toast.error("Failed to mark no-show")
    }
  }

  const resetProviderForm = () => {
    setProviderFormData({ name: "", email: "", phone: "", bio: "", is_active: true })
  }

  const openEditProviderDrawer = (provider: ServiceProvider) => {
    setProviderFormData({
      name: provider.name, email: provider.email, phone: provider.phone || "", bio: provider.bio || "", is_active: provider.is_active,
    })
    setEditingProvider(provider)
  }

  const bookingColumns = [
    { key: "customer", header: "Customer", cell: (b: Booking) => (
      <div><Text className="font-medium">{b.customer?.first_name} {b.customer?.last_name}</Text><Text className="text-ui-fg-muted text-sm">{b.customer?.email}</Text></div>
    )},
    { key: "booking_date", header: "Date", sortable: true, cell: (b: Booking) => (
      <div><Text className="font-medium">{b.booking_date === today ? "Today" : b.booking_date}</Text><Text className="text-ui-fg-muted text-sm">{b.start_time} - {b.end_time}</Text></div>
    )},
    { key: "provider", header: "Provider", cell: (b: Booking) => b.provider?.name || "-" },
    { key: "duration", header: "Duration", cell: (b: Booking) => `${b.duration} min` },
    { key: "status", header: "Status", cell: (b: Booking) => <StatusBadge status={b.status} /> },
    { key: "actions", header: "", width: "160px", cell: (b: Booking) => (
      <div className="flex gap-1">
        {b.status === "pending" && (
          <>
            <Button variant="secondary" size="small" onClick={() => setConfirmingBooking(b)}><CheckCircle className="w-4 h-4 text-ui-tag-green-icon" /></Button>
            <Button variant="secondary" size="small" onClick={() => setCancelingBooking(b)}><XCircle className="w-4 h-4 text-ui-tag-red-icon" /></Button>
          </>
        )}
        {b.status === "confirmed" && (
          <>
            <Button variant="secondary" size="small" onClick={() => handleCompleteBooking(b.id)}>Complete</Button>
            <Button variant="secondary" size="small" onClick={() => handleMarkNoShow(b.id)}>No-show</Button>
          </>
        )}
      </div>
    )},
  ]

  const providerColumns = [
    { key: "name", header: "Provider", sortable: true, cell: (p: ServiceProvider) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-ui-bg-subtle flex items-center justify-center"><User className="w-4 h-4 text-ui-fg-muted" /></div>
        <div><Text className="font-medium">{p.name}</Text><Text className="text-ui-fg-muted text-sm">{p.email}</Text></div>
      </div>
    )},
    { key: "phone", header: "Phone", cell: (p: ServiceProvider) => p.phone || "-" },
    { key: "services", header: "Services", cell: (p: ServiceProvider) => `${p.services?.length || 0} services` },
    { key: "is_active", header: "Status", cell: (p: ServiceProvider) => <Badge color={p.is_active ? "green" : "grey"}>{p.is_active ? "Active" : "Inactive"}</Badge> },
    { key: "actions", header: "", width: "80px", cell: (p: ServiceProvider) => (
      <Button variant="transparent" size="small" onClick={() => openEditProviderDrawer(p)}><PencilSquare className="w-4 h-4" /></Button>
    )},
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div><Heading level="h1">Bookings</Heading><Text className="text-ui-fg-muted">Manage appointments and service providers</Text></div>
          <Button onClick={() => setShowProviderDrawer(true)}><Plus className="w-4 h-4 mr-2" />Add Provider</Button>
        </div>
      </div>

      <div className="p-6"><StatsGrid stats={stats} columns={4} /></div>

      <div className="px-6 pb-6">
        <div className="flex gap-4 border-b border-ui-border-base mb-4">
          <button className={`pb-2 px-1 ${activeTab === "bookings" ? "border-b-2 border-ui-fg-base font-medium" : "text-ui-fg-muted"}`} onClick={() => setActiveTab("bookings")}>
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4" />Bookings ({bookings.length})</div>
          </button>
          <button className={`pb-2 px-1 ${activeTab === "providers" ? "border-b-2 border-ui-fg-base font-medium" : "text-ui-fg-muted"}`} onClick={() => setActiveTab("providers")}>
            <div className="flex items-center gap-2"><User className="w-4 h-4" />Providers ({providers.length})</div>
          </button>
        </div>

        {activeTab === "bookings" && <DataTable data={bookings} columns={bookingColumns} searchable searchPlaceholder="Search bookings..." searchKeys={[]} loading={loadingBookings} emptyMessage="No bookings found" />}
        {activeTab === "providers" && <DataTable data={providers} columns={providerColumns} searchable searchPlaceholder="Search providers..." searchKeys={["name", "email"]} loading={loadingProviders} emptyMessage="No providers found" />}
      </div>

      <FormDrawer
        open={showProviderDrawer || !!editingProvider}
        onOpenChange={(open) => { if (!open) { setShowProviderDrawer(false); setEditingProvider(null); resetProviderForm() } }}
        title={editingProvider ? "Edit Provider" : "Add Provider"}
        onSubmit={editingProvider ? handleUpdateProvider : handleCreateProvider}
        submitLabel={editingProvider ? "Update" : "Add"}
        loading={createProvider.isPending || updateProvider.isPending}
      >
        <div className="space-y-4">
          <div><Label htmlFor="name">Name</Label><Input id="name" value={providerFormData.name} onChange={(e) => setProviderFormData({ ...providerFormData, name: e.target.value })} /></div>
          <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={providerFormData.email} onChange={(e) => setProviderFormData({ ...providerFormData, email: e.target.value })} /></div>
          <div><Label htmlFor="phone">Phone</Label><Input id="phone" value={providerFormData.phone} onChange={(e) => setProviderFormData({ ...providerFormData, phone: e.target.value })} /></div>
          <div><Label htmlFor="bio">Bio</Label><Input id="bio" value={providerFormData.bio} onChange={(e) => setProviderFormData({ ...providerFormData, bio: e.target.value })} /></div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_active" checked={providerFormData.is_active} onChange={(e) => setProviderFormData({ ...providerFormData, is_active: e.target.checked })} />
            <Label htmlFor="is_active">Active</Label>
          </div>
        </div>
      </FormDrawer>

      <ConfirmModal open={!!confirmingBooking} onOpenChange={() => setConfirmingBooking(null)} title="Confirm Booking" description={`Confirm booking for ${confirmingBooking?.customer?.first_name} ${confirmingBooking?.customer?.last_name}?`} onConfirm={handleConfirmBooking} confirmLabel="Confirm" loading={confirmBooking.isPending} />
      <ConfirmModal open={!!cancelingBooking} onOpenChange={() => setCancelingBooking(null)} title="Cancel Booking" description={`Cancel booking for ${cancelingBooking?.customer?.first_name} ${cancelingBooking?.customer?.last_name}?`} onConfirm={handleCancelBooking} confirmLabel="Cancel Booking" variant="danger" loading={cancelBooking.isPending} />
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Bookings", icon: Calendar })
export default BookingsPage
