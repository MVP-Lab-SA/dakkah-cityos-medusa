import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text } from "@medusajs/ui"
import { AcademicCap, CurrencyDollar, UserGroup } from "@medusajs/icons"
import { DataTable } from "../../components/tables/data-table.js"
import { StatusBadge } from "../../components/common"
import { StatsGrid } from "../../components/charts/stats-grid.js"

type Course = {
  id: string
  title: string
  instructor: string
  students_enrolled: number
  price: number
  status: string
  category: string
  completion_rate: number
  duration_hours: number
}

const mockCourses: Course[] = [
  { id: "crs_01", title: "Introduction to Web Development", instructor: "Sarah Johnson", students_enrolled: 1250, price: 49.99, status: "active", category: "Technology", completion_rate: 78, duration_hours: 40 },
  { id: "crs_02", title: "Advanced Python Programming", instructor: "Michael Chen", students_enrolled: 890, price: 79.99, status: "active", category: "Technology", completion_rate: 65, duration_hours: 60 },
  { id: "crs_03", title: "Digital Marketing Mastery", instructor: "Emily Davis", students_enrolled: 2100, price: 59.99, status: "active", category: "Marketing", completion_rate: 82, duration_hours: 30 },
  { id: "crs_04", title: "Financial Accounting Basics", instructor: "Robert Williams", students_enrolled: 670, price: 39.99, status: "active", category: "Business", completion_rate: 71, duration_hours: 25 },
  { id: "crs_05", title: "UX/UI Design Fundamentals", instructor: "Lisa Park", students_enrolled: 1450, price: 69.99, status: "active", category: "Design", completion_rate: 74, duration_hours: 35 },
  { id: "crs_06", title: "Data Science with R", instructor: "James Anderson", students_enrolled: 520, price: 89.99, status: "draft", category: "Technology", completion_rate: 0, duration_hours: 50 },
  { id: "crs_07", title: "Public Speaking Masterclass", instructor: "Angela Martinez", students_enrolled: 3200, price: 29.99, status: "active", category: "Personal Development", completion_rate: 88, duration_hours: 15 },
  { id: "crs_08", title: "Photography for Beginners", instructor: "David Kim", students_enrolled: 980, price: 44.99, status: "archived", category: "Creative", completion_rate: 91, duration_hours: 20 },
]

const EducationPage = () => {
  const courses = mockCourses
  const activeCourses = courses.filter(c => c.status === "active")
  const totalStudents = courses.reduce((s, c) => s + c.students_enrolled, 0)
  const avgCompletion = Math.round(activeCourses.reduce((s, c) => s + c.completion_rate, 0) / activeCourses.length)
  const totalRevenue = courses.reduce((s, c) => s + (c.price * c.students_enrolled), 0)

  const stats = [
    { label: "Total Courses", value: courses.length, icon: <AcademicCap className="w-5 h-5" /> },
    { label: "Active Students", value: totalStudents.toLocaleString(), icon: <UserGroup className="w-5 h-5" />, color: "blue" as const },
    { label: "Completion Rate", value: `${avgCompletion}%`, color: "green" as const },
    { label: "Revenue", value: `$${Math.round(totalRevenue).toLocaleString()}`, icon: <CurrencyDollar className="w-5 h-5" />, color: "green" as const },
  ]

  const columns = [
    { key: "title", header: "Course", sortable: true, cell: (c: Course) => (
      <div><Text className="font-medium">{c.title}</Text><Text className="text-ui-fg-muted text-sm">{c.duration_hours}h · {c.category}</Text></div>
    )},
    { key: "instructor", header: "Instructor", cell: (c: Course) => c.instructor },
    { key: "students_enrolled", header: "Students", sortable: true, cell: (c: Course) => c.students_enrolled.toLocaleString() },
    { key: "price", header: "Price", sortable: true, cell: (c: Course) => <Text className="font-medium">${c.price.toFixed(2)}</Text> },
    { key: "completion_rate", header: "Completion", sortable: true, cell: (c: Course) => (
      <div className="flex items-center gap-2">
        <div className="w-16 h-2 bg-ui-bg-subtle rounded-full overflow-hidden">
          <div className="h-full bg-ui-tag-green-icon rounded-full" style={{ width: `${c.completion_rate}%` }} />
        </div>
        <Text className="text-sm">{c.completion_rate}%</Text>
      </div>
    )},
    { key: "status", header: "Status", cell: (c: Course) => <StatusBadge status={c.status} /> },
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div><Heading level="h1">Education / Courses</Heading><Text className="text-ui-fg-muted">Manage courses, instructors, and student enrollments</Text></div>
        </div>
      </div>

      <div className="p-6"><StatsGrid stats={stats} columns={4} /></div>

      <div className="px-6 pb-6">
        <DataTable data={courses} columns={columns} searchable searchPlaceholder="Search courses..." searchKeys={["title", "instructor", "category"]} loading={false} emptyMessage="No courses found" />
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Education", icon: AcademicCap })
export default EducationPage
