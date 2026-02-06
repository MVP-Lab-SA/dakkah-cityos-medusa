import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { sdk } from "@/lib/utils/sdk";
import { QuoteDetails } from "@/components/quotes/quote-details";

interface QuoteItem {
  id: string;
  product_id: string;
  variant_id?: string;
  title: string;
  sku?: string;
  thumbnail?: string;
  quantity: number;
  unit_price: number;
  custom_price?: number;
}

interface Quote {
  id: string;
  quote_number: string;
  status: string;
  subtotal: number;
  discount_total: number;
  tax_total: number;
  total: number;
  customer_notes?: string;
  internal_notes?: string;
  discount_reason?: string;
  created_at: string;
  valid_until?: string;
  items: QuoteItem[];
}

export const Route = createFileRoute("/$countryCode/quotes/$id")({
  component: QuoteDetailPage,
});

function QuoteDetailPage() {
  const { id } = Route.useParams();
  
  const { data, isLoading } = useQuery({
    queryKey: ["quote", id],
    queryFn: async () => {
      const response = await sdk.client.fetch<{ quote: Quote }>(`/store/quotes/${id}`, {
        credentials: "include",
      });
      return response;
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
      {data?.quote && <QuoteDetails quote={data.quote} />}
    </div>
  );
}
