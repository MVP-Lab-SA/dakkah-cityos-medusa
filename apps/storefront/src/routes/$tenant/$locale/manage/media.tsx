// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, SectionCard } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { Sparkles } from "@medusajs/icons"

export const Route = createFileRoute("/$tenant/$locale/manage/media")({
  component: ManageMediaPage,
  head: () => ({
    meta: [
      { title: "Media Library" },
      { name: "description", content: "Manage uploaded images and files" },
    ],
  }),
})

function ManageMediaPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"

  return (
    <ManageLayout locale={locale}>
      <Container>
        <PageHeader
          title="Media Library"
          subtitle="Manage uploaded images and files"
        />

        <SectionCard title="Media Library">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Sparkles className="w-12 h-12 text-ds-muted-foreground/70 mb-4" />
            <h3 className="text-lg font-semibold text-ds-foreground mb-2">
              Media library coming soon
            </h3>
            <p className="text-sm text-ds-muted-foreground max-w-sm">
              Upload and manage images, documents, and media files for your store.
            </p>
          </div>
        </SectionCard>
      </Container>
    </ManageLayout>
  )
}
