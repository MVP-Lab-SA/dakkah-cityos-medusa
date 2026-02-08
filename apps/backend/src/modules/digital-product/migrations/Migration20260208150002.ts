import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208150002 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "download_license" drop constraint if exists "download_license_license_key_unique";`);
    this.addSql(`create table if not exists "digital_asset" ("id" text not null, "tenant_id" text not null, "product_id" text not null, "title" text not null, "file_url" text not null, "file_type" text check ("file_type" in ('pdf', 'video', 'audio', 'image', 'archive', 'ebook', 'software', 'other')) not null, "file_size_bytes" integer null, "preview_url" text null, "version" text not null default '1.0', "max_downloads" integer not null default -1, "is_active" boolean not null default true, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "digital_asset_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_digital_asset_deleted_at" ON "digital_asset" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "download_license" ("id" text not null, "tenant_id" text not null, "asset_id" text not null, "customer_id" text not null, "order_id" text not null, "license_key" text not null, "status" text check ("status" in ('active', 'expired', 'revoked')) not null default 'active', "download_count" integer not null default 0, "max_downloads" integer not null default -1, "first_downloaded_at" timestamptz null, "last_downloaded_at" timestamptz null, "expires_at" timestamptz null, "revoked_at" timestamptz null, "revoke_reason" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "download_license_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_download_license_license_key_unique" ON "download_license" ("license_key") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_download_license_deleted_at" ON "download_license" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "digital_asset" cascade;`);

    this.addSql(`drop table if exists "download_license" cascade;`);
  }

}
