import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Table, Input } from "@medusajs/ui"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../lib/client"
import { Calendar } from "@medusajs/icons"
import { useState } from "react"

interface Booking {
  id: string
  customer_id: string
  customer_email?: string
  service_provider_id?: string
  provider_name?: string
  status: string
  booking_date: string
  start_time: string
  end_time: string
  duration_minutes: number
  total_amount: number
  currency_code: string
  notes?: string
  created_at: string
}

interface ServiceProvider {
  id: string
  name: string
  email: string
  phone?: string
  status: string
  specialty?: string
  services_count: number
  created_at: string
}

const BookingsPage = () => {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<"bookings" | "providers">("bookings")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const response = await sdk.client.fetch<{
        bookings: Booking[]
        count: number
      }>("/admin/bookings", { credentials: "include" })
      return response
    },
  })

  const { data: providersData, isLoading: providersLoading } = useQuery({
    queryKey: ["admin-service-providers"],
    queryFn: async () => {
      const response = await sdk.client.fetch<{
        providers: ServiceProvider[]
        count: number
      }>("/admin/service-providers", { credentials: "include" })
      return response
    },
  })

  const confirmMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      return sdk.client.fetch(`/admin/bookings/${bookingId}`, {
        method: "PUT",
        credentials: "include",
        body: { status: "confirmed" },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] })
    },
  })

  const cancelMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      return sdk.client.fetch(`/admin/bookings/${bookingId}`, {
        method: "PUT",
        credentials: "include",
        body: { status: "cancelled" },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] })
    },
  })

  const completeMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      return sdk.client.fetch(`/admin/bookings/${bookingId}`, {
        method: "PUT",
        credentials: "include",
        body: { status: "completed" },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] })
    },
  })

  const bookings = bookingsData?.bookings || []
  const providers = providersData?.providers || []

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      (b.customer_email?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (b.provider_name?.toLowerCase() || "").includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || b.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "green"
      case "pending":
        return "orange"
      case "cancelled":
        return "red"
      case "completed":
        return "blue"
      case "no_show":
        return "grey"
      default:
        return "grey"
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString()
  }

  const formatTime = (timeStr: string) => {
    return timeStr
  }

  const formatMoney = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: (currency || "usd").toUpperCase(),
    }).format(amount)
  }

  const todayBookings = bookings.filter((b) => {
    const today = new Date().toDateString()
    return new Date(b.booking_date).toDateString() === today
  }).length

  const pendingCount = bookings.filter((b) => b.status === "pending").length

  const isLoading = bookingsLoading || providersLoading

  if (isLoading) {
    return (
      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h1">Bookings</Heading>
        </div>
        <div className="px-6 py-4">
          <Text className="text-ui-fg-subtle">Loading bookings...</Text>
        </div>
      </Container>
    )
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h1">Bookings & Services</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            Manage appointments, service providers, and availability
          </Text>
        </div>
        <div className="flex items-center gap-x-6">
          <div className="text-right">
            <Text size="small" weight="plus">
              {todayBookings} today
            </Text>
            <Text size="xsmall" className="text-ui-fg-subtle">
              {pendingCount} pending
            </Text>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-x-4 px-6 py-4">
        <Button
          size="small"
          variant={activeTab === "bookings" ? "primary" : "secondary"}
          onClick={() => setActiveTab("bookings")}
        >
          Bookings ({bookings.length})
        </Button>
        <Button
          size="small"
          variant={activeTab === "providers" ? "primary" : "secondary"}
          onClick={() => setActiveTab("providers")}
        >
          Providers ({providers.length})
        </Button>
      </div>

      {activeTab === "bookings" && (
        <>
          <div className="flex items-center gap-x-4 px-6 py-4">
            <Input
              size="small"
              placeholder="Search bookings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <div className="flex items-center gap-x-2">
              <Button
                size="small"
                variant={statusFilter === "all" ? "primary" : "secondary"}
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button
                size="small"
                variant={statusFilter === "pending" ? "primary" : "secondary"}
                onClick={() => setStatusFilter("pending")}
              >
                Pending
              </Button>
              <Button
                size="small"
                variant={statusFilter === "confirmed" ? "primary" : "secondary"}
                onClick={() => setStatusFilter("confirmed")}
              >
                Confirmed
              </Button>
            </div>
          </div>

          <div className="px-6 py-4">
            {filteredBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Calendar className="text-ui-fg-muted mb-4" />
                <Text className="text-ui-fg-subtle">No bookings found</Text>
              </div>
            ) : (
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Customer</Table.HeaderCell>
                    <Table.HeaderCell>Provider</Table.HeaderCell>
                    <Table.HeaderCell>Date & Time</Table.HeaderCell>
                    <Table.HeaderCell>Duration</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Amount</Table.HeaderCell>
                    <Table.HeaderCell>Actions</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {filteredBookings.map((booking) => (
                    <Table.Row key={booking.id}>
                      <Table.Cell>
                        <Text size="small">
                          {booking.customer_email || booking.customer_id}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="small">{booking.provider_name || "-"}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <div>
                          <Text size="small" weight="plus">
                            {formatDate(booking.booking_date)}
                          </Text>
                          <Text size="xsmall" className="text-ui-fg-subtle">
                            {formatTime(booking.start_time)} -{" "}
                            {formatTime(booking.end_time)}
                          </Text>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="small">{booking.duration_minutes} min</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge size="2xsmall" color={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="small">
                          {formatMoney(booking.total_amount, booking.currency_code)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-x-2">
                          {booking.status === "pending" && (
                            <>
                              <Button
                                size="small"
                                variant="secondary"
                                onClick={() => confirmMutation.mutate(booking.id)}
                                disabled={confirmMutation.isPending}
                              >
                                Confirm
                              </Button>
                              <Button
                                size="small"
                                variant="secondary"
                                onClick={() => cancelMutation.mutate(booking.id)}
                                disabled={cancelMutation.isPending}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          {booking.status === "confirmed" && (
                            <Button
                              size="small"
                              variant="secondary"
                              onClick={() => completeMutation.mutate(booking.id)}
                              disabled={completeMutation.isPending}
                            >
                              Complete
                            </Button>
                          )}
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            )}
          </div>
        </>
      )}

      {activeTab === "providers" && (
        <div className="px-6 py-4">
          {providers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Calendar className="text-ui-fg-muted mb-4" />
              <Text className="text-ui-fg-subtle">No service providers yet</Text>
            </div>
          ) : (
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Provider</Table.HeaderCell>
                  <Table.HeaderCell>Specialty</Table.HeaderCell>
                  <Table.HeaderCell>Services</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {providers.map((provider) => (
                  <Table.Row key={provider.id}>
                    <Table.Cell>
                      <div>
                        <Text size="small" weight="plus">
                          {provider.name}
                        </Text>
                        <Text size="small" className="text-ui-fg-subtle">
                          {provider.email}
                        </Text>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="small">{provider.specialty || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="small">{provider.services_count}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        size="2xsmall"
                        color={provider.status === "active" ? "green" : "grey"}
                      >
                        {provider.status}
                      </Badge>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </div>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Bookings",
  icon: Calendar,
})

export default BookingsPage
