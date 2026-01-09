import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { sdk } from "@/lib/sdk";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    mutationFn: async (data: any) => {
      const response = await sdk.client.fetch("/store/companies", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
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
            <Label htmlFor="name">Company Name *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="legal_name">Legal Name</Label>
            <Input
              id="legal_name"
              value={formData.legal_name}
              onChange={(e) => updateField("legal_name", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
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
            <Label htmlFor="tax_id">Tax ID / EIN</Label>
            <Input
              id="tax_id"
              value={formData.tax_id}
              onChange={(e) => updateField("tax_id", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="industry">Industry</Label>
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
          <Label htmlFor="address">Street Address *</Label>
          <Input
            id="address"
            required
            value={formData.billing_address.address_1}
            onChange={(e) => updateAddressField("address_1", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              required
              value={formData.billing_address.city}
              onChange={(e) => updateAddressField("city", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="province">State / Province *</Label>
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
            <Label htmlFor="postal_code">Postal Code *</Label>
            <Input
              id="postal_code"
              required
              value={formData.billing_address.postal_code}
              onChange={(e) => updateAddressField("postal_code", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
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
          variant="outline"
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
