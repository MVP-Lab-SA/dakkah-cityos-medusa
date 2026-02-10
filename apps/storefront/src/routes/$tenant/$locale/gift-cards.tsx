import { createFileRoute } from "@tanstack/react-router"
import { GiftCardDisplay, GiftCardPurchaseForm } from "@/components/payments/gift-card-display"
import { useGiftCards, usePurchaseGiftCard } from "@/lib/hooks/use-payments"
import { t } from "@/lib/i18n"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/gift-cards")({
  component: GiftCardsPage,
})

const defaultAmounts = [25, 50, 100, 150, 200, 500]

function GiftCardsPage() {
  const { tenant, locale } = Route.useParams() as { tenant: string; locale: string }
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-ds-muted flex items-center justify-center">
        <p className="text-sm text-ds-muted-foreground">{t(locale, "common.loading")}</p>
      </div>
    )
  }

  return <GiftCardsPageClient locale={locale} />
}

function GiftCardsPageClient({ locale }: { locale: string }) {
  const { data: giftCards, isLoading } = useGiftCards()
  const purchaseMutation = usePurchaseGiftCard()

  return (
    <div className="min-h-screen bg-ds-muted">
      <div className="bg-ds-background border-b border-ds-border">
        <div className="content-container py-8">
          <h1 className="text-2xl font-bold text-ds-foreground">{t(locale, "payment.gift_cards")}</h1>
          <p className="mt-1 text-ds-muted-foreground">{t(locale, "payment.gift_cards_description")}</p>
        </div>
      </div>

      <div className="content-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <GiftCardPurchaseForm
              amounts={defaultAmounts}
              currency="USD"
              locale={locale}
              onPurchase={(data) => purchaseMutation.mutate(data)}
              loading={purchaseMutation.isPending}
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-ds-foreground mb-4">{t(locale, "payment.my_gift_cards")}</h2>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-48 bg-ds-muted rounded-xl animate-pulse" />
                ))}
              </div>
            ) : !giftCards?.length ? (
              <div className="bg-ds-background rounded-xl border border-ds-border p-12 text-center">
                <div className="w-12 h-12 rounded-full bg-ds-muted flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎁</span>
                </div>
                <p className="text-ds-muted-foreground">{t(locale, "payment.no_gift_cards")}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {giftCards.map((card) => (
                  <GiftCardDisplay
                    key={card.id}
                    code={card.code}
                    balance={card.balance}
                    originalAmount={card.originalAmount}
                    currency={card.currency}
                    expiresAt={card.expiresAt}
                    status={card.status}
                    recipientEmail={card.recipientEmail}
                    senderName={card.senderName}
                    message={card.message}
                    locale={locale}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
