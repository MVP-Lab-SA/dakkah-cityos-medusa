import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  try {
    const { data: stores } = await query.graph({
      entity: "store",
      fields: [
        "id",
        "name",
        "handle",
        "description",
        "status",
        "store_type",
        "subdomain",
        "custom_domain",
        "logo_url",
        "theme_config",
        "sales_channel_id",
      ],
      filters: {
        status: "active",
      },
    });

    // Transform to match StoreBranding interface
    const formattedStores = stores.map((store: any) => ({
      id: store.id,
      name: store.name,
      handle: store.handle || store.subdomain,
      logo: store.logo_url ? { url: store.logo_url } : undefined,
      themeConfig: store.theme_config,
      seo: {
        title: store.name,
        description: store.description,
      },
    }));

    res.json({ stores: formattedStores });
  } catch (error) {
    console.error("Error fetching stores:", error);
    res.status(500).json({ error: "Failed to fetch stores" });
  }
};
