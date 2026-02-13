import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260213170006 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "reservation_hold" ("id" text not null, "tenant_id" text not null, "variant_id" text not null, "quantity" integer not null, "reason" text null, "reference_id" text null, "expires_at" timestamptz null, "status" text check ("status" in ('active', 'released', 'expired')) not null default 'active', "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "reservation_hold_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_reservation_hold_deleted_at" ON "reservation_hold" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_reservation_hold_tenant_id" ON "reservation_hold" ("tenant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_reservation_hold_variant_id" ON "reservation_hold" ("variant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_reservation_hold_status" ON "reservation_hold" ("status") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_reservation_hold_expires_at" ON "reservation_hold" ("expires_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "stock_alert" ("id" text not null, "tenant_id" text not null, "variant_id" text not null, "product_id" text null, "alert_type" text check ("alert_type" in ('low_stock', 'out_of_stock', 'overstock', 'expiring')) not null, "threshold" integer null, "current_quantity" integer null, "is_resolved" boolean not null default false, "notified_at" timestamptz null, "resolved_at" timestamptz null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "stock_alert_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_stock_alert_deleted_at" ON "stock_alert" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_stock_alert_tenant_id" ON "stock_alert" ("tenant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_stock_alert_variant_id" ON "stock_alert" ("variant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_stock_alert_product_id" ON "stock_alert" ("product_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_stock_alert_alert_type" ON "stock_alert" ("alert_type") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_stock_alert_is_resolved" ON "stock_alert" ("is_resolved") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "warehouse_transfer" ("id" text not null, "tenant_id" text not null, "source_location_id" text not null, "destination_location_id" text not null, "transfer_number" text not null, "status" text check ("status" in ('draft', 'pending', 'in_transit', 'received', 'cancelled')) not null default 'draft', "items" jsonb not null, "notes" text null, "initiated_by" text null, "shipped_at" timestamptz null, "received_at" timestamptz null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "warehouse_transfer_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_warehouse_transfer_deleted_at" ON "warehouse_transfer" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_warehouse_transfer_tenant_id" ON "warehouse_transfer" ("tenant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_warehouse_transfer_transfer_number_unique" ON "warehouse_transfer" ("transfer_number") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_warehouse_transfer_status" ON "warehouse_transfer" ("status") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_warehouse_transfer_source_location_id" ON "warehouse_transfer" ("source_location_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_warehouse_transfer_destination_location_id" ON "warehouse_transfer" ("destination_location_id") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "reservation_hold" cascade;`);

    this.addSql(`drop table if exists "stock_alert" cascade;`);

    this.addSql(`drop table if exists "warehouse_transfer" cascade;`);
  }

}
