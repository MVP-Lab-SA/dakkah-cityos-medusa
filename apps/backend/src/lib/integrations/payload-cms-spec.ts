/**
 * =============================================================================
 * PAYLOAD CMS INTEGRATION SPECIFICATION
 * =============================================================================
 *
 * Contract document for the Payload CMS integration with Dakkah CityOS Commerce.
 *
 * Payload CMS is the headless content management system responsible for managing
 * all rich content, localized copy, media assets, SEO metadata, and editorial
 * workflows for tenants, vendors, POIs, pages, navigations, and service channels.
 *
 * Medusa (commerce backend) remains the source of truth for transactional data
 * (orders, products, inventory, pricing). Payload CMS is the source of truth
 * for content & presentation data. Both systems sync via webhooks and events.
 *
 * Supported locales: en (English), fr (French), ar (Arabic)
 *
 * @module PayloadCMSSpec
 * @version 1.0.0
 * @lastUpdated 2026-02-09
 */

// ---------------------------------------------------------------------------
// Shared Types
// ---------------------------------------------------------------------------

/** Supported locales across the platform */
export type SupportedLocale = "en" | "fr" | "ar"

/** Payload document status */
export type PayloadDocStatus = "draft" | "published"

/** Scope tiers matching Medusa tenant.scope_tier */
export type ScopeTier = "nano" | "micro" | "small" | "medium" | "large" | "mega" | "global"

/** Tenant types matching Medusa tenant.tenant_type */
export type TenantType = "platform" | "marketplace" | "vendor" | "brand"

/** Region zones matching Medusa tenant.residency_zone */
export type RegionZone = "GCC" | "EU" | "MENA" | "APAC" | "AMERICAS" | "GLOBAL"

/** Page templates available in the CMS */
export type PageTemplate =
  | "vertical-list"
  | "vertical-detail"
  | "landing"
  | "static"
  | "category"
  | "node-browser"
  | "custom"

/** Navigation placement locations */
export type NavigationLocation = "header" | "footer" | "sidebar" | "mobile"

/** POI types matching Medusa tenant_poi.poi_type */
export type POIType =
  | "storefront"
  | "warehouse"
  | "fulfillment_hub"
  | "service_point"
  | "office"
  | "branch"
  | "kiosk"
  | "mobile"

/** Service channel types matching Medusa service_channel.channel_type */
export type ChannelType =
  | "in_store"
  | "online"
  | "delivery"
  | "pickup"
  | "drive_through"
  | "curbside"
  | "appointment"
  | "telemedicine"
  | "home_service"
  | "subscription_box"
  | "wholesale"
  | "auction"
  | "rental"

/** Localized text field — one value per supported locale */
export interface LocalizedText {
  en: string
  fr?: string
  ar?: string
}

/** Localized rich text field (Lexical JSON or HTML) */
export interface LocalizedRichText {
  en: any
  fr?: any
  ar?: any
}

/** SEO metadata block */
export interface SEOMetadata {
  /** Page/document title for search engines */
  title?: LocalizedText
  /** Meta description for search engines */
  description?: LocalizedText
  /** Open Graph image (Payload media reference) */
  og_image?: string
  /** Canonical URL override */
  canonical_url?: string
  /** Additional meta tags as key-value pairs */
  extra_meta?: Array<{ key: string; value: string }>
}

/** Social media link entry */
export interface SocialLink {
  platform: "twitter" | "instagram" | "facebook" | "linkedin" | "youtube" | "tiktok" | "whatsapp" | "website" | "other"
  url: string
  label?: string
}

/** Structured operating hours for a single day */
export interface DayOperatingHours {
  day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"
  is_open: boolean
  /** Opening time in HH:mm format (24h) */
  open_time?: string
  /** Closing time in HH:mm format (24h) */
  close_time?: string
  /** Optional break periods */
  breaks?: Array<{ start: string; end: string }>
}

/** Media gallery item */
export interface MediaGalleryItem {
  /** Payload media reference ID */
  media_id: string
  alt_text?: LocalizedText
  caption?: LocalizedText
  sort_order: number
}

// ---------------------------------------------------------------------------
// 1. PAYLOAD_COLLECTIONS
// ---------------------------------------------------------------------------

/**
 * Defines all Payload CMS collections that must be created and maintained.
 * Each collection mirrors or extends data from Medusa with content-focused fields.
 */
