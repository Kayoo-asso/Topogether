import { setReactRef } from "helpers/utils";
import type { StaticImageData } from "next/image";
import {
	ImgHTMLAttributes,
	useRef,
	useState,
	useCallback,
	ReactElement,
} from "react";
import { useBreakpoint, Portal } from "helpers/hooks";
import type { Img, UUID } from "types";

import defaultKayoo from "public/assets/img/Kayoo_defaut_image.png";

export type ImageProps = RawImageAttributes & {
	alt: string;
	image?: Img;
	objectFit?: "contain" | "cover";
	sizeHint: SourceSize | { raw: string };
	defaultImage?: StaticImageData;
	modalable?: boolean;
};

type RawImageAttributes = Omit<
	ImgHTMLAttributes<HTMLImageElement>,
	"src" | "srcset" | "width" | "height" | "sizes" | "style" | "fetchpriority"
>;

// TODO: implement priority using a <link> tag + next/head (as next/image does)
export const Image = ({
	objectFit = "contain",
	image,
	sizeHint,
	modalable,
	defaultImage = defaultKayoo,
	...props
}: ImageProps) => {
	const device = useBreakpoint();
	const imgRef = useRef<HTMLImageElement>(null);

	const [portalOpen, setPortalOpen] = useState(false);
	const wrapPortal = (elts: ReactElement<any, any>) => {
		if (modalable)
			return (
				<>
					{elts}
					<Portal open={portalOpen}>
						<div
							className="absolute top-0 left-0 z-full flex h-screen w-screen overflow-hidden bg-black bg-opacity-80"
							onClick={() => setPortalOpen(false)}
						>
							{elts}
						</div>
					</Portal>
				</>
			);
		return <>{elts}</>;
	};

	let src = defaultImage.src;
	let width = defaultImage.width;
	let height = defaultImage.height;
	let placeholder = defaultImage.blurDataURL;
	let srcSet = undefined;
	let sizes = undefined;

	if (portalOpen) objectFit = "contain";
	const objectFitClass =
		objectFit === "contain" ? " object-contain " : " object-cover ";

	if (image) {
		const defaultVariant = device === "mobile" ? 640 : 1920; //TODO: optimize by checking size
		const sources = VariantWidths.map((w) => `${bunnyUrl(image.id, w)} ${w}w`);
		// width and height are not actual constraints, only aspect ratio information
		width = defaultVariant;
		height = width / image.ratio;
		srcSet = sources.join();
		src = bunnyUrl(image.id, defaultVariant);
		sizes = portalOpen
			? "100vw"
			: typeof sizeHint === "string"
			? sizeHint
			: sizeHint.raw;
		placeholder = image.placeholder;
	}

	return wrapPortal(
		<img
			key={image?.id}
			ref={useCallback((ref) => {
				// In case the image has loaded before the onLoad handler was registered
				if (ref?.complete) {
					clearPlaceholder(ref);
				}
				setReactRef(imgRef, ref);
			}, [])}
			{...props}
			src={src}
			width={width}
			height={height}
			srcSet={srcSet}
			sizes={sizes}
			className={`h-full ${objectFitClass} ${props.className || ""}`}
			loading={props.loading || "lazy"}
			decoding={props.decoding || "async"}
			// Add the placeholder as background image
			style={
				placeholder
					? {
							filter: "blur(20px)",
							backgroundSize: objectFit,
							backgroundPosition: "center",
							backgroundImage: `url(${placeholder})`,
							backgroundRepeat: "no-repeat",
					  }
					: {}
			}
			onClick={(e) => {
				if (modalable && image) setPortalOpen(true);
				if (props.onClick) props.onClick(e);
			}}
			onLoad={(e) => {
				clearPlaceholder(e.target as HTMLImageElement);
				if (props.onLoad) props.onLoad(e);
			}}
			onError={(e) => {
				// also clear the placeholder on error
				clearPlaceholder(e.target as HTMLImageElement);
				if (props.onError) props.onError(e);
			}}
		/>
	);
};

function clearPlaceholder(img: HTMLImageElement) {
	img.style.filter = null as any;
	img.style.backgroundSize = null as any;
	img.style.backgroundPosition = null as any;
	img.style.backgroundImage = null as any;
	img.style.backgroundRepeat = null as any;
}

// --- Cloudflare Images ---

const VariantWidths = [
	16, 32, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840,
] as const;
type VariantWidth = typeof VariantWidths[number];

type VW<W extends number> = `${W}vw`;
type PX<W extends number> = `${W}px`;
type ViewportWidth = VW<number>;
type PixelWidth = PX<number>;

export type SourceSize = ViewportWidth | PixelWidth;

// All images have a `.jpg` suffix added to let Bunny CDN recognize they are images
// (even if they are originally a PNG)
export const bunnyUrl = (imageId: UUID, width: VariantWidth): string =>
	`https://topogether.b-cdn.net/${imageId}.jpg?width=${width}`;
