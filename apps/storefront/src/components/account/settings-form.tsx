import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check } from "@medusajs/icons"

interface NotificationSettings {
  orderUpdates: boolean
  promotions: boolean
  newsletter: boolean
  smsAlerts: boolean
}

interface SettingsFormProps {
  onSave?: (settings: NotificationSettings) => void
}

export function SettingsForm({ onSave }: SettingsFormProps) {
  const [settings, setSettings] = useState<NotificationSettings>({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    smsAlerts: false,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
    setSaved(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    onSave?.(settings)
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const Toggle = ({ 
    checked, 
    onChange, 
    label, 
    description 
  }: { 
    checked: boolean
    onChange: () => void
    label: string
    description: string
  }) => (
    <div className="flex items-center justify-between py-4 border-b border-ds-border last:border-0">
      <div>
        <p className="font-medium text-ds-foreground">{label}</p>
        <p className="text-sm text-ds-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-ds-primary" : "bg-ds-muted"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-ds-background transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Notification Preferences */}
      <div>
        <h3 className="text-lg font-semibold text-ds-foreground mb-4">Notifications</h3>
        <div className="bg-ds-background rounded-xl border border-ds-border px-6">
          <Toggle
            checked={settings.orderUpdates}
            onChange={() => handleToggle("orderUpdates")}
            label="Order Updates"
            description="Receive notifications about your order status"
          />
          <Toggle
            checked={settings.promotions}
            onChange={() => handleToggle("promotions")}
            label="Promotions"
            description="Get notified about sales and special offers"
          />
          <Toggle
            checked={settings.newsletter}
            onChange={() => handleToggle("newsletter")}
            label="Newsletter"
            description="Receive our weekly newsletter"
          />
          <Toggle
            checked={settings.smsAlerts}
            onChange={() => handleToggle("smsAlerts")}
            label="SMS Alerts"
            description="Receive text messages for important updates"
          />
        </div>
      </div>

      {/* Privacy */}
      <div>
        <h3 className="text-lg font-semibold text-ds-foreground mb-4">Privacy</h3>
        <div className="bg-ds-background rounded-xl border border-ds-border p-6 space-y-4">
          <p className="text-sm text-ds-muted-foreground">
            We value your privacy. Your data is used only to improve your shopping experience 
            and is never shared with third parties without your consent.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              Download My Data
            </Button>
            <Button variant="outline" size="sm" className="text-ds-destructive hover:text-ds-destructive hover:bg-ds-destructive">
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      {/* Password Change */}
      <div>
        <h3 className="text-lg font-semibold text-ds-foreground mb-4">Change Password</h3>
        <div className="bg-ds-background rounded-xl border border-ds-border p-6 space-y-4">
          <div>
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              placeholder="Enter current password"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Enter new password"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm new password"
              className="mt-1"
            />
          </div>
          <Button variant="outline">Update Password</Button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {saved ? (
            <>
              <Check className="w-4 h-4 me-2" />
              Saved
            </>
          ) : isSaving ? (
            "Saving..."
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  )
}
