import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { sdk } from "@/lib/utils/sdk";
import { Button } from "@/components/ui/button";
import { 
  Buildings, 
  DocumentText,
  CreditCard, 
  Clock,
  CheckCircleSolid
} from "@medusajs/icons";
import { useCountryCode } from "@/lib/hooks/use-country-code";

interface Company {
  id: string;
  name: string;
  legal_name?: string;
  status: "pending" | "active" | "suspended" | "inactive";
  tier: "bronze" | "silver" | "gold" | "platinum";
  credit_limit?: number;
  credit_used?: number;
  payment_terms?: string;
  tax_id?: string;
  created_at: string;
}

interface CompanyUser {
  id: string;
  role: "admin" | "approver" | "buyer" | "viewer";
  spending_limit?: number;
  spending_used?: number;
  can_approve: boolean;
}

interface Quote {
  id: string;
  quote_number: string;
  status: string;
  total: number;
  created_at: string;
  valid_until?: string;
}

export function B2BDashboard() {
  const countryCode = useCountryCode();
  
  // Fetch company data
  const { data: companyData, isLoading: loadingCompany } = useQuery({
    queryKey: ["my-company"],
    queryFn: async () => {
      const response = await sdk.client.fetch<{ companies: Company[] }>("/store/companies", {
        credentials: "include",
      });
      return response;
    },
  });

  // Fetch quotes
  const { data: quotesData, isLoading: loadingQuotes } = useQuery({
    queryKey: ["my-quotes"],
    queryFn: async () => {
      const response = await sdk.client.fetch<{ quotes: Quote[] }>("/store/quotes", {
        credentials: "include",
      });
      return response;
    },
  });

  const company = companyData?.companies?.[0];
  const quotes = quotesData?.quotes || [];

  // Calculate stats
  const creditAvailable = company?.credit_limit 
    ? company.credit_limit - (company.credit_used || 0) 
    : 0;
  const creditUsagePercent = company?.credit_limit 
    ? ((company.credit_used || 0) / company.credit_limit) * 100 
    : 0;
  const pendingQuotes = quotes.filter((q: Quote) => q.status === "submitted" || q.status === "under_review").length;
  const approvedQuotes = quotes.filter((q: Quote) => q.status === "approved").length;

  if (loadingCompany) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="text-center py-16">
        <Buildings className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">No B2B Account Found</h2>
        <p className="text-muted-foreground mb-6">
          Register your company to access B2B features like quotes, volume pricing, and credit terms.
        </p>
        <Link to="/$countryCode/b2b/register" params={{ countryCode }}>
          <Button>Register Your Company</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{company.name}</h1>
          <p className="text-muted-foreground">
            {company.legal_name || "B2B Account Dashboard"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            company.status === "active" ? "bg-green-100 text-green-800" :
            company.status === "pending" ? "bg-yellow-100 text-yellow-800" :
            company.status === "suspended" ? "bg-red-100 text-red-800" :
            "bg-gray-100 text-gray-800"
          }`}>
            {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            company.tier === "platinum" ? "bg-purple-100 text-purple-800" :
            company.tier === "gold" ? "bg-yellow-100 text-yellow-800" :
            company.tier === "silver" ? "bg-slate-200 text-slate-800" :
            "bg-amber-100 text-amber-800"
          }`}>
            {company.tier.charAt(0).toUpperCase() + company.tier.slice(1)}
          </span>
        </div>
      </div>

      {/* Pending Approval Notice */}
      {company.status === "pending" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800">Account Pending Approval</h3>
            <p className="text-sm text-yellow-700">
              Your B2B account is under review. You'll receive an email once approved.
              Some features may be limited until approval.
            </p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Credit Available */}
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Credit Available</span>
            <CreditCard className="w-5 h-5 text-green-600" color="green" />
          </div>
          <p className="text-2xl font-bold">
            ${creditAvailable.toLocaleString()}
          </p>
          {company.credit_limit && (
            <div className="mt-2">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${creditUsagePercent > 80 ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{ width: `${100 - creditUsagePercent}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ${company.credit_used?.toLocaleString() || 0} of ${company.credit_limit.toLocaleString()} used
              </p>
            </div>
          )}
        </div>

        {/* Pending Quotes */}
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Pending Quotes</span>
            <DocumentText className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold">{pendingQuotes}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Awaiting review
          </p>
        </div>

        {/* Approved Quotes */}
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Approved Quotes</span>
            <CheckCircleSolid className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold">{approvedQuotes}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Ready to convert
          </p>
        </div>

        {/* Payment Terms */}
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Payment Terms</span>
            <CreditCard className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold">{company.payment_terms || "Net 30"}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Standard terms
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/$countryCode/quotes/request" params={{ countryCode }}>
          <div className="border rounded-lg p-6 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer">
            <DocumentText className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-1">Request a Quote</h3>
            <p className="text-sm text-muted-foreground">
              Get custom pricing for bulk orders
            </p>
          </div>
        </Link>

        <Link to="/$countryCode/quotes" params={{ countryCode }}>
          <div className="border rounded-lg p-6 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer">
            <Clock className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-1">View All Quotes</h3>
            <p className="text-sm text-muted-foreground">
              Track and manage your quote requests
            </p>
          </div>
        </Link>

        <Link to="/$countryCode/store" params={{ countryCode }}>
          <div className="border rounded-lg p-6 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer">
            <CreditCard className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-1">Browse Products</h3>
            <p className="text-sm text-muted-foreground">
              Shop with volume discounts
            </p>
          </div>
        </Link>
      </div>

      {/* Recent Quotes */}
      <div className="border rounded-lg">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Quotes</h2>
          <Link to="/$countryCode/quotes" params={{ countryCode }}>
            <Button variant="secondary">View All</Button>
          </Link>
        </div>
        
        {loadingQuotes ? (
          <div className="p-6 text-center text-muted-foreground">Loading...</div>
        ) : quotes.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No quotes yet. Request your first quote to get custom pricing.
          </div>
        ) : (
          <div className="divide-y">
            {quotes.slice(0, 5).map((quote) => (
              <Link
                key={quote.id}
                to="/$countryCode/quotes/$id"
                params={{ countryCode: "us", id: quote.id }}
                className="block"
              >
                <div className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{quote.quote_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(quote.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <QuoteStatusBadge status={quote.status} />
                      <p className="text-sm font-semibold mt-1">
                        ${Number(quote.total || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Company Details */}
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Company Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Legal Name</p>
            <p className="font-medium">{company.legal_name || company.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tax ID</p>
            <p className="font-medium">{company.tax_id || "Not provided"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Account Created</p>
            <p className="font-medium">
              {new Date(company.created_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Account Tier</p>
            <TierBadge tier={company.tier} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TierBadge({ tier }: { tier: Company["tier"] }) {
  const styles = {
    bronze: "bg-amber-100 text-amber-800",
    silver: "bg-slate-200 text-slate-800",
    gold: "bg-yellow-100 text-yellow-800",
    platinum: "bg-purple-100 text-purple-800",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${styles[tier]}`}>
      {tier.charAt(0).toUpperCase() + tier.slice(1)}
    </span>
  );
}

function QuoteStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    submitted: "bg-blue-100 text-blue-800",
    under_review: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    accepted: "bg-emerald-100 text-emerald-800",
    declined: "bg-orange-100 text-orange-800",
    expired: "bg-gray-100 text-gray-800",
  };

  const labels: Record<string, string> = {
    draft: "Draft",
    submitted: "Submitted",
    under_review: "Under Review",
    approved: "Approved",
    rejected: "Rejected",
    accepted: "Accepted",
    declined: "Declined",
    expired: "Expired",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status] || "bg-gray-100"}`}>
      {labels[status] || status}
    </span>
  );
}
