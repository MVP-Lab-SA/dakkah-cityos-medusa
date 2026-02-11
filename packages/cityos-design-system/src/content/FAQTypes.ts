import type { BaseComponentProps } from "../components/ComponentTypes"

export interface FAQAccordionProps extends BaseComponentProps {
  items: {
    id: string
    question: string
    answer: string
    category?: string
  }[]
  allowMultiple?: boolean
  defaultOpenIds?: string[]
  locale?: string
}

export interface FAQSearchProps extends BaseComponentProps {
  onSearch: (query: string) => void
  placeholder?: string
  value?: string
  loading?: boolean
  locale?: string
}

export interface FAQCategoryCardProps extends BaseComponentProps {
  id: string
  title: string
  description?: string
  icon?: string
  articleCount: number
  slug: string
  locale?: string
}

export interface SupportTicketFormProps extends BaseComponentProps {
  onSubmit?: (data: {
    subject: string
    description: string
    priority: "low" | "medium" | "high" | "urgent"
    category?: string
    attachments?: File[]
  }) => void
  categories?: string[]
  locale?: string
}

export interface HelpCenterLayoutProps extends BaseComponentProps {
  sidebar?: React.ReactNode
  children?: React.ReactNode
  locale?: string
}

export interface ContactCardProps extends BaseComponentProps {
  method: "email" | "phone" | "chat" | "social"
  title: string
  description?: string
  value: string
  icon?: string
  available?: boolean
  hours?: string
  locale?: string
}
