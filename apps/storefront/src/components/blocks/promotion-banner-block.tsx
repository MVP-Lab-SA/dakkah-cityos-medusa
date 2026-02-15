import React, { useState } from 'react'
import { t } from '@/lib/i18n'

interface PromotionBannerBlockProps {
  heading?: string
  description?: string
  code?: string
  expiresAt?: string
  image?: {
    url: string
    alt?: string
  }
  variant?: 'banner' | 'card' | 'floating' | 'countdown'
  dismissible?: boolean
  locale?: string
}

function formatExpiry(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export const PromotionBannerBlock: React.FC<PromotionBannerBlockProps> = (props) => {
  const { heading, description, ...rest } = props;
  const itemsKey = Object.keys(props).find(k => Array.isArray(props[k]));
  const items = itemsKey ? props[itemsKey] : [];
  if ((!items || !items.length) && !heading && !description) return null;
  heading,
  description,
  code,
  expiresAt,
  image,
  variant = 'banner',
  dismissible = false,
  locale = 'en',
}) => {
  const [dismissed, setDismissed] = useState(false)
  const [copied, setCopied] = useState(false)

  if (dismissed) return null

  const handleCopyCode = async () => {
    if (!code) return
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const DismissButton = () =>
    dismissible ? (
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 end-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-ds-muted/20 transition-colors text-current"
        aria-label={t(locale, 'blocks.dismiss')}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      </button>
    ) : null

  const CodeButton = () =>
    code ? (
      <button
        onClick={handleCopyCode}
        className="inline-flex items-center gap-2 px-4 py-2 bg-ds-background text-ds-foreground rounded-lg font-mono text-sm border border-ds-border hover:bg-ds-muted transition-colors"
      >
        <span>{code}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="5" y="5" width="9" height="9" rx="1.5" />
          <path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5" />
        </svg>
        {copied && <span className="text-xs">{t(locale, 'blocks.copied')}</span>}
      </button>
    ) : null

  const ExpiryInfo = () =>
    expiresAt ? (
      <p className="text-sm opacity-80">
        {t(locale, 'blocks.expires')} {formatExpiry(expiresAt)}
      </p>
    ) : null

  if (variant === 'card') {
    return (
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <div className="relative bg-ds-card border border-ds-border rounded-xl overflow-hidden">
            <DismissButton />
            {image?.url && (
              <div className="aspect-[3/1] overflow-hidden">
                <img
                  src={image.url}
                  alt={image.alt || heading || 'Promotion'}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6 md:p-8 text-center">
              {heading && (
                <h2 className="text-2xl md:text-3xl font-bold text-ds-foreground mb-3">
                  {heading}
                </h2>
              )}
              {description && (
                <p className="text-ds-muted-foreground mb-4">{description}</p>
              )}
              <div className="flex flex-col items-center gap-3">
                <CodeButton />
                <ExpiryInfo />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'floating') {
    return (
      <div className="fixed bottom-4 start-4 end-4 md:start-auto md:end-4 md:w-96 z-50">
        <div className="relative bg-ds-card border border-ds-border rounded-xl p-4 shadow-lg">
          <DismissButton />
          <div className="pe-8">
            {heading && (
              <h3 className="text-lg font-bold text-ds-foreground mb-1">{heading}</h3>
            )}
            {description && (
              <p className="text-ds-muted-foreground text-sm mb-3">{description}</p>
            )}
            <div className="flex items-center gap-3">
              <CodeButton />
              <ExpiryInfo />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="relative bg-ds-accent">
      <DismissButton />
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-start">
          <div>
            {heading && (
              <h2 className="text-lg md:text-xl font-bold text-ds-accent-foreground">
                {heading}
              </h2>
            )}
            {description && (
              <p className="text-ds-accent-foreground/80 text-sm">{description}</p>
            )}
          </div>
          <CodeButton />
          <ExpiryInfo />
        </div>
      </div>
    </section>
  )
}
