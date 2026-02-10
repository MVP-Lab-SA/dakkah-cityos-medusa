import React from 'react'
import { Accordion } from '../ui/accordion'

interface FaqItem {
  question: string
  answer: string
  category?: string
}

interface FaqBlockProps {
  heading?: string
  description?: string
  items: FaqItem[]
  layout?: 'accordion' | 'two-column' | 'categorized'
}

export const FaqBlock: React.FC<FaqBlockProps> = ({
  heading,
  description,
  items,
  layout = 'accordion',
}) => {
  const toAccordionItems = (faqItems: FaqItem[]) =>
    faqItems.map((item, index) => ({
      key: `faq-${index}`,
      title: item.question,
      content: <p>{item.answer}</p>,
    }))

  const renderAccordion = () => (
    <div className="max-w-4xl mx-auto">
      <Accordion items={toAccordionItems(items)} type="single" />
    </div>
  )

  const renderTwoColumn = () => {
    const mid = Math.ceil(items.length / 2)
    const left = items.slice(0, mid)
    const right = items.slice(mid)
    return (
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <Accordion items={toAccordionItems(left)} type="single" />
        <Accordion items={toAccordionItems(right)} type="single" />
      </div>
    )
  }

  const renderCategorized = () => {
    const grouped: Record<string, FaqItem[]> = {}
    items.forEach((item) => {
      const cat = item.category || 'General'
      if (!grouped[cat]) grouped[cat] = []
      grouped[cat].push(item)
    })

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {Object.entries(grouped).map(([category, categoryItems]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold text-ds-foreground mb-4">
              {category}
            </h3>
            <Accordion items={toAccordionItems(categoryItems)} type="single" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        {heading && (
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-ds-foreground text-center mb-4">
            {heading}
          </h2>
        )}
        {description && (
          <p className="text-ds-muted-foreground text-center max-w-2xl mx-auto mb-8 md:mb-12">
            {description}
          </p>
        )}

        {layout === 'accordion' && renderAccordion()}
        {layout === 'two-column' && renderTwoColumn()}
        {layout === 'categorized' && renderCategorized()}
      </div>
    </section>
  )
}