export const PAYLOAD_COLLECTIONS = {

  /**
   * =========================================================================
   * TENANTS COLLECTION
   * =========================================================================
   * Mirrors and extends Medusa tenant records with CMS-managed content:
   * branding, localized copy, SEO, social links, and custom pages.
   *
   * Sync key: medusa_tenant_id
   * Source of truth: Medusa (transactional), Payload (content/branding)
   */
  tenants: {
    slug: "tenants" as const,
    labels: { singular: "Tenant", plural: "Tenants" },
    admin: { useAsTitle: "name_en", defaultColumns: ["name_en", "slug", "scope_tier", "tenant_type", "_status"] },

    fields: {
      /** Medusa tenant ID for bidirectional sync */
      medusa_tenant_id: { type: "text" as const, required: true, unique: true, index: true },

      /** Tenant slug — must match Medusa tenant.slug */
      slug: { type: "text" as const, required: true, unique: true, index: true },

      /** Scope tier from Medusa — determines feature access and visibility */
      scope_tier: {
        type: "select" as const,
        options: ["nano", "micro", "small", "medium", "large", "mega", "global"] as ScopeTier[],
        required: true,
        defaultValue: "nano" as ScopeTier,
      },

      /** Tenant type from Medusa — determines role in the platform hierarchy */
      tenant_type: {
        type: "select" as const,
        options: ["platform", "marketplace", "vendor", "brand"] as TenantType[],
        required: true,
        defaultValue: "vendor" as TenantType,
      },

      /** Parent tenant ID for hierarchical tenancy */
      parent_tenant_id: { type: "text" as const, required: false },

      // -- Localized content fields --

      /** Tenant display name (localized) */
      name: { type: "localized_text" as const, locales: ["en", "fr", "ar"] as SupportedLocale[], required: true },

      /** Short description / tagline (localized) */
      tagline: { type: "localized_text" as const, locales: ["en", "fr", "ar"] as SupportedLocale[], required: false },

      /** Full description (localized rich text) */
      description: { type: "localized_richtext" as const, locales: ["en", "fr", "ar"] as SupportedLocale[], required: false },

      // -- Branding / Media fields --

      /** Primary logo — Payload media upload */
      logo: { type: "upload" as const, relationTo: "media" as const, required: false },

      /** Banner / hero image */
      banner: { type: "upload" as const, relationTo: "media" as const, required: false },

      /** Favicon — small icon for browser tabs */
      favicon: { type: "upload" as const, relationTo: "media" as const, required: false },

      /** Open Graph image for social sharing */
      og_image: { type: "upload" as const, relationTo: "media" as const, required: false },

      /** Primary brand color (hex) */
      primary_color: { type: "text" as const, required: false },

      /** Accent / secondary brand color (hex) */
      accent_color: { type: "text" as const, required: false },

      /** Font family name */
      font_family: { type: "text" as const, required: false },

      /** Extended branding configuration (CSS variables, theme overrides) */
      branding_config: { type: "json" as const, required: false },

      // -- SEO --

      /** SEO metadata for the tenant's storefront */
      seo: { type: "group" as const, fields: "SEOMetadata" as const },

      // -- Social & Links --

      /** Social media links */
      social_links: { type: "array" as const, fields: "SocialLink" as const },

      /** Custom pages owned by this tenant (relationship to pages collection) */
      custom_pages: { type: "relationship" as const, relationTo: "pages" as const, hasMany: true },

      // -- Locale & Region --

      /** Default locale for this tenant */
      default_locale: { type: "select" as const, options: ["en", "fr", "ar"] as SupportedLocale[], defaultValue: "en" },

      /** Supported locales */
      supported_locales: { type: "select" as const, hasMany: true, options: ["en", "fr", "ar"] as SupportedLocale[] },

      /** Residency zone */
      residency_zone: {
        type: "select" as const,
        options: ["GCC", "EU", "MENA", "APAC", "AMERICAS", "GLOBAL"] as RegionZone[],
        defaultValue: "GLOBAL" as RegionZone,
      },

      // -- Status --

      /** Payload document status (draft/published) */
      _status: { type: "select" as const, options: ["draft", "published"] as PayloadDocStatus[], defaultValue: "draft" },
    },

    hooks: {
      afterChange: "Trigger webhook to Medusa on publish: sync branding, SEO, localized names back to tenant record",
    },
  },

  /**
   * =========================================================================
   * POIS COLLECTION (Points of Interest)
   * =========================================================================
   * Rich content layer for Medusa TenantPOI records. Manages localized
   * descriptions, photo galleries, virtual tours, operating hours display,
   * amenities, and SEO for each physical or virtual location.
   *
   * Sync keys: medusa_poi_id, medusa_tenant_id
   * Geo data is referenced from Fleetbase (fleetbase_place_id on Medusa side)
   */
  pois: {
    slug: "pois" as const,
    labels: { singular: "Point of Interest", plural: "Points of Interest" },
    admin: { useAsTitle: "name_en", defaultColumns: ["name_en", "poi_type", "medusa_tenant_id", "_status"] },

    fields: {
      /** Medusa TenantPOI ID for sync */
      medusa_poi_id: { type: "text" as const, required: true, unique: true, index: true },

      /** Owning tenant ID in Medusa */
      medusa_tenant_id: { type: "text" as const, required: true, index: true },

      /** POI type — synced from Medusa, displayed in CMS */
      poi_type: {
        type: "select" as const,
        options: ["storefront", "warehouse", "fulfillment_hub", "service_point", "office", "branch", "kiosk", "mobile"] as POIType[],
        required: true,
      },

      // -- Content fields (localized) --

      /** POI display name */
      name: { type: "localized_text" as const, locales: ["en", "fr", "ar"] as SupportedLocale[], required: true },

      /** Short description */
      description: { type: "localized_richtext" as const, locales: ["en", "fr", "ar"] as SupportedLocale[], required: false },

      /** Extended rich content (about this location, history, etc.) */
      rich_content: { type: "localized_richtext" as const, locales: ["en", "fr", "ar"] as SupportedLocale[], required: false },

      // -- Media --

      /** Cover image for the POI */
      cover_image: { type: "upload" as const, relationTo: "media" as const, required: false },

      /** Photo gallery */
      photos: { type: "array" as const, fields: "MediaGalleryItem" as const },

      /** Virtual tour links (e.g., Matterport, Google 360) */
      virtual_tour_links: {
        type: "array" as const,
        fields: {
          label: { type: "text" as const },
          url: { type: "text" as const },
          provider: { type: "select" as const, options: ["matterport", "google_360", "custom", "other"] },
        },
      },

      // -- Operating hours --

      /** Structured operating hours per day of the week */
      operating_hours: { type: "array" as const, fields: "DayOperatingHours" as const, maxRows: 7 },

      /** Special hours / holiday overrides */
      special_hours: {
        type: "array" as const,
        fields: {
          date: { type: "date" as const },
          label: { type: "localized_text" as const, locales: ["en", "fr", "ar"] as SupportedLocale[] },
          is_closed: { type: "checkbox" as const },
          open_time: { type: "text" as const },
          close_time: { type: "text" as const },
        },
      },

      // -- Amenities & features --

      /** Tags for amenities and features (e.g., wifi, parking, wheelchair access) */
      amenities: { type: "array" as const, fields: { tag: { type: "text" as const }, icon: { type: "text" as const } } },

      // -- Geo reference --

      /** Latitude — synced from Medusa (originally from Fleetbase) */
      latitude: { type: "number" as const, required: false },

      /** Longitude — synced from Medusa (originally from Fleetbase) */
      longitude: { type: "number" as const, required: false },

      /** Fleetbase place ID for cross-system reference */
      fleetbase_place_id: { type: "text" as const, required: false },

      /** Formatted address — synced from Medusa */
      formatted_address: { type: "text" as const, required: false },

      // -- SEO --

      seo: { type: "group" as const, fields: "SEOMetadata" as const },

      // -- Status --

      _status: { type: "select" as const, options: ["draft", "published"] as PayloadDocStatus[], defaultValue: "draft" },
    },

    hooks: {
      afterChange: "Trigger webhook to Medusa on publish: sync localized names, description, media URLs, operating hours",
    },
  },

  /**
   * =========================================================================
   * VENDOR-PROFILES COLLECTION
   * =========================================================================
   * Public-facing profile content for vendors. Extends the Medusa Vendor
   * (TenantVendorProfile) with rich editorial content: about page, team bios,
   * media galleries, FAQs, certifications, and press mentions.
   *
   * Sync keys: medusa_vendor_id, medusa_tenant_id
   */
  "vendor-profiles": {
    slug: "vendor-profiles" as const,
    labels: { singular: "Vendor Profile", plural: "Vendor Profiles" },
    admin: { useAsTitle: "business_name_en", defaultColumns: ["business_name_en", "medusa_tenant_id", "_status"] },

    fields: {
      /** Medusa Vendor ID for sync */
      medusa_vendor_id: { type: "text" as const, required: true, unique: true, index: true },

      /** Owning tenant ID in Medusa */
      medusa_tenant_id: { type: "text" as const, required: true, index: true },

      /** Business name — synced from Medusa, localizable in CMS */
      business_name: { type: "localized_text" as const, locales: ["en", "fr", "ar"] as SupportedLocale[], required: true },

      // -- Public profile content --

      /** About the vendor (rich text, localized) */
      about: { type: "localized_richtext" as const, locales: ["en", "fr", "ar"] as SupportedLocale[], required: false },

      /** Brand story / origin narrative */
      story: { type: "localized_richtext" as const, locales: ["en", "fr", "ar"] as SupportedLocale[], required: false },

      /** Core values or mission statement */
      values: { type: "localized_richtext" as const, locales: ["en", "fr", "ar"] as SupportedLocale[], required: false },

      /** Certifications and badges (e.g., organic, halal, ISO) */
      certifications: {
        type: "array" as const,
        fields: {
          name: { type: "text" as const, required: true },
          issuer: { type: "text" as const },
          badge_image: { type: "upload" as const, relationTo: "media" as const },
          issued_date: { type: "date" as const },
          expiry_date: { type: "date" as const },
          url: { type: "text" as const },
        },
      },

      // -- Team members --

      /** Team members displayed on the public profile */
      team_members: {
        type: "array" as const,
        fields: {
          name: { type: "text" as const, required: true },
          role: { type: "text" as const, required: true },
          photo: { type: "upload" as const, relationTo: "media" as const },
          bio: { type: "localized_text" as const, locales: ["en", "fr", "ar"] as SupportedLocale[] },
          sort_order: { type: "number" as const, defaultValue: 0 },
        },
      },

      // -- Media --

      /** Media gallery for the vendor profile page */
      media_gallery: { type: "array" as const, fields: "MediaGalleryItem" as const },

      // -- Social & Press --

      /** Social media links */
      social_links: { type: "array" as const, fields: "SocialLink" as const },

      /** Press mentions and articles */
      press_mentions: {
        type: "array" as const,
        fields: {
          title: { type: "text" as const, required: true },
          publication: { type: "text" as const },
          url: { type: "text" as const },
          date: { type: "date" as const },
          excerpt: { type: "textarea" as const },
        },
      },

      // -- FAQ --

      /** Frequently asked questions (localized) */
      faq: {
        type: "array" as const,
        fields: {
          question: { type: "localized_text" as const, locales: ["en", "fr", "ar"] as SupportedLocale[], required: true },
          answer: { type: "localized_richtext" as const, locales: ["en", "fr", "ar"] as SupportedLocale[], required: true },
          sort_order: { type: "number" as const, defaultValue: 0 },
        },
      },

      // -- Reviews / Testimonials display --

      /** Configuration for how reviews and testimonials appear on the profile */
      reviews_display: {
        type: "group" as const,
        fields: {
          show_reviews: { type: "checkbox" as const, defaultValue: true },
          show_rating_summary: { type: "checkbox" as const, defaultValue: true },
          featured_testimonials: {
            type: "array" as const,
            fields: {
              customer_name: { type: "text" as const },
              quote: { type: "localized_text" as const, locales: ["en", "fr", "ar"] as SupportedLocale[] },
              rating: { type: "number" as const },
              date: { type: "date" as const },
              avatar: { type: "upload" as const, relationTo: "media" as const },
            },
          },
          max_displayed: { type: "number" as const, defaultValue: 10 },
        },
      },

      // -- SEO --

      seo: { type: "group" as const, fields: "SEOMetadata" as const },

      // -- Status --

      _status: { type: "select" as const, options: ["draft", "published"] as PayloadDocStatus[], defaultValue: "draft" },
    },

    hooks: {
      afterChange: "Trigger webhook to Medusa on publish: sync display fields (description, logo_url, banner_url) back to vendor record",
    },
  },

  /**
   * =========================================================================
   * PAGES COLLECTION
   * =========================================================================
   * CMS-managed pages for tenants. Extends the existing local CMS registry
   * with tenant ownership, tier-based visibility, and full editorial control.
   *
   * Existing fields from cms-registry.ts PayloadPage interface are preserved.
   * New fields: owner_tenant_id, scope_tier_visibility.
   */
  pages: {
    slug: "pages" as const,
    labels: { singular: "Page", plural: "Pages" },
    admin: { useAsTitle: "title", defaultColumns: ["title", "slug", "template", "owner_tenant_id", "_status"] },

    fields: {
      /** Which tenant owns/manages this page */
      owner_tenant_id: { type: "text" as const, required: true, index: true },

      /** Minimum scope tier required to see/use this page template */
      scope_tier_visibility: {
        type: "select" as const,
        options: ["nano", "micro", "small", "medium", "large", "mega", "global"] as ScopeTier[],
        defaultValue: "nano" as ScopeTier,
        required: true,
      },

      // -- Existing fields from PayloadPage --

      title: { type: "text" as const, required: true },
      slug: { type: "text" as const, required: true, index: true },
      path: { type: "text" as const, required: true },

      template: {
        type: "select" as const,
        options: ["vertical-list", "vertical-detail", "landing", "static", "category", "node-browser", "custom"] as PageTemplate[],
        required: true,
      },

      /** Tenant ID (for backward compat with existing registry) */
      tenant: { type: "text" as const, required: true, index: true },

      locale: { type: "select" as const, options: ["en", "fr", "ar", "all"] },
      countryCode: { type: "text" as const, defaultValue: "global" },

      regionZone: {
        type: "select" as const,
        options: ["GCC", "EU", "MENA", "APAC", "AMERICAS", "GLOBAL", "GCC_EU"] as const,
      },

      /** Node ID for node-scoped pages */
      nodeId: { type: "text" as const, required: false },
      /** Node level for node-scoped pages */
      nodeLevel: { type: "select" as const, options: ["CITY", "DISTRICT", "ZONE", "FACILITY", "ASSET"] },

      /** SEO metadata */
      seo: { type: "group" as const, fields: { title: { type: "text" as const }, description: { type: "text" as const } } },

      /** Vertical configuration for vertical-list and vertical-detail templates */
      verticalConfig: {
        type: "group" as const,
        fields: {
          verticalSlug: { type: "text" as const },
          medusaEndpoint: { type: "text" as const },
          cardLayout: { type: "select" as const, options: ["grid", "list"] },
          filterFields: { type: "json" as const },
          sortFields: { type: "json" as const },
        },
      },

      /** Flexible layout blocks (Payload blocks field) */
      layout: { type: "blocks" as const, required: false },

      /** Governance tags for content governance policies */
      governanceTags: { type: "json" as const, required: false },

      _status: { type: "select" as const, options: ["draft", "published"] as PayloadDocStatus[], defaultValue: "draft" },
    },

    hooks: {
      afterChange: "On publish → notify Medusa CMS registry to update page cache. On unpublish → remove from registry.",
    },
  },

  /**
   * =========================================================================
   * NAVIGATIONS COLLECTION
   * =========================================================================
   * Tenant-scoped navigation menus for header, footer, sidebar, and mobile.
   * Extends existing NavigationEntry with tenant ownership and tier visibility.
   */
  navigations: {
    slug: "navigations" as const,
    labels: { singular: "Navigation", plural: "Navigations" },
    admin: { useAsTitle: "name", defaultColumns: ["name", "location", "owner_tenant_id", "_status"] },

    fields: {
      /** Which tenant owns this navigation */
      owner_tenant_id: { type: "text" as const, required: true, index: true },

      /** Minimum scope tier to use this navigation */
      scope_tier_visibility: {
        type: "select" as const,
        options: ["nano", "micro", "small", "medium", "large", "mega", "global"] as ScopeTier[],
        defaultValue: "nano" as ScopeTier,
      },

      name: { type: "text" as const, required: true },
      slug: { type: "text" as const, required: true, index: true },

      /** Placement location */
      location: {
        type: "select" as const,
        options: ["header", "footer", "sidebar", "mobile"] as NavigationLocation[],
        required: true,
      },

      locale: { type: "select" as const, options: ["en", "fr", "ar", "all"] as const },

      /** Navigation items — recursive tree structure with tenant-scoped links */
      items: {
        type: "array" as const,
        fields: {
          id: { type: "text" as const, required: true },
          label: { type: "localized_text" as const, locales: ["en", "fr", "ar"] as SupportedLocale[] },
          /** URL can be relative (tenant-scoped) or absolute */
          url: { type: "text" as const, required: true },
          /** Open in new tab */
          new_tab: { type: "checkbox" as const, defaultValue: false },
          /** Icon identifier (from design system) */
          icon: { type: "text" as const },
          /** Nested children for dropdown/mega menus */
          children: { type: "array" as const, fields: "NavigationItem (recursive)" as const },
          order: { type: "number" as const, defaultValue: 0 },
        },
      },

      _status: { type: "select" as const, options: ["draft", "published"] as PayloadDocStatus[], defaultValue: "draft" },
    },

    hooks: {
      afterChange: "On publish → notify Medusa to update cached navigation for the tenant",
    },
  },

  /**
   * =========================================================================
   * SERVICE-CHANNELS COLLECTION
   * =========================================================================
   * Content and display layer for Medusa ServiceChannel records. Manages
   * localized display names, descriptions, icons, themes, and promotional
   * content for each service channel.
   *
   * Sync keys: medusa_channel_id, medusa_tenant_id
   */
  "service-channels": {
    slug: "service-channels" as const,
    labels: { singular: "Service Channel", plural: "Service Channels" },
    admin: { useAsTitle: "display_name_en", defaultColumns: ["display_name_en", "channel_type", "medusa_tenant_id", "_status"] },

    fields: {
      /** Medusa ServiceChannel ID for sync */
      medusa_channel_id: { type: "text" as const, required: true, unique: true, index: true },

      /** Owning tenant ID in Medusa */
      medusa_tenant_id: { type: "text" as const, required: true, index: true },

      /** Channel type — synced from Medusa for display/filtering */
      channel_type: {
        type: "select" as const,
        options: [
          "in_store", "online", "delivery", "pickup", "drive_through",
          "curbside", "appointment", "telemedicine", "home_service",
          "subscription_box", "wholesale", "auction", "rental",
        ] as ChannelType[],
      },

      // -- Display content (localized) --

      /** Display name shown to customers */
      display_name: { type: "localized_text" as const, locales: ["en", "fr", "ar"] as SupportedLocale[], required: true },

      /** Description of the channel */
      description: { type: "localized_richtext" as const, locales: ["en", "fr", "ar"] as SupportedLocale[], required: false },

      // -- Visual identity --

      /** Icon identifier or Payload media reference */
      icon: { type: "upload" as const, relationTo: "media" as const, required: false },

      /** Icon name from the design system icon set */
      icon_name: { type: "text" as const, required: false },

      /** Color theme for this channel (hex) */
      color_theme: { type: "text" as const, required: false },

      // -- Promotional content --

      /** Promotional banner image */
      promo_banner: { type: "upload" as const, relationTo: "media" as const, required: false },

      /** Active promotional offers */
      promo_offers: {
        type: "array" as const,
        fields: {
          title: { type: "localized_text" as const, locales: ["en", "fr", "ar"] as SupportedLocale[] },
          description: { type: "localized_text" as const, locales: ["en", "fr", "ar"] as SupportedLocale[] },
          badge_text: { type: "localized_text" as const, locales: ["en", "fr", "ar"] as SupportedLocale[] },
          valid_from: { type: "date" as const },
          valid_until: { type: "date" as const },
          is_active: { type: "checkbox" as const, defaultValue: true },
        },
      },

      _status: { type: "select" as const, options: ["draft", "published"] as PayloadDocStatus[], defaultValue: "draft" },
    },

    hooks: {
      afterChange: "On publish → notify Medusa to sync display content back to the service channel metadata",
    },
  },
} as const

