import React from 'react'
import { sanitizeHtml } from '@/lib/utils/sanitize-html'

interface ContentBlockProps {
  content?: any
  layout?: 'single' | 'two-column'
  backgroundColor?: string
}

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { heading, description, ...rest } = props;
  const itemsKey = Object.keys(props).find(k => Array.isArray(props[k]));
  const items = itemsKey ? props[itemsKey] : [];
  if ((!items || !items.length) && !heading && !description) return null;
  content,
  layout = 'single',
  backgroundColor,
}) => {
  return (
    <section
      className="py-12 md:py-16 lg:py-20"
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <div className={`container mx-auto px-4 md:px-6 ${layout === 'two-column' ? 'grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12' : 'max-w-4xl'}`}>
        <div
          className="prose prose-base md:prose-lg max-w-none text-ds-foreground"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
        />
      </div>
    </section>
  )
}
