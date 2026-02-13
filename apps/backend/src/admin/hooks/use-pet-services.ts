import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type PetProfile = {
  id: string
  tenant_id: string
  owner_id: string
  name: string
  species: "dog" | "cat" | "bird" | "fish" | "reptile" | "rabbit" | "hamster" | "other"
  breed?: string
  date_of_birth?: string
  weight_kg?: number
  color?: string
  gender?: "male" | "female" | "unknown"
  is_neutered?: boolean
  microchip_id?: string
  medical_notes?: string
  allergies?: any
  vaccinations?: any
  photo_url?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function usePetProfiles() {
  return useQuery({
    queryKey: ["pet-services"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/pet-services", { method: "GET" })
      return response as { items: PetProfile[]; count: number }
    },
  })
}

export function useCreatePetProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<PetProfile>) => {
      const response = await sdk.client.fetch("/admin/pet-services", { method: "POST", body: data })
      return response as { item: PetProfile }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pet-services"] }),
  })
}
