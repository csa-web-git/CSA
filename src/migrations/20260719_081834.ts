import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "banderole_slides" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"activite_id" integer,
  	"ordre" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "banderole_slides_id" integer;
  ALTER TABLE "banderole_slides" ADD CONSTRAINT "banderole_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "banderole_slides" ADD CONSTRAINT "banderole_slides_activite_id_activites_id_fk" FOREIGN KEY ("activite_id") REFERENCES "public"."activites"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "banderole_slides_image_idx" ON "banderole_slides" USING btree ("image_id");
  CREATE INDEX "banderole_slides_activite_idx" ON "banderole_slides" USING btree ("activite_id");
  CREATE INDEX "banderole_slides_updated_at_idx" ON "banderole_slides" USING btree ("updated_at");
  CREATE INDEX "banderole_slides_created_at_idx" ON "banderole_slides" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_banderole_slides_fk" FOREIGN KEY ("banderole_slides_id") REFERENCES "public"."banderole_slides"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_banderole_slides_id_idx" ON "payload_locked_documents_rels" USING btree ("banderole_slides_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "banderole_slides" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "banderole_slides" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_banderole_slides_fk";
  
  DROP INDEX "payload_locked_documents_rels_banderole_slides_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "banderole_slides_id";`)
}