// ---------------------------------------------------------------------------
// 2. PAYLOAD_WEBHOOKS
// ---------------------------------------------------------------------------

/**
 * Webhooks that Payload CMS sends TO Medusa when content changes.
 * Payload must POST JSON payloads to these Medusa endpoints.
 *
 * Endpoint base: `{MEDUSA_BASE_URL}/admin/webhooks/payload`
 * Authentication: Shared webhook secret in `x-payload-signature` header (HMAC-SHA256)
 */
export const PAYLOAD_WEBHOOKS = {

  /** Fired when a tenant document is created in Payload */
  "tenant.created": {
    event: "tenant.created" as const,
    description: "A new tenant content document was created in Payload CMS. Medusa should verify the medusa_tenant_id exists and link the CMS document.",
    payload_fields: ["medusa_tenant_id", "slug", "name", "branding_config", "seo", "social_links", "_status"],
    medusa_action: "Link Payload document to existing Medusa tenant; optionally sync branding fields if published",
  },

  /** Fired when a tenant document is updated/published in Payload */
  "tenant.updated": {
    event: "tenant.updated" as const,
    description: "Tenant content was updated in Payload (branding, localized names, SEO, etc.). Sync display fields to Medusa tenant.",
    payload_fields: ["medusa_tenant_id", "slug", "name", "tagline", "description", "logo", "banner", "favicon", "primary_color", "accent_color", "font_family", "branding_config", "seo", "social_links", "_status"],
    medusa_action: "Update tenant: logo_url, favicon_url, primary_color, accent_color, font_family, branding JSON. Only sync when _status=published.",
  },

  /** Fired when a POI document is created in Payload */
  "poi.created": {
    event: "poi.created" as const,
    description: "A new POI content document was created in Payload. Link to existing Medusa TenantPOI.",
    payload_fields: ["medusa_poi_id", "medusa_tenant_id", "name", "description", "cover_image", "photos", "operating_hours", "amenities", "_status"],
    medusa_action: "Link Payload POI to Medusa TenantPOI; sync content fields when published.",
  },

  /** Fired when a POI document is updated in Payload */
  "poi.updated": {
    event: "poi.updated" as const,
    description: "POI content was updated (descriptions, media, hours). Sync to Medusa TenantPOI.",
    payload_fields: ["medusa_poi_id", "medusa_tenant_id", "name", "description", "rich_content", "cover_image", "photos", "operating_hours", "amenities", "seo", "_status"],
    medusa_action: "Update TenantPOI: media JSON, operating_hours JSON, metadata. Only sync published content.",
  },

  /** Fired when a POI document is deleted in Payload */
  "poi.deleted": {
    event: "poi.deleted" as const,
    description: "POI content was deleted from Payload. Medusa should clear CMS-managed fields but keep the TenantPOI record.",
    payload_fields: ["medusa_poi_id", "medusa_tenant_id"],
    medusa_action: "Clear CMS-managed fields (media, rich descriptions) from TenantPOI. Do NOT delete the Medusa record.",
  },

  /** Fired when a vendor profile is updated in Payload */
  "vendor-profile.updated": {
    event: "vendor-profile.updated" as const,
    description: "Vendor public profile content was updated (about, team, gallery, FAQ). Sync display fields to Medusa.",
    payload_fields: ["medusa_vendor_id", "medusa_tenant_id", "business_name", "about", "media_gallery", "social_links", "seo", "_status"],
    medusa_action: "Update vendor: description, logo_url, banner_url from CMS media. Only sync published profiles.",
  },

  /** Fired when a page is published in Payload */
  "page.published": {
    event: "page.published" as const,
    description: "A CMS page was published. Medusa should add/update it in the local CMS page registry cache.",
    payload_fields: ["id", "title", "slug", "path", "template", "tenant", "owner_tenant_id", "locale", "countryCode", "regionZone", "seo", "verticalConfig", "layout", "scope_tier_visibility"],
    medusa_action: "Add or update the page in CMS_PAGE_REGISTRY and invalidate page resolution cache.",
  },

  /** Fired when a page is unpublished in Payload */
  "page.unpublished": {
    event: "page.unpublished" as const,
    description: "A CMS page was unpublished. Remove from active registry.",
    payload_fields: ["id", "slug", "tenant", "owner_tenant_id"],
    medusa_action: "Remove the page from CMS_PAGE_REGISTRY and invalidate cache.",
  },

  /** Fired when a navigation is updated in Payload */
  "navigation.updated": {
    event: "navigation.updated" as const,
    description: "A navigation menu was updated. Sync to Medusa navigation cache.",
    payload_fields: ["id", "name", "slug", "location", "owner_tenant_id", "locale", "items", "_status"],
    medusa_action: "Update cached navigation for the tenant. Invalidate storefront navigation cache.",
  },
} as const

