import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208081244 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "event_outbox" ("id" text not null, "tenant_id" text not null, "event_type" text not null, "aggregate_type" text not null, "aggregate_id" text not null, "payload" jsonb not null, "metadata" jsonb null, "source" text not null default 'commerce', "correlation_id" text null, "causation_id" text null, "actor_id" text null, "actor_role" text null, "node_id" text null, "channel" text null, "status" text check ("status" in ('pending', 'published', 'failed', 'archived')) not null default 'pending', "published_at" timestamptz null, "error" text null, "retry_count" integer not null default 0, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "event_outbox_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_event_outbox_deleted_at" ON "event_outbox" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_event_outbox_tenant_id" ON "event_outbox" ("tenant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_event_outbox_status" ON "event_outbox" ("status") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_event_outbox_event_type" ON "event_outbox" ("event_type") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_event_outbox_aggregate_type_aggregate_id" ON "event_outbox" ("aggregate_type", "aggregate_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_event_outbox_correlation_id" ON "event_outbox" ("correlation_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_event_outbox_tenant_id_status" ON "event_outbox" ("tenant_id", "status") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "event_outbox" cascade;`);
  }

}
