import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { sdk } from "@/lib/utils/sdk";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/hooks/use-cart";
import { useToast } from "@/components/ui/toast";

export function QuoteRequestForm() {
  const navigate = useNavigate();
  const { data: cart } = useCart();
  const [notes, setNotes] = useState("");
  const { addToast } = useToast();

  const createQuoteMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await sdk.client.fetch("/store/quotes", {
        method: "POST",
        credentials: "include",
        body: data,
      });
      return response as { quote: { id: string } };
    },
    onSuccess: (data) => {
      const countryCode = cart?.region?.countries?.[0]?.iso_2 || "us";
      navigate({
        to: "/$countryCode/quotes/$id",
        params: { countryCode, id: data.quote.id },
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!cart?.items || cart.items.length === 0) {
      addToast("warning", "Your cart is empty. Add items before requesting a quote.");
      return;
    }

    const items = cart.items.map((item) => ({
      product_id: item.product_id,
      variant_id: item.variant_id,
      title: item.title,
      sku: item.variant?.sku,
      thumbnail: item.thumbnail,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }));

    createQuoteMutation.mutate({
      items,
      customer_notes: notes,
      company_id: (cart.metadata as Record<string, string>)?.company_id || null,
      tenant_id: (cart.metadata as Record<string, string>)?.tenant_id || null,
      region_id: cart.region_id,
      store_id: (cart.metadata as Record<string, string>)?.store_id || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border rounded-lg p-6 bg-muted/20">
        <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
        {!cart?.items || cart.items.length === 0 ? (
          <p className="text-muted-foreground">No items in cart</p>
        ) : (
          <div className="space-y-3">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {item.thumbnail && (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold">
                  ${(Number(item.unit_price) * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
            <div className="pt-4 border-t flex justify-between font-bold">
              <span>Total</span>
              <span>${Number(cart.total || 0).toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="text-sm font-medium block mb-2">
          Additional Notes (Optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Tell us about your needs, timeline, or any special requirements..."
          className="w-full min-h-32 p-3 border rounded-lg resize-none"
        />
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={!cart?.items || cart.items.length === 0 || createQuoteMutation.isPending}
          className="flex-1"
        >
          {createQuoteMutation.isPending ? "Submitting..." : "Submit Quote Request"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate({ to: "/$countryCode", params: { countryCode: "us" } })}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
