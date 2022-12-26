/* === A quickly hacked image upload service for Topogether, running on Fly === */
// Mostly intended to avoid the payload limitations of Serverless / Edge functions on Vercel and other platforms
import connect from "connect";
import http from "http";
import sharp from "sharp";
import { PassThrough, Readable } from "stream";
import dotenv from "dotenv";

dotenv.config();

const app = connect();
const isProd = process.env.NODE_ENV === "production";

const token = process.env.BUNNY_API_TOKEN!;
if (!token) throw new Error("Undefined Bunny CDN API token");
const storageZone = "topogether-images";
const placeholderSize = 64;
const port = process.env.PORT || 5043;

app.use(async function (req, res, next) {
	res.setHeader(
		"Access-Control-Allow-Origin",
		// TODO: change later
		"*"
		// isProd ? "https://topogether.com" : "http://localhost:3000"
	);
	res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Content-Type, Origin, Accept, Authorization, x-image-id, x-image-dev"
	);
	next();
});

app.use("/images/upload", async function (req, res) {
	if (req.method === "OPTIONS") {
		res.writeHead(200);
		res.end();
		return;
	}

	const id = req.headers["x-image-id"];
	const isDev = req.headers["x-image-dev"];
	if (req.method !== "PUT" || !id) {
		res.writeHead(400);
		res.write("Invalid HTTP method");
		res.end();
		return;
	}
	// Store images uploaded during dev into a separate folder, for easy cleanup
	const path = !!isDev ? "dev" : "";

	const uploadStream = req.pipe(new PassThrough());
	const blurStream = req.pipe(new PassThrough());

	// Start uploading ASAP
	const upload = fetch(
		`https://storage.bunnycdn.com/${storageZone}/${path}/${id}.jpg`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/octet-stream",
				AccessKey: token,
			},
			body: uploadStream as any,
		}
	);

	const placeholderPromise = toBuffer(blurStream).then((buffer) => {
		// Pipeline adapted from `plaiceholder`
		// https://github.com/joe-bell/plaiceholder/blob/main/packages/plaiceholder/src/get-image.ts#L157-L162
		return (
			sharp(buffer)
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
				)
		);
	});

	const [placeholder, uploadRes] = await Promise.all([
		placeholderPromise,
		upload,
	]);

	if (!uploadRes.ok) {
		console.error("Upload failed:", await uploadRes.text());
		res.writeHead(uploadRes.status, uploadRes.statusText);
		res.end();
	} else {
		res.writeHead(200, { "Content-Type": "application/json" });
		res.write(JSON.stringify({ placeholder }));
		res.end();
	}
});

function toBuffer(stream: Readable): Promise<Buffer> {
	return new Promise<Buffer>((resolve, reject) => {
		const parts: Uint8Array[] = [];
		stream.on("data", (chunk) => parts.push(chunk));
		stream.on("end", () => {
			var buffer = Buffer.concat(parts);
			resolve(buffer);
		});
		stream.on("error", reject);
	});
}

http.createServer(app).listen(port);
