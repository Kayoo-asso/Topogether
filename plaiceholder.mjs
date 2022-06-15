import { getPlaiceholder } from "plaiceholder";

const cloudflareUrl = (imageId, width) =>
    `https://imagedelivery.net/9m8hQCHM9NXY8VKZ1mHt-A/${imageId}/${width}w`;

const images = [ {
        id: "08f005e1-d68d-439c-74c8-129393e10b00",
        ratio: 4592/3064
    },
    {
        id: "10412040-08fd-4458-03d0-e05d5a841600",
        ratio: 1920/2878
    },
    {
        id: "1197c296-0ba4-4274-f559-14978c338100",
        ratio: 1334/2000
    },
]

const size = 16;
for (const img of images) {
    const url = cloudflareUrl(img.id, 2048);
    
    const { base64 } = await getPlaiceholder(url, { size });
    console.log(`Base64 for ${img.id}: ${base64}`);
}