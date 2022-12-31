import React, {
	CSSProperties,
	ReactElement,
	useCallback,
	useRef,
	useState,
} from "react";
import { Img, PointEnum, DrawerToolEnum, Position, Track } from "types";
import {
	Quark,
	QuarkIter,
	watchDependencies,
} from "helpers/quarky";
import { Image } from "components/atoms/Image";
import { SVGTrack } from "components/atoms";
import QuickPinchZoom, { make3dTransformValue } from "react-quick-pinch-zoom";
import { Portal } from "helpers/hooks";
import { getCoordsInViewbox } from "helpers/svg";
import { useSelectStore } from "components/pages/selectStore";
import { SourceSize } from "helpers/services/sharedWithServiceWorker";

type TracksImageProps = React.PropsWithChildren<{
	image?: Img;
	tracks: QuarkIter<Quark<Track>>;
	// 'fill' could be possible, but it distorts the aspect ratio
	objectFit?: "contain" | "cover";
	sizeHint: SourceSize;
	displayTracks?: boolean;
	displayPhantomTracks?: boolean;
	displayTracksDetails?: boolean;
	displayTrackOrderIndexes?: boolean;
	tracksWeight?: number;
	editable?: boolean;
	modalable?: boolean;
	allowDoubleTapZoom?: boolean;
	currentTool?: DrawerToolEnum;
	onImageClick?: (pos: Position) => void;
	onPointClick?: (pointType: PointEnum, index: number) => void;
	onImageLoad?: (width: number, height: number) => void;
}>;

// see: https://www.sarasoueidan.com/blog/svg-object-fit/
const preserveAspectRatio = {
	contain: "meet",
	cover: "slice",
	// fill: 'none'
};

export const viewBoxHeight = 4096;
export const defaultTracksWeight = viewBoxHeight * 0.007;

