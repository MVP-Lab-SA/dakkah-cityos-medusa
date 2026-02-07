import { Button } from "@/components/ui/button"
import { PencilSquare, Trash, Check } from "@medusajs/icons"

interface Address {
  id: string
  first_name: string
  last_name: string
  address_1: string
  address_2?: string
  city: string
  province?: string
  postal_code: string
  country_code: string
  phone?: string
  is_default_shipping?: boolean
  is_default_billing?: boolean
}

interface AddressCardProps {
  address: Address
  onEdit?: () => void
  onDelete?: () => void
  onSetDefault?: () => void
}

export function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
  const isDefault = address.is_default_shipping || address.is_default_billing

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-medium text-zinc-900">
            {address.first_name} {address.last_name}
          </span>
          {isDefault && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
              <Check className="h-3 w-3" />
              Default
            </span>
          )}
        </div>
      </div>

      <div className="text-sm text-zinc-600 space-y-1">
        <p>{address.address_1}</p>
        {address.address_2 && <p>{address.address_2}</p>}
        <p>
          {address.city}
          {address.province && `, ${address.province}`} {address.postal_code}
        </p>
        <p className="uppercase">{address.country_code}</p>
        {address.phone && <p className="mt-2">{address.phone}</p>}
      </div>

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-100">
        {onEdit && (
          <Button variant="ghost" size="sm" onClick={onEdit} className="text-zinc-600">
            <PencilSquare className="h-4 w-4 mr-1" />
            Edit
          </Button>
        )}
        {onSetDefault && !isDefault && (
          <Button variant="ghost" size="sm" onClick={onSetDefault} className="text-zinc-600">
            <Check className="h-4 w-4 mr-1" />
            Set as default
          </Button>
        )}
        {onDelete && (
          <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-600 ml-auto">
            <Trash className="h-4 w-4 mr-1" />
            Delete
          </Button>
        )}
      </div>
    </div>
  )
}
