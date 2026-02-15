import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, Envelope } from "@medusajs/icons"

interface VendorContactProps {
  vendorId: string
  vendorName: string
  onSubmit?: (data: { name: string; email: string; subject: string; message: string }) => Promise<void>
}

export function VendorContact({ vendorId, vendorName, onSubmit }: VendorContactProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit?.(formData)
      setSubmitted(true)
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-ds-background rounded-xl border border-ds-border p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-ds-success flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-ds-success" />
        </div>
        <h3 className="text-xl font-semibold text-ds-foreground mb-2">Message Sent</h3>
        <p className="text-ds-muted-foreground mb-4">
          Your message has been sent to {vendorName}. They will respond to your email shortly.
        </p>
        <Button variant="outline" onClick={() => {
          setSubmitted(false)
          setFormData({ name: "", email: "", subject: "", message: "" })
        }}>
          Send Another Message
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-ds-background rounded-xl border border-ds-border overflow-hidden">
      <div className="px-6 py-4 border-b border-ds-border">
        <h3 className="text-lg font-semibold text-ds-foreground">Contact {vendorName}</h3>
      </div>
      
      <form aria-label="Vendor contact form" onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">Your Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="message">Message</Label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
            rows={5}
            className="mt-1 w-full rounded-lg border border-ds-border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ds-ring"
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          <Envelope className="w-4 h-4 me-2" />
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  )
}
