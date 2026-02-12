import React, { useState } from "react"

interface StoreLocation {
  id: string
  name: string
  address: string
  city: string
  mapUrl?: string
  estimatedReadyTime?: string
}

interface TimeSlot {
  id: string
  label: string
  time: string
}

interface StorePickupProps {
  stores?: StoreLocation[]
  onSelectionChange?: (selection: {
    mode: "delivery" | "pickup"
    storeId?: string
    date?: string
    timeSlot?: string
  }) => void
}

const defaultStores: StoreLocation[] = [
  { id: "store-1", name: "Downtown Store", address: "123 Main Street", city: "Riyadh", mapUrl: "https://maps.google.com", estimatedReadyTime: "2 hours" },
  { id: "store-2", name: "Mall of Arabia", address: "King Fahd Road", city: "Jeddah", mapUrl: "https://maps.google.com", estimatedReadyTime: "3 hours" },
  { id: "store-3", name: "Al Khobar Branch", address: "Prince Turkey St", city: "Al Khobar", mapUrl: "https://maps.google.com", estimatedReadyTime: "2 hours" },
]

const timeSlots: TimeSlot[] = [
  { id: "morning", label: "Morning", time: "9:00 AM - 12:00 PM" },
  { id: "afternoon", label: "Afternoon", time: "12:00 PM - 5:00 PM" },
  { id: "evening", label: "Evening", time: "5:00 PM - 9:00 PM" },
]

export function StorePickup({
  stores = defaultStores,
  onSelectionChange,
}: StorePickupProps) {
  const [mode, setMode] = useState<"delivery" | "pickup">("delivery")
  const [selectedStore, setSelectedStore] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("")

  const handleModeChange = (newMode: "delivery" | "pickup") => {
    setMode(newMode)
    onSelectionChange?.({ mode: newMode, storeId: selectedStore, date: selectedDate, timeSlot: selectedTimeSlot })
  }

  const handleStoreChange = (storeId: string) => {
    setSelectedStore(storeId)
    onSelectionChange?.({ mode, storeId, date: selectedDate, timeSlot: selectedTimeSlot })
  }

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    onSelectionChange?.({ mode, storeId: selectedStore, date, timeSlot: selectedTimeSlot })
  }

  const handleTimeChange = (slot: string) => {
    setSelectedTimeSlot(slot)
    onSelectionChange?.({ mode, storeId: selectedStore, date: selectedDate, timeSlot: slot })
  }

  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }

  const store = stores.find((s) => s.id === selectedStore)

  return (
    <div className="bg-ds-card border border-ds-border rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-ds-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <h3 className="text-sm font-semibold text-ds-foreground">Delivery Method</h3>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => handleModeChange("delivery")}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
            mode === "delivery"
              ? "border-ds-primary bg-ds-primary/10 text-ds-primary"
              : "border-ds-border text-ds-muted-foreground hover:bg-ds-muted"
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
          Delivery
        </button>
        <button
          type="button"
          onClick={() => handleModeChange("pickup")}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
            mode === "pickup"
              ? "border-ds-primary bg-ds-primary/10 text-ds-primary"
              : "border-ds-border text-ds-muted-foreground hover:bg-ds-muted"
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Store Pickup
        </button>
      </div>

      {mode === "pickup" && (
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-ds-muted-foreground mb-2">
              Select store location
            </label>
            <div className="space-y-2">
              {stores.map((s) => (
                <label
                  key={s.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedStore === s.id
                      ? "border-ds-primary bg-ds-primary/5"
                      : "border-ds-border hover:bg-ds-muted"
                  }`}
                >
                  <input
                    type="radio"
                    name="store"
                    value={s.id}
                    checked={selectedStore === s.id}
                    onChange={() => handleStoreChange(s.id)}
                    className="mt-1 w-4 h-4 text-ds-primary border-ds-border focus:ring-ds-primary"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ds-foreground">{s.name}</p>
                    <p className="text-xs text-ds-muted-foreground">{s.address}, {s.city}</p>
                    {s.estimatedReadyTime && (
                      <p className="text-xs text-ds-primary mt-1">
                        Ready in ~{s.estimatedReadyTime}
                      </p>
                    )}
                  </div>
                  {s.mapUrl && (
                    <a
                      href={s.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-ds-primary hover:underline flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View map
                    </a>
                  )}
                </label>
              ))}
            </div>
          </div>

          {selectedStore && (
            <>
              <div>
                <label className="block text-xs font-medium text-ds-muted-foreground mb-2">
                  Pickup date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={getMinDate()}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-ds-muted border border-ds-border rounded-md text-ds-foreground focus:outline-none focus:ring-1 focus:ring-ds-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ds-muted-foreground mb-2">
                  Pickup time slot
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => handleTimeChange(slot.id)}
                      className={`px-3 py-2 rounded-lg border text-center transition-colors ${
                        selectedTimeSlot === slot.id
                          ? "border-ds-primary bg-ds-primary/10 text-ds-primary"
                          : "border-ds-border text-ds-muted-foreground hover:bg-ds-muted"
                      }`}
                    >
                      <p className="text-sm font-medium">{slot.label}</p>
                      <p className="text-xs mt-0.5">{slot.time}</p>
                    </button>
                  ))}
                </div>
              </div>

              {store && (
                <div className="bg-ds-muted rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-ds-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-ds-foreground">{store.name}</p>
                      <p className="text-xs text-ds-muted-foreground">{store.address}, {store.city}</p>
                      <p className="text-xs text-ds-primary mt-1">
                        Estimated ready time: {store.estimatedReadyTime}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
