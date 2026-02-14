export interface ManagePageConfig {
  title: string
  entityType: string
  apiEndpoint: string
  columns: { key: string; label: string; sortable?: boolean }[]
  filters?: { key: string; label: string; options: string[] }[]
  actions?: string[]
}

export interface ManageField {
  key: string
  label: string
  type: "text" | "number" | "select" | "date" | "boolean"
  required?: boolean
  options?: string[]
}

export function getManagePageConfig(entityType: string): ManagePageConfig | null {
  const configs: Record<string, ManagePageConfig> = {
    products: {
      title: "Manage Products",
      entityType: "products",
      apiEndpoint: "/api/admin/products",
      columns: [
        { key: "title", label: "Title", sortable: true },
        { key: "status", label: "Status", sortable: true },
        { key: "price", label: "Price", sortable: true },
        { key: "created_at", label: "Created", sortable: true },
      ],
      filters: [{ key: "status", label: "Status", options: ["draft", "published", "archived"] }],
      actions: ["create", "edit", "delete"],
    },
    orders: {
      title: "Manage Orders",
      entityType: "orders",
      apiEndpoint: "/api/admin/orders",
      columns: [
        { key: "display_id", label: "Order #", sortable: true },
        { key: "status", label: "Status", sortable: true },
        { key: "total", label: "Total", sortable: true },
        { key: "created_at", label: "Date", sortable: true },
      ],
      actions: ["view", "fulfill", "cancel"],
    },
  }

  return configs[entityType] || null
}

export function validateManageFields(
  fields: ManageField[],
  data: Record<string, any>
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}

  for (const field of fields) {
    const value = data[field.key]

    if (field.required && (value === undefined || value === null || value === "")) {
      errors[field.key] = `${field.label} is required`
      continue
    }

    if (value !== undefined && value !== null && value !== "") {
      if (field.type === "number" && typeof value !== "number" && isNaN(Number(value))) {
        errors[field.key] = `${field.label} must be a number`
      }
      if (field.type === "select" && field.options && !field.options.includes(value)) {
        errors[field.key] = `${field.label} must be one of: ${field.options.join(", ")}`
      }
    }
  }

  return { valid: Object.keys(errors).length === 0, errors }
}

export function formatManageTableData(
  items: Record<string, any>[],
  columns: { key: string; label: string }[]
): { headers: string[]; rows: any[][] } {
  const headers = columns.map((c) => c.label)
  const rows = items.map((item) => columns.map((col) => item[col.key] ?? ""))
  return { headers, rows }
}

export function getManageStatusOptions(entityType: string): string[] {
  const statusMap: Record<string, string[]> = {
    products: ["draft", "published", "archived"],
    orders: ["pending", "processing", "completed", "cancelled"],
    invoices: ["draft", "sent", "paid", "overdue", "void"],
    memberships: ["active", "expired", "cancelled"],
    rentals: ["reserved", "active", "returned", "cancelled"],
  }

  return statusMap[entityType] || ["active", "inactive"]
}
