import React from "react";
import { Image, Track, UUID } from "types";
// eslint-disable-next-line import/no-cycle
import { DeleteButton, TracksImage } from "components";
import useDimensions from "react-cool-dimensions";
import { Quark, QuarkIter, watchDependencies } from "helpers/quarky";
import { CFImage } from "./CFImage";

interface ImageThumbProps {
	image: Image;
	tracks?: QuarkIter<Quark<Track>>;
	selected?: boolean;
	onDelete?: (id: UUID) => void;
	onClick?: (id: UUID) => void;
}

export const ImageThumb: React.FC<ImageThumbProps> = watchDependencies(
	({ selected = false, ...props }: ImageThumbProps) => {
		const {
			observe,
			unobserve,
			width: containerWidth,
			height: containerHeight,
			entry,
		} = useDimensions({
			onResize: ({ observe, unobserve, width, height, entry }) => {
				// Triggered whenever the size of the target is changed...
				unobserve(); // To stop observing the current target element
				observe(); // To re-start observing the current target element
			},
		});

		return (
			// eslint-disable-next-line jsx-a11y/click-events-have-key-events
			<div
				ref={observe}
				className={`${selected ? "border-main" : "border-dark"}${
					props.onClick ? " cursor-pointer" : ""
				} \
      			group relative flex w-full flex-col justify-center border-2`}
				onClick={() => props.onClick && props.onClick(props.image.id)}
				style={{
					height: containerWidth,
				}}
			>
				{props.onDelete && (
					<div
						className="absolute -top-[15px] -right-[8px] z-10 hidden md:group-hover:block"
						onClick={(e) => e.stopPropagation()}
					>
						<DeleteButton
							onClick={() => props.onDelete && props.onDelete(props.image.id)}
						/>
					</div>
				)}

				<TracksImage
					image={props.image}
					tracks={props.tracks || new QuarkIter([])}
					displayTracks
					displayTrackOrderIndexes={true}
					objectFit="contain"
					// Avoid loading separate images for the thumbnail or the preview image
					sizeHint="300px"
					tracksWeight={60}
				/>
			</div>
		);
	}
);
