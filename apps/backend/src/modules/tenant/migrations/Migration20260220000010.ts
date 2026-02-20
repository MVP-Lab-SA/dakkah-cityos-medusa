import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260220000010 extends Migration {
  override async up(): Promise<void> {
    // Add poi_id column if it doesn't exist (was missing from original service_channel creation)
    this.addSql(
      `ALTER TABLE IF EXISTS "service_channel" ADD COLUMN IF NOT EXISTS "poi_id" text null;`,
    );
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_service_channel_poi_id" ON "service_channel" ("poi_id") WHERE deleted_at IS NULL;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`DROP INDEX IF EXISTS "IDX_service_channel_poi_id";`);
    this.addSql(
      `ALTER TABLE IF EXISTS "service_channel" DROP COLUMN IF EXISTS "poi_id";`,
    );
  }
}
