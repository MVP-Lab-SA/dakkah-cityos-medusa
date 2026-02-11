import { useState } from "react"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"

interface WishlistCollection {
  id: string
  name: string
  itemCount: number
}

interface WishlistMoveProps {
  locale?: string
  itemName: string
  collections: WishlistCollection[]
  currentCollectionId?: string
  onMove?: (targetCollectionId: string) => void
  onCreateCollection?: (name: string) => void
  onClose?: () => void
}

export function WishlistMove({
  locale: localeProp,
  itemName,
  collections,
  currentCollectionId,
  onMove,
  onCreateCollection,
  onClose,
}: WishlistMoveProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [showNewForm, setShowNewForm] = useState(false)
  const [newName, setNewName] = useState("")

  const handleCreateAndMove = () => {
    if (newName.trim()) {
      onCreateCollection?.(newName.trim())
      setNewName("")
      setShowNewForm(false)
    }
  }

  return (
    <div className="bg-ds-card rounded-lg border border-ds-border p-4 space-y-4 max-w-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-ds-foreground">
          {t(locale, "wishlist.move_item")}
        </h3>
        {onClose && (
          <button onClick={onClose} className="text-ds-muted-foreground hover:text-ds-foreground">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <p className="text-sm text-ds-muted-foreground">
        {t(locale, "wishlist.move_to")}: <span className="font-medium text-ds-foreground">{itemName}</span>
      </p>

      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        {collections
          .filter((c) => c.id !== currentCollectionId)
          .map((collection) => (
            <button
              key={collection.id}
              onClick={() => onMove?.(collection.id)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-ds-border hover:bg-ds-muted transition-colors text-start"
            >
              <span className="text-sm font-medium text-ds-foreground">{collection.name}</span>
              <span className="text-xs text-ds-muted-foreground">
                {collection.itemCount} {t(locale, "wishlist.items_count")}
              </span>
            </button>
          ))}
      </div>

      {showNewForm ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={t(locale, "wishlist.wishlist_name")}
            className="flex-1 px-3 py-2 rounded-lg border border-ds-border bg-ds-background text-ds-foreground text-sm placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary/50"
            onKeyDown={(e) => e.key === "Enter" && handleCreateAndMove()}
            autoFocus
          />
          <button
            onClick={handleCreateAndMove}
            disabled={!newName.trim()}
            className="px-3 py-2 bg-ds-primary text-ds-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {t(locale, "wishlist.create_wishlist")}
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowNewForm(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-ds-border text-sm text-ds-muted-foreground hover:text-ds-foreground hover:border-ds-foreground/50 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t(locale, "wishlist.new_collection")}
        </button>
      )}
    </div>
  )
}
