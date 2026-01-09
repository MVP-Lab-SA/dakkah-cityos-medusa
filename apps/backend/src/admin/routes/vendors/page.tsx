import { Container, Heading } from "@medusajs/ui"

export default function VendorsPage() {
  return (
    <Container>
      <Heading level="h1">Vendors</Heading>
      <div className="mt-4">
        <p className="text-ui-fg-subtle">
          Manage marketplace vendors, onboarding, and verification.
        </p>
      </div>
    </Container>
  )
}

export const config = {
  link: {
    label: "Vendors",
    icon: "Users",
  },
}
