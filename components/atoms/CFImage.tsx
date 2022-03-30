import { Image } from "types"
import { SourceSize, VariantWidths } from "helpers/variants";
import { cloudflareUrl } from "helpers/cloudflareUrl";
import { CSSProperties, DetailedHTMLProps, ImgHTMLAttributes } from "react";
import defaultKayoo from 'public/assets/img/Kayoo_defaut_image.png';
import NextImage, { StaticImageData } from 'next/image';
import { useDevice } from "helpers/hooks/useDevice";


export type CFImageProps = RawImageAttributes & {
    alt: string,
    style?: Omit<CSSProperties, 'objectFit'>,
    image?: Image,
    sizeHint: SourceSize | { raw: string },
    defaultImage?: StaticImageData,
};

type RawImageAttributes = Omit<
    DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
    'src' | 'srcset' | 'width' | 'height' | 'sizes' | 'style'
>

export const CFImage: React.FC<CFImageProps> = ({ 
    image, sizeHint, style,
    defaultImage = defaultKayoo,
    ...props }: CFImageProps) => {
    const device = useDevice()
    if (image) {
        const defaultVariant = device === "mobile"
            ? 640
            : 1920; //TODO: optimize by checking size
        const sources = VariantWidths.map(w => `${cloudflareUrl(image, w)} ${w}w`)
        // note: check that width and height are not actual constraints,
        // only aspect ratio information
        const width = defaultVariant;
        const height = width / image.ratio;
        const srcSet = sources.join();
        const src = cloudflareUrl(image, defaultVariant);
        const sizes = typeof sizeHint === "string"
            ? sizeHint
            : sizeHint.raw;
        return <img src={src} width={width} height={height} srcSet={srcSet} style={style} sizes={sizes} {...props} />;
    }

    return <NextImage src={defaultImage} className={props.className} alt={props.alt} />

}
