import { createFileRoute } from "@tanstack/react-router"
import { useServices } from "@/lib/hooks/use-bookings"
import { ServiceList } from "@/components/bookings"
import { Spinner } from "@medusajs/icons"

export const Route = createFileRoute("/$tenant/$locale/bookings/")({
  component: BookingsPage,
})

function BookingsPage() {
  const { tenant, locale } = Route.useParams()
  const { data: services, isLoading, error } = useServices()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-20">
        <div className="content-container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Book a Service
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Schedule a consultation, training session, or support call with our
            expert team. Choose from a variety of services tailored to your needs.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="content-container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Available Services</h2>
              <p className="section-subtitle">
                Select a service to view available times
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner className="w-8 h-8 text-slate-400 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-600">
                Failed to load services. Please try again.
              </p>
            </div>
          ) : services ? (
            <ServiceList services={services} />
          ) : null}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="content-container max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Choose a Service
              </h3>
              <p className="text-sm text-slate-500">
                Browse our available services and select the one that fits your
                needs.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Pick a Time
              </h3>
              <p className="text-sm text-slate-500">
                Select your preferred provider, date, and time slot from
                available options.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Confirm Booking
              </h3>
              <p className="text-sm text-slate-500">
                Complete your booking and receive a confirmation with all the
                details.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="content-container text-center">
          <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
          <p className="text-slate-300 mb-8">
            Contact our sales team for custom services and enterprise packages.
          </p>
          <a
            href="mailto:sales@dakkah.com"
            className="btn-enterprise bg-white text-slate-900 hover:bg-slate-100"
          >
            Contact Sales
          </a>
        </div>
      </section>
    </div>
  )
}
