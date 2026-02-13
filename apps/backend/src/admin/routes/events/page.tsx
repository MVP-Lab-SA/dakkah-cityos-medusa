import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { Calendar, CurrencyDollar } from "@medusajs/icons"
import { DataTable } from "../../components/tables/data-table.js"
import { StatusBadge } from "../../components/common"
import { StatsGrid } from "../../components/charts/stats-grid.js"

type Event = {
  id: string
  name: string
  date: string
  venue: string
  tickets_sold: number
  tickets_available: number
  price_range: string
  status: string
  category: string
}

const mockEvents: Event[] = [
  { id: "evt_01", name: "Summer Music Festival 2026", date: "2026-06-15", venue: "Central Park Arena", tickets_sold: 8500, tickets_available: 10000, price_range: "$75-$250", status: "on_sale", category: "Music" },
  { id: "evt_02", name: "Tech Innovation Conference", date: "2026-04-20", venue: "Convention Center", tickets_sold: 1200, tickets_available: 1500, price_range: "$199-$499", status: "on_sale", category: "Technology" },
  { id: "evt_03", name: "Comedy Night Live", date: "2026-03-08", venue: "Laugh Factory", tickets_sold: 350, tickets_available: 350, price_range: "$35-$65", status: "sold_out", category: "Comedy" },
  { id: "evt_04", name: "Food & Wine Expo", date: "2026-05-12", venue: "Exhibition Hall", tickets_sold: 2800, tickets_available: 5000, price_range: "$45-$120", status: "on_sale", category: "Food & Drink" },
  { id: "evt_05", name: "Championship Basketball Finals", date: "2026-07-01", venue: "Sports Stadium", tickets_sold: 15000, tickets_available: 20000, price_range: "$50-$500", status: "on_sale", category: "Sports" },
  { id: "evt_06", name: "Art Gallery Opening Night", date: "2026-03-22", venue: "Modern Art Museum", tickets_sold: 180, tickets_available: 200, price_range: "$25-$50", status: "on_sale", category: "Art" },
  { id: "evt_07", name: "Business Leadership Summit", date: "2026-09-10", venue: "Grand Hotel Ballroom", tickets_sold: 0, tickets_available: 800, price_range: "$299-$599", status: "draft", category: "Business" },
  { id: "evt_08", name: "New Year's Eve Gala", date: "2026-12-31", venue: "Rooftop Lounge", tickets_sold: 420, tickets_available: 500, price_range: "$150-$350", status: "on_sale", category: "Entertainment" },
]

const EventsPage = () => {
  const events = mockEvents
  const upcoming = events.filter(e => e.status !== "completed").length
  const totalTicketsSold = events.reduce((s, e) => s + e.tickets_sold, 0)
  const totalRevenue = 1850000

  const stats = [
    { label: "Total Events", value: events.length, icon: <Calendar className="w-5 h-5" /> },
    { label: "Upcoming", value: upcoming, color: "blue" as const },
    { label: "Tickets Sold", value: totalTicketsSold.toLocaleString(), color: "green" as const },
    { label: "Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: <CurrencyDollar className="w-5 h-5" />, color: "green" as const },
  ]

  const columns = [
    { key: "name", header: "Event", sortable: true, cell: (e: Event) => (
      <div><Text className="font-medium">{e.name}</Text><Text className="text-ui-fg-muted text-sm">{e.venue}</Text></div>
    )},
    { key: "date", header: "Date", sortable: true, cell: (e: Event) => e.date },
    { key: "category", header: "Category", cell: (e: Event) => <Badge color="grey">{e.category}</Badge> },
    { key: "tickets", header: "Tickets", sortable: true, cell: (e: Event) => (
      <div>
        <Text className="font-medium">{e.tickets_sold.toLocaleString()} / {e.tickets_available.toLocaleString()}</Text>
        <div className="w-20 h-1.5 bg-ui-bg-subtle rounded-full overflow-hidden mt-1">
          <div className="h-full bg-ui-tag-blue-icon rounded-full" style={{ width: `${Math.round((e.tickets_sold / e.tickets_available) * 100)}%` }} />
        </div>
      </div>
    )},
    { key: "price_range", header: "Price Range", cell: (e: Event) => e.price_range },
    { key: "status", header: "Status", cell: (e: Event) => <StatusBadge status={e.status} /> },
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div><Heading level="h1">Event Ticketing</Heading><Text className="text-ui-fg-muted">Manage events, venues, and ticket sales</Text></div>
        </div>
      </div>

      <div className="p-6"><StatsGrid stats={stats} columns={4} /></div>

      <div className="px-6 pb-6">
        <DataTable data={events} columns={columns} searchable searchPlaceholder="Search events..." searchKeys={["name", "venue", "category"]} loading={false} emptyMessage="No events found" />
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Events", icon: Calendar })
export default EventsPage
