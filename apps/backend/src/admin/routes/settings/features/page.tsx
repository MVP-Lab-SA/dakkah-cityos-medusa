import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Switch, Button, Input, Badge, Tabs, toast } from "@medusajs/ui"
import { Settings, ShoppingBag, Users, Calendar, Star, Tag, Gift, FileText, Building, TruckDelivery } from "@medusajs/icons"
import { useState, useEffect } from "react"

interface ModuleConfig {
  enabled: boolean
  config: Record<string, any>
}

interface FeatureSettings {
  modules: {
    marketplace: ModuleConfig
    b2b: ModuleConfig
    subscriptions: ModuleConfig
    bookings: ModuleConfig
    reviews: ModuleConfig
    volumePricing: ModuleConfig
    wishlists: ModuleConfig
    giftCards: ModuleConfig
  }
  homepage: {
    sections: Array<{
      id: string
      type: string
      enabled: boolean
      config: Record<string, any>
    }>
  }
  navigation: {
    header: Record<string, any>
    footer: Record<string, any>
  }
}

const MODULE_INFO = {
  marketplace: {
    name: "Marketplace / Multi-Vendor",
    description: "Allow multiple vendors to sell on your platform",
    icon: TruckDelivery,
    configFields: [
      { key: "allowVendorRegistration", label: "Allow Vendor Registration", type: "boolean" },
      { key: "requireApproval", label: "Require Approval", type: "boolean" },
      { key: "commissionRate", label: "Default Commission (%)", type: "number" },
      { key: "showVendorPages", label: "Show Vendor Pages", type: "boolean" }
    ]
  },
  b2b: {
    name: "B2B Commerce",
    description: "Business accounts, quotes, invoices, and approval workflows",
    icon: Building,
    configFields: [
      { key: "allowCompanyRegistration", label: "Allow Company Registration", type: "boolean" },
      { key: "requireApproval", label: "Require Approval", type: "boolean" },
      { key: "enableCreditLimits", label: "Enable Credit Limits", type: "boolean" },
      { key: "enableSpendingLimits", label: "Enable Spending Limits", type: "boolean" },
      { key: "enableTaxExemptions", label: "Enable Tax Exemptions", type: "boolean" },
      { key: "enableApprovalWorkflows", label: "Enable Approval Workflows", type: "boolean" },
      { key: "enableQuotes", label: "Enable Quotes", type: "boolean" },
      { key: "enableInvoices", label: "Enable Invoices", type: "boolean" }
    ]
  },
  subscriptions: {
    name: "Subscriptions",
    description: "Recurring billing and subscription products",
    icon: Tag,
    configFields: [
      { key: "showOnProductPages", label: "Show on Product Pages", type: "boolean" },
      { key: "allowPause", label: "Allow Pause", type: "boolean" },
      { key: "allowSkip", label: "Allow Skip", type: "boolean" },
      { key: "trialEnabled", label: "Enable Trials", type: "boolean" },
      { key: "trialDays", label: "Trial Days", type: "number" }
    ]
  },
  bookings: {
    name: "Bookings / Services",
    description: "Appointments, services, and calendar management",
    icon: Calendar,
    configFields: [
      { key: "showOnHomepage", label: "Show on Homepage", type: "boolean" },
      { key: "allowOnlinePayment", label: "Allow Online Payment", type: "boolean" },
      { key: "requireDeposit", label: "Require Deposit", type: "boolean" },
      { key: "depositPercentage", label: "Deposit (%)", type: "number" },
      { key: "cancellationWindow", label: "Cancellation Window (hours)", type: "number" }
    ]
  },
  reviews: {
    name: "Reviews & Ratings",
    description: "Customer reviews and product ratings",
    icon: Star,
    configFields: [
      { key: "requireApproval", label: "Require Approval", type: "boolean" },
      { key: "allowPhotos", label: "Allow Photos", type: "boolean" },
      { key: "showOnProductPages", label: "Show on Product Pages", type: "boolean" },
      { key: "verifiedPurchaseOnly", label: "Verified Purchase Only", type: "boolean" }
    ]
  },
  volumePricing: {
    name: "Volume / Tiered Pricing",
    description: "Quantity-based discounts and B2B pricing tiers",
    icon: Tag,
    configFields: [
      { key: "showOnProductPages", label: "Show on Product Pages", type: "boolean" },
      { key: "showSavingsPercentage", label: "Show Savings Percentage", type: "boolean" }
    ]
  },
  wishlists: {
    name: "Wishlists",
    description: "Customer wishlists and favorites",
    icon: ShoppingBag,
    configFields: [
      { key: "allowMultipleLists", label: "Allow Multiple Lists", type: "boolean" },
      { key: "allowSharing", label: "Allow Sharing", type: "boolean" }
    ]
  },
  giftCards: {
    name: "Gift Cards",
    description: "Digital gift cards and store credit",
    icon: Gift,
    configFields: [
      { key: "customAmounts", label: "Allow Custom Amounts", type: "boolean" },
      { key: "minAmount", label: "Minimum Amount", type: "number" },
      { key: "maxAmount", label: "Maximum Amount", type: "number" }
    ]
  }
}

