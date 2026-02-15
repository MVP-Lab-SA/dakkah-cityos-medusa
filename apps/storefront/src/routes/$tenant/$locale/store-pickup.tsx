import { createFileRoute } from "@tanstack/react-router"
import { StorePickupSelector } from "@/components/delivery/store-pickup-selector"
import { PickupScheduler } from "@/components/delivery/pickup-scheduler"
import { t } from "@/lib/i18n"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/store-pickup")({
  component: StorePickupPage,
  head: () => ({
    meta: [
      { title: "Store Pickup | Dakkah CityOS" },
      { name: "description", content: "Schedule store pickup on Dakkah CityOS" },
    ],
  }),
})

const demoStores = [
  { id: "s1", name: "Downtown Store", address: "123 Main St, Downtown", lat: 25.2, lng: 55.3, distance: "1.2 km", pickupAvailable: true, phone: "+1 555-0101", hours: "9AM-9PM" },
  { id: "s2", name: "Mall of Commerce", address: "456 Shopping Ave, Mall District", lat: 25.3, lng: 55.4, distance: "3.5 km", pickupAvailable: true, phone: "+1 555-0102", hours: "10AM-10PM" },
  { id: "s3", name: "Airport Branch", address: "789 Terminal Rd, Airport", lat: 25.1, lng: 55.2, distance: "12 km", pickupAvailable: false, phone: "+1 555-0103", hours: "24/7" },
]

const demoSlots = [
  { id: "sl1", date: "2026-02-12", startTime: "10:00", endTime: "12:00", available: true, remaining: 3 },
  { id: "sl2", date: "2026-02-12", startTime: "14:00", endTime: "16:00", available: true, remaining: 8 },
  { id: "sl3", date: "2026-02-12", startTime: "18:00", endTime: "20:00", available: false },
  { id: "sl4", date: "2026-02-13", startTime: "10:00", endTime: "12:00", available: true, remaining: 5 },
  { id: "sl5", date: "2026-02-13", startTime: "14:00", endTime: "16:00", available: true },
]

function StorePickupPage() {
  const { locale } = Route.useParams()
  const [selectedStoreId, setSelectedStoreId] = useState<string | undefined>()
  const [selectedSlotId, setSelectedSlotId] = useState<string | undefined>()

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-ds-foreground mb-2">
          {t(locale, "bopis.page_title")}
        </h1>
        <p className="text-ds-muted-foreground mb-8">
          {t(locale, "bopis.page_desc")}
        </p>

        <div className="space-y-8">
          <StorePickupSelector
            stores={demoStores}
            selectedStoreId={selectedStoreId}
            onStoreSelect={setSelectedStoreId}
            showMap
            locale={locale}
          />

          {selectedStoreId && (
            <PickupScheduler
              storeId={selectedStoreId}
              availableSlots={demoSlots}
              selectedSlotId={selectedSlotId}
              onSlotSelect={setSelectedSlotId}
              locale={locale}
            />
          )}
        </div>
      </div>
    </div>
  )
}
