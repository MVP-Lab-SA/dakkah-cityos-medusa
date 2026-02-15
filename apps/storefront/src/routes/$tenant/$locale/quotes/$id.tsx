// @ts-nocheck
import { getServerBaseUrl } from "@/lib/utils/env"
import { createFileRoute } from "@tanstack/react-router";
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

function normalizeDetail(item: any) {
  if (!item) return null
  const meta = typeof item.metadata === 'string' ? JSON.parse(item.metadata) : (item.metadata || {})
  return { ...meta, ...item,
    thumbnail: item.thumbnail || item.photo_url || item.banner_url || item.logo_url || meta.thumbnail || (meta.images && meta.images[0]) || null,
    images: meta.images || [item.photo_url || item.banner_url || item.logo_url].filter(Boolean),
    description: item.description || meta.description || "",
    price: item.price ?? meta.price ?? null,
    rating: item.rating ?? item.avg_rating ?? meta.rating ?? null,
    review_count: item.review_count ?? meta.review_count ?? null,
    location: item.location || item.city || item.address || meta.location || null,
  }
}

export const Route = createFileRoute("/$tenant/$locale/quotes/$id")({
  loader: async ({ params }) => {
    try {
      const baseUrl = getServerBaseUrl()
      const resp = await fetch(`${baseUrl}/store/quotes/${params.id}`, {
        headers: { "x-publishable-api-key": import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || "pk_56377e90449a39fc4585675802137b09577cd6e17f339eba6dc923eaf22e3445" },
      })
      if (!resp.ok) return { item: null }
      const data = await resp.json()
      return { item: normalizeDetail(data.quote || data.item || data) }
    } catch { return { item: null } }
  },
  component: QuoteDetailPage,
});

function QuoteDetailPage() {
  const { id } = Route.useParams();

  const loaderData = Route.useLoaderData()
  const quote = loaderData?.item

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {quote && <QuoteDetails quote={quote} />}
    </div>
  );
}
