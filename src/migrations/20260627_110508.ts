import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_communiques_type" AS ENUM('document', 'lien-externe');
  CREATE TABLE "communiques" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titre" varchar NOT NULL,
  	"slug" varchar,
  	"description_courte" varchar NOT NULL,
  	"type" "enum_communiques_type" DEFAULT 'document' NOT NULL,
  	"document_id" integer,
  	"lien_externe" varchar,
  	"image_id" integer,
  	"date_publication" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "communiques_id" integer;
  ALTER TABLE "communiques" ADD CONSTRAINT "communiques_document_id_media_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "communiques" ADD CONSTRAINT "communiques_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "communiques_slug_idx" ON "communiques" USING btree ("slug");
  CREATE INDEX "communiques_document_idx" ON "communiques" USING btree ("document_id");
  CREATE INDEX "communiques_image_idx" ON "communiques" USING btree ("image_id");
  CREATE INDEX "communiques_updated_at_idx" ON "communiques" USING btree ("updated_at");
  CREATE INDEX "communiques_created_at_idx" ON "communiques" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_communiques_fk" FOREIGN KEY ("communiques_id") REFERENCES "public"."communiques"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_communiques_id_idx" ON "payload_locked_documents_rels" USING btree ("communiques_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "communiques" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "communiques" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_communiques_fk";
  
  DROP INDEX "payload_locked_documents_rels_communiques_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "communiques_id";
  DROP TYPE "public"."enum_communiques_type";`)
}
