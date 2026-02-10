import React from 'react'
import { HeroBlock } from '../blocks/hero-block'
import { ContentBlock } from '../blocks/content-block'
import { ProductsBlock } from '../blocks/products-block'
import { FeaturesBlock } from '../blocks/features-block'
import { CTABlock } from '../blocks/cta-block'

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
        switch (block.blockType) {
          case 'hero':
            return <HeroBlock key={index} {...block} branding={branding} locale={locale} />
          
          case 'content':
            return <ContentBlock key={index} {...block} locale={locale} />
          
          case 'products':
            return <ProductsBlock key={index} {...block} locale={locale} />
          
          case 'features':
            return <FeaturesBlock key={index} {...block} locale={locale} />
          
          case 'cta':
            return <CTABlock key={index} {...block} branding={branding} locale={locale} />
          
          default:
            console.warn(`Unknown block type: ${block.blockType}`)
            return null
        }
      })}
    </div>
  )
}
