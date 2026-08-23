import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
}
