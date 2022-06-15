import { NextApiHandler } from 'next';
import {getPlaiceholder} from 'plaiceholder';

const handler: NextApiHandler = async (req, res) => {
    if (req.method !== "POST") {
        res.status(400);
        res.json({ error: "POST method required" });
        return;
    }
    const buffer = new Buffer(req.body);

    res.status(200);
}