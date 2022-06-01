import { Image } from "types";
import { SourceSize, VariantWidths } from "helpers/variants";
import { cloudflareUrl } from "helpers/cloudflareUrl";
import { ImgHTMLAttributes, ReactElement, useEffect, useRef, useState } from "react";
import defaultKayoo from 'public/assets/img/Kayoo_defaut_image.png';
import type { StaticImageData } from 'next/image';
import { useDevice } from "helpers/hooks/useDevice";
import { Loading } from "components/layouts";
import { Portal } from "helpers";

export type CFImageProps = RawImageAttributes & {
    alt: string,
    image?: Image,
    objectFit?: 'contain' | 'cover',
    forceLoading?: boolean,
    sizeHint: SourceSize | { raw: string },
    defaultImage?: StaticImageData,
    modalable?: boolean,
};

type RawImageAttributes = Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    'src' | 'srcset' | 'width' | 'height' | 'sizes' | 'style' | 'fetchpriority'
>

// TODO: implement priority using a <link> tag + next/head (as next/image does)
export const CFImage: React.FC<CFImageProps> = ({ 
    image, 
    sizeHint,
    modalable,
    objectFit = 'contain',
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
    }, [image?.id]);

    const [portalOpen, setPortalOpen] = useState(false);
    const wrapPortal = (elts: ReactElement<any, any>) => {
        if (modalable) {
            return (
                <>
                    {elts}
                    <Portal open={portalOpen}>
                        <div className="absolute top-0 left-0 flex z-full w-screen h-screen bg-black bg-opacity-80" onClick={() => setPortalOpen(false)}>
                            {elts}
                        </div>
                    </Portal>
                </>
        )}
        else return elts;
    }

    let src = defaultImage.src;
    let width = defaultImage.width;
    let height = defaultImage.height;
    let placeholder = defaultImage.blurDataURL;
    let srcSet = undefined;
    let sizes = undefined;
    const objectFitClass = ((portalOpen || objectFit === 'contain') ? ' object-contain ' : ' object-cover ');

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
        sizes = portalOpen ? '100vw'
        : typeof sizeHint === "string"
            ? sizeHint
            : sizeHint.raw;
        // no placeholder
        placeholder = undefined;
    }
        
    return (
        wrapPortal(
            <div 
                className={'w-full h-full relative overflow-hidden ' 
                    + ((modalable && !loading && !forceLoading) ? 'cursor-pointer ' : '')
                    + (props.className || '')         
                }
                onClick={() => (modalable && !loading && !forceLoading) && setPortalOpen(true)}
            >
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
                    className={props.className + ' h-full ' + objectFitClass}
                    loading={props.loading ?? 'lazy'}
                    decoding={props.decoding ?? 'async'}
                    onLoad={() => {
                        setLoading(false);
                        currentImage.current = image?.id;
                    }}
                />
            </div>
        )
    )
}
