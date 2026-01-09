import { createFileRoute } from '@tanstack/react-router'
import { queryKeys } from '~/lib/utils/query-keys'
import { unifiedClient } from '~/lib/api/unified-client'
import { StoreSelection } from '~/components/store/store-selection'

export const Route = createFileRoute('/$countryCode/stores')({
  loader: async ({ context }) => {
    // Load all available stores/tenants
    const stores = await context.queryClient.ensureQueryData({
      queryKey: queryKeys.tenants.list(),
      queryFn: async () => {
        return unifiedClient.payload.getStores({
          where: {
            status: {
              equals: 'active',
            },
          },
          limit: 100,
        })
      },
    })

    return { stores: stores?.docs || [] }
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
