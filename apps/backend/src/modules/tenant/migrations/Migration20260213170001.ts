import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260213170001 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "tenant_poi" ("id" text not null, "tenant_id" text not null, "node_id" text null, "name" text not null, "slug" text not null, "poi_type" text check ("poi_type" in ('store', 'warehouse', 'office', 'service_center', 'pickup_point', 'other')) not null, "address_line1" text null, "address_line2" text null, "city" text null, "state" text null, "postal_code" text null, "country_code" text null, "latitude" numeric null, "longitude" numeric null, "geohash" text null, "operating_hours" jsonb null, "phone" text null, "email" text null, "is_primary" boolean not null default false, "is_active" boolean not null default true, "service_radius_km" numeric null, "delivery_zones" jsonb null, "fleetbase_place_id" text null, "media" jsonb null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "tenant_poi_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_tenant_poi_deleted_at" ON "tenant_poi" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_tenant_poi_tenant_id" ON "tenant_poi" ("tenant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_tenant_poi_node_id" ON "tenant_poi" ("node_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_tenant_poi_slug" ON "tenant_poi" ("slug") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_tenant_poi_poi_type" ON "tenant_poi" ("poi_type") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_tenant_poi_geohash" ON "tenant_poi" ("geohash") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_tenant_poi_country_code" ON "tenant_poi" ("country_code") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "tenant_relationship" ("id" text not null, "host_tenant_id" text not null, "vendor_tenant_id" text not null, "relationship_type" text check ("relationship_type" in ('marketplace', 'franchise', 'affiliate', 'reseller', 'partner')) not null, "status" text check ("status" in ('pending', 'active', 'suspended', 'terminated')) not null default 'pending', "commission_type" text check ("commission_type" in ('percentage', 'flat', 'tiered')) null, "commission_rate" numeric null, "commission_flat" numeric null, "commission_tiers" jsonb null, "listing_scope" text check ("listing_scope" in ('full', 'category', 'manual')) null, "allowed_categories" jsonb null, "revenue_share_model" text null, "contract_start" timestamptz null, "contract_end" timestamptz null, "approved_by" text null, "approved_at" timestamptz null, "terms" jsonb null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "tenant_relationship_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_tenant_relationship_deleted_at" ON "tenant_relationship" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_tenant_relationship_host_tenant_id" ON "tenant_relationship" ("host_tenant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_tenant_relationship_vendor_tenant_id" ON "tenant_relationship" ("vendor_tenant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_tenant_relationship_status" ON "tenant_relationship" ("status") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_tenant_relationship_relationship_type" ON "tenant_relationship" ("relationship_type") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "tenant_poi" cascade;`);

    this.addSql(`drop table if exists "tenant_relationship" cascade;`);
  }

}
