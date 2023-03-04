import { setReactRef } from "helpers/utils";
import type { StaticImageData } from "next/image";
import {
	ImgHTMLAttributes,
	useRef,
	useState,
	useCallback,
	ReactElement,
} from "react";
import type { Img } from "types";

import defaultKayoo from "public/assets/img/Kayoo_defaut_image.png";
import { SourceSize, VariantWidths, bunnyUrl } from "helpers/sharedWithServiceWorker";
import { useBreakpoint } from "helpers/hooks/DeviceProvider";
import { Portal } from "helpers/hooks/useModal";

export type ImageProps = RawImageAttributes & {
	alt: string;
	image?: Img;
	objectFit?: "contain" | "cover";
	sizeHint: SourceSize | { raw: string };
	defaultImage?: StaticImageData;
	modalable?: boolean;
	onImageClick?: () => void;
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

	const cssCursor = modalable && image
				? portalOpen
					? " cursor-zoom-out"
					: " cursor-zoom-in"
				: props.onImageClick ? " md:cursor-pointer" : "";

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
			className={`h-full ${cssCursor} ${objectFitClass} ${props.className || ""}`}
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
