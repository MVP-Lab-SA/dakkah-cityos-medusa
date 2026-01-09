import React from 'react'

interface ContentBlockProps {
  content?: any
  layout?: 'single' | 'two-column'
  backgroundColor?: string
}

export const ContentBlock: React.FC<ContentBlockProps> = ({
  content,
  layout = 'single',
  backgroundColor,
}) => {
  return (
    <section
      className="py-16"
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <div className={`container mx-auto px-4 ${layout === 'two-column' ? 'grid md:grid-cols-2 gap-12' : 'max-w-4xl'}`}>
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  )
}
