import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { Heart, Star, Clock, User } from "@medusajs/icons"
import { DataTable } from "../../components/tables/data-table.js"
import { StatusBadge } from "../../components/common"
import { StatsGrid } from "../../components/charts/stats-grid.js"

type Provider = {
  id: string
  name: string
  specialty: string
  availability: string
  rating: number
  appointments_today: number
  status: string
  location: string
  patients_count: number
}

const mockProviders: Provider[] = [
  { id: "hcp_01", name: "Dr. Sarah Mitchell", specialty: "Cardiology", availability: "Mon-Fri", rating: 4.9, appointments_today: 8, status: "active", location: "Main Hospital", patients_count: 450 },
  { id: "hcp_02", name: "Dr. James Lee", specialty: "Dermatology", availability: "Mon-Thu", rating: 4.7, appointments_today: 12, status: "active", location: "Downtown Clinic", patients_count: 320 },
  { id: "hcp_03", name: "Dr. Maria Garcia", specialty: "Pediatrics", availability: "Mon-Sat", rating: 4.8, appointments_today: 15, status: "active", location: "Children's Center", patients_count: 580 },
  { id: "hcp_04", name: "Dr. Robert Kim", specialty: "Orthopedics", availability: "Tue-Fri", rating: 4.6, appointments_today: 6, status: "active", location: "Sports Medicine Center", patients_count: 290 },
  { id: "hcp_05", name: "Dr. Emily Thompson", specialty: "Neurology", availability: "Mon-Wed", rating: 4.9, appointments_today: 5, status: "active", location: "Main Hospital", patients_count: 210 },
  { id: "hcp_06", name: "Dr. David Patel", specialty: "Ophthalmology", availability: "Mon-Fri", rating: 4.5, appointments_today: 10, status: "on_leave", location: "Eye Care Center", patients_count: 380 },
  { id: "hcp_07", name: "Dr. Linda Johnson", specialty: "General Practice", availability: "Mon-Sat", rating: 4.4, appointments_today: 18, status: "active", location: "Community Health", patients_count: 720 },
  { id: "hcp_08", name: "Dr. Michael Brown", specialty: "Psychiatry", availability: "Mon-Thu", rating: 4.8, appointments_today: 7, status: "active", location: "Mental Health Wing", patients_count: 165 },
]

const HealthcarePage = () => {
  const providers = mockProviders
  const totalAppointments = providers.reduce((s, p) => s + p.appointments_today, 0)
  const avgWait = "18 min"

  const stats = [
    { label: "Total Providers", value: providers.length, icon: <User className="w-5 h-5" /> },
    { label: "Appointments Today", value: totalAppointments, color: "blue" as const },
    { label: "Avg Wait Time", value: avgWait, icon: <Clock className="w-5 h-5" />, color: "orange" as const },
    { label: "Avg Rating", value: (providers.reduce((s, p) => s + p.rating, 0) / providers.length).toFixed(1), icon: <Star className="w-5 h-5" />, color: "green" as const },
  ]

  const columns = [
    { key: "name", header: "Provider", sortable: true, cell: (p: Provider) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-ui-bg-subtle flex items-center justify-center"><Heart className="w-4 h-4 text-ui-tag-red-icon" /></div>
        <div><Text className="font-medium">{p.name}</Text><Text className="text-ui-fg-muted text-sm">{p.location}</Text></div>
      </div>
    )},
    { key: "specialty", header: "Specialty", cell: (p: Provider) => <Badge color="blue">{p.specialty}</Badge> },
    { key: "availability", header: "Availability", cell: (p: Provider) => p.availability },
    { key: "appointments_today", header: "Today's Appts", sortable: true, cell: (p: Provider) => p.appointments_today },
    { key: "rating", header: "Rating", sortable: true, cell: (p: Provider) => (
      <div className="flex items-center gap-1"><Star className="w-4 h-4 text-ui-tag-orange-icon" /><Text className="font-medium">{p.rating}</Text></div>
    )},
    { key: "patients_count", header: "Patients", sortable: true, cell: (p: Provider) => p.patients_count.toLocaleString() },
    { key: "status", header: "Status", cell: (p: Provider) => <StatusBadge status={p.status} /> },
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div><Heading level="h1">Healthcare Services</Heading><Text className="text-ui-fg-muted">Manage healthcare providers, appointments, and services</Text></div>
        </div>
      </div>

      <div className="p-6"><StatsGrid stats={stats} columns={4} /></div>

      <div className="px-6 pb-6">
        <DataTable data={providers} columns={columns} searchable searchPlaceholder="Search providers..." searchKeys={["name", "specialty", "location"]} loading={false} emptyMessage="No providers found" />
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Healthcare", icon: Heart })
export default HealthcarePage
