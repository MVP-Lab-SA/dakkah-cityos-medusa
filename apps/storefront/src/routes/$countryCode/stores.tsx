import { createFileRoute } from '@tanstack/react-router'
import { queryKeys } from '@/lib/utils/query-keys'
import { getUnifiedClient } from '@/lib/api/unified-client'
import { StoreSelection } from '@/components/store/store-selection'

export const Route = createFileRoute('/$countryCode/stores')({
  loader: async ({ context }) => {
    // Load all available stores/tenants
    try {
      const stores = await context.queryClient.ensureQueryData({
        queryKey: queryKeys.tenants.list(),
        queryFn: async () => {
          const client = getUnifiedClient()
          const result = await client.getStores()
          console.log('Stores loaded in loader:', result)
          return result
        },
      })

      return { stores: stores || [] }
    } catch (error) {
      console.error('Error loading stores:', error)
      return { stores: [] }
    }
  },
  component: StoreSelectionComponent,
  head: () => ({
    meta: [
      { title: 'Select Your Store' },
      { name: 'description', content: 'Choose from our marketplace of vendors and stores' },
    ],
  }),
})

function StoreSelectionComponent() {
  const { stores } = Route.useLoaderData()

  return <StoreSelection stores={stores} />
}
