import React, { useState } from 'react'

interface NewsletterBlockProps {
  heading?: string
  description?: string
  placeholder?: string
  buttonText?: string
  variant?: 'inline' | 'card' | 'banner' | 'minimal'
  backgroundStyle?: 'primary' | 'secondary' | 'muted'
}

const bgStyles: Record<string, string> = {
  primary: 'bg-ds-primary text-ds-primary-foreground',
  secondary: 'bg-ds-secondary text-ds-secondary-foreground',
  muted: 'bg-ds-muted text-ds-muted-foreground',
}

export const NewsletterBlock: React.FC<NewsletterBlockProps> = ({
  heading = 'Subscribe to our newsletter',
  description,
  placeholder = 'Enter your email',
  buttonText = 'Subscribe',
  variant = 'card',
  backgroundStyle = 'muted',
}) => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <section className={`w-full py-12 px-4 ${bgStyles[backgroundStyle]}`}>
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ds-success/20 mb-4">
            <svg className="w-6 h-6 text-ds-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Thank you for subscribing!</h3>
          <p className="text-sm opacity-80">You'll receive our latest updates in your inbox.</p>
        </div>
      </section>
    )
  }

  const formContent = (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        required
        className="flex-1 px-4 py-2.5 rounded-md border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
      />
      <button
        type="submit"
        className="px-6 py-2.5 rounded-md bg-ds-primary text-ds-primary-foreground font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
      >
        {buttonText}
      </button>
    </form>
  )

  if (variant === 'minimal') {
    return (
      <section className="w-full py-8 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center gap-4">
          {heading && (
            <span className="text-sm font-medium text-ds-foreground whitespace-nowrap">
              {heading}
            </span>
          )}
          {formContent}
        </div>
      </section>
    )
  }

  if (variant === 'inline') {
    return (
      <section className={`w-full py-8 px-4 ${bgStyles[backgroundStyle]}`}>
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            {heading && <h2 className="text-xl font-bold mb-1">{heading}</h2>}
            {description && <p className="text-sm opacity-80">{description}</p>}
          </div>
          {formContent}
        </div>
      </section>
    )
  }

  if (variant === 'banner') {
    return (
      <section className={`w-full py-16 px-4 ${bgStyles[backgroundStyle]}`}>
        <div className="container mx-auto text-center">
          {heading && <h2 className="text-3xl font-bold mb-3">{heading}</h2>}
          {description && (
            <p className="text-lg opacity-80 mb-8 max-w-xl mx-auto">{description}</p>
          )}
          <div className="flex justify-center">{formContent}</div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full py-12 px-4">
      <div className="container mx-auto max-w-lg">
        <div className={`rounded-lg p-8 text-center ${bgStyles[backgroundStyle]}`}>
          {heading && <h2 className="text-2xl font-bold mb-2">{heading}</h2>}
          {description && (
            <p className="text-sm opacity-80 mb-6">{description}</p>
          )}
          <div className="flex justify-center">{formContent}</div>
        </div>
      </div>
    </section>
  )
}
