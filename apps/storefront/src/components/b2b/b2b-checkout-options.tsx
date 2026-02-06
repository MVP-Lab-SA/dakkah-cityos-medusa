import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { sdk } from "@/lib/utils/sdk";
import { Input } from "@/components/ui/input";
import { Buildings, DocumentText, CreditCard } from "@medusajs/icons";

interface B2BCheckoutOptionsProps {
  cartId: string;
  onOptionsChange: (options: B2BCheckoutData) => void;
}

export interface B2BCheckoutData {
  po_number?: string;
  use_company_credit: boolean;
  requires_approval: boolean;
  company_id?: string;
  approver_id?: string;
}

interface Company {
  id: string;
  name: string;
  credit_limit?: number;
  credit_used?: number;
  status: string;
}

export function B2BCheckoutOptions({ cartId, onOptionsChange }: B2BCheckoutOptionsProps) {
  const [poNumber, setPoNumber] = useState("");
  const [useCredit, setUseCredit] = useState(false);
  const [requiresApproval, setRequiresApproval] = useState(false);

  // Fetch company data
  const { data: companyData, isLoading } = useQuery({
    queryKey: ["my-company-checkout"],
    queryFn: async () => {
      const response = await sdk.client.fetch<{ companies: Company[] }>("/store/companies", {
        credentials: "include",
      });
      return response;
    },
  });

  const company = companyData?.companies?.[0];
  const creditAvailable = company?.credit_limit 
    ? company.credit_limit - (company.credit_used || 0) 
    : 0;
  const hasCredit = creditAvailable > 0 && company?.status === "active";

  // Update parent when options change
  useEffect(() => {
    onOptionsChange({
      po_number: poNumber || undefined,
      use_company_credit: useCredit,
      requires_approval: requiresApproval,
      company_id: company?.id,
    });
  }, [poNumber, useCredit, requiresApproval, company?.id, onOptionsChange]);

  if (isLoading) {
    return (
      <div className="border rounded-lg p-4 bg-muted/20 animate-pulse">
        <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
        <div className="h-8 bg-muted rounded w-full"></div>
      </div>
    );
  }

  // Don't show B2B options if no company
  if (!company) {
    return null;
  }

  // Don't show for pending companies
  if (company.status === "pending") {
    return (
      <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
        <div className="flex items-center gap-2 text-yellow-800">
          <Buildings className="w-5 h-5" />
          <span className="font-medium">B2B Account Pending</span>
        </div>
        <p className="text-sm text-yellow-700 mt-1">
          Your company account is pending approval. Standard checkout is available.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Buildings className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">B2B Checkout Options</h3>
        <span className="px-2 py-1 rounded text-xs font-medium border">{company.name}</span>
      </div>

      {/* PO Number */}
      <div className="space-y-2">
        <label htmlFor="po_number" className="flex items-center gap-2 text-sm font-medium">
          <DocumentText className="w-4 h-4" />
          Purchase Order Number (Optional)
        </label>
        <Input
          id="po_number"
          value={poNumber}
          onChange={(e) => setPoNumber(e.target.value)}
          placeholder="Enter your PO number"
        />
        <p className="text-xs text-muted-foreground">
          Add a PO number for your records and invoicing
        </p>
      </div>

      {/* Use Company Credit */}
      {hasCredit && (
        <div className="flex items-start gap-3 p-4 border rounded-lg bg-green-50/50">
          <input
            type="checkbox"
            id="use_credit"
            checked={useCredit}
            onChange={(e) => setUseCredit(e.target.checked)}
            className="mt-1"
          />
          <div className="flex-1">
            <label htmlFor="use_credit" className="flex items-center gap-2 cursor-pointer text-sm font-medium">
              <CreditCard className="w-4 h-4 text-green-600" />
              Use Company Credit
            </label>
            <p className="text-sm text-muted-foreground mt-1">
              Pay using your company credit line
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm font-medium text-green-700">
                ${creditAvailable.toLocaleString()} available
              </span>
              <span className="text-xs text-muted-foreground">
                of ${company.credit_limit?.toLocaleString()} limit
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Requires Approval */}
      <div className="flex items-start gap-3 p-4 border rounded-lg">
        <input
          type="checkbox"
          id="requires_approval"
          checked={requiresApproval}
          onChange={(e) => setRequiresApproval(e.target.checked)}
          className="mt-1"
        />
        <div className="flex-1">
          <label htmlFor="requires_approval" className="cursor-pointer text-sm font-medium">
            Request Internal Approval Before Processing
          </label>
          <p className="text-sm text-muted-foreground mt-1">
            Send this order for approval by a manager or finance team before payment is processed
          </p>
        </div>
      </div>

      {/* Credit Info */}
      {useCredit && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <p className="text-blue-800">
            <strong>Credit Payment:</strong> Your order will be invoiced to your company account.
            Payment is due according to your agreed terms ({company.credit_limit ? "Net 30" : "On receipt"}).
          </p>
        </div>
      )}
    </div>
  );
}
