import {
	Kysely,
	Migration,
	MigrationProvider,
	Migrator,
	PostgresDialect,
	sql,
} from "kysely";
import fs from "fs";
import { db } from "api/db";

// Adapted from kysely's default FileMigrationProvider
export class SQLMigrationProvider implements MigrationProvider {
	readonly #directory: string;

	constructor(folder: string) {
		this.#directory = folder;
	}

	async getMigrations(): Promise<Record<string, Migration>> {
		const migrations: Record<string, Migration> = {};
		const files = fs.readdirSync(this.#directory);
		for (const filename of files) {
			if (filename.endsWith(".sql")) {
				const bytes = fs.readFileSync(this.#directory + "/" + filename);
				const migrationKey = filename.substring(0, filename.lastIndexOf("."));
				const contents = bytes.toString();
				const query = sql.raw(contents);
				migrations[migrationKey] = {
					up(db) {
						// The empty `then` is just here to ensure a `void` return type
						return query.execute(db).then();
					},
					down() {
						return Promise.resolve();
					},
				};
			}
		}
		return migrations;
	}
}

// Adapted from: https://github.com/koskimas/kysely/tree/master#migrations
async function migrateToLatest() {
	const folder = __dirname + "/migrations";

	const migrator = new Migrator({
		db,
		provider: new SQLMigrationProvider(folder),
	});

	const { error, results } = await migrator.migrateToLatest();

	results?.forEach((it) => {
		if (it.status === "Success") {
			console.log(`migration "${it.migrationName}" was executed successfully`);
		} else if (it.status === "Error") {
			console.error(`failed to execute migration "${it.migrationName}"`);
		}
	});

	if (error) {
		console.error("failed to migrate");
		console.error(error);
		process.exit(1);
	}

	await db.destroy();
}

migrateToLatest();
