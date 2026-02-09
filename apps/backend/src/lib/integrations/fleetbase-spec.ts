/**
 * =============================================================================
 * FLEETBASE INTEGRATION SPECIFICATION
 * =============================================================================
 *
 * Contract document for the Fleetbase integration with Dakkah CityOS Commerce.
 *
 * Fleetbase provides all geo-spatial capabilities for the platform: geocoding,
 * place management, delivery zone management, routing, fleet/driver management,
 * and service area calculations.
 *
 * Medusa is the source of truth for TenantPOI records and order fulfillment.
 * Fleetbase is the source of truth for geo data, routing, and real-time tracking.
 * Both systems sync via webhooks and direct API calls.
 *
 * Each Medusa TenantPOI may have a corresponding `fleetbase_place_id` linking
 * it to a Fleetbase Place record.
 *
 * @module FleetbaseSpec
 * @version 1.0.0
 * @lastUpdated 2026-02-09
 */

// ---------------------------------------------------------------------------
// Shared Types
// ---------------------------------------------------------------------------

/** Geographic coordinate pair */
export interface LatLng {
  lat: number
  lng: number
}

/** A geographic point with optional metadata */
export interface GeoPoint extends LatLng {
  /** Geohash string for spatial indexing */
  geohash?: string
}

/** Structured address */
export interface Address {
  line1: string
  line2?: string
  city: string
  state?: string
  postal_code: string
  country_code: string
}

/** GeoJSON polygon for zone boundaries */
export interface GeoPolygon {
  type: "Polygon"
  coordinates: number[][][]
}

/** Scope tiers — used for rate limiting per tier */
export type ScopeTier = "nano" | "micro" | "small" | "medium" | "large" | "mega" | "global"

/** POI types from Medusa TenantPOI */
export type POIType =
  | "storefront"
  | "warehouse"
  | "fulfillment_hub"
  | "service_point"
  | "office"
  | "branch"
  | "kiosk"
  | "mobile"

/** Driver status */
export type DriverStatus = "available" | "busy" | "offline" | "on_break"

/** Delivery task status */
export type DeliveryTaskStatus =
  | "pending"
  | "assigned"
  | "en_route_pickup"
  | "arrived_pickup"
  | "picked_up"
  | "en_route_delivery"
  | "arrived_delivery"
  | "delivered"
  | "failed"
  | "cancelled"

// ---------------------------------------------------------------------------
// Response Types
// ---------------------------------------------------------------------------

/** Geocoding result */
export interface GeocodeResult {
  lat: number
  lng: number
  formatted_address: string
  place_id: string
}

/** Address validation result */
export interface AddressValidationResult {
  is_valid: boolean
  suggestions: Array<{
    formatted_address: string
    lat: number
    lng: number
    place_id: string
  }>
}

/** Autocomplete suggestion */
export interface AutocompleteSuggestion {
  description: string
  place_id: string
  main_text: string
  secondary_text: string
}

