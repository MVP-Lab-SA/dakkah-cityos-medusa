import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260207123052 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "review" ("id" text not null, "rating" integer not null, "title" text null, "content" text not null, "customer_id" text not null, "customer_name" text null, "customer_email" text null, "product_id" text null, "vendor_id" text null, "order_id" text null, "is_verified_purchase" boolean not null default false, "is_approved" boolean not null default false, "helpful_count" integer not null default 0, "images" jsonb not null default '[]', "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "review_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_review_deleted_at" ON "review" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "review" cascade;`);
  }

}
