import { Image } from "types"
import { SourceSize, VariantWidths } from "helpers/variants";
import { cloudflareUrl } from "helpers/cloudflareUrl";
import { ImgHTMLAttributes, useEffect, useRef, useState } from "react";
import defaultKayoo from 'public/assets/img/Kayoo_defaut_image.png';
import type { StaticImageData } from 'next/image';
import { useDevice } from "helpers/hooks/useDevice";
import { Loading } from "components/layouts";

export type CFImageProps = RawImageAttributes & {
    alt: string,
    image?: Image,
    forceLoading?: boolean,
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
    ...props 
}: CFImageProps) => {
    const device = useDevice();
    const imgRef = useRef<HTMLImageElement>(null);
    const [loading, setLoading] = useState(true);
    const { forceLoading, ...imgProps } = props;
    
    // useLayoutEffect to avoid a "flickering" loading indicator
    useEffect(() => {
        //If the image is already in the page because it's in cache, onLoad does not trigger
        //So we verify if the image already exists through its naturalHeight
        if (imgRef.current?.naturalHeight !== 0) {
            setLoading(false);
        }
    }, [imgRef.current]);
    
    const currentImage = useRef(image?.id);
    useEffect(() => {
        // this check prevents setting `loading` to true in case the image loads too fast
        if (currentImage.current !== image?.id) {
            setLoading(true);
        }
    }, [image?.id])

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
        
    return (
        <div className='w-full h-full relative'>
            {(loading || forceLoading) &&
                <div className='bg-white absolute w-full h-full top-0 z-1000'>
                    <Loading 
                        bgWhite={false} 
                        SVGClassName='w-12 h-12'
                    />
                </div>
            }
            <img
                ref={imgRef}
                src={src}
                width={width}
                height={height}
                srcSet={srcSet}
                sizes={sizes}
                {...imgProps}
                loading={props.loading ?? 'lazy'}
                decoding={props.decoding ?? 'async'}
                onLoad={() => {
                    setLoading(false);
                    currentImage.current = image?.id;
                }}
            />
        </div>
    )
}
