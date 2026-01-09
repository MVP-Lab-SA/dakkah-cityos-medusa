import React from 'react'
import { Link, useNavigate } from '@tantml:react-router'
import { useBranding } from '~/lib/context/branding-context'

interface Store {
  id: string
  handle: string
  storeName: string
  storeDescription?: string
  logo?: {
    url: string
    alt?: string
  }
  theme?: {
    primaryColor?: string
  }
}

interface StoreSelectionProps {
  stores: Store[]
}

export const StoreSelection: React.FC<StoreSelectionProps> = ({ stores }) => {
  const { setTenantHandle } = useBranding()
  const navigate = useNavigate()

  const handleStoreSelect = (handle: string) => {
    setTenantHandle(handle)
    navigate({ to: '/$countryCode', params: { countryCode: 'us' } })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to Our Marketplace</h1>
          <p className="text-xl text-gray-600">
            Select a store to start shopping
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {stores.map((store) => (
            <button
              key={store.id}
              onClick={() => handleStoreSelect(store.handle)}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-8 text-left group"
            >
              {store.logo?.url && (
                <div className="mb-6 h-20 flex items-center justify-center">
                  <img
                    src={store.logo.url}
                    alt={store.logo.alt || store.storeName}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}

              <h2
                className="text-2xl font-bold mb-3 group-hover:underline"
                style={
                  store.theme?.primaryColor
                    ? { color: store.theme.primaryColor }
                    : undefined
                }
              >
                {store.storeName}
              </h2>

              {store.storeDescription && (
                <p className="text-gray-600 mb-4">{store.storeDescription}</p>
              )}

              <div className="text-sm font-semibold text-gray-900 group-hover:translate-x-2 transition-transform inline-flex items-center">
                Visit Store
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {stores.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">
              No stores available at the moment
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