/** Fleetbase Place — a managed location record */
export interface FleetbasePlace {
  fleetbase_place_id: string
  name: string
  address: Address
  lat: number
  lng: number
  geohash: string
  place_type: string
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

/** Delivery/service zone */
export interface FleetbaseZone {
  zone_id: string
  tenant_id: string
  name: string
  polygon: GeoPolygon
  metadata: Record<string, any>
  is_active: boolean
  created_at: string
  updated_at: string
}

/** Route calculation result */
export interface RouteResult {
  distance_meters: number
  duration_seconds: number
  /** Encoded polyline string for map rendering */
  polyline: string
}

/** ETA calculation result */
export interface ETAResult {
  eta_minutes: number
  distance_meters: number
}

/** Route optimization result */
export interface OptimizedRouteResult {
  optimized_order: number[]
  total_distance_meters: number
  total_duration_seconds: number
  legs: Array<{
    from_index: number
    to_index: number
    distance_meters: number
    duration_seconds: number
  }>
}

/** Driver record */
export interface FleetbaseDriver {
  driver_id: string
  tenant_id: string
  name: string
  phone: string
  email?: string
  vehicle_type?: string
  vehicle_plate?: string
  status: DriverStatus
  current_location?: LatLng
  created_at: string
  updated_at: string
}

/** Driver assignment result */
export interface DriverAssignment {
  assignment_id: string
  order_id: string
  driver_id: string
  status: DeliveryTaskStatus
  estimated_pickup: string
  estimated_delivery: string
  created_at: string
}

/** Real-time driver location */
export interface DriverLocation {
  driver_id: string
  lat: number
  lng: number
  heading: number
  speed: number
  updated_at: string
}

/** Service area definition */
export interface ServiceArea {
  service_area_id: string
  tenant_id: string
  poi_id: string
  radius_km: number
  polygon?: GeoPolygon
  is_active: boolean
  created_at: string
  updated_at: string
}

/** Coverage check result */
export interface CoverageCheckResult {
  is_covered: boolean
  nearest_poi: {
    poi_id: string
    name: string
    distance_km: number
    lat: number
    lng: number
  } | null
  distance_km: number
}

// ---------------------------------------------------------------------------
// Filter Types
// ---------------------------------------------------------------------------

/** Filters for listing places */
export interface PlaceFilters {
  poi_type?: POIType
  country_code?: string
  city?: string
  is_active?: boolean
  limit?: number
  offset?: number
}

/** Filters for listing drivers */
export interface DriverFilters {
  status?: DriverStatus
  vehicle_type?: string
  near?: LatLng & { radius_km: number }
  limit?: number
  offset?: number
}

/** Routing options */
export interface RoutingOptions {
  mode?: "driving" | "walking" | "cycling" | "transit"
  avoid?: Array<"tolls" | "highways" | "ferries">
  departure_time?: string
  traffic_model?: "best_guess" | "pessimistic" | "optimistic"
}

/** Autocomplete options */
export interface AutocompleteOptions {
  country_codes?: string[]
  types?: Array<"address" | "establishment" | "geocode" | "regions">
  language?: string
  location_bias?: LatLng & { radius_km: number }
  limit?: number
}

// ---------------------------------------------------------------------------
// 1. FLEETBASE_CAPABILITIES
// ---------------------------------------------------------------------------

/**
 * Defines all required Fleetbase API capabilities that the integration must support.
 * Each capability group documents the methods, parameters, and return types.
 *
 * All methods are async and may throw on network/validation errors.
 * Fleetbase must implement these endpoints or SDK methods.
 */
export const FLEETBASE_CAPABILITIES = {

  /**
   * =========================================================================
   * GEOCODING
   * =========================================================================
   * Address-to-coordinate and coordinate-to-address resolution.
   * Used when vendors register POIs, customers enter delivery addresses,
   * and the system needs to validate/normalize addresses.
   */
  geocoding: {
    description: "Address geocoding, reverse geocoding, validation, and autocomplete",

    /** Convert a text address to geographic coordinates */
    geocodeAddress: {
      description: "Forward geocode: convert a text address to lat/lng coordinates",
      parameters: {
        address: "string — Free-form address text or structured Address object",
      },
      returns: "GeocodeResult — { lat, lng, formatted_address, place_id }",
      errors: ["ADDRESS_NOT_FOUND", "INVALID_ADDRESS", "RATE_LIMIT_EXCEEDED"],
    },

    /** Convert coordinates to a human-readable address */
    reverseGeocode: {
      description: "Reverse geocode: convert lat/lng to a formatted address",
      parameters: {
        lat: "number — Latitude",
        lng: "number — Longitude",
      },
      returns: "{ address: Address, formatted_address: string, place_id: string }",
      errors: ["LOCATION_NOT_FOUND", "RATE_LIMIT_EXCEEDED"],
    },

    /** Validate an address and return suggestions if invalid */
    validateAddress: {
      description: "Validate an address for deliverability and correctness",
      parameters: {
        address: "Address — Structured address to validate",
      },
      returns: "AddressValidationResult — { is_valid, suggestions[] }",
      errors: ["VALIDATION_FAILED", "RATE_LIMIT_EXCEEDED"],
    },

    /** Autocomplete partial address input */
    autocomplete: {
      description: "Provide address suggestions as the user types",
      parameters: {
        query: "string — Partial address text",
        options: "AutocompleteOptions — Country filter, types, language, location bias",
      },
      returns: "{ suggestions: AutocompleteSuggestion[] }",
      errors: ["RATE_LIMIT_EXCEEDED"],
    },
  },

  /**
   * =========================================================================
   * PLACES (POI management in Fleetbase)
   * =========================================================================
   * CRUD operations for geo-referenced places. Each Medusa TenantPOI may
   * have a corresponding Fleetbase Place for geo enrichment, routing, and
   * zone calculations.
   */
  places: {
    description: "CRUD operations for geo-referenced places linked to Medusa TenantPOIs",

    /** Create a new place in Fleetbase */
    createPlace: {
      description: "Create a Fleetbase place from a Medusa TenantPOI",
      parameters: {
        poi_data: "{ medusa_poi_id: string, medusa_tenant_id: string, name: string, address: Address, lat?: number, lng?: number, poi_type: POIType, metadata?: Record<string, any> }",
      },
      returns: "{ fleetbase_place_id: string } — The new Fleetbase place ID to store on TenantPOI",
      errors: ["INVALID_ADDRESS", "DUPLICATE_PLACE", "TENANT_NOT_FOUND"],
    },

    /** Update an existing place */
    updatePlace: {
      description: "Update a Fleetbase place when POI data changes in Medusa",
      parameters: {
        place_id: "string — Fleetbase place ID",
        data: "Partial<{ name: string, address: Address, lat: number, lng: number, poi_type: POIType, metadata: Record<string, any> }>",
      },
      returns: "{ place: FleetbasePlace }",
      errors: ["PLACE_NOT_FOUND", "INVALID_DATA"],
    },

    /** Delete a place */
    deletePlace: {
      description: "Delete a Fleetbase place when a POI is removed from Medusa",
      parameters: {
        place_id: "string — Fleetbase place ID",
      },
      returns: "void",
      errors: ["PLACE_NOT_FOUND", "PLACE_HAS_ACTIVE_ZONES"],
    },

    /** Get a single place by ID */
    getPlace: {
      description: "Retrieve a Fleetbase place by its ID",
      parameters: {
        place_id: "string — Fleetbase place ID",
      },
      returns: "{ place: FleetbasePlace }",
      errors: ["PLACE_NOT_FOUND"],
    },

    /** List all places for a tenant */
    listPlaces: {
      description: "List all Fleetbase places belonging to a Medusa tenant",
      parameters: {
        tenant_id: "string — Medusa tenant ID",
        filters: "PlaceFilters — Optional filters (poi_type, country, city, pagination)",
      },
      returns: "{ places: FleetbasePlace[], total: number }",
      errors: ["TENANT_NOT_FOUND"],
    },
  },

  /**
   * =========================================================================
   * ZONES (Delivery / Service Zones)
   * =========================================================================
   * Polygon-based zone management for defining delivery areas, service
   * coverage, pricing zones, and geo-fencing boundaries.
   */
  zones: {
    description: "Polygon-based delivery and service zone management",

    /** Create a new zone */
    createZone: {
      description: "Create a delivery/service zone for a tenant",
      parameters: {
        tenant_id: "string — Medusa tenant ID",
        polygon: "GeoPolygon — GeoJSON polygon defining the zone boundary",
        metadata: "{ name: string, zone_type?: string, delivery_fee?: number, min_order?: number, estimated_time_minutes?: number, is_active?: boolean }",
      },
      returns: "{ zone_id: string }",
      errors: ["INVALID_POLYGON", "TENANT_NOT_FOUND", "ZONE_OVERLAP"],
    },

    /** Update a zone's boundary or metadata */
    updateZone: {
      description: "Update an existing zone's polygon boundary or metadata",
      parameters: {
        zone_id: "string — Zone ID",
        polygon: "GeoPolygon — Updated polygon (optional if only metadata changes)",
        metadata: "Partial<{ name: string, delivery_fee: number, min_order: number, estimated_time_minutes: number, is_active: boolean }>",
      },
      returns: "{ zone: FleetbaseZone }",
      errors: ["ZONE_NOT_FOUND", "INVALID_POLYGON"],
    },

    /** Delete a zone */
    deleteZone: {
      description: "Delete a delivery/service zone",
      parameters: {
        zone_id: "string — Zone ID",
      },
      returns: "void",
      errors: ["ZONE_NOT_FOUND", "ZONE_HAS_ACTIVE_ORDERS"],
    },

    /** Check if a point is inside a specific zone */
    checkPointInZone: {
      description: "Determine if a geographic point falls within a specific zone",
      parameters: {
        lat: "number — Latitude",
        lng: "number — Longitude",
        zone_id: "string — Zone ID to check against",
      },
      returns: "{ is_inside: boolean }",
      errors: ["ZONE_NOT_FOUND"],
    },

    /** Get all zones containing a given point */
    getZonesForPoint: {
      description: "Find all zones that contain a given geographic point",
      parameters: {
        lat: "number — Latitude",
        lng: "number — Longitude",
      },
      returns: "{ zones: FleetbaseZone[] }",
      errors: [],
    },

    /** List all zones for a tenant */
    listZones: {
      description: "List all delivery/service zones for a tenant",
      parameters: {
        tenant_id: "string — Medusa tenant ID",
      },
      returns: "{ zones: FleetbaseZone[] }",
      errors: ["TENANT_NOT_FOUND"],
    },
  },

  /**
   * =========================================================================
   * ROUTING
   * =========================================================================
   * Route calculation, ETA estimation, and multi-stop route optimization.
   * Used for delivery time estimates, driver routing, and logistics planning.
   */
  routing: {
    description: "Route calculation, ETA estimation, and route optimization",

    /** Calculate a route between two points */
    calculateRoute: {
      description: "Calculate the route between an origin and destination",
      parameters: {
        origin: "LatLng — Starting point",
        destination: "LatLng — End point",
        options: "RoutingOptions — Mode of transport, avoidances, traffic model",
      },
      returns: "RouteResult — { distance_meters, duration_seconds, polyline }",
      errors: ["ROUTE_NOT_FOUND", "INVALID_COORDINATES", "RATE_LIMIT_EXCEEDED"],
    },

    /** Calculate estimated time of arrival */
    calculateETA: {
      description: "Get the estimated time of arrival between two points",
      parameters: {
        origin: "LatLng — Starting point (e.g., driver location)",
        destination: "LatLng — End point (e.g., customer address)",
      },
      returns: "ETAResult — { eta_minutes, distance_meters }",
      errors: ["ROUTE_NOT_FOUND", "INVALID_COORDINATES"],
    },

    /** Optimize a multi-stop route */
    optimizeRoute: {
      description: "Optimize the order of multiple waypoints to minimize total travel time/distance",
      parameters: {
        waypoints: "LatLng[] — Array of waypoints to visit (minimum 3)",
      },
      returns: "OptimizedRouteResult — { optimized_order, total_distance_meters, total_duration_seconds, legs }",
      errors: ["INSUFFICIENT_WAYPOINTS", "ROUTE_NOT_FOUND", "RATE_LIMIT_EXCEEDED"],
    },
  },

  /**
   * =========================================================================
   * FLEET (Driver & Vehicle Management)
   * =========================================================================
   * Per-vendor-tenant driver management, order assignment, and real-time
   * driver tracking. Each vendor tenant manages their own fleet of drivers.
   */
  fleet: {
    description: "Driver management, order assignment, and real-time tracking per vendor-tenant",

    /** Register a new driver for a tenant */
    createDriver: {
      description: "Register a new driver under a vendor tenant's fleet",
      parameters: {
        tenant_id: "string — Medusa tenant ID (the vendor)",
        driver_data: "{ name: string, phone: string, email?: string, vehicle_type?: string, vehicle_plate?: string, license_number?: string, metadata?: Record<string, any> }",
      },
      returns: "{ driver_id: string }",
      errors: ["TENANT_NOT_FOUND", "DUPLICATE_PHONE", "INVALID_DATA"],
    },

    /** Assign a driver to an order for delivery */
    assignDriver: {
      description: "Assign a driver to fulfill a delivery order",
      parameters: {
        order_id: "string — Medusa order ID",
        driver_id: "string — Fleetbase driver ID",
      },
      returns: "DriverAssignment — { assignment_id, order_id, driver_id, status, estimated_pickup, estimated_delivery }",
      errors: ["ORDER_NOT_FOUND", "DRIVER_NOT_FOUND", "DRIVER_UNAVAILABLE", "ORDER_ALREADY_ASSIGNED"],
    },

    /** Get real-time location of a driver */
    trackDriver: {
      description: "Get the current real-time location and movement data for a driver",
      parameters: {
        driver_id: "string — Fleetbase driver ID",
      },
      returns: "DriverLocation — { driver_id, lat, lng, heading, speed, updated_at }",
      errors: ["DRIVER_NOT_FOUND", "LOCATION_UNAVAILABLE"],
    },

    /** List all drivers for a tenant */
    listDrivers: {
      description: "List all drivers in a vendor tenant's fleet with optional filters",
      parameters: {
        tenant_id: "string — Medusa tenant ID",
        filters: "DriverFilters — Status, vehicle type, proximity, pagination",
      },
      returns: "{ drivers: FleetbaseDriver[], total: number }",
      errors: ["TENANT_NOT_FOUND"],
    },
  },

  /**
   * =========================================================================
   * SERVICE AREAS
   * =========================================================================
   * Define and query service coverage areas around POIs. Used to determine
   * if a customer's location is within a vendor's delivery/service range.
   */
  serviceAreas: {
    description: "Service coverage area management and coverage checks around POIs",

    /** Create a service area around a POI */
    createServiceArea: {
      description: "Define a service/delivery area around a specific POI",
      parameters: {
        tenant_id: "string — Medusa tenant ID",
        poi_id: "string — Medusa TenantPOI ID",
        radius_km: "number — Service radius in kilometers",
        polygon: "GeoPolygon | undefined — Optional custom polygon (overrides radius if provided)",
      },
      returns: "{ service_area_id: string }",
      errors: ["POI_NOT_FOUND", "TENANT_NOT_FOUND", "INVALID_RADIUS", "INVALID_POLYGON"],
    },

    /** Check if a location is covered by any of a tenant's service areas */
    checkCoverage: {
      description: "Check if a customer location is within a tenant's service coverage",
      parameters: {
        lat: "number — Customer latitude",
        lng: "number — Customer longitude",
        tenant_id: "string — Medusa tenant ID",
      },
      returns: "CoverageCheckResult — { is_covered, nearest_poi, distance_km }",
      errors: ["TENANT_NOT_FOUND"],
    },

    /** Get the service area definition for a specific POI */
    getServiceArea: {
      description: "Retrieve the service area configuration for a POI",
      parameters: {
        poi_id: "string — Medusa TenantPOI ID",
      },
      returns: "{ service_area: ServiceArea }",
      errors: ["POI_NOT_FOUND", "SERVICE_AREA_NOT_FOUND"],
    },
  },
} as const

// ---------------------------------------------------------------------------
// 2. FLEETBASE_WEBHOOKS
// ---------------------------------------------------------------------------

/**
 * Webhooks that Fleetbase sends TO Medusa when delivery/logistics events occur.
 * Fleetbase must POST JSON payloads to these Medusa endpoints.
 *
 * Endpoint base: `{MEDUSA_BASE_URL}/admin/webhooks/fleetbase`
 * Authentication: Shared webhook secret in `x-fleetbase-signature` header (HMAC-SHA256)
 */
export const FLEETBASE_WEBHOOKS = {

  /** A driver has been assigned to an order */
  "order.driver_assigned": {
    event: "order.driver_assigned" as const,
    description: "A driver has been assigned to fulfill an order. Update order tracking information.",
    fleetbase_payload: {
      order_id: "string — Medusa order ID",
      driver_id: "string — Fleetbase driver ID",
      driver_name: "string — Driver display name",
      driver_phone: "string — Driver phone number",
      vehicle_type: "string | null — Vehicle type",
      vehicle_plate: "string | null — Vehicle plate number",
      estimated_pickup: "string — ISO 8601 datetime for estimated pickup",
      estimated_delivery: "string — ISO 8601 datetime for estimated delivery",
      assignment_id: "string — Fleetbase assignment ID",
    },
    medusa_action: "Update order metadata with driver info and tracking assignment. Notify customer of driver assignment.",
  },

  /** Order has been picked up by the driver */
  "order.picked_up": {
    event: "order.picked_up" as const,
    description: "The driver has picked up the order from the vendor/POI. Update fulfillment status.",
    fleetbase_payload: {
      order_id: "string — Medusa order ID",
      driver_id: "string — Fleetbase driver ID",
      picked_up_at: "string — ISO 8601 datetime",
      pickup_location: "LatLng — Where the pickup occurred",
      proof_of_pickup: "string | null — Photo URL or signature",
    },
    medusa_action: "Update order fulfillment to 'picked_up' status. Notify customer with ETA.",
  },

  /** Order has been delivered to the customer */
  "order.delivered": {
    event: "order.delivered" as const,
    description: "The order has been delivered to the customer. Complete the fulfillment.",
    fleetbase_payload: {
      order_id: "string — Medusa order ID",
      driver_id: "string — Fleetbase driver ID",
      delivered_at: "string — ISO 8601 datetime",
      delivery_location: "LatLng — Where the delivery occurred",
      proof_of_delivery: "string | null — Photo URL or signature",
      recipient_name: "string | null — Name of person who received the delivery",
    },
    medusa_action: "Complete order fulfillment. Mark delivery as completed. Notify customer of successful delivery.",
  },

  /** Driver location update (real-time tracking) */
  "driver.location_updated": {
    event: "driver.location_updated" as const,
    description: "Real-time driver location update for active deliveries. Push to customer tracking.",
    fleetbase_payload: {
      driver_id: "string — Fleetbase driver ID",
      order_id: "string | null — Active order being delivered",
      lat: "number — Current latitude",
      lng: "number — Current longitude",
      heading: "number — Direction in degrees (0-360)",
      speed: "number — Speed in km/h",
      updated_at: "string — ISO 8601 datetime",
    },
    medusa_action: "Forward to real-time tracking channel (WebSocket/SSE). Update estimated delivery time.",
    rate_limit: "Maximum 1 update per 5 seconds per driver",
  },

  /** A delivery/service zone was updated in Fleetbase */
  "zone.updated": {
    event: "zone.updated" as const,
    description: "A delivery/service zone boundary or metadata was changed. Sync to Medusa.",
    fleetbase_payload: {
      zone_id: "string — Fleetbase zone ID",
      tenant_id: "string — Medusa tenant ID",
      name: "string — Zone name",
      polygon: "GeoPolygon — Updated polygon boundary",
      is_active: "boolean — Whether the zone is active",
      metadata: "Record<string, any> — Zone metadata (delivery_fee, min_order, etc.)",
    },
    medusa_action: "Update TenantPOI delivery_zones JSON with new zone data. Recalculate service coverage if needed.",
  },
} as const

// ---------------------------------------------------------------------------
// 3. MEDUSA_TO_FLEETBASE_EVENTS
// ---------------------------------------------------------------------------

/**
 * Events that Medusa sends TO Fleetbase when commerce data changes.
 * Medusa POSTs to Fleetbase's webhook/API endpoint.
 *
 * Authentication: Fleetbase API key in `Authorization: Bearer {FLEETBASE_API_KEY}` header
 */
export const MEDUSA_TO_FLEETBASE_EVENTS = {

  /** A new TenantPOI was created — Fleetbase should create a corresponding place */
  "poi.created": {
    event: "poi.created" as const,
    description: "New POI created in Medusa. Create a Fleetbase place for geo services.",
    medusa_payload: {
      poi_id: "string — Medusa TenantPOI ID",
      tenant_id: "string — Owning tenant ID",
      name: "string — POI name",
      poi_type: "POIType",
      address: "Address — Structured address",
      latitude: "number | null",
      longitude: "number | null",
      service_radius_km: "number | null — Desired service radius",
      metadata: "Record<string, any> | null",
    },
    fleetbase_action: "Create a Fleetbase Place. If lat/lng not provided, geocode the address. Return fleetbase_place_id. Optionally create a default service area if service_radius_km is provided.",
  },

  /** A TenantPOI was updated — sync changes to Fleetbase */
  "poi.updated": {
    event: "poi.updated" as const,
    description: "POI was updated in Medusa. Sync address/location changes to Fleetbase.",
    medusa_payload: {
      poi_id: "string — Medusa TenantPOI ID",
      fleetbase_place_id: "string — Existing Fleetbase place ID",
      name: "string — Updated name",
      address: "Address — Updated address",
      latitude: "number | null",
      longitude: "number | null",
      service_radius_km: "number | null",
      is_active: "boolean",
    },
    fleetbase_action: "Update the Fleetbase Place record. Re-geocode if address changed and lat/lng not provided. Update service area if radius changed.",
  },

  /** An order was placed that requires delivery — create a delivery task */
  "order.placed": {
    event: "order.placed" as const,
    description: "A new order requiring delivery was placed. Create a delivery task in Fleetbase.",
    medusa_payload: {
      order_id: "string — Medusa order ID",
      tenant_id: "string — Vendor tenant ID",
      pickup_poi_id: "string — POI where order is picked up",
      pickup_fleetbase_place_id: "string — Fleetbase place ID for pickup",
      delivery_address: "Address — Customer delivery address",
      delivery_lat: "number | null",
      delivery_lng: "number | null",
      items_count: "number — Number of items",
      total_weight_kg: "number | null — Estimated total weight",
      requires_signature: "boolean — Whether delivery requires signature",
      delivery_notes: "string | null — Customer delivery instructions",
      preferred_delivery_time: "string | null — ISO 8601 datetime",
    },
    fleetbase_action: "Create a delivery task. Geocode delivery address if lat/lng not provided. Find optimal driver (if auto-assign enabled). Return task ID and ETA.",
  },

  /** An order was cancelled — cancel the delivery task */
  "order.cancelled": {
    event: "order.cancelled" as const,
    description: "An order was cancelled. Cancel the corresponding delivery task in Fleetbase.",
    medusa_payload: {
      order_id: "string — Medusa order ID",
      cancellation_reason: "string | null — Reason for cancellation",
      cancelled_by: "string — Who cancelled (customer, vendor, admin)",
    },
    fleetbase_action: "Cancel the delivery task if not yet picked up. If already picked up, mark as 'return to sender'. Notify assigned driver.",
  },
} as const

// ---------------------------------------------------------------------------
// 4. FLEETBASE_CONFIG
// ---------------------------------------------------------------------------

/**
 * Configuration requirements for the Fleetbase integration.
 * These values must be set as environment variables or secrets.
 */
export const FLEETBASE_CONFIG = {

  /** Required environment variables */
  required_env_vars: {
    FLEETBASE_API_KEY: "string — Fleetbase API key for authentication. Store as secret.",
    FLEETBASE_BASE_URL: "string — Fleetbase API base URL (e.g., https://api.fleetbase.io/v1)",
    FLEETBASE_WEBHOOK_SECRET: "string — Shared secret for verifying inbound webhooks (HMAC-SHA256). Store as secret.",
  },

  /** Optional environment variables */
  optional_env_vars: {
    FLEETBASE_SANDBOX_MODE: "boolean — Whether to use Fleetbase sandbox/test environment. Default: false",
    FLEETBASE_DEFAULT_ROUTING_MODE: "string — Default routing mode: driving | walking | cycling. Default: driving",
    FLEETBASE_LOCATION_UPDATE_INTERVAL_MS: "number — Minimum interval between driver location updates. Default: 5000",
  },

  /**
   * Rate limits per tenant scope tier.
   * These limits are enforced by the Medusa integration layer, not Fleetbase.
   * Values represent maximum API calls per minute.
   */
  rate_limits_per_tier: {
    nano: {
      geocoding: 10,
      places: 20,
      zones: 10,
      routing: 10,
      fleet: 0,
      serviceAreas: 10,
      description: "Nano tier: Basic geo capabilities. No fleet management.",
    },
    micro: {
      geocoding: 30,
      places: 50,
      zones: 20,
      routing: 30,
      fleet: 10,
      serviceAreas: 20,
      description: "Micro tier: Small business with limited fleet.",
    },
    small: {
      geocoding: 60,
      places: 100,
      zones: 50,
      routing: 60,
      fleet: 30,
      serviceAreas: 50,
      description: "Small tier: Growing business with moderate fleet.",
    },
    medium: {
      geocoding: 120,
      places: 200,
      zones: 100,
      routing: 120,
      fleet: 60,
      serviceAreas: 100,
      description: "Medium tier: Established business with significant fleet.",
    },
    large: {
      geocoding: 300,
      places: 500,
      zones: 250,
      routing: 300,
      fleet: 150,
      serviceAreas: 250,
      description: "Large tier: Major business with large fleet operations.",
    },
    mega: {
      geocoding: 600,
      places: 1000,
      zones: 500,
      routing: 600,
      fleet: 300,
      serviceAreas: 500,
      description: "Mega tier: Enterprise with extensive logistics.",
    },
    global: {
      geocoding: -1,
      places: -1,
      zones: -1,
      routing: -1,
      fleet: -1,
      serviceAreas: -1,
      description: "Global tier: Unlimited API calls. Value -1 means no limit.",
    },
  } as Record<ScopeTier, {
    geocoding: number
    places: number
    zones: number
    routing: number
    fleet: number
    serviceAreas: number
    description: string
  }>,

  /**
   * Supported countries and regions.
   * Fleetbase geo services must be available in these regions.
   * Aligned with Medusa tenant.residency_zone values.
   */
  supported_regions: {
    GCC: {
      countries: ["AE", "SA", "QA", "KW", "BH", "OM"],
      description: "Gulf Cooperation Council — Primary market",
      full_capabilities: true,
    },
    EU: {
      countries: ["DE", "FR", "GB", "IT", "ES", "NL", "BE", "AT", "CH"],
      description: "European Union — Secondary market",
      full_capabilities: true,
    },
    MENA: {
      countries: ["EG", "JO", "LB", "MA", "TN", "IQ"],
      description: "Middle East and North Africa — Expanding market",
      full_capabilities: true,
    },
    APAC: {
      countries: ["CN", "JP", "KR", "IN", "SG", "AU", "MY", "TH", "PH"],
      description: "Asia Pacific — Expanding market",
      full_capabilities: false,
      limited_capabilities: "Fleet management and real-time tracking may have limited coverage",
    },
    AMERICAS: {
      countries: ["US", "CA", "MX", "BR", "AR", "CO", "CL"],
      description: "Americas — Expanding market",
      full_capabilities: false,
      limited_capabilities: "Fleet management requires regional Fleetbase partner",
    },
  },

  /** Webhook configuration */
  webhook_config: {
    /** Medusa endpoint that receives Fleetbase webhooks */
    medusa_endpoint: "/admin/webhooks/fleetbase",
    /** Signature header name */
    signature_header: "x-fleetbase-signature",
    /** Signature algorithm */
    signature_algorithm: "HMAC-SHA256",
    /** Maximum retry attempts for failed webhook deliveries */
    max_retries: 5,
    /** Retry backoff: exponential with base delay in seconds */
    retry_backoff_base_seconds: 30,
    /** Webhook timeout in seconds */
    timeout_seconds: 30,
  },
} as const
