// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, SectionCard } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { SquaresPlus } from "@medusajs/icons"

export const Route = createFileRoute("/$tenant/$locale/manage/navigation")({
  component: ManageNavigationPage,
  head: () => ({
    meta: [
      { title: "Navigation Management" },
      { name: "description", content: "Manage site navigation menus and links" },
    ],
  }),
})

function ManageNavigationPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"

  return (
    <ManageLayout locale={locale}>
      <Container>
        <PageHeader
          title="Navigation Management"
          subtitle="Manage site navigation menus and links"
        />

        <SectionCard title="Navigation Management">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <SquaresPlus className="w-12 h-12 text-ds-muted-foreground/70 mb-4" />
            <h3 className="text-lg font-semibold text-ds-foreground mb-2">
              Navigation management coming soon
            </h3>
            <p className="text-sm text-ds-muted-foreground max-w-sm">
              Manage menu structures, header and footer links, navigation hierarchies, and site navigation menus.
            </p>
          </div>
        </SectionCard>
      </Container>
    </ManageLayout>
  )
}
