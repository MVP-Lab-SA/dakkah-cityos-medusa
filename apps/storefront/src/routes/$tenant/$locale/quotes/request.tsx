import { createFileRoute } from "@tanstack/react-router";
import { QuoteRequestForm } from "@/components/quotes/quote-request-form";

export const Route = createFileRoute("/$tenant/$locale/quotes/request")({
  component: QuoteRequestPage,
  head: () => ({
    meta: [
      { title: "Request a Quote | Dakkah CityOS" },
      { name: "description", content: "Submit a quote request on Dakkah CityOS" },
    ],
  }),
});

function QuoteRequestPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Request a Quote</h1>
        <p className="text-muted-foreground">
          Submit a quote request for custom pricing on bulk orders or special items.
          Our sales team will review and respond within 24-48 hours.
        </p>
      </div>
      
      <QuoteRequestForm />
    </div>
  );
}
