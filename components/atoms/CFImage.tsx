import {
	SourceSize,
	VariantWidths,
	cloudflareUrl,
	setReactRef,
} from "helpers/utils";
import type { StaticImageData } from "next/image";
import {
	ImgHTMLAttributes,
	forwardRef,
	useRef,
	useState,
	useCallback,
	ReactElement,
} from "react";
import QuickPinchZoom, { make3dTransformValue } from "react-quick-pinch-zoom";
import { useBreakpoint, Portal } from "helpers/hooks";
import type { Image } from "types";

import defaultKayoo from "public/assets/img/Kayoo_defaut_image.png";

export type CFImageProps = RawImageAttributes & {
	alt: string;
	image?: Image;
	objectFit?: "contain" | "cover";
	// Default = "cover"
	// Customizable
	bgObjectFit?: "contain" | "cover";
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
			bgObjectFit,
			defaultImage = defaultKayoo,
			...props
		}: CFImageProps,
		parentRef
	) => {
		const device = useBreakpoint();
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
								className="absolute top-0 left-0 z-full flex h-screen w-screen bg-black bg-opacity-80"
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
		let placeholder = defaultImage.blurDataURL;
		let srcSet = undefined;
		let sizes = undefined;

		if (portalOpen) objectFit = "contain";
		const objectFitClass =
			objectFit === "contain" ? " object-contain " : " object-cover ";
		const backgroundSize = bgObjectFit || objectFit;

		if (image) {
			const defaultVariant = device === "mobile" ? 640 : 1920; //TODO: optimize by checking size
			const sources = VariantWidths.map(
				(w) => `${cloudflareUrl(image.id, w)} ${w}w`
			);
			// note: check that width and height are not actual constraints,
			// only aspect ratio information
			width = defaultVariant;
			height = width / image.ratio;
			srcSet = sources.join();
			src = cloudflareUrl(image.id, defaultVariant);
			sizes = portalOpen
				? "100vw"
				: typeof sizeHint === "string"
				? sizeHint
				: sizeHint.raw;
			placeholder = image.placeholder;
		}

		return wrapPortal(
			<QuickPinchZoom onUpdate={onPinchZoom} draggableUnZoomed={false}>
				<img
					ref={(ref) => {
						// In case the image has loaded before the onLoad handler was registered
						if (ref?.complete) {
							clearPlaceholder(ref);
						}
						setReactRef(imgRef, ref);
						setReactRef(parentRef, ref);
					}}
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
									backgroundSize,
									backgroundPosition: "center",
									backgroundImage: `url(${placeholder})`,
									backgroundRepeat: "no-repeat",
							  }
							: {}
					}
					onClick={(e) => {
						if (modalable) setPortalOpen(true);
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
			</QuickPinchZoom>
		);
	}
);

function clearPlaceholder(img: HTMLImageElement) {
	img.style.filter = null as any;
	img.style.backgroundSize = null as any;
	img.style.backgroundPosition = null as any;
	img.style.backgroundImage = null as any;
	img.style.backgroundRepeat = null as any;
}
