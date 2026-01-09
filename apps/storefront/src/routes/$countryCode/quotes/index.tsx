import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { sdk } from "@/lib/sdk";
import { QuoteList } from "@/components/quotes/quote-list";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/$countryCode/quotes/")({
  component: QuotesPage,
});

function QuotesPage() {
  const { countryCode } = Route.useParams();
  
  const { data, isLoading } = useQuery({
    queryKey: ["quotes"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/store/quotes", {
        credentials: "include",
      });
      return response.json();
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
        <Link to="/$countryCode/quotes/request" params={{ countryCode }}>
          <Button>Request New Quote</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading quotes...</div>
      ) : data?.quotes?.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground mb-4">You haven't requested any quotes yet.</p>
          <Link to="/$countryCode/quotes/request" params={{ countryCode }}>
            <Button>Request Your First Quote</Button>
          </Link>
        </div>
      ) : (
        <QuoteList quotes={data?.quotes || []} />
      )}
    </div>
  );
}
