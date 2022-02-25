import { NextApiHandler } from "next";
import type { Image, UUID } from "types";
import { v4 as uuid } from "uuid";
import { dropboxUpload } from "helpers";


const handler: NextApiHandler<{ id: UUID, url: string } | null> = async (req, res) => {
    const id = uuid();
    const type = req.query.type;
    let fileExt: string;
    if (type === "jpg" || type === "jpeg" || type === "png") {
        fileExt = type;
        const path = await dropboxUpload(id + '.' + fileExt, req.body);
        res.status(200);
        res.json({
            id,
            url: path // TODO: add the base path to Flavien's dropbox
        });
    } else {
        res.status(500);
        res.json(null);
        return;
    }
}

export default handler; 

export const config = {
    api: {
        // consume the body as a stream
        bodyParser: false
    }
}