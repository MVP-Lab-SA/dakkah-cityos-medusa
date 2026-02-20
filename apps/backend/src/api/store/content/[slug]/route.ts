import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { handleApiError } from "../../../../lib/api-error-handler";

/**
 * GET /store/content/:slug
 * Fetch a published CMS page by URL slug for storefront rendering.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const cmsContentService = req.scope.resolve("cmsContent") as any;
    const slug = req.params.slug;
    const { locale } = req.query as { locale?: string };

    if (!slug) {
      return res.status(400).json({ error: "slug is required" });
    }

    const pages = await (cmsContentService as any).listCmsPages(
      { slug },
      { take: 1 },
    );
    const list = Array.isArray(pages) ? pages : [pages].filter(Boolean);
    const page = list[0] ?? null;

    if (!page) {
      return res
        .status(404)
        .json({ error: `No page found with slug '${slug}'` });
    }

    if ((page as any).status !== "published") {
      return res
        .status(404)
        .json({ error: `No published page found with slug '${slug}'` });
    }

    // Return localised content if available
    const content =
      locale && (page as any).localizations?.[locale]
        ? (page as any).localizations[locale]
        : {
            title: (page as any).title,
            body: (page as any).body,
            seo: (page as any).seo_metadata,
          };

    return res.json({
      page: {
        id: (page as any).id,
        slug,
        locale: locale ?? (page as any).default_locale ?? "en",
        ...content,
        published_at: (page as any).published_at,
        updated_at: (page as any).updated_at,
      },
    });
  } catch (error: any) {
    return handleApiError(res, error, "STORE-CONTENT-SLUG");
  }
}
