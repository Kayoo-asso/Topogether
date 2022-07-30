import postgres from "postgres";
import dotenv from "dotenv";
import sharp from "sharp";
import type { UUID } from "types";

type Image = {
	id: UUID;
	ratio: number;
};

class Semaphore {
	private counter: number = 0;
	private max: number;
	private waiting: (() => void)[] = [];
	released: number = 0;

	constructor(max: number) {
		this.max = max;
	}

	async acquire(): Promise<void> {
		if (this.counter < this.max) {
			this.counter += 1;
			return Promise.resolve();
		} else {
			return new Promise<void>((resolve) => {
				this.waiting.push(resolve);
			});
		}
	}

	release() {
		this.counter -= 1;
		this.released += 1;
		const next = this.waiting.shift();
		if (next) next();
	}

	clear() {
		// TODO: trigger errors in waiting promises
		this.released = 0;
	}
}

dotenv.config({ path: ".env.development" });
const SUPABASE_PASSWORD = process.env.SUPABASE_PASSWORD;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const BUNNY_API_TOKEN = process.env.BUNNY_API_TOKEN;

const lock = new Semaphore(20);

async function run() {
	const sql = postgres({
		db: "postgres",
		user: "postgres",
		password: SUPABASE_PASSWORD,
		hostname: "db.viqtyrnkrehvkperouqf.supabase.co",
		port: 5432,
	});

	const existing: Array<Image> = (await sql`
		select * 
		from public.images
		where placeholder is null;
	`) as any;

	const promises: Array<Promise<void>> = [];
	for (let i = 0; i < existing.length; i++) {
		promises.push(transfer(sql, existing[i].id));
	}
	await Promise.all(promises);
	process.exit(0);
}

async function transfer(sql: postgres.Sql<{}>, imageId: string) {
	try {
		await lock.acquire();
		const req = await fetch(
			`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1/${imageId}/blob`,
			{
				headers: {
					Authorization: `BEARER ${CLOUDFLARE_API_TOKEN}`,
				},
			}
		);
		if (!req.ok) {
			// console.log("Error getting image:", await req.text());
			console.log(
				`Transfer process failed for image ${imageId} (error getting image)`
			);
			console.log(`[${imageId}] ${req.statusText}`)
			return;
		}
		// Not gonna do fancy stream tricks today
		const blob = await req.blob();

		const upload = await fetch(
			`https://storage.bunnycdn.com/topogether-images//${imageId}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/octet-stream",
					AccessKey: BUNNY_API_TOKEN!,
				},
				body: blob,
			}
		);

		if (!upload.ok) {
			console.log(
				`Transfer process failed for image ${imageId} (error uploading)`
			);
			console.log(`[${imageId}] ${upload.statusText}`)
			return;
		}

		const buffer = Buffer.from(await blob.arrayBuffer());
		// Taken from /api/images/upload
		const placeholderSize = 64;
		const placeholder = await sharp(buffer)
			// Rotate to match EXIF metadata if needed
			.rotate()
			.resize(placeholderSize, placeholderSize, { fit: "inside" })
			.normalize()
			.modulate({ saturation: 1.2, brightness: 1 })
			.removeAlpha()
			.toBuffer({ resolveWithObject: true })
			.then(
				({ data, info }) =>
					`data:image/${info.format};base64,${data.toString("base64")}`
			);

		try {
			await sql`
					update public.images
					set placeholder = ${placeholder}
					where id = ${imageId}
				`;
		} catch (err) {
			console.log(
				`Transfer process failed for image ${imageId} (error updating placeholder)`
			);
			console.log(`[${imageId}] ${err}`)
		}
	} catch (err) {
		console.log(
			`Transfer process failed for image ${imageId} (async / fetch error)`
		);
		console.log(`[${imageId}] ${err}`)
	}
	finally {
		lock.release()
	}
}


run();
