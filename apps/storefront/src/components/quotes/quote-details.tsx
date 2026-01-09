import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sdk } from "@/lib/sdk";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface QuoteDetailsProps {
  quote: any;
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

export function QuoteDetails({ quote }: QuoteDetailsProps) {
  const queryClient = useQueryClient();
  const [declineReason, setDeclineReason] = useState("");
  const [showDeclineForm, setShowDeclineForm] = useState(false);

  const acceptMutation = useMutation({
    mutationFn: async () => {
      const response = await sdk.client.fetch(`/store/quotes/${quote.id}/accept`, {
        method: "POST",
        credentials: "include",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quote", quote.id] });
    },
  });

  const declineMutation = useMutation({
    mutationFn: async (reason: string) => {
      const response = await sdk.client.fetch(`/store/quotes/${quote.id}/decline`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quote", quote.id] });
      setShowDeclineForm(false);
    },
  });

  const handleDecline = () => {
    declineMutation.mutate(declineReason);
  };

  if (!quote) return <div>Quote not found</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">{quote.quote_number}</h1>
          <p className="text-muted-foreground">
            Created {new Date(quote.created_at).toLocaleDateString()}
          </p>
        </div>
        <Badge className={statusColors[quote.status] + " text-lg px-4 py-2"}>
          {quote.status.replace("_", " ").toUpperCase()}
        </Badge>
      </div>

      {/* Items */}
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Items</h2>
        <div className="space-y-4">
          {quote.items?.map((item: any) => (
            <div key={item.id} className="flex justify-between items-center pb-4 border-b last:border-0">
              <div className="flex items-center gap-4">
                {item.thumbnail && (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-medium">{item.title}</p>
                  {item.sku && (
                    <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                  )}
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  {item.custom_unit_price && (
                    <Badge variant="secondary" className="mt-1">
                      Custom Price
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  ${Number(item.total).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  ${Number(item.custom_unit_price || item.unit_price).toFixed(2)} each
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="border rounded-lg p-6 bg-muted/20">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${Number(quote.subtotal).toFixed(2)}</span>
          </div>
          {Number(quote.discount_total) > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-${Number(quote.discount_total).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax</span>
            <span>${Number(quote.tax_total).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold pt-2 border-t">
            <span>Total</span>
            <span>${Number(quote.total).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {quote.customer_notes && (
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-2">Your Notes</h3>
          <p className="text-muted-foreground">{quote.customer_notes}</p>
        </div>
      )}

      {quote.discount_reason && (
        <div className="border rounded-lg p-6 bg-green-50">
          <h3 className="font-semibold mb-2">Special Discount Applied</h3>
          <p className="text-muted-foreground">{quote.discount_reason}</p>
        </div>
      )}

      {/* Actions */}
      {quote.status === "approved" && (
        <div className="border rounded-lg p-6 bg-blue-50">
          <h3 className="font-semibold mb-2">Quote Approved!</h3>
          <p className="text-muted-foreground mb-4">
            Your quote has been approved. You can now accept or decline this offer.
            {quote.valid_until && (
              <span className="block mt-1">
                Valid until {new Date(quote.valid_until).toLocaleDateString()}
              </span>
            )}
          </p>
          
          {!showDeclineForm ? (
            <div className="flex gap-4">
              <Button
                onClick={() => acceptMutation.mutate()}
                disabled={acceptMutation.isPending}
              >
                {acceptMutation.isPending ? "Accepting..." : "Accept Quote"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeclineForm(true)}
              >
                Decline Quote
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="Please let us know why you're declining (optional)"
                className="min-h-24"
              />
              <div className="flex gap-4">
                <Button
                  onClick={handleDecline}
                  disabled={declineMutation.isPending}
                  variant="destructive"
                >
                  {declineMutation.isPending ? "Declining..." : "Confirm Decline"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeclineForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {quote.status === "rejected" && quote.rejection_reason && (
        <div className="border rounded-lg p-6 bg-red-50">
          <h3 className="font-semibold mb-2">Quote Rejected</h3>
          <p className="text-muted-foreground">{quote.rejection_reason}</p>
        </div>
      )}
    </div>
  );
}
