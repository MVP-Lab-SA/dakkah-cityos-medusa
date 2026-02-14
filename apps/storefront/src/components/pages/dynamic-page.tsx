import React from 'react'
import { BLOCK_REGISTRY } from '../blocks/block-registry'

interface DynamicPageProps {
  page: any
  branding?: any
  locale?: string
}

export const DynamicPage: React.FC<DynamicPageProps> = ({ page, branding, locale }) => {
  if (!page) return null

  if (!page.layout || (Array.isArray(page.layout) && page.layout.length === 0)) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
        {page.description && <p className="text-ds-muted-foreground">{page.description}</p>}
      </div>
    )
  }

  return (
    <div className="w-full">
      {page.layout.map((block: any, index: number) => {
        const Component = BLOCK_REGISTRY[block.blockType]
        if (!Component) {
          return null
        }
        const { blockType, blockName, ...props } = block
        return <Component key={block.id || index} {...props} branding={branding} locale={locale} />
      })}
    </div>
  )
}
