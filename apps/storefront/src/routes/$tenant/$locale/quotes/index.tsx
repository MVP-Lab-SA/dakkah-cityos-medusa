import { createFileRoute } from "@tanstack/react-router";
import { QuoteList } from "@/components/quotes/quote-list";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

interface Quote {
  id: string;
  quote_number: string;
  status: string;
  total: number;
  created_at: string;
  valid_until?: string;
  items?: Array<{ id: string }>;
}

export const Route = createFileRoute("/$tenant/$locale/quotes/")({
  component: QuotesPage,
  loader: async () => {
    try {
      const isServer = typeof window === "undefined"
      const baseUrl = isServer ? "http://localhost:9000" : ""
      const resp = await fetch(`${baseUrl}/store/quotes`, {
        headers: {
          "x-publishable-api-key": import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || "pk_56377e90449a39fc4585675802137b09577cd6e17f339eba6dc923eaf22e3445",
        },
      })
      if (!resp.ok) return { quotes: [], count: 0 }
      const data = await resp.json()
      return { quotes: data.quotes || data.items || [], count: data.count || 0 }
    } catch {
      return { quotes: [], count: 0 }
    }
  },
});

function QuotesPage() {
  const { tenant, locale } = Route.useParams();
  const data = Route.useLoaderData();

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Quotes</h1>
          <p className="text-muted-foreground">
            View and manage your quote requests
          </p>
        </div>
        <Link to="/$tenant/$locale/quotes/request" params={{ tenant, locale }}>
          <Button>Request New Quote</Button>
        </Link>
      </div>

      {data?.quotes?.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground mb-4">You haven't requested any quotes yet.</p>
          <Link to="/$tenant/$locale/quotes/request" params={{ tenant, locale }}>
            <Button>Request Your First Quote</Button>
          </Link>
        </div>
      ) : (
        <QuoteList quotes={data?.quotes || []} />
      )}
    </div>
  );
}
