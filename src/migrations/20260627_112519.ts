import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "kiosk" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titre" varchar NOT NULL,
  	"slug" varchar,
  	"description_courte" varchar NOT NULL,
  	"document_id" integer NOT NULL,
  	"image_id" integer,
  	"date_publication" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "kiosk_id" integer;
  ALTER TABLE "kiosk" ADD CONSTRAINT "kiosk_document_id_media_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "kiosk" ADD CONSTRAINT "kiosk_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "kiosk_slug_idx" ON "kiosk" USING btree ("slug");
  CREATE INDEX "kiosk_document_idx" ON "kiosk" USING btree ("document_id");
  CREATE INDEX "kiosk_image_idx" ON "kiosk" USING btree ("image_id");
  CREATE INDEX "kiosk_updated_at_idx" ON "kiosk" USING btree ("updated_at");
  CREATE INDEX "kiosk_created_at_idx" ON "kiosk" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_kiosk_fk" FOREIGN KEY ("kiosk_id") REFERENCES "public"."kiosk"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_kiosk_id_idx" ON "payload_locked_documents_rels" USING btree ("kiosk_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "kiosk" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "kiosk" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_kiosk_fk";
  
  DROP INDEX "payload_locked_documents_rels_kiosk_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "kiosk_id";`)
}
