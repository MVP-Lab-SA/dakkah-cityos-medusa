import { t } from "@/lib/i18n"
import { useState } from "react"

export function ConsignmentSubmitForm({
  locale,
  categories,
  onSubmit,
  submitting,
}: {
  locale: string
  categories?: { id: string; name: string }[]
  onSubmit?: (data: {
    title: string
    description: string
    category: string
    askingPrice: number
    condition: string
  }) => void
  submitting?: boolean
}) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [askingPrice, setAskingPrice] = useState("")
  const [condition, setCondition] = useState("good")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.({
      title,
      description,
      category,
      askingPrice: parseFloat(askingPrice) || 0,
      condition,
    })
  }

  return (
    <form aria-label="Consignment submission form" onSubmit={handleSubmit} className="bg-ds-background border border-ds-border rounded-xl p-6 space-y-5">
      <h3 className="text-lg font-semibold text-ds-foreground">
        {t(locale, "consignment.submit_item")}
      </h3>

      <div>
        <label className="block text-sm font-medium text-ds-foreground mb-1.5">
          {t(locale, "consignment.item_title")}
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t(locale, "consignment.item_title_placeholder")}
          required
          className="w-full px-4 py-2.5 bg-ds-background border border-ds-border rounded-lg text-sm text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ds-foreground mb-1.5">
          {t(locale, "consignment.description")}
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t(locale, "consignment.description_placeholder")}
          rows={3}
          className="w-full px-4 py-2.5 bg-ds-background border border-ds-border rounded-lg text-sm text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary resize-none"
        />
      </div>

      {categories && categories.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-ds-foreground mb-1.5">
            {t(locale, "consignment.category")}
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 bg-ds-background border border-ds-border rounded-lg text-sm text-ds-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
          >
            <option value="">{t(locale, "consignment.select_category")}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-ds-foreground mb-1.5">
          {t(locale, "consignment.asking_price")}
        </label>
        <input
          type="number"
          value={askingPrice}
          onChange={(e) => setAskingPrice(e.target.value)}
          placeholder="0.00"
          min="0"
          step="0.01"
          required
          className="w-full px-4 py-2.5 bg-ds-background border border-ds-border rounded-lg text-sm text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ds-foreground mb-1.5">
          {t(locale, "consignment.condition")}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(["excellent", "good", "fair", "poor"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCondition(c)}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                condition === c
                  ? "border-ds-primary bg-ds-primary text-ds-primary-foreground"
                  : "border-ds-border bg-ds-background text-ds-muted-foreground hover:bg-ds-muted"
              }`}
            >
              {t(locale, `consignment.condition_${c}`)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ds-foreground mb-1.5">
          {t(locale, "consignment.photos")}
        </label>
        <div className="border-2 border-dashed border-ds-border rounded-lg p-6 text-center hover:border-ds-ring transition-colors cursor-pointer">
          <svg className="w-10 h-10 text-ds-muted-foreground/40 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <p className="text-sm text-ds-muted-foreground">
            {t(locale, "consignment.upload_photos")}
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full px-4 py-2.5 text-sm font-medium rounded-lg bg-ds-primary text-ds-primary-foreground hover:bg-ds-primary/90 transition-colors disabled:opacity-50"
      >
        {submitting ? t(locale, "common.loading") : t(locale, "consignment.submit")}
      </button>
    </form>
  )
}
