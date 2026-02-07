import { Container, Text } from "@medusajs/ui"
import { Spinner } from "@medusajs/icons"

interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <Container className="flex flex-col items-center justify-center py-16">
      <Spinner className="mb-4 animate-spin" />
      <Text className="text-ui-fg-subtle">{message}</Text>
    </Container>
  )
}
