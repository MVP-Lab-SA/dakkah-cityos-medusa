import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

interface UseManageCrudOptions {
  moduleKey: string
  apiEndpoint: string
  queryKey?: string[]
}

export function useManageCrud({
  moduleKey,
  apiEndpoint,
  queryKey,
}: UseManageCrudOptions) {
  const queryClient = useQueryClient()
  const keys = queryKey || ["manage", moduleKey]

  const createMutation = useMutation({
    mutationFn: async (data: Record<string, any>) => {
      const response = await sdk.client.fetch(apiEndpoint, {
        method: "POST",
        body: data,
      })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      ...data
    }: { id: string } & Record<string, any>) => {
      const response = await sdk.client.fetch(`${apiEndpoint}/${id}`, {
        method: "PUT",
        body: data,
      })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await sdk.client.fetch(`${apiEndpoint}/${id}`, {
        method: "DELETE",
      })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys })
    },
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  }
}
