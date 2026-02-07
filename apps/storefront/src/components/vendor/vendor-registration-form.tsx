import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { sdk } from "@/lib/utils/sdk";
import { Button } from "@/components/ui/button";
import { CheckCircleSolid } from "@medusajs/icons";
import { useCountryCode } from "@/lib/hooks/use-country-code";

interface VendorRegistrationData {
  business_name: string;
  legal_name?: string;
  business_type: string;
  tax_id?: string;
  email: string;
  phone?: string;
  website?: string;
  description?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country_code: string;
  contact_person_name: string;
  contact_person_email: string;
  contact_person_phone?: string;
}

export function VendorRegistrationForm() {
  const navigate = useNavigate();
  const countryCode = useCountryCode();

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<VendorRegistrationData>({
    business_name: "",
    legal_name: "",
    business_type: "individual",
    tax_id: "",
    email: "",
    phone: "",
    website: "",
    description: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country_code: "US",
    contact_person_name: "",
    contact_person_email: "",
    contact_person_phone: "",
  });

  const registerMutation = useMutation({
    mutationFn: async (data: VendorRegistrationData) => {
      return sdk.client.fetch("/store/vendors/register", {
        method: "POST",
        body: data,
        credentials: "include",
      });
    },
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    registerMutation.mutate(formData);
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.business_name || !formData.email) {
        setError("Business name and email are required");
        return;
      }
    }
    if (step === 2) {
      if (!formData.address_line1 || !formData.city || !formData.state || !formData.postal_code) {
        setError("Address fields are required");
        return;
      }
    }
    setError(null);
    setStep(step + 1);
  };

  const prevStep = () => {
    setError(null);
    setStep(step - 1);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <CheckCircleSolid className="w-16 h-16 text-green-600 mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-4">Application Submitted</h2>
        <p className="text-muted-foreground mb-6">
          Thank you for applying to become a vendor! We will review your application
          and get back to you within 2-3 business days.
        </p>
        <Button onClick={() => navigate({ to: "/$countryCode/store", params: { countryCode } })}>
          Return to Store
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Become a Vendor</h1>
      <p className="text-muted-foreground mb-8">
        Join our marketplace and start selling your products
      </p>

      {/* Progress Steps */}
      <div className="flex items-center mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                s <= step
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`w-16 h-1 mx-2 ${
                  s < step ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Step 1: Business Information */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Business Information</h2>
            
            <div>
              <label className="block text-sm font-medium mb-1">Business Name *</label>
              <input
                type="text"
                value={formData.business_name}
                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Your business name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Legal Name</label>
              <input
                type="text"
                value={formData.legal_name || ""}
                onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Legal entity name (if different)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Business Type</label>
              <select
                value={formData.business_type}
                onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="individual">Individual / Sole Proprietor</option>
                <option value="llc">LLC</option>
                <option value="corporation">Corporation</option>
                <option value="partnership">Partnership</option>
                <option value="nonprofit">Non-Profit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tax ID / EIN</label>
              <input
                type="text"
                value={formData.tax_id || ""}
                onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="XX-XXXXXXX"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="business@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              <input
                type="url"
                value={formData.website || ""}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="https://www.example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Business Description</label>
              <textarea
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-md min-h-[100px]"
                placeholder="Tell us about your business and products"
              />
            </div>

            <div className="flex justify-end">
              <Button type="button" onClick={nextStep}>
                Next Step
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Address */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Business Address</h2>

            <div>
              <label className="block text-sm font-medium mb-1">Street Address *</label>
              <input
                type="text"
                value={formData.address_line1}
                onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="123 Main St"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address Line 2</label>
              <input
                type="text"
                value={formData.address_line2 || ""}
                onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Suite, Unit, Building, Floor, etc."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State / Province *</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Postal Code *</label>
                <input
                  type="text"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <select
                  value={formData.country_code}
                  onChange={(e) => setFormData({ ...formData, country_code: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="secondary" onClick={prevStep}>
                Previous
              </Button>
              <Button type="button" onClick={nextStep}>
                Next Step
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Contact Person */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Contact Person</h2>
            <p className="text-muted-foreground">
              Who should we contact regarding your vendor account?
            </p>

            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input
                type="text"
                value={formData.contact_person_name}
                onChange={(e) => setFormData({ ...formData, contact_person_name: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                value={formData.contact_person_email}
                onChange={(e) => setFormData({ ...formData, contact_person_email: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                value={formData.contact_person_phone || ""}
                onChange={(e) => setFormData({ ...formData, contact_person_phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            {/* Terms Agreement */}
            <div className="border rounded-lg p-4 bg-muted/20">
              <label className="flex items-start gap-3">
                <input type="checkbox" className="mt-1 rounded" required />
                <span className="text-sm">
                  I agree to the Vendor Terms of Service and understand that my application
                  will be reviewed before I can start selling. I confirm that all information
                  provided is accurate and complete.
                </span>
              </label>
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="secondary" onClick={prevStep}>
                Previous
              </Button>
              <Button type="submit" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
