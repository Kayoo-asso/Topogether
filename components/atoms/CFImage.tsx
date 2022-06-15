import { Image as ImageType } from "types";
import { SourceSize, VariantWidths, cloudflareUrl } from "helpers/images";
import {
  forwardRef,
  ImgHTMLAttributes,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import defaultKayoo from "public/assets/img/Kayoo_defaut_image.png";
import type { StaticImageData } from "next/image";
import { useDevice } from "helpers/hooks/useDevice";
import { Portal, setReactRef } from "helpers";
import QuickPinchZoom, { make3dTransformValue } from "react-quick-pinch-zoom";

export type CFImageProps = RawImageAttributes & {
  alt: string;
  image?: ImageType;
  objectFit?: "contain" | "cover";
  sizeHint: SourceSize | { raw: string };
  defaultImage?: StaticImageData;
  modalable?: boolean;
  zoomable?: boolean;
};

type RawImageAttributes = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "srcset" | "width" | "height" | "sizes" | "style" | "fetchpriority"
>;

// TODO: implement priority using a <link> tag + next/head (as next/image does)
export const CFImage = forwardRef<HTMLImageElement, CFImageProps>(
  (
    {
      image,
      sizeHint,
      modalable,
      zoomable = true,
      objectFit = "contain",
      defaultImage = defaultKayoo,
      ...props
    }: CFImageProps,
    parentRef
  ) => {
    const device = useDevice();
    const imgRef = useRef<HTMLImageElement>(null);

    const onPinchZoom = useCallback(
      ({ x, y, scale }) => {
        if (imgRef.current && zoomable) {
          const value = make3dTransformValue({ x, y, scale });
          imgRef.current.style.setProperty("transform", value);
        }
      },
      [imgRef.current]
    );

    const [portalOpen, setPortalOpen] = useState(false);
    const wrapPortal = (elts: ReactElement<any, any>) => {
      if (modalable) {
        return (
          <>
            {elts}
            <Portal open={portalOpen}>
              <div
                className="absolute top-0 left-0 flex z-full w-screen h-screen bg-black bg-opacity-80"
                onClick={() => setPortalOpen(false)}
              >
                {elts}
              </div>
            </Portal>
          </>
        );
      } else return elts;
    };

    let src = defaultImage.src;
    let width = defaultImage.width;
    let height = defaultImage.height;
    let placeholder: string | undefined = defaultImage.blurDataURL;

    let srcSet = undefined;
    let sizes = undefined;
    objectFit = portalOpen ? "contain" : objectFit;

    if (image) {
      const defaultVariant = device === "mobile" ? 640 : 1920; //TODO: optimize by checking size
      const sources = VariantWidths.map(
        (w) => `${cloudflareUrl(image.id, w)} ${w}w`
      );
      width = defaultVariant;
      height = width / image.ratio;
      placeholder = image.placeholder;
      srcSet = sources.join();
      src = cloudflareUrl(image.id, defaultVariant);
      sizes = portalOpen
        ? "100vw"
        : typeof sizeHint === "string"
        ? sizeHint
        : sizeHint.raw;
    }

    return wrapPortal(
      <div
        className="w-full h-full relative overflow-hidden"
        onClick={() => modalable && setPortalOpen(true)}
      >
        <QuickPinchZoom onUpdate={onPinchZoom} draggableUnZoomed={false}>
          <img
            ref={(ref) => {
              setReactRef(imgRef, ref);
              setReactRef(parentRef, ref);
            }}
            src={src}
            width={width}
            height={height}
            srcSet={srcSet}
            sizes={sizes}
            style={{
              objectFit,
              // filter: 'blur(20px)',
              backgroundSize: objectFit,
              backgroundPosition: 'center',
              backgroundImage: `url(${placeholder})`,
              backgroundRepeat: 'no-repeat',
            }}
            {...props}
            className={props.className + " h-full"}
            loading={props.loading ?? "lazy"}
            decoding={props.decoding ?? "async"}
          />
        </QuickPinchZoom>
      </div>
    );
  }
);
