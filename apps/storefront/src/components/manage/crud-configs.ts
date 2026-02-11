import type { FormField } from "./ui/form-drawer"

export interface CrudConfig {
  moduleKey: string
  apiEndpoint: string
  dataKey: string
  singularKey: string
  label: string
  singularLabel: string
  fields: FormField[]
  defaultValues: Record<string, any>
  canCreate?: boolean
  canEdit?: boolean
  canDelete?: boolean
}

export const crudConfigs: Record<string, CrudConfig> = {
  products: {
    moduleKey: "products",
    apiEndpoint: "/admin/products",
    dataKey: "products",
    singularKey: "product",
    label: "Products",
    singularLabel: "Product",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, placeholder: "Product title" },
      { key: "subtitle", label: "Subtitle", type: "text", placeholder: "Product subtitle" },
      { key: "description", label: "Description", type: "textarea", placeholder: "Product description" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "draft", label: "Draft" },
        { value: "published", label: "Published" },
        { value: "archived", label: "Archived" },
      ]},
      { key: "handle", label: "Handle", type: "text", placeholder: "product-handle" },
      { key: "thumbnail", label: "Thumbnail URL", type: "url", placeholder: "https://example.com/image.jpg" },
    ],
    defaultValues: { title: "", subtitle: "", description: "", status: "draft", handle: "", thumbnail: "" },
  },

  orders: {
    moduleKey: "orders",
    apiEndpoint: "/admin/orders",
    dataKey: "orders",
    singularKey: "order",
    label: "Orders",
    singularLabel: "Order",
    canCreate: false,
    canDelete: false,
    fields: [
      { key: "status", label: "Status", type: "select", options: [
        { value: "pending", label: "Pending" },
        { value: "processing", label: "Processing" },
        { value: "shipped", label: "Shipped" },
        { value: "delivered", label: "Delivered" },
        { value: "cancelled", label: "Cancelled" },
      ]},
      { key: "fulfillment_status", label: "Fulfillment Status", type: "select", options: [
        { value: "not_fulfilled", label: "Not Fulfilled" },
        { value: "partially_fulfilled", label: "Partially Fulfilled" },
        { value: "fulfilled", label: "Fulfilled" },
        { value: "returned", label: "Returned" },
      ]},
      { key: "notes", label: "Notes", type: "textarea", placeholder: "Order notes" },
    ],
    defaultValues: { status: "pending", fulfillment_status: "not_fulfilled", notes: "" },
  },

  customers: {
    moduleKey: "customers",
    apiEndpoint: "/admin/customers",
    dataKey: "customers",
    singularKey: "customer",
    label: "Customers",
    singularLabel: "Customer",
    fields: [
      { key: "first_name", label: "First Name", type: "text", required: true, placeholder: "First name" },
      { key: "last_name", label: "Last Name", type: "text", required: true, placeholder: "Last name" },
      { key: "email", label: "Email", type: "email", required: true, placeholder: "email@example.com" },
      { key: "phone", label: "Phone", type: "text", placeholder: "+1 (555) 000-0000" },
    ],
    defaultValues: { first_name: "", last_name: "", email: "", phone: "" },
  },

  vendors: {
    moduleKey: "vendors",
    apiEndpoint: "/admin/vendors",
    dataKey: "vendors",
    singularKey: "vendor",
    label: "Vendors",
    singularLabel: "Vendor",
    fields: [
      { key: "company_name", label: "Company Name", type: "text", required: true, placeholder: "Company name" },
      { key: "email", label: "Email", type: "email", required: true, placeholder: "vendor@example.com" },
      { key: "phone", label: "Phone", type: "text", placeholder: "+1 (555) 000-0000" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "pending", label: "Pending" },
        { value: "approved", label: "Approved" },
        { value: "suspended", label: "Suspended" },
      ]},
      { key: "description", label: "Description", type: "textarea", placeholder: "Vendor description" },
    ],
    defaultValues: { company_name: "", email: "", phone: "", status: "pending", description: "" },
  },

  commissions: {
    moduleKey: "commissions",
    apiEndpoint: "/admin/commissions",
    dataKey: "commissions",
    singularKey: "commission",
    label: "Commissions",
    singularLabel: "Commission",
    fields: [
      { key: "vendor_id", label: "Vendor ID", type: "text", placeholder: "Vendor ID" },
      { key: "rate", label: "Rate", type: "number", required: true, placeholder: "0" },
      { key: "type", label: "Type", type: "select", options: [
        { value: "percentage", label: "Percentage" },
        { value: "fixed", label: "Fixed" },
      ]},
      { key: "status", label: "Status", type: "select", options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ]},
    ],
    defaultValues: { vendor_id: "", rate: 0, type: "percentage", status: "active" },
  },

  payouts: {
    moduleKey: "payouts",
    apiEndpoint: "/admin/payouts",
    dataKey: "payouts",
    singularKey: "payout",
    label: "Payouts",
    singularLabel: "Payout",
    canCreate: false,
    fields: [
      { key: "status", label: "Status", type: "select", options: [
        { value: "pending", label: "Pending" },
        { value: "processing", label: "Processing" },
        { value: "completed", label: "Completed" },
        { value: "failed", label: "Failed" },
      ]},
      { key: "notes", label: "Notes", type: "textarea", placeholder: "Payout notes" },
    ],
    defaultValues: { status: "pending", notes: "" },
  },

  auctions: {
    moduleKey: "auctions",
    apiEndpoint: "/admin/auctions",
    dataKey: "auctions",
    singularKey: "auction",
    label: "Auctions",
    singularLabel: "Auction",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, placeholder: "Auction title" },
      { key: "description", label: "Description", type: "textarea", placeholder: "Auction description" },
      { key: "starting_price", label: "Starting Price", type: "number", required: true, placeholder: "0" },
      { key: "reserve_price", label: "Reserve Price", type: "number", placeholder: "0" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "active", label: "Active" },
        { value: "ended", label: "Ended" },
        { value: "cancelled", label: "Cancelled" },
      ]},
      { key: "start_date", label: "Start Date", type: "date" },
      { key: "end_date", label: "End Date", type: "date" },
    ],
    defaultValues: { title: "", description: "", starting_price: 0, reserve_price: 0, status: "active", start_date: "", end_date: "" },
  },

  bookings: {
    moduleKey: "bookings",
    apiEndpoint: "/admin/bookings",
    dataKey: "bookings",
    singularKey: "booking",
    label: "Bookings",
    singularLabel: "Booking",
    fields: [
      { key: "service_name", label: "Service Name", type: "text", required: true, placeholder: "Service name" },
      { key: "customer_name", label: "Customer Name", type: "text", placeholder: "Customer name" },
      { key: "date_time", label: "Date & Time", type: "date" },
      { key: "duration", label: "Duration (minutes)", type: "number", placeholder: "60" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "pending", label: "Pending" },
        { value: "confirmed", label: "Confirmed" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
      ]},
      { key: "provider_name", label: "Provider Name", type: "text", placeholder: "Provider name" },
      { key: "notes", label: "Notes", type: "textarea", placeholder: "Booking notes" },
    ],
    defaultValues: { service_name: "", customer_name: "", date_time: "", duration: 0, status: "pending", provider_name: "", notes: "" },
  },

  "event-ticketing": {
    moduleKey: "event-ticketing",
    apiEndpoint: "/admin/events",
    dataKey: "events",
    singularKey: "event",
    label: "Event Ticketing",
    singularLabel: "Event",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, placeholder: "Event title" },
      { key: "description", label: "Description", type: "textarea", placeholder: "Event description" },
      { key: "venue", label: "Venue", type: "text", placeholder: "Venue name" },
      { key: "date", label: "Date", type: "date" },
      { key: "capacity", label: "Capacity", type: "number", placeholder: "0" },
      { key: "price", label: "Price", type: "number", placeholder: "0" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "draft", label: "Draft" },
        { value: "published", label: "Published" },
        { value: "sold-out", label: "Sold Out" },
        { value: "cancelled", label: "Cancelled" },
      ]},
    ],
    defaultValues: { title: "", description: "", venue: "", date: "", capacity: 0, price: 0, status: "draft" },
  },

  rentals: {
    moduleKey: "rentals",
    apiEndpoint: "/admin/rentals",
    dataKey: "rentals",
    singularKey: "rental",
    label: "Rentals",
    singularLabel: "Rental",
    fields: [
      { key: "item_name", label: "Item Name", type: "text", required: true, placeholder: "Item name" },
      { key: "description", label: "Description", type: "textarea", placeholder: "Item description" },
      { key: "daily_rate", label: "Daily Rate", type: "number", required: true, placeholder: "0" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "available", label: "Available" },
        { value: "rented", label: "Rented" },
        { value: "maintenance", label: "Maintenance" },
      ]},
      { key: "category", label: "Category", type: "text", placeholder: "Category" },
    ],
    defaultValues: { item_name: "", description: "", daily_rate: 0, status: "available", category: "" },
  },

  restaurants: {
    moduleKey: "restaurants",
    apiEndpoint: "/admin/restaurants",
    dataKey: "restaurants",
    singularKey: "restaurant",
    label: "Restaurants",
    singularLabel: "Restaurant",
    fields: [
      { key: "name", label: "Name", type: "text", required: true, placeholder: "Restaurant name" },
      { key: "cuisine", label: "Cuisine", type: "text", placeholder: "Italian, Japanese, etc." },
      { key: "address", label: "Address", type: "text", placeholder: "Restaurant address" },
      { key: "phone", label: "Phone", type: "text", placeholder: "+1 (555) 000-0000" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ]},
      { key: "rating", label: "Rating", type: "number", placeholder: "0" },
    ],
    defaultValues: { name: "", cuisine: "", address: "", phone: "", status: "active", rating: 0 },
  },

  grocery: {
    moduleKey: "grocery",
    apiEndpoint: "/admin/grocery",
    dataKey: "grocery",
    singularKey: "grocery_item",
    label: "Grocery",
    singularLabel: "Grocery Item",
    fields: [
      { key: "name", label: "Name", type: "text", required: true, placeholder: "Item name" },
      { key: "category", label: "Category", type: "text", placeholder: "Category" },
      { key: "price", label: "Price", type: "number", required: true, placeholder: "0" },
      { key: "stock", label: "Stock", type: "number", placeholder: "0" },
      { key: "unit", label: "Unit", type: "text", placeholder: "kg, lb, each, etc." },
      { key: "status", label: "Status", type: "select", options: [
        { value: "available", label: "Available" },
        { value: "out-of-stock", label: "Out of Stock" },
      ]},
    ],
    defaultValues: { name: "", category: "", price: 0, stock: 0, unit: "", status: "available" },
  },

  travel: {
    moduleKey: "travel",
    apiEndpoint: "/admin/travel",
    dataKey: "travel",
    singularKey: "travel_package",
    label: "Travel",
    singularLabel: "Travel Package",
    fields: [
      { key: "destination", label: "Destination", type: "text", required: true, placeholder: "Destination" },
      { key: "description", label: "Description", type: "textarea", placeholder: "Package description" },
      { key: "package_type", label: "Package Type", type: "select", options: [
        { value: "flight", label: "Flight" },
        { value: "hotel", label: "Hotel" },
        { value: "tour", label: "Tour" },
        { value: "package", label: "Package" },
      ]},
      { key: "price", label: "Price", type: "number", required: true, placeholder: "0" },
      { key: "duration", label: "Duration", type: "text", placeholder: "7 days" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "available", label: "Available" },
        { value: "booked", label: "Booked" },
        { value: "cancelled", label: "Cancelled" },
      ]},
    ],
    defaultValues: { destination: "", description: "", package_type: "flight", price: 0, duration: "", status: "available" },
  },

  automotive: {
    moduleKey: "automotive",
    apiEndpoint: "/admin/automotive",
    dataKey: "automotive",
    singularKey: "vehicle",
    label: "Automotive",
    singularLabel: "Vehicle",
    fields: [
      { key: "make", label: "Make", type: "text", required: true, placeholder: "Toyota, Ford, etc." },
      { key: "model", label: "Model", type: "text", required: true, placeholder: "Camry, F-150, etc." },
      { key: "year", label: "Year", type: "number", placeholder: "2024" },
      { key: "price", label: "Price", type: "number", required: true, placeholder: "0" },
      { key: "mileage", label: "Mileage", type: "number", placeholder: "0" },
      { key: "condition", label: "Condition", type: "select", options: [
        { value: "new", label: "New" },
        { value: "used", label: "Used" },
        { value: "certified", label: "Certified" },
      ]},
      { key: "status", label: "Status", type: "select", options: [
        { value: "available", label: "Available" },
        { value: "sold", label: "Sold" },
        { value: "reserved", label: "Reserved" },
      ]},
    ],
    defaultValues: { make: "", model: "", year: 0, price: 0, mileage: 0, condition: "new", status: "available" },
  },

  "real-estate": {
    moduleKey: "real-estate",
    apiEndpoint: "/admin/real-estate",
    dataKey: "listings",
    singularKey: "listing",
    label: "Real Estate",
    singularLabel: "Listing",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, placeholder: "Listing title" },
      { key: "address", label: "Address", type: "text", required: true, placeholder: "Property address" },
      { key: "property_type", label: "Property Type", type: "select", options: [
        { value: "residential", label: "Residential" },
        { value: "commercial", label: "Commercial" },
        { value: "industrial", label: "Industrial" },
        { value: "land", label: "Land" },
      ]},
      { key: "price", label: "Price", type: "number", required: true, placeholder: "0" },
      { key: "area", label: "Area (sq ft)", type: "number", placeholder: "0" },
      { key: "bedrooms", label: "Bedrooms", type: "number", placeholder: "0" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "available", label: "Available" },
        { value: "sold", label: "Sold" },
        { value: "rented", label: "Rented" },
        { value: "pending", label: "Pending" },
      ]},
    ],
    defaultValues: { title: "", address: "", property_type: "residential", price: 0, area: 0, bedrooms: 0, status: "available" },
  },

  healthcare: {
    moduleKey: "healthcare",
    apiEndpoint: "/admin/healthcare",
    dataKey: "healthcare",
    singularKey: "service",
    label: "Healthcare",
    singularLabel: "Healthcare Service",
    fields: [
      { key: "service_name", label: "Service Name", type: "text", required: true, placeholder: "Service name" },
      { key: "provider", label: "Provider", type: "text", placeholder: "Provider name" },
      { key: "specialty", label: "Specialty", type: "text", placeholder: "Specialty" },
      { key: "price", label: "Price", type: "number", placeholder: "0" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ]},
      { key: "description", label: "Description", type: "textarea", placeholder: "Service description" },
    ],
    defaultValues: { service_name: "", provider: "", specialty: "", price: 0, status: "active", description: "" },
  },

  education: {
    moduleKey: "education",
    apiEndpoint: "/admin/education",
    dataKey: "education",
    singularKey: "course",
    label: "Education",
    singularLabel: "Course",
    fields: [
      { key: "course_name", label: "Course Name", type: "text", required: true, placeholder: "Course name" },
      { key: "instructor", label: "Instructor", type: "text", placeholder: "Instructor name" },
      { key: "duration", label: "Duration", type: "text", placeholder: "8 weeks" },
      { key: "price", label: "Price", type: "number", placeholder: "0" },
      { key: "level", label: "Level", type: "select", options: [
        { value: "beginner", label: "Beginner" },
        { value: "intermediate", label: "Intermediate" },
        { value: "advanced", label: "Advanced" },
      ]},
      { key: "status", label: "Status", type: "select", options: [
        { value: "active", label: "Active" },
        { value: "draft", label: "Draft" },
        { value: "archived", label: "Archived" },
      ]},
      { key: "description", label: "Description", type: "textarea", placeholder: "Course description" },
    ],
    defaultValues: { course_name: "", instructor: "", duration: "", price: 0, level: "beginner", status: "active", description: "" },
  },

  fitness: {
    moduleKey: "fitness",
    apiEndpoint: "/admin/fitness",
    dataKey: "fitness",
    singularKey: "class",
    label: "Fitness",
    singularLabel: "Fitness Class",
    fields: [
      { key: "class_name", label: "Class Name", type: "text", required: true, placeholder: "Class name" },
      { key: "instructor", label: "Instructor", type: "text", placeholder: "Instructor name" },
      { key: "schedule", label: "Schedule", type: "text", placeholder: "Mon/Wed/Fri 9:00 AM" },
      { key: "capacity", label: "Capacity", type: "number", placeholder: "0" },
      { key: "price", label: "Price", type: "number", placeholder: "0" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ]},
    ],
    defaultValues: { class_name: "", instructor: "", schedule: "", capacity: 0, price: 0, status: "active" },
  },

  "pet-services": {
    moduleKey: "pet-services",
    apiEndpoint: "/admin/pet-services",
    dataKey: "services",
    singularKey: "service",
    label: "Pet Services",
    singularLabel: "Pet Service",
    fields: [
      { key: "service_name", label: "Service Name", type: "text", required: true, placeholder: "Service name" },
      { key: "pet_type", label: "Pet Type", type: "select", options: [
        { value: "dog", label: "Dog" },
        { value: "cat", label: "Cat" },
        { value: "bird", label: "Bird" },
        { value: "other", label: "Other" },
      ]},
      { key: "price", label: "Price", type: "number", placeholder: "0" },
      { key: "duration", label: "Duration", type: "text", placeholder: "30 minutes" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ]},
      { key: "description", label: "Description", type: "textarea", placeholder: "Service description" },
    ],
    defaultValues: { service_name: "", pet_type: "dog", price: 0, duration: "", status: "active", description: "" },
  },

  "digital-products": {
    moduleKey: "digital-products",
    apiEndpoint: "/admin/digital-products",
    dataKey: "products",
    singularKey: "product",
    label: "Digital Products",
    singularLabel: "Digital Product",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, placeholder: "Product title" },
      { key: "description", label: "Description", type: "textarea", placeholder: "Product description" },
      { key: "price", label: "Price", type: "number", required: true, placeholder: "0" },
      { key: "file_url", label: "File URL", type: "url", placeholder: "https://example.com/file.zip" },
      { key: "format", label: "Format", type: "text", placeholder: "PDF, ZIP, MP3, etc." },
      { key: "status", label: "Status", type: "select", options: [
        { value: "active", label: "Active" },
        { value: "draft", label: "Draft" },
        { value: "archived", label: "Archived" },
      ]},
    ],
    defaultValues: { title: "", description: "", price: 0, file_url: "", format: "", status: "active" },
  },

  memberships: {
    moduleKey: "memberships",
    apiEndpoint: "/admin/memberships",
    dataKey: "memberships",
    singularKey: "membership",
    label: "Memberships",
    singularLabel: "Membership",
    fields: [
      { key: "name", label: "Name", type: "text", required: true, placeholder: "Membership name" },
      { key: "description", label: "Description", type: "textarea", placeholder: "Membership description" },
      { key: "price", label: "Price", type: "number", required: true, placeholder: "0" },
      { key: "duration_months", label: "Duration (months)", type: "number", placeholder: "12" },
      { key: "benefits", label: "Benefits", type: "textarea", placeholder: "List of benefits" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "draft", label: "Draft" },
      ]},
    ],
    defaultValues: { name: "", description: "", price: 0, duration_months: 0, benefits: "", status: "active" },
  },

  "financial-products": {
    moduleKey: "financial-products",
    apiEndpoint: "/admin/financial-products",
    dataKey: "products",
    singularKey: "product",
    label: "Financial Products",
    singularLabel: "Financial Product",
    fields: [
      { key: "name", label: "Name", type: "text", required: true, placeholder: "Product name" },
      { key: "type", label: "Type", type: "select", options: [
        { value: "insurance", label: "Insurance" },
        { value: "loan", label: "Loan" },
        { value: "investment", label: "Investment" },
        { value: "savings", label: "Savings" },
      ]},
      { key: "description", label: "Description", type: "textarea", placeholder: "Product description" },
      { key: "rate", label: "Rate", type: "number", placeholder: "0" },
      { key: "min_amount", label: "Minimum Amount", type: "number", placeholder: "0" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ]},
    ],
    defaultValues: { name: "", type: "insurance", description: "", rate: 0, min_amount: 0, status: "active" },
  },

  freelance: {
    moduleKey: "freelance",
    apiEndpoint: "/admin/freelance",
    dataKey: "freelance",
    singularKey: "project",
    label: "Freelance",
    singularLabel: "Freelance Project",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, placeholder: "Project title" },
      { key: "category", label: "Category", type: "text", placeholder: "Category" },
      { key: "budget_min", label: "Budget Min", type: "number", placeholder: "0" },
      { key: "budget_max", label: "Budget Max", type: "number", placeholder: "0" },
      { key: "deadline", label: "Deadline", type: "date" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "open", label: "Open" },
        { value: "in-progress", label: "In Progress" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
      ]},
      { key: "description", label: "Description", type: "textarea", placeholder: "Project description" },
    ],
    defaultValues: { title: "", category: "", budget_min: 0, budget_max: 0, deadline: "", status: "open", description: "" },
  },

  parking: {
    moduleKey: "parking",
    apiEndpoint: "/admin/parking",
    dataKey: "parking",
    singularKey: "parking_lot",
    label: "Parking",
    singularLabel: "Parking Lot",
    fields: [
      { key: "location", label: "Location", type: "text", required: true, placeholder: "Parking location" },
      { key: "spots_total", label: "Total Spots", type: "number", required: true, placeholder: "0" },
      { key: "rate_hourly", label: "Hourly Rate", type: "number", placeholder: "0" },
      { key: "rate_daily", label: "Daily Rate", type: "number", placeholder: "0" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "active", label: "Active" },
        { value: "full", label: "Full" },
        { value: "maintenance", label: "Maintenance" },
      ]},
      { key: "description", label: "Description", type: "textarea", placeholder: "Location description" },
    ],
    defaultValues: { location: "", spots_total: 0, rate_hourly: 0, rate_daily: 0, status: "active", description: "" },
  },

  advertising: {
    moduleKey: "advertising",
    apiEndpoint: "/admin/advertising",
    dataKey: "campaigns",
    singularKey: "campaign",
    label: "Advertising",
    singularLabel: "Campaign",
    fields: [
      { key: "name", label: "Name", type: "text", required: true, placeholder: "Campaign name" },
      { key: "type", label: "Type", type: "select", options: [
        { value: "banner", label: "Banner" },
        { value: "native", label: "Native" },
        { value: "sponsored", label: "Sponsored" },
        { value: "popup", label: "Popup" },
      ]},
      { key: "budget", label: "Budget", type: "number", placeholder: "0" },
      { key: "start_date", label: "Start Date", type: "date" },
      { key: "end_date", label: "End Date", type: "date" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "active", label: "Active" },
        { value: "paused", label: "Paused" },
        { value: "ended", label: "Ended" },
        { value: "draft", label: "Draft" },
      ]},
    ],
    defaultValues: { name: "", type: "banner", budget: 0, start_date: "", end_date: "", status: "active" },
  },

  promotions: {
    moduleKey: "promotions",
    apiEndpoint: "/admin/promotions",
    dataKey: "promotions",
    singularKey: "promotion",
    label: "Promotions",
    singularLabel: "Promotion",
    fields: [
      { key: "name", label: "Name", type: "text", required: true, placeholder: "Promotion name" },
      { key: "code", label: "Code", type: "text", placeholder: "PROMO2024" },
      { key: "discount_type", label: "Discount Type", type: "select", options: [
        { value: "percentage", label: "Percentage" },
        { value: "fixed", label: "Fixed" },
      ]},
      { key: "discount_value", label: "Discount Value", type: "number", required: true, placeholder: "0" },
      { key: "start_date", label: "Start Date", type: "date" },
      { key: "end_date", label: "End Date", type: "date" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "expired", label: "Expired" },
      ]},
    ],
    defaultValues: { name: "", code: "", discount_type: "percentage", discount_value: 0, start_date: "", end_date: "", status: "active" },
  },

  "social-commerce": {
    moduleKey: "social-commerce",
    apiEndpoint: "/admin/social-commerce",
    dataKey: "posts",
    singularKey: "post",
    label: "Social Commerce",
    singularLabel: "Social Post",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, placeholder: "Post title" },
      { key: "platform", label: "Platform", type: "select", options: [
        { value: "instagram", label: "Instagram" },
        { value: "facebook", label: "Facebook" },
        { value: "tiktok", label: "TikTok" },
        { value: "twitter", label: "Twitter" },
      ]},
      { key: "content", label: "Content", type: "textarea", placeholder: "Post content" },
      { key: "product_link", label: "Product Link", type: "url", placeholder: "https://example.com/product" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "draft", label: "Draft" },
        { value: "published", label: "Published" },
        { value: "archived", label: "Archived" },
      ]},
    ],
    defaultValues: { title: "", platform: "instagram", content: "", product_link: "", status: "draft" },
  },

  classifieds: {
    moduleKey: "classifieds",
    apiEndpoint: "/admin/classifieds",
    dataKey: "listings",
    singularKey: "listing",
    label: "Classifieds",
    singularLabel: "Classified Listing",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, placeholder: "Listing title" },
      { key: "category", label: "Category", type: "text", placeholder: "Category" },
      { key: "price", label: "Price", type: "number", placeholder: "0" },
      { key: "location", label: "Location", type: "text", placeholder: "Location" },
      { key: "description", label: "Description", type: "textarea", placeholder: "Listing description" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "active", label: "Active" },
        { value: "sold", label: "Sold" },
        { value: "expired", label: "Expired" },
      ]},
    ],
    defaultValues: { title: "", category: "", price: 0, location: "", description: "", status: "active" },
  },

  crowdfunding: {
    moduleKey: "crowdfunding",
    apiEndpoint: "/admin/crowdfunding",
    dataKey: "campaigns",
    singularKey: "campaign",
    label: "Crowdfunding",
    singularLabel: "Campaign",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, placeholder: "Campaign title" },
      { key: "description", label: "Description", type: "textarea", placeholder: "Campaign description" },
      { key: "goal_amount", label: "Goal Amount", type: "number", required: true, placeholder: "0" },
      { key: "deadline", label: "Deadline", type: "date" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "active", label: "Active" },
        { value: "funded", label: "Funded" },
        { value: "failed", label: "Failed" },
        { value: "draft", label: "Draft" },
      ]},
    ],
    defaultValues: { title: "", description: "", goal_amount: 0, deadline: "", status: "active" },
  },

  charity: {
    moduleKey: "charity",
    apiEndpoint: "/admin/charity",
    dataKey: "campaigns",
    singularKey: "campaign",
    label: "Charity",
    singularLabel: "Charity Campaign",
    fields: [
      { key: "name", label: "Name", type: "text", required: true, placeholder: "Campaign name" },
      { key: "description", label: "Description", type: "textarea", placeholder: "Campaign description" },
      { key: "goal_amount", label: "Goal Amount", type: "number", placeholder: "0" },
      { key: "category", label: "Category", type: "text", placeholder: "Category" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "active", label: "Active" },
        { value: "completed", label: "Completed" },
        { value: "draft", label: "Draft" },
      ]},
    ],
    defaultValues: { name: "", description: "", goal_amount: 0, category: "", status: "active" },
  },

  team: {
    moduleKey: "team",
    apiEndpoint: "/admin/team",
    dataKey: "members",
    singularKey: "member",
    label: "Team",
    singularLabel: "Team Member",
    fields: [
      { key: "first_name", label: "First Name", type: "text", required: true, placeholder: "First name" },
      { key: "last_name", label: "Last Name", type: "text", required: true, placeholder: "Last name" },
      { key: "email", label: "Email", type: "email", required: true, placeholder: "email@example.com" },
      { key: "role", label: "Role", type: "select", options: [
        { value: "admin", label: "Admin" },
        { value: "manager", label: "Manager" },
        { value: "editor", label: "Editor" },
        { value: "viewer", label: "Viewer" },
      ]},
      { key: "status", label: "Status", type: "select", options: [
        { value: "active", label: "Active" },
        { value: "invited", label: "Invited" },
        { value: "disabled", label: "Disabled" },
      ]},
    ],
    defaultValues: { first_name: "", last_name: "", email: "", role: "admin", status: "active" },
  },

  companies: {
    moduleKey: "companies",
    apiEndpoint: "/admin/companies",
    dataKey: "companies",
    singularKey: "company",
    label: "Companies",
    singularLabel: "Company",
    fields: [
      { key: "name", label: "Name", type: "text", required: true, placeholder: "Company name" },
      { key: "registration_number", label: "Registration Number", type: "text", placeholder: "Registration number" },
      { key: "email", label: "Email", type: "email", placeholder: "company@example.com" },
      { key: "phone", label: "Phone", type: "text", placeholder: "+1 (555) 000-0000" },
      { key: "address", label: "Address", type: "textarea", placeholder: "Company address" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "pending", label: "Pending" },
      ]},
    ],
    defaultValues: { name: "", registration_number: "", email: "", phone: "", address: "", status: "active" },
  },

  stores: {
    moduleKey: "stores",
    apiEndpoint: "/admin/stores",
    dataKey: "stores",
    singularKey: "store",
    label: "Stores",
    singularLabel: "Store",
    fields: [
      { key: "name", label: "Name", type: "text", required: true, placeholder: "Store name" },
      { key: "address", label: "Address", type: "text", required: true, placeholder: "Store address" },
      { key: "phone", label: "Phone", type: "text", placeholder: "+1 (555) 000-0000" },
      { key: "email", label: "Email", type: "email", placeholder: "store@example.com" },
      { key: "operating_hours", label: "Operating Hours", type: "text", placeholder: "Mon-Fri 9AM-5PM" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ]},
    ],
    defaultValues: { name: "", address: "", phone: "", email: "", operating_hours: "", status: "active" },
  },

  legal: {
    moduleKey: "legal",
    apiEndpoint: "/admin/legal",
    dataKey: "documents",
    singularKey: "document",
    label: "Legal",
    singularLabel: "Legal Document",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, placeholder: "Document title" },
      { key: "type", label: "Type", type: "select", options: [
        { value: "terms", label: "Terms" },
        { value: "privacy", label: "Privacy" },
        { value: "refund", label: "Refund" },
        { value: "disclaimer", label: "Disclaimer" },
        { value: "contract", label: "Contract" },
      ]},
      { key: "content", label: "Content", type: "textarea", colSpan: 2, placeholder: "Document content" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "draft", label: "Draft" },
        { value: "published", label: "Published" },
        { value: "archived", label: "Archived" },
      ]},
      { key: "effective_date", label: "Effective Date", type: "date" },
    ],
    defaultValues: { title: "", type: "terms", content: "", status: "draft", effective_date: "" },
  },

  utilities: {
    moduleKey: "utilities",
    apiEndpoint: "/admin/utilities",
    dataKey: "services",
    singularKey: "service",
    label: "Utilities",
    singularLabel: "Utility Service",
    fields: [
      { key: "name", label: "Name", type: "text", required: true, placeholder: "Service name" },
      { key: "type", label: "Type", type: "select", options: [
        { value: "electricity", label: "Electricity" },
        { value: "water", label: "Water" },
        { value: "gas", label: "Gas" },
        { value: "internet", label: "Internet" },
        { value: "maintenance", label: "Maintenance" },
      ]},
      { key: "provider", label: "Provider", type: "text", placeholder: "Provider name" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ]},
      { key: "description", label: "Description", type: "textarea", placeholder: "Service description" },
    ],
    defaultValues: { name: "", type: "electricity", provider: "", status: "active", description: "" },
  },

  subscriptions: {
    moduleKey: "subscriptions",
    apiEndpoint: "/admin/subscriptions",
    dataKey: "subscriptions",
    singularKey: "subscription",
    label: "Subscriptions",
    singularLabel: "Subscription",
    fields: [
      { key: "plan_name", label: "Plan Name", type: "text", required: true, placeholder: "Plan name" },
      { key: "price", label: "Price", type: "number", required: true, placeholder: "0" },
      { key: "interval", label: "Interval", type: "select", options: [
        { value: "monthly", label: "Monthly" },
        { value: "quarterly", label: "Quarterly" },
        { value: "yearly", label: "Yearly" },
      ]},
      { key: "status", label: "Status", type: "select", options: [
        { value: "active", label: "Active" },
        { value: "cancelled", label: "Cancelled" },
        { value: "paused", label: "Paused" },
      ]},
      { key: "description", label: "Description", type: "textarea", placeholder: "Plan description" },
    ],
    defaultValues: { plan_name: "", price: 0, interval: "monthly", status: "active", description: "" },
  },

  quotes: {
    moduleKey: "quotes",
    apiEndpoint: "/admin/quotes",
    dataKey: "quotes",
    singularKey: "quote",
    label: "Quotes",
    singularLabel: "Quote",
    fields: [
      { key: "customer_name", label: "Customer Name", type: "text", placeholder: "Customer name" },
      { key: "total", label: "Total", type: "number", placeholder: "0" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "draft", label: "Draft" },
        { value: "sent", label: "Sent" },
        { value: "accepted", label: "Accepted" },
        { value: "rejected", label: "Rejected" },
        { value: "expired", label: "Expired" },
      ]},
      { key: "valid_until", label: "Valid Until", type: "date" },
      { key: "notes", label: "Notes", type: "textarea", placeholder: "Quote notes" },
    ],
    defaultValues: { customer_name: "", total: 0, status: "draft", valid_until: "", notes: "" },
  },

  invoices: {
    moduleKey: "invoices",
    apiEndpoint: "/admin/invoices",
    dataKey: "invoices",
    singularKey: "invoice",
    label: "Invoices",
    singularLabel: "Invoice",
    fields: [
      { key: "customer_name", label: "Customer Name", type: "text", placeholder: "Customer name" },
      { key: "amount", label: "Amount", type: "number", required: true, placeholder: "0" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "draft", label: "Draft" },
        { value: "sent", label: "Sent" },
        { value: "paid", label: "Paid" },
        { value: "overdue", label: "Overdue" },
        { value: "cancelled", label: "Cancelled" },
      ]},
      { key: "due_date", label: "Due Date", type: "date" },
      { key: "notes", label: "Notes", type: "textarea", placeholder: "Invoice notes" },
    ],
    defaultValues: { customer_name: "", amount: 0, status: "draft", due_date: "", notes: "" },
  },

  reviews: {
    moduleKey: "reviews",
    apiEndpoint: "/admin/reviews",
    dataKey: "reviews",
    singularKey: "review",
    label: "Reviews",
    singularLabel: "Review",
    canCreate: false,
    fields: [
      { key: "status", label: "Status", type: "select", options: [
        { value: "pending", label: "Pending" },
        { value: "approved", label: "Approved" },
        { value: "rejected", label: "Rejected" },
      ]},
      { key: "response", label: "Response", type: "textarea", placeholder: "Response to review" },
    ],
    defaultValues: { status: "pending", response: "" },
  },

  affiliates: {
    moduleKey: "affiliates",
    apiEndpoint: "/admin/affiliates",
    dataKey: "affiliates",
    singularKey: "affiliate",
    label: "Affiliates",
    singularLabel: "Affiliate",
    fields: [
      { key: "name", label: "Name", type: "text", required: true, placeholder: "Affiliate name" },
      { key: "email", label: "Email", type: "email", required: true, placeholder: "affiliate@example.com" },
      { key: "commission_rate", label: "Commission Rate", type: "number", placeholder: "0" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "pending", label: "Pending" },
      ]},
      { key: "referral_code", label: "Referral Code", type: "text", placeholder: "REF-001" },
    ],
    defaultValues: { name: "", email: "", commission_rate: 0, status: "active", referral_code: "" },
  },
}
