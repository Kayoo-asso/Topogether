import React, { forwardRef, useEffect, useState } from "react";
import { ImageThumb } from "components";
import { Boulder, Img, UUID } from "types";
import { ImageInput } from ".";
import ArrowFull from "assets/icons/arrow-full.svg";

interface MultipleImageInputProps {
	images: Img[];
	boulder?: Boulder;
	label?: string;
	rows?: number;
	cols?: number;
	allowUpload?: boolean;
	selected?: UUID;
	onImageClick?: (id: UUID) => void;
	onImageDelete?: (id: UUID) => void;
	onChange: (images: Img[]) => void;
	onLoadStart?: () => void;
	onLoadEnd?: () => void;
}

export const MultipleImageInput = forwardRef<
	HTMLInputElement,
	MultipleImageInputProps
>(
	(
		{
			rows = 2,
			cols = 3,
			allowUpload = true,
			...props
		}: MultipleImageInputProps,
		ref
	) => {
		const [error, setError] = useState<string>();

		let nbVisible = rows * cols;
		if (allowUpload) {
			nbVisible -= 1;
		}

		const nbPages = Math.ceil(props.images.length / nbVisible);
		const [page, setPage] = useState<number>(0);
		useEffect(() => {
			if (props.selected) {
				const indexOfTheImage = props.images
					.map((img) => img.id)
					.indexOf(props.selected);
				const pageToDisplay = Math.trunc(indexOfTheImage / nbVisible);
				setPage(pageToDisplay);
			}
		}, [props.selected]);

		const displayLeftArrow = page > 0;
		const displayRightArrow = page < nbPages - 1;

		// index of first image to display
		const sliceStart = nbVisible * page;
		// index of last image to display
		const sliceEnd = sliceStart + nbVisible;
		const toDisplay = props.images.slice(sliceStart, sliceEnd);

		return (
			<>
				<div className="flex w-full flex-row gap-1.5">
					{displayLeftArrow && (
						<button onClick={() => setPage((p) => p - 1)}>
							<ArrowFull className="h-3 w-3 rotate-180 fill-main stroke-main" />
						</button>
					)}

					{[...Array(nbVisible).keys()].map((i, index) => {
						if (toDisplay[index])
							return (
								<ImageThumb
									key={toDisplay[index].id}
									image={toDisplay[index]}
									tracks={props.boulder?.tracks
										.quarks()
										.filter(
											(track) =>
												track().lines.find(
													(line) => line.imageId === toDisplay[index].id
												) !== undefined
										)}
									selected={toDisplay[index].id === props.selected}
									onClick={props.onImageClick}
									onDelete={props.onImageDelete}
								/>
							);
						else return <div className="w-full" key={index}></div>;
					})}

					{allowUpload && (
						<ImageInput
							ref={ref}
							label={props.label}
							multiple
							onChange={(images) => {
								if (error) setError(undefined);
								props.onChange(images);
							}}
							onError={(err) => setError(err)}
							onLoadStart={props.onLoadStart}
							onLoadEnd={props.onLoadEnd}
						/>
					)}

					{displayRightArrow && (
						<button onClick={() => setPage((p) => p + 1)}>
							<ArrowFull className="h-3 w-3 fill-main stroke-main" />
						</button>
					)}
				</div>
				<div
					className={`ktext-error mt-2 w-full pt-1 text-center text-error ${
						error && error.length > 0 ? "" : "hidden"
					}`}
				>
					{error}
				</div>
			</>
		);
	}
);
