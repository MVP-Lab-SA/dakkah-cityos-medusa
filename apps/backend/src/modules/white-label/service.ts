import { MedusaService } from "@medusajs/framework/utils";
import WhiteLabelConfig from "./models/white-label-config";
import WhiteLabelTheme from "./models/white-label-theme";

class WhiteLabelModuleService extends MedusaService({
  WhiteLabelConfig,
  WhiteLabelTheme,
}) {
  /**
   * Get the white-label configuration for a tenant.
   */
  async getConfigForTenant(tenantId: string): Promise<any> {
    const configs = (await this.listWhiteLabelConfigs({
      tenant_id: tenantId,
    })) as any[];
    const list = Array.isArray(configs) ? configs : [];
    return list[0] ?? null;
  }

  /**
   * Create or update the white-label config for a tenant.
   */
  async upsertConfig(
    tenantId: string,
    data: {
      brandName?: string;
      logoUrl?: string;
      primaryColor?: string;
      secondaryColor?: string;
      customDomain?: string;
      status?: string;
      metadata?: Record<string, unknown>;
    },
  ): Promise<any> {
    const existing = await this.getConfigForTenant(tenantId);

    if (existing) {
      return await (this as any).updateWhiteLabelConfigs({
        id: existing.id,
        brand_name: data.brandName ?? existing.brand_name,
        logo_url: data.logoUrl ?? existing.logo_url,
        primary_color: data.primaryColor ?? existing.primary_color,
        secondary_color: data.secondaryColor ?? existing.secondary_color,
        custom_domain: data.customDomain ?? existing.custom_domain,
        status: data.status ?? existing.status,
        metadata: data.metadata ?? existing.metadata,
      });
    }

    return await (this as any).createWhiteLabelConfigs({
      tenant_id: tenantId,
      brand_name: data.brandName ?? "",
      logo_url: data.logoUrl ?? null,
      primary_color: data.primaryColor ?? null,
      secondary_color: data.secondaryColor ?? null,
      custom_domain: data.customDomain ?? null,
      status: data.status ?? "pending",
      metadata: data.metadata ?? null,
    });
  }

  /**
   * Publish the active theme for a config, making it live.
   */
  async publishTheme(themeId: string): Promise<any> {
    const theme = await this.retrieveWhiteLabelTheme(themeId);
    // Unpublish all other themes for this config first
    const existing = (await this.listWhiteLabelThemes({
      white_label_id: (theme as any).white_label_id,
    })) as any[];
    for (const t of existing) {
      if (t.id !== themeId && t.is_published) {
        await (this as any).updateWhiteLabelThemes({
          id: t.id,
          is_published: false,
        });
      }
    }
    return await (this as any).updateWhiteLabelThemes({
      id: themeId,
      is_published: true,
    });
  }
}

export default WhiteLabelModuleService;
