import { NextApiHandler } from "next";
import { getPlaiceholder } from "plaiceholder";
import type { ImageHolder } from "helpers/services";

const BLUR_SIZE = 16;


const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    res.status(400);
    res.json({ error: "POST method required" });
    return;
  }
  const { src, holder } = req.body;
  const { base64 } = await getPlaiceholder(src, { size: BLUR_SIZE })
  console.log("Obtained base64 placeholder for url " + src + ":", base64);

  res.status(200);
  res.json({});
};


export default handler;
