import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260207140409 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "invoice" drop constraint if exists "invoice_invoice_number_unique";`);
    this.addSql(`create table if not exists "invoice" ("id" text not null, "invoice_number" text not null, "company_id" text not null, "customer_id" text null, "status" text check ("status" in ('draft', 'sent', 'paid', 'overdue', 'cancelled', 'void')) not null default 'draft', "issue_date" timestamptz not null, "due_date" timestamptz not null, "paid_at" timestamptz null, "subtotal" numeric not null, "tax_total" numeric not null default 0, "discount_total" numeric not null default 0, "total" numeric not null, "amount_paid" numeric not null default 0, "amount_due" numeric not null, "currency_code" text not null default 'usd', "period_start" timestamptz null, "period_end" timestamptz null, "payment_terms" text null, "payment_terms_days" integer not null default 30, "notes" text null, "internal_notes" text null, "pdf_url" text null, "metadata" jsonb null, "raw_subtotal" jsonb not null, "raw_tax_total" jsonb not null default '{"value":"0","precision":20}', "raw_discount_total" jsonb not null default '{"value":"0","precision":20}', "raw_total" jsonb not null, "raw_amount_paid" jsonb not null default '{"value":"0","precision":20}', "raw_amount_due" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "invoice_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_invoice_invoice_number_unique" ON "invoice" ("invoice_number") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_invoice_deleted_at" ON "invoice" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "invoice_item" ("id" text not null, "invoice_id" text not null, "title" text not null, "description" text null, "order_id" text null, "order_display_id" text null, "quantity" integer not null default 1, "unit_price" numeric not null, "subtotal" numeric not null, "tax_total" numeric not null default 0, "total" numeric not null, "metadata" jsonb null, "raw_unit_price" jsonb not null, "raw_subtotal" jsonb not null, "raw_tax_total" jsonb not null default '{"value":"0","precision":20}', "raw_total" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "invoice_item_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_invoice_item_invoice_id" ON "invoice_item" ("invoice_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_invoice_item_deleted_at" ON "invoice_item" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "invoice_item" add constraint "invoice_item_invoice_id_foreign" foreign key ("invoice_id") references "invoice" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "invoice_item" drop constraint if exists "invoice_item_invoice_id_foreign";`);

    this.addSql(`drop table if exists "invoice" cascade;`);

    this.addSql(`drop table if exists "invoice_item" cascade;`);
  }

}
