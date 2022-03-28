import { Image } from "types"
import { SourceSize, VariantWidth, VariantWidths } from "helpers/variants";
import { cloudflareUrl } from "helpers/cloudflareUrl";
import { CSSProperties, DetailedHTMLProps, ImgHTMLAttributes } from "react";
import defaultKayoo from 'public/assets/img/Kayoo_defaut_image.png';
import NextImage from 'next/image';


export type CFImageProps = RawImageAttributes & {
    alt: string,
    style?: Omit<CSSProperties, 'objectFit'>,
    image?: Image,
    defaultVariant: VariantWidth,
    objectFit: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down',
    size: SourceSize | { raw: string }
};



type RawImageAttributes = Omit<
    DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
    'src' | 'srcset' | 'width' | 'height' | 'sizes' | 'style'
>

export const CFImage: React.FC<CFImageProps> = ({ image, defaultVariant, objectFit, size, style, ...props }) => {
    const styles: CSSProperties = {
        ...style,
        objectFit,
    };
    if (image) {
        const sources = VariantWidths.map(w => `${cloudflareUrl(image, w)} ${w}w`)
        const width = defaultVariant;
        const height = width / image.ratio;
        const srcSet = sources.join();
        const src = cloudflareUrl(image, defaultVariant);
        const sizes = typeof size === "string"
            ? size
            : size.raw;
        return <img src={src} width={width} height={height} srcSet={srcSet} style={styles} sizes={sizes} {...props} />;
    }

    return <NextImage src={defaultKayoo} objectFit={objectFit} alt={props.alt} />

}