// ---------------------------------------------------------------------------
// 3. PAYLOAD_GLOBALS
// ---------------------------------------------------------------------------

/**
 * Payload CMS Globals — singleton documents for platform-wide settings.
 * These are NOT per-tenant; they apply across the entire platform.
 */
export const PAYLOAD_GLOBALS = {

  /**
   * Platform-wide default settings: branding fallbacks, header/footer defaults,
   * global announcements, and maintenance mode.
   */
  "platform-settings": {
    slug: "platform-settings" as const,
    label: "Platform Settings",
    fields: {
      /** Default branding applied when a tenant has no custom branding */
      default_branding: {
        logo: { type: "upload" as const, relationTo: "media" as const },
        favicon: { type: "upload" as const, relationTo: "media" as const },
        primary_color: { type: "text" as const, defaultValue: "#1a1a2e" },
        accent_color: { type: "text" as const, defaultValue: "#e94560" },
        font_family: { type: "text" as const, defaultValue: "Inter" },
      },
      /** Default header configuration */
      default_header: {
        show_search: { type: "checkbox" as const, defaultValue: true },
        show_locale_switcher: { type: "checkbox" as const, defaultValue: true },
        show_cart: { type: "checkbox" as const, defaultValue: true },
        announcement_bar: {
          enabled: { type: "checkbox" as const, defaultValue: false },
          text: { type: "localized_text" as const, locales: ["en", "fr", "ar"] as SupportedLocale[] },
          link: { type: "text" as const },
          background_color: { type: "text" as const },
        },
      },
      /** Default footer configuration */
      default_footer: {
        copyright_text: { type: "localized_text" as const, locales: ["en", "fr", "ar"] as SupportedLocale[] },
        show_social_links: { type: "checkbox" as const, defaultValue: true },
        footer_links: { type: "array" as const, fields: { label: { type: "text" as const }, url: { type: "text" as const } } },
      },
      /** Platform-wide maintenance mode */
      maintenance_mode: {
        enabled: { type: "checkbox" as const, defaultValue: false },
        message: { type: "localized_text" as const, locales: ["en", "fr", "ar"] as SupportedLocale[] },
        allowed_ips: { type: "json" as const },
      },
    },
  },

  /**
   * Tier configuration — defines what features, limits, and UI capabilities
   * each scope_tier unlocks. Used by the storefront and admin to gate features.
   */
  "tier-configuration": {
    slug: "tier-configuration" as const,
    label: "Tier Configuration",
    fields: {
      tiers: {
        type: "array" as const,
        fields: {
          /** Tier identifier matching ScopeTier */
          tier: { type: "select" as const, options: ["nano", "micro", "small", "medium", "large", "mega", "global"] as ScopeTier[] },
          /** Human-readable tier name */
          display_name: { type: "localized_text" as const, locales: ["en", "fr", "ar"] as SupportedLocale[] },
          /** Tier description */
          description: { type: "localized_text" as const, locales: ["en", "fr", "ar"] as SupportedLocale[] },
          /** Maximum POIs allowed */
          max_pois: { type: "number" as const },
          /** Maximum service channels allowed */
          max_channels: { type: "number" as const },
          /** Can this tier host other vendors */
          can_host_vendors: { type: "checkbox" as const },
          /** Maximum number of hosted vendors (if can_host_vendors) */
          max_hosted_vendors: { type: "number" as const },
          /** Available page templates for this tier */
          available_templates: { type: "json" as const },
          /** Custom domain support */
          custom_domain_support: { type: "checkbox" as const },
          /** Analytics access level */
          analytics_level: { type: "select" as const, options: ["basic", "standard", "advanced", "enterprise"] },
          /** API rate limit (requests per minute) */
          api_rate_limit: { type: "number" as const },
          /** Feature flags enabled for this tier */
          feature_flags: { type: "json" as const },
        },
      },
    },
  },

  /**
   * Vertical definitions — the 27+ commerce verticals supported by the platform.
   * Synced with VERTICAL_TEMPLATES in cms-registry.ts.
   */
  "vertical-definitions": {
    slug: "vertical-definitions" as const,
    label: "Vertical Definitions",
    fields: {
      verticals: {
        type: "array" as const,
        fields: {
          slug: { type: "text" as const, required: true },
          title: { type: "localized_text" as const, locales: ["en", "fr", "ar"] as SupportedLocale[] },
          /** Medusa store API endpoint for this vertical */
          endpoint: { type: "text" as const, required: true },
          /** SEO description (localized) */
          seo_description: { type: "localized_text" as const, locales: ["en", "fr", "ar"] as SupportedLocale[] },
          /** Category grouping */
          category: { type: "select" as const, options: ["commerce", "services", "lifestyle", "community"] },
          /** Default card layout */
          card_layout: { type: "select" as const, options: ["grid", "list"] },
          /** Available filter fields */
          filter_fields: { type: "json" as const },
          /** Available sort fields */
          sort_fields: { type: "json" as const },
          /** Icon for vertical navigation */
          icon: { type: "upload" as const, relationTo: "media" as const },
          /** Whether this vertical is active */
          is_active: { type: "checkbox" as const, defaultValue: true },
          /** Minimum tier required to use this vertical */
          min_tier: { type: "select" as const, options: ["nano", "micro", "small", "medium", "large", "mega", "global"] as ScopeTier[] },
        },
      },
    },
  },
} as const

