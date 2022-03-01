import { dropboxDelete } from "helpers";
import { NextApiHandler } from "next";

const handler: NextApiHandler<void> = async (req, res) => {
    if (req.method !== 'DELETE') {
        res.status(400);
    }
    const { path } = req.body as { path: string };
    // let this method throw an Error to get a Vercel log for now
    await dropboxDelete(path);
}