export const TracksImage: React.FC<TracksImageProps> = watchDependencies(
	({
		displayTracks = true,
		displayPhantomTracks = true,
		displayTracksDetails = false,
		displayTrackOrderIndexes = true,
		tracksWeight = defaultTracksWeight,
		objectFit = "contain",
		editable = false,
		allowDoubleTapZoom = true,
		...props
	}: TracksImageProps) => {
		const selectedTrackQuark = useSelectStore(s => s.item.type === 'boulder' && s.item.selectedTrack || undefined);
		const selectedTrack = selectedTrackQuark ? selectedTrackQuark() : undefined;
		const selectTrack = useSelectStore(s => s.select.track);
		// ratio = width / height
		// so the most accurate way to scale the SVG viewBox is to set a height
		// and take width = ratio * height (multiplication is better than division)
		const ratio = props.image?.ratio ?? 1;
		const viewBoxRef = useRef<SVGRectElement | null>(null);
		const viewBoxWidth = ratio * viewBoxHeight;

		const [portalOpen, setPortalOpen] = useState(false);
		const wrapPortal = (elts: ReactElement<any, any>) => {
			if (props.modalable && props.image) {
				return (
					<>
						{elts}
						<Portal open={portalOpen}>
							<div
								className="absolute top-0 left-0 z-full flex h-screen w-screen bg-black bg-opacity-80"
								onClick={(e) => {
									const eltUnder = e.target as EventTarget & SVGSVGElement;
									if (eltUnder.nodeName === "svg") setPortalOpen(false);
								}}
							>
								{elts}
							</div>
						</Portal>
					</>
				);
			} else return elts;
		};

		const getCursorUrl = () => {
			let cursorColor = "grey";
			if (selectedTrack?.grade) cursorColor = selectedTrack.grade[0];

			let cursorUrl = "/assets/icons/colored/";
			switch (props.currentTool) {
				case "LINE_DRAWER":
					cursorUrl += `line-point/_line-point-${cursorColor}.svg`;
					break;
				case "ERASER":
					cursorUrl += "_eraser-main.svg";
					break;
				case "HAND_DEPARTURE_DRAWER":
					cursorUrl += `hand-full/_hand-full-${cursorColor}.svg`;
					break;
				case "FOOT_DEPARTURE_DRAWER":
					cursorUrl += `climbing-shoe-full/_climbing-shoe-full-${cursorColor}.svg`;
					break;
				case "FORBIDDEN_AREA_DRAWER":
					cursorUrl += "_forbidden-area-second.svg";
					break;
			}
			return cursorUrl;
		};
		const cursorStyle: CSSProperties = {
			cursor: editable
				? `url(${getCursorUrl()}) ${
						props.currentTool === "ERASER" ? "3 7" : ""
				  }, auto`
				: "",
		};
		const cssCursor =
			props.modalable && props.image
				? portalOpen
					? " cursor-zoom-out"
					: " cursor-zoom-in"
				: props.onImageClick
				? " cursor-pointer"
				: "";

		// Explanation of how this works:
		// - width=100%, height=100% on everything, to let the consumer decide how to size the image
		// - a wrapper with `position: relative` to anchor the SVG canvas, that uses `position: absolute`, in its top left corner
		//   (this allows the SVG canvas to overlap with the image)
		// - use object-fit to size the image
		// - produce a viewBox with the same aspect ratio as the original image
		// - the SVG canvas is forced to fully fit the viewBox within its block, following the method given by `preserveAspectRatio`
		// - see the following article on how to match values of `object-fit` <-> `preserveAspectRatio`:
		//   https://www.sarasoueidan.com/blog/svg-object-fit/
		//
		// Result:
		// An image and a SVG viewBox that always perfectly match, while respecting the dimensions of the parent container
		// & the provided object-fit. The viewBox has constant width and height for the same image, so everything drawn
		// on the image can be expressed in the coordinate space of the viewBox & resizes automatically
		const imgRef = useRef<HTMLDivElement>(null);
		const onPinchZoom = useCallback(
			({ x, y, scale }) => {
				if (imgRef.current) {
					const value = make3dTransformValue({ x, y, scale });
					imgRef.current.style.setProperty("transform", value);
				}
			},
			[]
		);

		return wrapPortal(
			<QuickPinchZoom
				onUpdate={onPinchZoom}
				draggableUnZoomed={false}
				tapZoomFactor={allowDoubleTapZoom ? 1 : 0}
			>
				<div ref={imgRef} className={"relative h-full" + cssCursor}>
					<Image
						objectFit={objectFit}
						sizeHint={portalOpen ? "100vw" : props.sizeHint}
						image={props.image}
						alt={"Rocher avec tracé de voies"}
					/>
					<svg
						className="absolute top-0 left-0 z-50 h-full w-full"
						style={cursorStyle}
						viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
						preserveAspectRatio={`xMidYMid ${preserveAspectRatio[objectFit]}`}
						onClick={useCallback(
							(e) => {
								const eltUnder = e.target as EventTarget & SVGSVGElement;
								if (eltUnder.nodeName === "svg" && props.modalable)
									setPortalOpen(true);
								else {
									// Handle clicks that are 1) left-click, 2) in the viewBox and 3) on the SVG canvas directly
									if (
										e.buttons !== 0 ||
										!props.onImageClick ||
										!viewBoxRef.current ||
										eltUnder.nodeName !== "svg"
									)
										return;
									const coords = getCoordsInViewbox(
										viewBoxRef.current,
										e.clientX,
										e.clientY
									);
									if (coords) props.onImageClick(coords);
								}
							},
							[props.onImageClick, props.modalable]
						)}
					>
						{/* Invisible rectangle of the size of the viewBox, to get its on-screen dimensions easily
                (they could also be computed, but I'm lazy)
                Another dev: I'm lazy too. Leave the rectangle.
            */}
						<rect
							ref={(ref) => {
								if (!viewBoxRef.current) viewBoxRef.current = ref;
							}}
							x={0}
							y={0}
							width={viewBoxWidth}
							height={viewBoxHeight}
							visibility="hidden"
						/>

						{props.image &&
							props.tracks
								.map((trackQuark) => {
									const highlighted =
										selectedTrack === undefined ||
										trackQuark().id === selectedTrack.id;
									if (highlighted || displayPhantomTracks)
										return (
											<SVGTrack
												key={trackQuark().id}
												track={trackQuark}
												currentTool={props.currentTool}
												imageId={props.image!.id}
												editable={editable}
												vb={viewBoxRef}
												highlighted={highlighted}
												displayTrackDetails={displayTracksDetails}
												displayTrackOrderIndexes={displayTrackOrderIndexes}
												trackWeight={tracksWeight}
												onLineClick={() => selectTrack(trackQuark)}
												onPointClick={props.onPointClick}
											/>
										);
								})
								.toArray()}
						{props.image && props.children}
					</svg>
				</div>
			</QuickPinchZoom>
		);
	}
);

TracksImage.displayName = "TracksImage";
