import { createFileRoute } from "@tanstack/react-router"
import { AccountLayout } from "@/components/account"
import { DownloadManager } from "@/components/digital/download-manager"
import { useMyDownloads } from "@/lib/hooks/use-digital-products"

export const Route = createFileRoute("/$tenant/$locale/account/downloads")({
  component: DownloadsPage,
})

function DownloadsPage() {
  const { data: downloads, isLoading } = useMyDownloads()

  return (
    <AccountLayout title="My Downloads" description="Your purchased digital products">
      <DownloadManager downloads={downloads || []} loading={isLoading} />
    </AccountLayout>
  )
}
