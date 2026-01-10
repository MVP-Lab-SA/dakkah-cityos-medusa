import { useEffect } from 'react'
import { useStore } from '../store-context'

/**
 * Applies store-specific theme configuration to the document
 * This hook injects CSS variables based on store theme settings
 */
export function useStoreTheme() {
  const { store } = useStore()

  useEffect(() => {
    if (!store || !store.theme) return

    const root = document.documentElement

    // Apply theme colors as CSS variables
    root.style.setProperty('--color-primary', store.theme.primaryColor || '#000000')
    root.style.setProperty('--color-secondary', store.theme.secondaryColor || '#666666')
    root.style.setProperty('--color-accent', store.theme.accentColor || '#0070f3')

    // Apply font family
    if (store.theme.fontFamily) {
      root.style.setProperty('--font-family', store.theme.fontFamily)
    }

    // Update favicon if configured
    if (store.theme.favicon) {
      const favicon = document.querySelector<HTMLLinkElement>("link[rel='icon']")
      if (favicon) {
        favicon.href = store.theme.favicon
      }
    }

    // Update page title from store SEO
    if (store.seo?.title) {
      document.title = store.seo.title
    }

    // Update meta description
    if (store.seo?.description) {
      let metaDescription = document.querySelector<HTMLMetaElement>("meta[name='description']")
      if (!metaDescription) {
        metaDescription = document.createElement('meta')
        metaDescription.name = 'description'
        document.head.appendChild(metaDescription)
      }
      metaDescription.content = store.seo.description
    }

    // Cleanup on unmount
    return () => {
      root.style.removeProperty('--color-primary')
      root.style.removeProperty('--color-secondary')
      root.style.removeProperty('--color-accent')
      root.style.removeProperty('--font-family')
    }
  }, [store])

  return store
}
