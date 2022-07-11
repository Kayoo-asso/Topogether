import { NextApiHandler } from "next";
import FormData from "form-data";
import { UUID } from "types";
import { UploadCountHeader, UploadInfo } from "helpers/services";

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

type UploadUrlResult = {
	result: {
		id: UUID;
		uploadURL: string;
	};
	result_info: string | null;
	success: boolean;
	errors: any[];
	messages: any[];
};

const handler: NextApiHandler = async (req, res) => {
	if (req.method !== "POST") {
		res.status(400);
		res.json({ error: "POST method required" });
		return;
	}
	const uploadCountHeader = req.headers[UploadCountHeader];
	if (typeof uploadCountHeader !== "string") {
		res.status(400);
		res.json({ error: "No upload count provided" });
		return;
	}
	const uploadCount: number = Number.parseInt(uploadCountHeader);

	const promises: Promise<UploadUrlResult>[] = [];
	for (let i = 0; i < uploadCount; ++i) {
		const data = new FormData();
		data.append("requireSignedURLs", "false");
		promises.push(
			fetch(
				`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v2/direct_upload`,
				{
					method: "POST",
					headers: {
						...data.getHeaders(),
						authorization: "Bearer " + API_TOKEN,
					},
					body: data as any,
				}
			).then((x) => x.json())
		);
	}
	const results = await Promise.allSettled(promises);

	const uploads: UploadInfo[] = [];
	for (const uploadResult of results) {
		if (uploadResult.status === "rejected" || !uploadResult.value.success) {
			console.error(
				"Failed to get upload URL:",
				(uploadResult as any).reason || (uploadResult as any).value.errors
			);
			res.status(400);
			res.json({ error: "Failed to retrieve all upload URLs from Cloudflare" });
			return;
		}
		uploads.push(uploadResult.value.result);
	}
	res.status(200);
	res.json({ uploads });
};

export default handler;
