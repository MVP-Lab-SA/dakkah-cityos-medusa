import { Container, Heading } from "@medusajs/ui"

export default function PayoutsPage() {
  return (
    <Container>
      <Heading level="h1">Payouts</Heading>
      <div className="mt-4">
        <p className="text-ui-fg-subtle">
          Process and manage vendor payouts and commission transactions.
        </p>
      </div>
    </Container>
  )
}

export const config = {
  link: {
    label: "Payouts",
    icon: "CreditCard",
  },
}
