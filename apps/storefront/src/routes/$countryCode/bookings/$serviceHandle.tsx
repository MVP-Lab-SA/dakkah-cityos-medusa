import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState, useMemo } from "react"
import {
  useService,
  useServiceProviders,
  useProviderAvailability,
  useCreateBooking,
} from "@/lib/hooks/use-bookings"
import {
  CalendarPicker,
  TimeSlotPicker,
  ProviderSelect,
} from "@/components/bookings"
import {
  Spinner,
  ArrowLeft,
  Clock,
  Users,
  CheckCircleSolid,
} from "@medusajs/icons"

export const Route = createFileRoute("/$countryCode/bookings/$serviceHandle")({
  component: ServiceBookingPage,
})

function ServiceBookingPage() {
  const { countryCode, serviceHandle } = Route.useParams()
  const navigate = useNavigate()

  const { data: service, isLoading: serviceLoading } = useService(serviceHandle)
  const { data: providers, isLoading: providersLoading } = useServiceProviders(
    service?.id
  )
  const createBooking = useCreateBooking()

  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [notes, setNotes] = useState("")
  const [attendees, setAttendees] = useState(1)
  const [step, setStep] = useState<"provider" | "datetime" | "confirm">(
    "provider"
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    data: slots,
    isLoading: slotsLoading,
  } = useProviderAvailability(
    selectedProvider || "",
    selectedDate || "",
    service?.duration
  )

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours} hour${hours > 1 ? "s" : ""}`
  }

  const selectedProviderData = useMemo(() => {
    return providers?.find((p) => p.id === selectedProvider)
  }, [providers, selectedProvider])

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId)
    setSelectedDate(null)
    setSelectedSlot(null)
    setStep("datetime")
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setSelectedSlot(null)
  }

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot)
  }

  const handleContinueToConfirm = () => {
    if (selectedProvider && selectedDate && selectedSlot) {
      setStep("confirm")
    }
  }

  const handleSubmit = async () => {
    if (!service || !selectedProvider || !selectedSlot) return

    setIsSubmitting(true)
    try {
      const booking = await createBooking.mutateAsync({
        service_id: service.id,
        provider_id: selectedProvider,
        start_time: selectedSlot,
        notes: notes || undefined,
        attendees,
      })

      navigate({
        to: `/${countryCode}/bookings/confirmation`,
        search: { id: booking.id },
      })
    } catch (error) {
      console.error("Failed to create booking:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (serviceLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Spinner className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Service Not Found
          </h1>
          <p className="text-slate-500 mb-6">
            The requested service could not be found.
          </p>
          <button
            onClick={() => navigate({ to: `/${countryCode}/bookings` })}
            className="btn-enterprise-primary"
          >
            View All Services
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="content-container max-w-5xl">
        {/* Back Button */}
        <button
          onClick={() => {
            if (step === "confirm") setStep("datetime")
            else if (step === "datetime") setStep("provider")
            else navigate({ to: `/${countryCode}/bookings` })
          }}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {step === "provider" ? "All Services" : "Back"}
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Service Header */}
            <div className="enterprise-card mb-6">
              <div className="enterprise-card-body">
                <div className="flex gap-4">
                  {service.images && service.images[0] && (
                    <img
                      src={service.images[0].url}
                      alt={service.name}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                      {service.name}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDuration(service.duration)}
                      </span>
                      {service.capacity && service.capacity > 1 && (
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          Up to {service.capacity} attendees
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 mt-2">{service.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step: Provider Selection */}
            {step === "provider" && (
              <div className="enterprise-card">
                <div className="enterprise-card-header">
                  <h2 className="font-semibold text-slate-900">
                    Select a Provider
                  </h2>
                </div>
                <div className="enterprise-card-body">
                  {providersLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Spinner className="w-6 h-6 text-slate-400 animate-spin" />
                    </div>
                  ) : providers && providers.length > 0 ? (
                    <ProviderSelect
                      providers={providers}
                      selectedProvider={selectedProvider}
                      onProviderSelect={handleProviderSelect}
                    />
                  ) : (
                    <p className="text-center text-slate-500 py-8">
                      No providers available for this service.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step: Date & Time Selection */}
            {step === "datetime" && (
              <div className="enterprise-card">
                <div className="enterprise-card-header">
                  <h2 className="font-semibold text-slate-900">
                    Select Date & Time
                  </h2>
                </div>
                <div className="enterprise-card-body">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Calendar */}
                    <div>
                      <h3 className="text-sm font-medium text-slate-700 mb-4">
                        Choose a Date
                      </h3>
                      <CalendarPicker
                        selectedDate={selectedDate}
                        onDateSelect={handleDateSelect}
                      />
                    </div>

                    {/* Time Slots */}
                    <div>
                      <h3 className="text-sm font-medium text-slate-700 mb-4">
                        {selectedDate ? "Available Times" : "Select a date first"}
                      </h3>
                      {selectedDate ? (
                        <TimeSlotPicker
                          slots={slots || []}
                          selectedSlot={selectedSlot}
                          onSlotSelect={handleSlotSelect}
                          isLoading={slotsLoading}
                        />
                      ) : (
                        <div className="text-center py-8 text-slate-400">
                          Select a date to see available times
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Continue Button */}
                  {selectedSlot && (
                    <div className="mt-8 pt-6 border-t border-slate-100">
                      <button
                        onClick={handleContinueToConfirm}
                        className="w-full btn-enterprise-primary py-3"
                      >
                        Continue to Confirm
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step: Confirmation */}
            {step === "confirm" && (
              <div className="enterprise-card">
                <div className="enterprise-card-header">
                  <h2 className="font-semibold text-slate-900">
                    Confirm Your Booking
                  </h2>
                </div>
                <div className="enterprise-card-body space-y-6">
                  {/* Additional Options */}
                  {service.capacity && service.capacity > 1 && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Number of Attendees
                      </label>
                      <select
                        value={attendees}
                        onChange={(e) => setAttendees(Number(e.target.value))}
                        className="input-enterprise max-w-xs"
                      >
                        {[...Array(service.capacity)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} {i === 0 ? "person" : "people"}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any specific topics you'd like to discuss?"
                      rows={3}
                      className="input-enterprise resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full btn-enterprise-primary py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <Spinner className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <CheckCircleSolid className="w-5 h-5" />
                        Confirm Booking -{" "}
                        {formatPrice(service.price, service.currency_code)}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="enterprise-card sticky top-24">
              <div className="enterprise-card-header">
                <h3 className="font-semibold text-slate-900">Booking Summary</h3>
              </div>
              <div className="enterprise-card-body space-y-4">
                {/* Service */}
                <div className="flex justify-between">
                  <span className="text-slate-500">Service</span>
                  <span className="font-medium text-slate-900">
                    {service.name}
                  </span>
                </div>

                {/* Duration */}
                <div className="flex justify-between">
                  <span className="text-slate-500">Duration</span>
                  <span className="text-slate-900">
                    {formatDuration(service.duration)}
                  </span>
                </div>

                {/* Provider */}
                {selectedProviderData && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Provider</span>
                    <span className="text-slate-900">
                      {selectedProviderData.name}
                    </span>
                  </div>
                )}

                {/* Date & Time */}
                {selectedDate && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date</span>
                    <span className="text-slate-900">
                      {new Date(selectedDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}

                {selectedSlot && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Time</span>
                    <span className="text-slate-900">
                      {new Date(selectedSlot).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-900">Total</span>
                    <span className="text-xl font-bold text-slate-900">
                      {formatPrice(service.price, service.currency_code)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
