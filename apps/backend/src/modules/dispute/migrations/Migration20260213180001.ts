import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260213180001 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "dispute" ("id" text not null, "order_id" text not null, "customer_id" text not null, "vendor_id" text null, "tenant_id" text not null, "type" text not null, "status" text not null default 'open', "priority" text not null default 'medium', "resolution" text null, "resolution_amount" numeric null, "resolved_by" text null, "resolved_at" timestamptz null, "escalated_at" timestamptz null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "dispute_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_dispute_deleted_at" ON "dispute" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_dispute_tenant_id" ON "dispute" ("tenant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_dispute_order_id" ON "dispute" ("order_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_dispute_customer_id" ON "dispute" ("customer_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_dispute_vendor_id" ON "dispute" ("vendor_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_dispute_status" ON "dispute" ("status") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_dispute_priority" ON "dispute" ("priority") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "dispute_message" ("id" text not null, "dispute_id" text not null, "sender_type" text not null, "sender_id" text not null, "content" text not null, "attachments" jsonb null, "is_internal" boolean not null default false, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "dispute_message_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_dispute_message_deleted_at" ON "dispute_message" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_dispute_message_dispute_id" ON "dispute_message" ("dispute_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_dispute_message_sender_id" ON "dispute_message" ("sender_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_dispute_message_sender_type" ON "dispute_message" ("sender_type") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_dispute_message_is_internal" ON "dispute_message" ("is_internal") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "dispute" cascade;`);

    this.addSql(`drop table if exists "dispute_message" cascade;`);
  }

}
