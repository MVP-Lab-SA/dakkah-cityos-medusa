import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260207135017 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "company" drop constraint if exists "company_handle_unique";`);
    this.addSql(`alter table if exists "company" add column if not exists "handle" text not null;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_company_handle_unique" ON "company" ("handle") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop index if exists "IDX_company_handle_unique";`);
    this.addSql(`alter table if exists "company" drop column if exists "handle";`);
  }

}
