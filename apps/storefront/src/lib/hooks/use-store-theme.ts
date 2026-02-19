import { useEffect } from "react"
import { useStore } from "@/lib/store-context"

export function useStoreTheme() {
  const { store } = useStore()

  useEffect(() => {
    if (typeof window === "undefined" || !store) return

    if (store.theme?.favicon) {
      const favicon =
        document.querySelector<HTMLLinkElement>("link[rel='icon']")
      if (favicon) {
        favicon.href = store.theme.favicon
      }
    }

    if (store.seo?.title) {
      document.title = store.seo.title
    }

    if (store.seo?.description) {
      let metaDescription = document.querySelector<HTMLMetaElement>(
        "meta[name='description']",
      )
      if (!metaDescription) {
        metaDescription = document.createElement("meta")
        metaDescription.name = "description"
        document.head.appendChild(metaDescription)
      }
      metaDescription.content = store.seo.description
    }
  }, [store])

  return store
}
