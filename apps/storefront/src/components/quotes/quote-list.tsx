import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Quote {
  id: string;
  quote_number: string;
  status: string;
  total: string;
  currency_code: string;
  created_at: string;
  valid_until?: string;
  items?: any[];
}

interface QuoteListProps {
  quotes: Quote[];
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-500",
  submitted: "bg-blue-500",
  under_review: "bg-yellow-500",
  approved: "bg-green-500",
  rejected: "bg-red-500",
  accepted: "bg-green-700",
  declined: "bg-gray-600",
  expired: "bg-gray-400",
};

export function QuoteList({ quotes }: QuoteListProps) {
  return (
    <div className="space-y-4">
      {quotes.map((quote) => (
        <div key={quote.id} className="border rounded-lg p-6 hover:border-primary transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">{quote.quote_number}</h3>
              <p className="text-sm text-muted-foreground">
                Created {new Date(quote.created_at).toLocaleDateString()}
              </p>
            </div>
            <Badge className={statusColors[quote.status]}>
              {quote.status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                {quote.items?.length || 0} items
              </p>
              <p className="text-2xl font-bold">
                ${Number(quote.total).toFixed(2)}
              </p>
              {quote.valid_until && (
                <p className="text-sm text-muted-foreground mt-1">
                  Valid until {new Date(quote.valid_until).toLocaleDateString()}
                </p>
              )}
            </div>
            <Link
              to="/$countryCode/quotes/$id"
              params={{ countryCode: "us", id: quote.id }}
            >
              <Button>View Details</Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
