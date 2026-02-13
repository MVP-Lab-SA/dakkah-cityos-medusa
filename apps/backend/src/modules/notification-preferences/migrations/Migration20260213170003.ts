import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260213170003 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "notification_preference" ("id" text not null, "customer_id" text not null, "tenant_id" text not null, "channel" text check ("channel" in ('email', 'sms', 'push', 'in_app', 'webhook')) not null, "event_type" text not null, "enabled" boolean not null default true, "frequency" text check ("frequency" in ('immediate', 'daily', 'weekly', 'never')) not null default 'immediate', "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "notification_preference_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_notification_preference_deleted_at" ON "notification_preference" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_notification_preference_tenant_id" ON "notification_preference" ("tenant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_notification_preference_customer_id" ON "notification_preference" ("customer_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_notification_preference_channel" ON "notification_preference" ("channel") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_notification_preference_event_type" ON "notification_preference" ("event_type") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_notification_preference_customer_id_channel_event_type_unique" ON "notification_preference" ("customer_id", "channel", "event_type") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "notification_preference" cascade;`);
  }

}