const HOMEPAGE_SECTIONS = [
  { type: "hero", name: "Hero Banner", description: "Main hero section with CTA" },
  { type: "featured_products", name: "Featured Products", description: "Showcase featured products" },
  { type: "categories", name: "Categories", description: "Product categories grid" },
  { type: "vendors", name: "Vendors", description: "Featured marketplace vendors", requiresModule: "marketplace" },
  { type: "services", name: "Services", description: "Bookable services", requiresModule: "bookings" },
  { type: "subscriptions", name: "Subscriptions", description: "Subscription plans CTA", requiresModule: "subscriptions" },
  { type: "reviews", name: "Reviews", description: "Recent customer reviews", requiresModule: "reviews" },
  { type: "newsletter", name: "Newsletter", description: "Newsletter signup form" }
]

export default function FeaturesSettingsPage() {
  const [features, setFeatures] = useState<FeatureSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchFeatures()
  }, [])

  const fetchFeatures = async () => {
    try {
      const response = await fetch("/admin/settings/features", {
        credentials: "include"
      })
      const data = await response.json()
      setFeatures(data.features)
    } catch (error) {
      console.error("Failed to fetch features:", error)
      toast.error("Failed to load features")
    } finally {
      setLoading(false)
    }
  }

  const saveFeatures = async () => {
    if (!features) return
    
    setSaving(true)
    try {
      const response = await fetch("/admin/settings/features", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(features)
      })
      const data = await response.json()
      setFeatures(data.features)
      toast.success("Features saved successfully")
    } catch (error) {
      console.error("Failed to save features:", error)
      toast.error("Failed to save features")
    } finally {
      setSaving(false)
    }
  }

  const toggleModule = (moduleKey: string, enabled: boolean) => {
    if (!features) return
    setFeatures({
      ...features,
      modules: {
        ...features.modules,
        [moduleKey]: {
          ...features.modules[moduleKey as keyof typeof features.modules],
          enabled
        }
      }
    })
  }

  const updateModuleConfig = (moduleKey: string, configKey: string, value: any) => {
    if (!features) return
    setFeatures({
      ...features,
      modules: {
        ...features.modules,
        [moduleKey]: {
          ...features.modules[moduleKey as keyof typeof features.modules],
          config: {
            ...features.modules[moduleKey as keyof typeof features.modules].config,
            [configKey]: value
          }
        }
      }
    })
  }

  const toggleHomepageSection = (sectionId: string, enabled: boolean) => {
    if (!features) return
    setFeatures({
      ...features,
      homepage: {
        ...features.homepage,
        sections: features.homepage.sections.map(section =>
          section.id === sectionId ? { ...section, enabled } : section
        )
      }
    })
  }

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (!features) return
    const sections = [...features.homepage.sections]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= sections.length) return
    
    const temp = sections[index]
    sections[index] = sections[newIndex]
    sections[newIndex] = temp
    
    setFeatures({
      ...features,
      homepage: { ...features.homepage, sections }
    })
  }

  if (loading) {
    return (
      <Container className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-ui-bg-subtle rounded w-1/4"></div>
          <div className="h-64 bg-ui-bg-subtle rounded"></div>
        </div>
      </Container>
    )
  }

  if (!features) {
    return (
      <Container className="p-8">
        <Text className="text-ui-fg-error">Failed to load feature settings</Text>
      </Container>
    )
  }

  return (
    <Container className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Heading level="h1" className="mb-2">Feature Management</Heading>
          <Text className="text-ui-fg-subtle">
            Enable or disable store features and configure their behavior
          </Text>
        </div>
        <Button onClick={saveFeatures} isLoading={saving}>
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="modules">
        <Tabs.List>
          <Tabs.Trigger value="modules">Modules</Tabs.Trigger>
          <Tabs.Trigger value="homepage">Homepage</Tabs.Trigger>
          <Tabs.Trigger value="navigation">Navigation</Tabs.Trigger>
        </Tabs.List>

        {/* Modules Tab */}
        <Tabs.Content value="modules" className="mt-6">
          <div className="grid gap-6">
            {Object.entries(MODULE_INFO).map(([key, info]) => {
              const module = features.modules[key as keyof typeof features.modules]
              const Icon = info.icon
              
              return (
                <div
                  key={key}
                  className={`border rounded-lg p-6 ${
                    module.enabled ? 'border-ui-border-interactive bg-ui-bg-subtle-hover' : 'border-ui-border-base'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${module.enabled ? 'bg-ui-bg-interactive text-ui-fg-on-color' : 'bg-ui-bg-subtle'}`}>
                        <Icon />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Heading level="h3">{info.name}</Heading>
                          {module.enabled && <Badge color="green">Enabled</Badge>}
                        </div>
                        <Text className="text-ui-fg-subtle text-sm">{info.description}</Text>
                      </div>
                    </div>
                    <Switch
                      checked={module.enabled}
                      onCheckedChange={(checked) => toggleModule(key, checked)}
                    />
                  </div>

                  {module.enabled && (
                    <div className="mt-4 pt-4 border-t border-ui-border-base">
                      <Text className="font-medium mb-3">Configuration</Text>
                      <div className="grid grid-cols-2 gap-4">
                        {info.configFields.map(field => (
                          <div key={field.key} className="flex items-center justify-between">
                            <Text className="text-sm">{field.label}</Text>
                            {field.type === 'boolean' ? (
                              <Switch
                                checked={module.config[field.key] || false}
                                onCheckedChange={(checked) => updateModuleConfig(key, field.key, checked)}
                              />
                            ) : (
                              <Input
                                type="number"
                                value={module.config[field.key] || ''}
                                onChange={(e) => updateModuleConfig(key, field.key, Number(e.target.value))}
                                className="w-24"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Tabs.Content>

        {/* Homepage Tab */}
        <Tabs.Content value="homepage" className="mt-6">
          <div className="space-y-2">
            <Text className="text-ui-fg-subtle mb-4">
              Drag to reorder sections. Sections will appear in this order on the homepage.
            </Text>
            
            {features.homepage.sections.map((section, index) => {
              const sectionInfo = HOMEPAGE_SECTIONS.find(s => s.type === section.type)
              const isDisabled = sectionInfo?.requiresModule && 
                !features.modules[sectionInfo.requiresModule as keyof typeof features.modules]?.enabled
              
              return (
                <div
                  key={section.id}
                  className={`flex items-center justify-between p-4 border rounded-lg ${
                    section.enabled && !isDisabled ? 'border-ui-border-interactive bg-ui-bg-subtle-hover' : 'border-ui-border-base'
                  } ${isDisabled ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="transparent"
                        size="small"
                        onClick={() => moveSection(index, 'up')}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        variant="transparent"
                        size="small"
                        onClick={() => moveSection(index, 'down')}
                        disabled={index === features.homepage.sections.length - 1}
                      >
                        ↓
                      </Button>
                    </div>
                    <div>
                      <Text className="font-medium">{sectionInfo?.name || section.type}</Text>
                      <Text className="text-sm text-ui-fg-subtle">{sectionInfo?.description}</Text>
                      {isDisabled && (
                        <Text className="text-sm text-ui-fg-error">
                          Requires {sectionInfo?.requiresModule} module
                        </Text>
                      )}
                    </div>
                  </div>
                  <Switch
                    checked={section.enabled && !isDisabled}
                    onCheckedChange={(checked) => toggleHomepageSection(section.id, checked)}
                    disabled={isDisabled}
                  />
                </div>
              )
            })}
          </div>
        </Tabs.Content>

        {/* Navigation Tab */}
        <Tabs.Content value="navigation" className="mt-6">
          <div className="grid grid-cols-2 gap-8">
            <div className="border rounded-lg p-6">
              <Heading level="h3" className="mb-4">Header Navigation</Heading>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Text>Show Categories</Text>
                  <Switch
                    checked={features.navigation.header.showCategories}
                    onCheckedChange={(checked) => setFeatures({
                      ...features,
                      navigation: {
                        ...features.navigation,
                        header: { ...features.navigation.header, showCategories: checked }
                      }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Text>Show Vendors</Text>
                    {!features.modules.marketplace.enabled && (
                      <Text className="text-xs text-ui-fg-subtle">Requires Marketplace</Text>
                    )}
                  </div>
                  <Switch
                    checked={features.navigation.header.showVendors}
                    disabled={!features.modules.marketplace.enabled}
                    onCheckedChange={(checked) => setFeatures({
                      ...features,
                      navigation: {
                        ...features.navigation,
                        header: { ...features.navigation.header, showVendors: checked }
                      }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Text>Show Services</Text>
                    {!features.modules.bookings.enabled && (
                      <Text className="text-xs text-ui-fg-subtle">Requires Bookings</Text>
                    )}
                  </div>
                  <Switch
                    checked={features.navigation.header.showServices}
                    disabled={!features.modules.bookings.enabled}
                    onCheckedChange={(checked) => setFeatures({
                      ...features,
                      navigation: {
                        ...features.navigation,
                        header: { ...features.navigation.header, showServices: checked }
                      }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Text>Show B2B Portal</Text>
                    {!features.modules.b2b.enabled && (
                      <Text className="text-xs text-ui-fg-subtle">Requires B2B</Text>
                    )}
                  </div>
                  <Switch
                    checked={features.navigation.header.showB2BPortal}
                    disabled={!features.modules.b2b.enabled}
                    onCheckedChange={(checked) => setFeatures({
                      ...features,
                      navigation: {
                        ...features.navigation,
                        header: { ...features.navigation.header, showB2BPortal: checked }
                      }
                    })}
                  />
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <Heading level="h3" className="mb-4">Footer Navigation</Heading>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Text>Show Categories</Text>
                  <Switch
                    checked={features.navigation.footer.showCategories}
                    onCheckedChange={(checked) => setFeatures({
                      ...features,
                      navigation: {
                        ...features.navigation,
                        footer: { ...features.navigation.footer, showCategories: checked }
                      }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Text>Show Vendors</Text>
                  <Switch
                    checked={features.navigation.footer.showVendors}
                    disabled={!features.modules.marketplace.enabled}
                    onCheckedChange={(checked) => setFeatures({
                      ...features,
                      navigation: {
                        ...features.navigation,
                        footer: { ...features.navigation.footer, showVendors: checked }
                      }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Text>Show Services</Text>
                  <Switch
                    checked={features.navigation.footer.showServices}
                    disabled={!features.modules.bookings.enabled}
                    onCheckedChange={(checked) => setFeatures({
                      ...features,
                      navigation: {
                        ...features.navigation,
                        footer: { ...features.navigation.footer, showServices: checked }
                      }
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </Tabs.Content>
      </Tabs>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Features",
  icon: Settings
})
