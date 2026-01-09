import { useQuery } from "@tanstack/react-query";
import { sdk } from "@/lib/sdk";
import { Badge } from "@/components/ui/badge";

interface VolumePricingDisplayProps {
  productId: string;
  currentQuantity?: number;
}

export function VolumePricingDisplay({ 
  productId, 
  currentQuantity = 1 
}: VolumePricingDisplayProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["volume-pricing", productId],
    queryFn: async () => {
      const response = await sdk.client.fetch(
        `/store/volume-pricing/${productId}`
      );
      return response.json();
    },
  });

  if (isLoading || !data?.rules || data.rules.length === 0) {
    return null;
  }

  const rule = data.rules[0]; // Use first matching rule
  const tiers = rule.tiers || [];

  if (tiers.length === 0) return null;

  // Find active tier based on current quantity
  const activeTier = tiers.find((tier: any) => {
    const inRange = tier.min_quantity <= currentQuantity;
    const noMax = tier.max_quantity === null;
    const belowMax = tier.max_quantity && currentQuantity <= tier.max_quantity;
    return inRange && (noMax || belowMax);
  });

  return (
    <div className="border rounded-lg p-4 bg-muted/20">
      <div className="flex items-center gap-2 mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 text-green-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
          />
        </svg>
        <h3 className="font-semibold">Volume Pricing</h3>
      </div>

      <div className="space-y-2">
        {tiers.map((tier: any, index: number) => {
          const isActive = activeTier?.id === tier.id;
          const quantityText = tier.max_quantity
            ? `${tier.min_quantity}-${tier.max_quantity}`
            : `${tier.min_quantity}+`;

          let discountText = "";
          if (tier.discount_percentage) {
            discountText = `${tier.discount_percentage}% off`;
          } else if (tier.fixed_price) {
            discountText = `$${Number(tier.fixed_price).toFixed(2)} each`;
          } else if (tier.discount_amount) {
            discountText = `$${Number(tier.discount_amount).toFixed(2)} off`;
          }

          return (
            <div
              key={tier.id}
              className={`flex justify-between items-center p-3 rounded ${
                isActive ? "bg-green-100 border border-green-300" : "bg-background"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-medium">{quantityText} units</span>
                {isActive && (
                  <Badge className="bg-green-600">Current</Badge>
                )}
              </div>
              <span className="font-semibold text-green-700">
                {discountText}
              </span>
            </div>
          );
        })}
      </div>

      {activeTier && (
        <p className="text-sm text-muted-foreground mt-3">
          You're getting{" "}
          <span className="font-semibold text-green-700">
            {activeTier.discount_percentage}% off
          </span>{" "}
          for ordering {currentQuantity} units
        </p>
      )}
    </div>
  );
}
