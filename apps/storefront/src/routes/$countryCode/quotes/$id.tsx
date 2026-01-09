import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { sdk } from "@/lib/sdk";
import { QuoteDetails } from "@/components/quotes/quote-details";

export const Route = createFileRoute("/$countryCode/quotes/$id")({
  component: QuoteDetailPage,
});

function QuoteDetailPage() {
  const { id } = Route.useParams();
  
  const { data, isLoading } = useQuery({
    queryKey: ["quote", id],
    queryFn: async () => {
      const response = await sdk.client.fetch(`/store/quotes/${id}`, {
        credentials: "include",
      });
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading quote details...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <QuoteDetails quote={data?.quote} />
    </div>
  );
}
