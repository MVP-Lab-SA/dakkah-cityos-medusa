import { useEffect } from 'react'
import { useStore } from '../store-context'

export function useStoreTheme() {
  const { store } = useStore()

  useEffect(() => {
    if (typeof window === 'undefined' || !store || !store.theme) return

    const root = document.documentElement

    root.style.setProperty('--color-primary', store.theme.primaryColor || '#000000')
    root.style.setProperty('--color-secondary', store.theme.secondaryColor || '#666666')
    root.style.setProperty('--color-accent', store.theme.accentColor || '#0070f3')

    if (store.theme.fontFamily) {
      root.style.setProperty('--font-family', store.theme.fontFamily)
    }

    if (store.theme.favicon) {
      const favicon = document.querySelector<HTMLLinkElement>("link[rel='icon']")
      if (favicon) {
        favicon.href = store.theme.favicon
      }
    }

    if (store.seo?.title) {
      document.title = store.seo.title
    }

    if (store.seo?.description) {
      let metaDescription = document.querySelector<HTMLMetaElement>("meta[name='description']")
      if (!metaDescription) {
        metaDescription = document.createElement('meta')
        metaDescription.name = 'description'
        document.head.appendChild(metaDescription)
      }
      metaDescription.content = store.seo.description
    }

    return () => {
      root.style.removeProperty('--color-primary')
      root.style.removeProperty('--color-secondary')
      root.style.removeProperty('--color-accent')
      root.style.removeProperty('--font-family')
    }
  }, [store])

  return store
}
