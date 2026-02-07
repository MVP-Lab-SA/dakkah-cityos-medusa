import { Container, Heading, Text, Button } from "@medusajs/ui"

interface EmptyStateProps {
  title: string
  description: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <Container className="flex flex-col items-center justify-center py-16 text-center">
      {icon && (
        <div className="mb-4 p-4 bg-ui-bg-subtle rounded-full">
          {icon}
        </div>
      )}
      <Heading level="h3" className="mb-2">
        {title}
      </Heading>
      <Text className="text-ui-fg-subtle mb-6 max-w-md">
        {description}
      </Text>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Container>
  )
}
