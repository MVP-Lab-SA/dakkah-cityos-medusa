import { sdk } from "@/lib/utils/sdk"
import { HttpTypes } from "@medusajs/types"

export const listRegions = async ({
  fields,
}: {
  fields?: string;
} = {}): Promise<HttpTypes.StoreRegion[]> => {
  const { regions } = await sdk.store.region.list({ fields })
  return regions
}

export const retrieveRegion = async ({
  id,
  fields,
}: {
  id: string;
  fields?: string;
}): Promise<HttpTypes.StoreRegion> => {
  const { region } = await sdk.store.region.retrieve(id, { fields })
  return region
}

const LOCALE_TO_COUNTRY: Record<string, string> = {
  en: "us",
  fr: "fr",
  ar: "sa",
}

export const getRegion = async ({
  country_code,
  fields,
}: {
  country_code: string;
  fields?: string;
}): Promise<HttpTypes.StoreRegion | null> => {
    const regions = await listRegions({ fields })
    const code = LOCALE_TO_COUNTRY[country_code.toLowerCase()] ?? country_code.toLowerCase()
    return regions.find(region =>
      region.countries?.some(country => country.iso_2 === code)
    ) || regions[0] || null
}