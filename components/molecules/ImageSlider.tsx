import { Quark, QuarkIter, SelectQuarkNullable } from "helpers/quarky";
import React, { ReactElement, useState } from "react";
import { Image, Track } from "types";
import { TracksImage } from "./TracksImage";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { Portal } from "helpers/hooks";
import { CFImage } from "components/atoms";

interface ImageSliderProps {
	images: Image[];
	imageToDisplayIdx: number;
	tracks: QuarkIter<Quark<Track>>;
	selectedTrack?: SelectQuarkNullable<Track>;
	displayPhantomTracks?: boolean;
	modalable?: boolean;
	onChange?: (idx: number, item: React.ReactNode) => void;
}

export const ImageSlider: React.FC<ImageSliderProps> = ({
	displayPhantomTracks = false,
	modalable = true,
	...props
}: ImageSliderProps) => {
	const [portalOpen, setPortalOpen] = useState(false);
	const wrapPortal = (elts: ReactElement<any, any>) => {
		if (modalable && props.images) {
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

	if (props.images.length > 1)
		return wrapPortal(
			<Carousel /* Force to hardcode some css (in carouselStyle.css) */
				showStatus={false}
				showThumbs={false}
				showIndicators={!!(props.images && props.images.length > 1)}
				useKeyboardArrows
				selectedItem={props.imageToDisplayIdx}
				onChange={props.onChange}
			>
				{props.images?.map((img) => {
					return (
						<TracksImage
							key={img.id}
							sizeHint="100vw"
							image={img}
							tracks={props.tracks}
							selectedTrack={props.selectedTrack}
							displayPhantomTracks={displayPhantomTracks}
							displayTracksDetails={
								props.selectedTrack && !!props.selectedTrack()?.id
							}
							onImageClick={() => setPortalOpen(true)}
						/>
					);
				})}
			</Carousel>
		);
	else if (props.images.length === 1)
		return wrapPortal(
			<TracksImage
				key={props.images[0].id}
				sizeHint="100vw"
				image={props.images[0]}
				tracks={props.tracks}
				selectedTrack={props.selectedTrack}
				displayPhantomTracks={displayPhantomTracks}
				displayTracksDetails={
					props.selectedTrack && !!props.selectedTrack()?.id
				}
				onImageClick={() => setPortalOpen(true)}
			/>
		);
	else
		return (
			<CFImage
				alt="default boulder"
				sizeHint="100vw"
				modalable={false}
				zoomable={false}
			/>
		);
};
