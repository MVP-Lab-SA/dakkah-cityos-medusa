import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260220000011 extends Migration {
  override async up(): Promise<void> {
    // Add visibility column if it doesn't exist — wishlist table was created in an earlier partial run
    // without this column, so CREATE TABLE IF NOT EXISTS was skipped on the subsequent migration run.
    this.addSql(
      `ALTER TABLE IF EXISTS "wishlist" ADD COLUMN IF NOT EXISTS "visibility" text check ("visibility" in ('private', 'shared', 'public')) not null default 'private';`,
    );
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_wishlist_visibility" ON "wishlist" ("visibility") WHERE deleted_at IS NULL;`,
    );

    // Also ensure share_token exists (same scenario)
    this.addSql(
      `ALTER TABLE IF EXISTS "wishlist" ADD COLUMN IF NOT EXISTS "share_token" text null;`,
    );
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_wishlist_share_token" ON "wishlist" ("share_token") WHERE deleted_at IS NULL;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`DROP INDEX IF EXISTS "IDX_wishlist_visibility";`);
    this.addSql(`DROP INDEX IF EXISTS "IDX_wishlist_share_token";`);
    this.addSql(
      `ALTER TABLE IF EXISTS "wishlist" DROP COLUMN IF EXISTS "visibility";`,
    );
    this.addSql(
      `ALTER TABLE IF EXISTS "wishlist" DROP COLUMN IF EXISTS "share_token";`,
    );
  }
}
