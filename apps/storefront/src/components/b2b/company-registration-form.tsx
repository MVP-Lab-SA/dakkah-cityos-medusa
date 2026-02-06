import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { sdk } from "@/lib/utils/sdk";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CompanyRegistrationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    legal_name: "",
    tax_id: "",
    email: "",
    phone: "",
    industry: "",
    employee_count: "",
    annual_revenue: "",
    billing_address: {
      address_1: "",
      city: "",
      province: "",
      postal_code: "",
      country_code: "us",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await sdk.client.fetch<{ company: unknown }>("/store/companies", {
        method: "POST",
        credentials: "include",
        body: data,
      });
      return response;
    },
    onSuccess: () => {
      navigate({ to: "/$countryCode", params: { countryCode: "us" } });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateAddressField = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      billing_address: {
        ...prev.billing_address,
        [field]: value,
      },
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Company Info */}
      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Company Information</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="text-sm font-medium">Company Name *</label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="legal_name" className="text-sm font-medium">Legal Name</label>
            <Input
              id="legal_name"
              value={formData.legal_name}
              onChange={(e) => updateField("legal_name", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium">Email *</label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="phone" className="text-sm font-medium">Phone</label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="tax_id" className="text-sm font-medium">Tax ID / EIN</label>
            <Input
              id="tax_id"
              value={formData.tax_id}
              onChange={(e) => updateField("tax_id", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="industry" className="text-sm font-medium">Industry</label>
            <Input
              id="industry"
              value={formData.industry}
              onChange={(e) => updateField("industry", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Billing Address */}
      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
        
        <div>
          <label htmlFor="address" className="text-sm font-medium">Street Address *</label>
          <Input
            id="address"
            required
            value={formData.billing_address.address_1}
            onChange={(e) => updateAddressField("address_1", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="text-sm font-medium">City *</label>
            <Input
              id="city"
              required
              value={formData.billing_address.city}
              onChange={(e) => updateAddressField("city", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="province" className="text-sm font-medium">State / Province *</label>
            <Input
              id="province"
              required
              value={formData.billing_address.province}
              onChange={(e) => updateAddressField("province", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="postal_code" className="text-sm font-medium">Postal Code *</label>
            <Input
              id="postal_code"
              required
              value={formData.billing_address.postal_code}
              onChange={(e) => updateAddressField("postal_code", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="country" className="text-sm font-medium">Country</label>
            <Input
              id="country"
              disabled
              value="United States"
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={registerMutation.isPending}
          className="flex-1"
        >
          {registerMutation.isPending ? "Submitting..." : "Register Company"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate({ to: "/$countryCode", params: { countryCode: "us" } })}
        >
          Cancel
        </Button>
      </div>

      <p className="text-sm text-muted-foreground text-center">
        Your account will be reviewed by our team. You'll receive an email
        once your B2B account is approved.
      </p>
    </form>
  );
}
