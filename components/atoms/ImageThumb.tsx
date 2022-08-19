import React from "react";
import { Img, Track, UUID } from "types";
// eslint-disable-next-line import/no-cycle
import { DeleteButton, TracksImage } from "components";
import { Quark, QuarkIter, watchDependencies } from "helpers/quarky";

interface ImageThumbProps {
	image: Img;
	tracks?: QuarkIter<Quark<Track>>;
	selected?: boolean;
	onDelete?: (id: UUID) => void;
	onClick?: (id: UUID) => void;
}

export const ImageThumb: React.FC<ImageThumbProps> = watchDependencies(
	({ selected = false, ...props }: ImageThumbProps) => {

		return (
			<div
				className={`${selected ? "border-main" : "border-dark"}${
					props.onClick ? " cursor-pointer" : ""
				} \
      			group relative h-[73px] w-[73px] border-2`}
				onClick={() => props.onClick && props.onClick(props.image.id)}
			>
				{props.onDelete && (
					<div
						className="absolute -top-[15px] -right-[8px] z-10 hidden md:group-hover:inline"
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
