import { BoulderImage } from "types"
import { v4 } from "uuid";

export const blobToImage = async (blob: Blob): Promise<BoulderImage> => {
    return new Promise((resolve, reject) => {
        const imgElt = document.createElement('img');
        const url = URL.createObjectURL(blob);
        imgElt.src = url;
        imgElt.onload = () => resolve({
            id: v4(),
            url: url,
            width: imgElt.width,
            height: imgElt.height,
        });
        imgElt.onerror = reject
    });
}