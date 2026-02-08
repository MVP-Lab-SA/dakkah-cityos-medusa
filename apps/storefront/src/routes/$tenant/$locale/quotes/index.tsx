import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { sdk } from "@/lib/utils/sdk";
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
});

function QuotesPage() {
  const { tenant, locale } = Route.useParams();
  
  const { data, isLoading } = useQuery({
    queryKey: ["quotes"],
    queryFn: async () => {
      const response = await sdk.client.fetch<{ quotes: Quote[] }>("/store/quotes", {
        credentials: "include",
      });
      return response;
    },
  });

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

      {isLoading ? (
        <div className="text-center py-12">Loading quotes...</div>
      ) : data?.quotes?.length === 0 ? (
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
