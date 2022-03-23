import { NextApiHandler, NextApiResponse } from "next";
import { v4 as uuid } from "uuid";
import { dropboxUpload } from "helpers";
import { ImageUploadApiResponse, ImageExtension, imageExtension } from "helpers/services/";

const handler: NextApiHandler<ImageUploadApiResponse> = async (req, res) => {
    if (req.method !== "PUT") {
        badRequest(res);
        return;
    }
    const type = req.headers["content-type"];
    if (type === undefined) {
        badRequest(res);
        return;
    }
    const extension = imageExtension(type);
    if (!extension) {
        badRequest(res);
        return;
    }

    const id = uuid();
    let uploadPath = `/${id}.${extension}`;
    const actualPath = await dropboxUpload(uploadPath, req.body);
    res.status(200);
    res.json({
        id,
        path: actualPath 
    });
}

function badRequest(res: NextApiResponse) {
    res.status(400);
    res.setHeader("Accept", ["image/jpeg", "image/jpg", "image/png", "image/webp"])
}

export default handler; 

export const config = {
    api: {
        // consume the body as a stream
        bodyParser: false
    }
}