import { NextApiHandler } from "next";
import sharp from "sharp";
import { PassThrough, Readable } from "stream";

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

const handler: NextApiHandler = async (req, res) => {
	const token = process.env.BUNNY_API_TOKEN;
	const id = req.headers["x-image-id"];
	const storageZone = "topogether-images";
	// Store images uploaded during dev into a separate folder, for easy cleanup
	const path = process.env.NODE_ENV === "production" ? "" : "dev";

	console.log("token", token);
	console.log("ID:", id);
	console.log("Headers:", req.headers);

	const uploadStream = req.pipe(new PassThrough());
	const blurStream = req.pipe(new PassThrough());

	// Setup this one first, so that we attach the listeners to get the buffer
	// before sending the upload request
	const placeholderPromise = toBuffer(blurStream).then((buffer) => {
		const placeholderSize = 64;
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

	const upload = fetch(
		`https://storage.bunnycdn.com/${storageZone}/${path}/${id}`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/octet-stream",
				AccessKey: token!,
			},
			body: uploadStream as any,
		}
	);

	const [placeholder, uploadRes] = await Promise.all([
		placeholderPromise,
		upload,
	]);

	if (!uploadRes.ok) {
		res.status(uploadRes.status);
		res.end();
	} else {
		res.status(200);
		res.json({
			placeholder,
		});
		res.end();
	}
};

export default handler;

export const config = {
	api: {
		bodyParser: false,
	},
};
