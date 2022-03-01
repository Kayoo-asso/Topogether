import { NextApiHandler } from "next";
import type { BoulderImage, ImageType, UUID } from "types";
import { v4 as uuid } from "uuid";
import { dropboxUpload } from "helpers";

const handler: NextApiHandler<{ id: UUID, url: string } | null> = async (req, res) => {
    if (req.method !== "PUT") {
        res.status(400);
        res.setHeader("")
    }
    const id = uuid();
    const type = req.query.type as ImageType;
    let uploadPath: string;
    switch (type) {
        case "jpg":
            uploadPath = id + ".jpg";
            break;
        case "png":
            uploadPath = id + ".png";
            break;
        default:
            // throw error, so Vercel keeps the logs
            throw new Error("Invalid image type. Supported types: \".jpg\", \".png\"");
    }
    const actualPath = await dropboxUpload(uploadPath, req.body);
    res.status(200);
    res.json({
        id,
        url: actualPath // TODO: add the base path to Flavien's dropbox + modifier to get the raw file
    });
}

export default handler; 

export const config = {
    api: {
        // consume the body as a stream
        bodyParser: false
    }
}