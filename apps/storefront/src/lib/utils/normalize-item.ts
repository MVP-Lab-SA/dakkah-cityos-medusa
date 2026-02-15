export function normalizeItem(item: any): any {
  if (!item) return item
  let meta = item.metadata || {}
  if (typeof meta === "string") {
    try { meta = JSON.parse(meta) } catch { meta = {} }
  }
  const thumbnail =
    item.thumbnail ||
    item.photo_url ||
    item.banner_url ||
    item.logo_url ||
    item.thumbnail_url ||
    item.cover_url ||
    item.image_url ||
    meta.thumbnail ||
    meta.cover_image ||
    (meta.images && meta.images[0]) ||
    (Array.isArray(item.images) && item.images[0]) ||
    (Array.isArray(item.photos) && item.photos[0]) ||
    null
  const images =
    meta.images ||
    (Array.isArray(item.images) ? item.images : null) ||
    (Array.isArray(item.photos) ? item.photos : null) ||
    [thumbnail].filter(Boolean)
  return {
    ...meta,
    ...item,
    thumbnail,
    images,
    description: item.description || meta.description || "",
    price: item.price ?? meta.price ?? null,
    rating: item.rating ?? item.avg_rating ?? meta.rating ?? null,
    review_count: item.review_count ?? meta.review_count ?? null,
    category: item.category || meta.category || null,
    location: item.location || item.city || item.address || meta.location || null,
  }
}
