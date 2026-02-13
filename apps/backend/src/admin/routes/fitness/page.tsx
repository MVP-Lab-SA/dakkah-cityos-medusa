import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { Star, User } from "@medusajs/icons"
import { DataTable } from "../../components/tables/data-table.js"
import { StatusBadge } from "../../components/common"
import { StatsGrid } from "../../components/charts/stats-grid.js"

type FitnessClass = {
  id: string
  name: string
  trainer: string
  trainer_email: string
  schedule: string
  time: string
  capacity: number
  enrolled: number
  duration: string
  level: string
  status: string
}

const mockClasses: FitnessClass[] = [
  { id: "fit_01", name: "Morning HIIT Blast", trainer: "Coach Mike", trainer_email: "mike@fitgym.com", schedule: "Mon/Wed/Fri", time: "6:00 AM", capacity: 30, enrolled: 28, duration: "45 min", level: "Advanced", status: "active" },
  { id: "fit_02", name: "Yoga Flow & Restore", trainer: "Priya Sharma", trainer_email: "priya@fitgym.com", schedule: "Tue/Thu", time: "7:30 AM", capacity: 20, enrolled: 18, duration: "60 min", level: "All Levels", status: "active" },
  { id: "fit_03", name: "Spin Class Endurance", trainer: "Jake Torres", trainer_email: "jake@fitgym.com", schedule: "Mon/Wed/Fri", time: "5:30 PM", capacity: 25, enrolled: 25, duration: "50 min", level: "Intermediate", status: "full" },
  { id: "fit_04", name: "Boxing Fundamentals", trainer: "Rina Patel", trainer_email: "rina@fitgym.com", schedule: "Tue/Thu/Sat", time: "12:00 PM", capacity: 15, enrolled: 12, duration: "60 min", level: "Beginner", status: "active" },
  { id: "fit_05", name: "Pilates Core Strength", trainer: "Emma Davis", trainer_email: "emma@fitgym.com", schedule: "Mon/Wed", time: "9:00 AM", capacity: 18, enrolled: 14, duration: "55 min", level: "Intermediate", status: "active" },
  { id: "fit_06", name: "CrossFit WOD", trainer: "Coach Mike", trainer_email: "mike@fitgym.com", schedule: "Mon-Fri", time: "4:00 PM", capacity: 20, enrolled: 19, duration: "60 min", level: "Advanced", status: "active" },
  { id: "fit_07", name: "Aqua Aerobics", trainer: "Lisa Chen", trainer_email: "lisa@fitgym.com", schedule: "Wed/Fri", time: "10:00 AM", capacity: 22, enrolled: 8, duration: "45 min", level: "All Levels", status: "active" },
  { id: "fit_08", name: "Zumba Dance Party", trainer: "Carlos Reyes", trainer_email: "carlos@fitgym.com", schedule: "Sat", time: "11:00 AM", capacity: 35, enrolled: 0, duration: "60 min", level: "All Levels", status: "cancelled" },
]

const FitnessPage = () => {
  const classes = mockClasses
  const activeMembers = 248
  const uniqueTrainers = [...new Set(classes.map(c => c.trainer))].length
  const sessionsToday = 6

  const stats = [
    { label: "Total Classes", value: classes.length, icon: <Star className="w-5 h-5" /> },
    { label: "Active Members", value: activeMembers, color: "green" as const },
    { label: "Trainers", value: uniqueTrainers, icon: <User className="w-5 h-5" />, color: "blue" as const },
    { label: "Sessions Today", value: sessionsToday, color: "blue" as const },
  ]

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Advanced": return "red"
      case "Intermediate": return "orange"
      case "Beginner": return "green"
      default: return "blue"
    }
  }

  const columns = [
    { key: "name", header: "Class", sortable: true, cell: (c: FitnessClass) => (
      <div><Text className="font-medium">{c.name}</Text><Text className="text-ui-fg-muted text-sm">{c.duration} · {c.schedule}</Text></div>
    )},
    { key: "trainer", header: "Trainer", cell: (c: FitnessClass) => (
      <div><Text className="font-medium">{c.trainer}</Text><Text className="text-ui-fg-muted text-sm">{c.time}</Text></div>
    )},
    { key: "capacity", header: "Capacity", sortable: true, cell: (c: FitnessClass) => (
      <div>
        <Text className="font-medium text-sm">{c.enrolled}/{c.capacity}</Text>
        <div className="w-20 h-1.5 bg-ui-bg-subtle rounded-full overflow-hidden mt-1">
          <div className={`h-full rounded-full ${c.enrolled >= c.capacity ? "bg-ui-tag-red-icon" : "bg-ui-tag-green-icon"}`} style={{ width: `${Math.round((c.enrolled / c.capacity) * 100)}%` }} />
        </div>
      </div>
    )},
    { key: "level", header: "Level", cell: (c: FitnessClass) => <Badge color={getLevelColor(c.level) as any}>{c.level}</Badge> },
    { key: "status", header: "Status", cell: (c: FitnessClass) => <StatusBadge status={c.status} /> },
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div><Heading level="h1">Fitness Services</Heading><Text className="text-ui-fg-muted">Manage fitness classes, trainers, and memberships</Text></div>
        </div>
      </div>

      <div className="p-6"><StatsGrid stats={stats} columns={4} /></div>

      <div className="px-6 pb-6">
        <DataTable data={classes} columns={columns} searchable searchPlaceholder="Search classes..." searchKeys={["name", "trainer", "level"]} loading={false} emptyMessage="No fitness classes found" />
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Fitness", icon: Star })
export default FitnessPage
