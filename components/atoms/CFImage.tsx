import { Image } from "types"
import { SourceSize, VariantWidths } from "helpers/variants";
import { cloudflareUrl } from "helpers/cloudflareUrl";
import { CSSProperties, ImgHTMLAttributes } from "react";
import defaultKayoo from 'public/assets/img/Kayoo_defaut_image.png';
import type { StaticImageData } from 'next/image';
import { useDevice } from "helpers/hooks/useDevice";

export type CFImageProps = RawImageAttributes & {
    alt: string,
    style?: Omit<CSSProperties, 'objectFit'>,
    image?: Image,
    sizeHint: SourceSize | { raw: string },
    defaultImage?: StaticImageData,
};

type RawImageAttributes = Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    'src' | 'srcset' | 'width' | 'height' | 'sizes' | 'style' | 'fetchpriority'
>

// TODO: implement priority using a <link> tag + next/head (as next/image does)
export const CFImage: React.FC<CFImageProps> = ({ 
    image, sizeHint,
    defaultImage = defaultKayoo,
    ...props }: CFImageProps) => {
    
    const device = useDevice();

    let src = defaultImage.src;
    let width = defaultImage.width;
    let height = defaultImage.height;
    let placeholder = defaultImage.blurDataURL;
    let srcSet = undefined;
    let sizes = undefined;

    if (image) {
        const defaultVariant = device === "mobile"
            ? 640
            : 1920; //TODO: optimize by checking size
        const sources = VariantWidths.map(w => `${cloudflareUrl(image, w)} ${w}w`)
        // note: check that width and height are not actual constraints,
        // only aspect ratio information
        width = defaultVariant;
        height = width / image.ratio;
        srcSet = sources.join();
        src = cloudflareUrl(image, defaultVariant);
        sizes = typeof sizeHint === "string"
            ? sizeHint
            : sizeHint.raw;
        // no placeholder
        placeholder = undefined;
    }
        
    return <img
        src={src}
        width={width}
        height={height}
        srcSet={srcSet}
        sizes={sizes}
        {...props}
        loading={props.loading ?? 'lazy'}
        decoding={props.decoding ?? 'async'}
    />;
}
