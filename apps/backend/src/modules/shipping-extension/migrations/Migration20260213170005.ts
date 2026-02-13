import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260213170005 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "carrier_config" ("id" text not null, "tenant_id" text not null, "carrier_code" text not null, "carrier_name" text not null, "api_endpoint" text null, "is_active" boolean not null default true, "supported_countries" jsonb null, "tracking_url_template" text null, "max_weight" numeric null, "max_dimensions" jsonb null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "carrier_config_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_carrier_config_deleted_at" ON "carrier_config" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_carrier_config_tenant_id" ON "carrier_config" ("tenant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_carrier_config_carrier_code" ON "carrier_config" ("carrier_code") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_carrier_config_is_active" ON "carrier_config" ("is_active") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "shipping_rate" ("id" text not null, "tenant_id" text not null, "carrier_id" text not null, "carrier_name" text not null, "service_type" text not null, "origin_zone" text null, "destination_zone" text null, "base_rate" numeric not null default 0, "per_kg_rate" numeric not null default 0, "min_weight" numeric null, "max_weight" numeric null, "estimated_days_min" integer null, "estimated_days_max" integer null, "is_active" boolean not null default true, "metadata" jsonb null, "raw_base_rate" jsonb not null default '{"value":"0","precision":20}', "raw_per_kg_rate" jsonb not null default '{"value":"0","precision":20}', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "shipping_rate_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_shipping_rate_deleted_at" ON "shipping_rate" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_shipping_rate_tenant_id" ON "shipping_rate" ("tenant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_shipping_rate_carrier_id" ON "shipping_rate" ("carrier_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_shipping_rate_service_type" ON "shipping_rate" ("service_type") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_shipping_rate_origin_zone_destination_zone" ON "shipping_rate" ("origin_zone", "destination_zone") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_shipping_rate_is_active" ON "shipping_rate" ("is_active") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "carrier_config" cascade;`);

    this.addSql(`drop table if exists "shipping_rate" cascade;`);
  }

}