// ---------------------------------------------------------------------------
// 4. MEDUSA_TO_PAYLOAD_EVENTS
// ---------------------------------------------------------------------------

/**
 * Events that Medusa sends TO Payload CMS when transactional data changes.
 * Medusa POSTs to Payload's integration webhook endpoint.
 *
 * Endpoint: `{PAYLOAD_BASE_URL}/api/integrations/medusa/webhook`
 * Authentication: API key in `Authorization: Bearer {PAYLOAD_API_KEY}` header
 */
export const MEDUSA_TO_PAYLOAD_EVENTS = {

  /**
   * A new vendor has completed registration in Medusa.
   * Payload should create both a vendor-profile and a tenant content document
   * so the vendor can immediately start editing their CMS content.
   */
  "vendor.registered": {
    event: "vendor.registered" as const,
    description: "New vendor registered in Medusa. Create vendor-profile and tenant CMS documents.",
    medusa_payload: {
      vendor_id: "string — Medusa Vendor ID",
      tenant_id: "string — Medusa Tenant ID (the vendor's own tenant)",
      business_name: "string — Business name from registration",
      handle: "string — Vendor handle/slug",
      email: "string — Business email",
      scope_tier: "ScopeTier — Initial tier assignment",
      tenant_type: "TenantType — Usually 'vendor'",
      verticals: "string[] | null — Vertical slugs the vendor operates in",
    },
    payload_action: "Create a 'tenants' document (draft) with medusa_tenant_id + basic fields. Create a 'vendor-profiles' document (draft) with medusa_vendor_id + business_name. Return created document IDs.",
  },

  /**
   * A tenant's scope tier changed (upgrade or downgrade).
   * Payload should update the scope_tier field and potentially unlock/lock
   * page templates and features.
   */
  "tenant.tier_changed": {
    event: "tenant.tier_changed" as const,
    description: "Tenant scope tier was changed in Medusa. Update CMS document.",
    medusa_payload: {
      tenant_id: "string — Medusa Tenant ID",
      old_tier: "ScopeTier — Previous tier",
      new_tier: "ScopeTier — New tier",
      tenant_type: "TenantType — Current tenant type",
    },
    payload_action: "Find tenant document by medusa_tenant_id, update scope_tier. If downgrade, flag pages/navigations that exceed new tier visibility.",
  },

  /**
   * A new TenantPOI was created in Medusa (e.g., vendor added a new location).
   * Payload should create a content shell so editors can add descriptions, photos, etc.
   */
  "poi.created": {
    event: "poi.created" as const,
    description: "New POI created in Medusa. Create a POI content shell in Payload.",
    medusa_payload: {
      poi_id: "string — Medusa TenantPOI ID",
      tenant_id: "string — Owning tenant ID",
      name: "string — POI name",
      slug: "string — POI slug",
      poi_type: "POIType — Type of POI",
      address: "object — { line1, line2, city, state, postal_code, country_code }",
      latitude: "number | null",
      longitude: "number | null",
      fleetbase_place_id: "string | null — Fleetbase place reference",
    },
    payload_action: "Create a 'pois' document (draft) with medusa_poi_id, basic name/type, and geo reference. Content editors can then enrich with photos, descriptions, hours.",
  },

  /**
   * A new ServiceChannel was created in Medusa.
   * Payload should create a content document for display customization.
   */
  "channel.created": {
    event: "channel.created" as const,
    description: "New service channel created in Medusa. Create channel content in Payload.",
    medusa_payload: {
      channel_id: "string — Medusa ServiceChannel ID",
      tenant_id: "string — Owning tenant ID",
      name: "string — Channel name",
      slug: "string — Channel slug",
      channel_type: "ChannelType — Type of channel",
    },
    payload_action: "Create a 'service-channels' document (draft) with medusa_channel_id and basic display name. Editors can customize with icons, descriptions, promotions.",
  },
} as const
