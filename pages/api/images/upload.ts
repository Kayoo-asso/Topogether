import { NextApiHandler, NextApiRequest, NextApiResponse, NextConfig } from "next";
import { v4 as uuid } from "uuid";
import { ImageUploadApiResponse } from "helpers/services/";
import formidable from "formidable";
import FormData from "form-data";
import busboy from "busboy";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken = process.env.CLOUDFLARE_API_TOKEN;

const form = formidable();

function parseMultipartForm(req: NextApiRequest) {
    return new Promise((resolve) => {
        const fields: any = {}
 
        const bb =busboy({
            headers: req.headers,
        })

        bb.on('file', (fieldname, filestream, info) => {
            const { filename, encoding, mimeType } = info;
            filestream.on('data', (data) => {
                fields[fieldname] = {
                    content: data,
                    filename,
                    type: mimeType,
                }
            })
        })

        bb.on('field', (fieldName, value) => {
            fields[fieldName] = value
        })

        bb.on('finish', () => {
            resolve(fields)
        })

        // This was the bastard!
        req.pipe(bb);
    })
}

const handler: NextApiHandler<ImageUploadApiResponse> = async (req, res) => {
    if (req.method !== "POST") {
        badRequest(res);
        return;
    }
    const contentType = req.headers['content-type'];
    const contentLength = req.headers['content-length'];
    if (!contentLength || !contentType || !contentType.startsWith('multipart/form-data')) {
        badRequest(res);
        return;
    }
    const data = new FormData();
    data.append()
    const bb = busboy({ headers: req.headers });
    bb.on('file', (name, file, info) => {
        const { filename, encoding, mimeType } = info;
        console.log(
            `File [${name}]: filename: %j, encoding: %j, mimeType: %j`,
            filename,
            encoding,
            mimeType
        );
    });
    req.pipe(bb);

    res.status(400);
    res.json({});

    console.log("Account ID:", accountId);
    console.log("API token:", apiToken);
    console.log("Request raw headers:", req.rawHeaders);
    console.log("Content-Type header:", contentType);
    const uploadRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`, {
        method: "POST",
        headers: {
            "authorization": `Bearer ${apiToken}`,
            "content-length": contentLength,
            "content-type": contentType,
            "enc"
        },
        body: req.body
    });

    // console.log("Upload response:", await uploadRes.text());
    // console.log("Headers:", Array.from(uploadRes.headers.entries()));
    // if (uploadRes.ok) {
    //     res.status(200);
    //     res.json({
    //         id: uuid(),
    //         path: ""
    //     });
    // } else {
    //     res.status(uploadRes.status);
    //     res.json(await uploadRes.json());
    // }

}

function badRequest(res: NextApiResponse) {
    res.status(400);
    res.setHeader("Accept", ["image/jpeg", "image/jpg", "image/png", "image/webp"])
}

export default handler;

export const config = {
    api: {
        bodyParser: false,
    },

}