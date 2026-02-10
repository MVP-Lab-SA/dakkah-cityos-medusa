import { useState } from "react"
import { ArrowRightMini } from "@medusajs/icons"

interface NewsletterSectionProps {
  config: Record<string, any>
}

export function NewsletterSection({ config }: NewsletterSectionProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) return
    
    setStatus('loading')
    
    try {
      // Call newsletter signup API
      const response = await fetch('/store/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      if (response.ok) {
        setStatus('success')
        setMessage(config.successMessage || "Thanks for subscribing!")
        setEmail("")
      } else {
        throw new Error('Failed to subscribe')
      }
    } catch (error) {
      setStatus('error')
      setMessage(config.errorMessage || "Something went wrong. Please try again.")
    }
  }

  return (
    <section className="py-16 bg-ds-primary text-ds-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="h-12 w-12 mx-auto mb-6 text-ds-muted-foreground flex items-center justify-center text-4xl">&#9993;</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {config.title || "Stay in the Loop"}
          </h2>
          <p className="text-ds-muted-foreground mb-8">
            {config.subtitle || "Subscribe to our newsletter for exclusive deals, new arrivals, and insider updates."}
          </p>
          
          {status === 'success' ? (
            <div className="bg-ds-success/20 border border-ds-success/50 rounded-lg p-4">
              <p className="text-ds-success">{message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-ds-background/10 border border-white/20 text-ds-primary-foreground placeholder-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/50"
                required
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-ds-background text-ds-foreground font-medium rounded-lg hover:bg-ds-muted transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? (
                  "Subscribing..."
                ) : (
                  <>
                    Subscribe
                    <ArrowRightMini className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}
          
          {status === 'error' && (
            <p className="mt-4 text-ds-destructive text-sm">{message}</p>
          )}
          
          <p className="mt-6 text-sm text-ds-muted-foreground">
            {config.disclaimer || "No spam, unsubscribe anytime."}
          </p>
        </div>
      </div>
    </section>
  )
}
