import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { useDebounce } from "./use-debounce"

interface SearchParams {
  q: string
  category_id?: string
  collection_id?: string
  limit?: number
  offset?: number
}

export function useSearch(query: string, options?: Partial<SearchParams>) {
  const debouncedQuery = useDebounce(query, 300)

  return useQuery({
    queryKey: ["search", debouncedQuery, options],
    queryFn: async () => {
      const response = await sdk.store.product.list({
        q: debouncedQuery,
        limit: options?.limit || 20,
        offset: options?.offset || 0,
        ...(options?.category_id && { category_id: [options.category_id] }),
        ...(options?.collection_id && { collection_id: [options.collection_id] }),
        fields: "*variants.calculated_price",
      })
      return response
    },
    enabled: debouncedQuery.length >= 2,
  })
}

export function useSearchSuggestions(query: string) {
  const debouncedQuery = useDebounce(query, 150)

  return useQuery({
    queryKey: ["search-suggestions", debouncedQuery],
    queryFn: async () => {
      const response = await sdk.store.product.list({
        q: debouncedQuery,
        limit: 5,
        fields: "id,title,handle,thumbnail",
      })
      return response.products
    },
    enabled: debouncedQuery.length >= 2,
  })
}

export function useSearchCategories() {
  return useQuery({
    queryKey: ["search-categories"],
    queryFn: async () => {
      const response = await sdk.store.category.list({
        limit: 50,
        fields: "id,name,handle,parent_category_id",
      })
      return response.product_categories
    },
  })
}

export function useSearchCollections() {
  return useQuery({
    queryKey: ["search-collections"],
    queryFn: async () => {
      const response = await sdk.store.collection.list({
        limit: 50,
        fields: "id,title,handle",
      })
      return response.collections
    },
  })
}
