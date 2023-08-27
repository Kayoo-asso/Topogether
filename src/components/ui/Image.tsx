import type { StaticImageData } from "next/image";
import {
	ImgHTMLAttributes,
	ReactElement,
	useCallback,
	useRef,
	useState,
} from "react";
import type { Img } from "~/types";
import { useBreakpoint } from "~/components/providers/DeviceProvider";
import { Portal } from "~/components/ui/Modal";
import {
	SourceSize,
	VariantWidths,
	bunnyUrl,
} from "~/helpers/sharedWithServiceWorker";
import { setReactRef } from "~/utils";

import defaultKayoo from "public/assets/img/Kayoo_defaut_image.png";

export type ImageProps = RawImageAttributes & {
	alt: string;
	image?: Img | null;
	objectFit?: "contain" | "cover";
	sizeHint: SourceSize | { raw: string };
	defaultImage?: StaticImageData;
	onImageClick?: () => void;
};

type RawImageAttributes = Omit<
	ImgHTMLAttributes<HTMLImageElement>,
	"src" | "srcset" | "width" | "height" | "sizes" | "style" | "fetchpriority"
>;


export function ModalableImage({ objectFit, sizeHint, ...commonProps }: ImageProps) {
	const [portalOpen, setPortalOpen] = useState(false);
	const cssCursor = portalOpen ? " cursor-zoom-out" : " cursor-zoom-in";

	return (
		<>
			<Image 
				objectFit={objectFit} 
				sizeHint={sizeHint} 
				className={cssCursor}
				onClick={(e) => {
					if (commonProps.image) setPortalOpen(true);
					if (commonProps.onClick) commonProps.onClick(e);
				}}
				{...commonProps} 
			/>
			{portalOpen && (
				<Portal open={portalOpen}>
					<div
						className="absolute left-0 top-0 z-full flex h-screen w-screen overflow-hidden bg-black bg-opacity-80"
						onClick={() => setPortalOpen(false)}
					>
						<Image 
							sizeHint="100vw" 
							className={cssCursor}
							onClick={(e) => {
								if (commonProps.image) setPortalOpen(true);
								if (commonProps.onClick) commonProps.onClick(e);
							}}
							{...commonProps} 
						/>
					</div>
				</Portal>
			)}
		</>
	);
}

// TODO: implement priority using a <link> tag + next/head (as next/image does)
export const Image = ({
	objectFit = "contain",
	image,
	sizeHint,
	defaultImage = defaultKayoo,
	...props
}: ImageProps) => {
	const device = useBreakpoint();
	const imgRef = useRef<HTMLImageElement>(null);

	let src = defaultImage.src;
	let width = defaultImage.width;
	let height = defaultImage.height;
	let placeholder = defaultImage.blurDataURL;
	let srcSet = undefined;
	let sizes = undefined;

	const objectFitClass =
		objectFit === "contain" ? " object-contain " : " object-cover ";

	if (image) {
		const defaultVariant = device.isDesktop ? 1920 : 640; //TODO: optimize by checking size
		const sources = VariantWidths.map((w) => `${bunnyUrl(image.id, w)} ${w}w`);
		// width and height are not actual constraints, only aspect ratio information
		width = defaultVariant;
		height = width / image.ratio;
		srcSet = sources.join();
		src = bunnyUrl(image.id, defaultVariant);
		sizes = typeof sizeHint === "string"
			? sizeHint
			: sizeHint.raw;
		placeholder = image.placeholder;
	}

	return (
		<img
			key={image?.id}
			ref={useCallback((ref: HTMLImageElement | null) => {
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
			className={`w-full h-full 
				${props.onImageClick ? " md:cursor-pointer" : ""} \
				${objectFitClass} \
				${props.className || ""}`
			}
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
