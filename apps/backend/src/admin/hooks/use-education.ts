import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type Course = {
  id: string
  tenant_id: string
  title: string
  description?: string
  short_description?: string
  instructor_id?: string
  category?: string
  subcategory?: string
  level?: "beginner" | "intermediate" | "advanced" | "all_levels"
  format: "self_paced" | "live" | "hybrid" | "in_person"
  language?: string
  price?: number
  currency_code?: string
  duration_hours?: number
  syllabus?: any
  prerequisites?: any
  tags?: any
  status: "draft" | "published" | "archived"
  is_free?: boolean
  certificate_offered?: boolean
  thumbnail_url?: string
  preview_video_url?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useEducation() {
  return useQuery({
    queryKey: ["education"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/education", { method: "GET" })
      return response as { items: Course[]; count: number }
    },
  })
}

export function useCreateCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Course>) => {
      const response = await sdk.client.fetch("/admin/education", { method: "POST", body: data })
      return response as { item: Course }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["education"] }),
  })
}
