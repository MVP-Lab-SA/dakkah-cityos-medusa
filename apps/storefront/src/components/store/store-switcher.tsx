import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useBranding } from '@/lib/context/branding-context'
import { queryKeys } from '@/lib/utils/query-keys'
import { getUnifiedClient } from '@/lib/api/unified-client'

export const StoreSwitcher: React.FC = () => {
  const { branding, tenantHandle, setTenantHandle } = useBranding()
  const [isOpen, setIsOpen] = useState(false)

  const { data: stores } = useQuery({
    queryKey: queryKeys.tenants.list(),
    queryFn: async () => {
      const client = getUnifiedClient()
      return client.getStores()
    },
  })

  const handleStoreChange = (handle: string) => {
    setTenantHandle(handle)
    setIsOpen(false)
    window.location.reload() // Reload to apply new branding
  }

  if (!stores || stores.length <= 1) {
    return null
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {branding?.logo?.url && (
          <img
            src={branding.logo.url}
            alt={branding.storeName}
            className="h-6 w-auto"
          />
        )}
        <span className="font-medium">{branding?.storeName || 'Select Store'}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-20 max-h-96 overflow-y-auto">
            {stores.map((store: any) => (
              <button
                key={store.id}
                onClick={() => handleStoreChange(store.handle)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                  store.handle === tenantHandle ? 'bg-gray-100' : ''
                }`}
              >
                {store.logo?.url && (
                  <img
                    src={store.logo.url}
                    alt={store.storeName}
                    className="h-8 w-8 object-contain"
                  />
                )}
                <div className="flex-1">
                  <div className="font-medium">{store.storeName}</div>
                  {store.storeDescription && (
                    <div className="text-sm text-gray-500 truncate">
                      {store.storeDescription}
                    </div>
                  )}
                </div>
                {store.handle === tenantHandle && (
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
