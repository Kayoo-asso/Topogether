import React, { forwardRef, useCallback, useEffect, useState } from "react";
import { Img, UUID } from "types";
import ArrowFull from "assets/icons/arrow-full.svg";
import { SelectedBoulder, useSelectStore } from "components/store/selectStore";
import { ImageThumb } from "components/atoms/ImageThumb";
import { ImageInput } from "./ImageInput";
import { useDeleteStore } from "components/store/deleteStore";

interface MultipleImageInputProps {
	images: Img[];
	label?: string;
	rows?: number;
	cols?: number;
	allowUpload?: boolean;
	allowDelete?: boolean;
	selected?: Img;
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
		const selectedBoulder = useSelectStore(s => s.item as SelectedBoulder);
		const select = useSelectStore(s => s.select);
		const del = useDeleteStore(d => d.delete);
		const [error, setError] = useState<string>();

		let nbVisible = rows * cols;
		if (allowUpload) {
			nbVisible -= 1;
		}

		const nbPages = Math.ceil(props.images.length / nbVisible);
		const [page, setPage] = useState<number>(0);
		useEffect(() => {
			if (props.selected) {
				const indexOfTheImage = props.images.findIndex(
					(img) => img.id === props.selected?.id
				);
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
		const toDisplay: Array<Img | undefined> = props.images.slice(
			sliceStart,
			sliceEnd
		);
		const missing = nbVisible - toDisplay.length;
		if (missing > 0) {
			toDisplay.push(...new Array(missing));
		}

		return (
			<>
				<div className="flex w-full flex-row gap-1.5">
					{displayLeftArrow && (
						<button onClick={() => setPage((p) => p - 1)}>
							<ArrowFull className="h-3 w-3 rotate-180 fill-main stroke-main" />
						</button>
					)}

					{toDisplay.map((image, index) =>
						image ? (
							<ImageThumb
								key={image.id}
								image={image}
								tracks={selectedBoulder?.value()?.tracks
									.quarks()
									.filter(
										(track) =>
											track().lines.find(
												(line) => line.imageId === image.id
											) !== undefined
									)
								}
								selected={image.id === props.selected?.id}
								onClick={() => select.image(image)}
								onDelete={props.allowDelete ? () => del.item({ 
									type: 'image', 
									value: image, 
									selectedBoulder: selectedBoulder 
								}) : undefined}
							/>
						) : (
							<div key={index} className="w-[73px] h-[73px]"></div>
						)
					)}

					{allowUpload && (
						<ImageInput
							ref={ref}
							label={props.label}
							multiple
							onChange={useCallback((images) => {
								if (error) setError(undefined);
								props.onChange(images);
							}, [error, props.onChange])}
							onError={(err) => setError(err)}
							onLoadStart={useCallback(() => {
								setError(undefined);
								props.onLoadStart && props.onLoadStart();
							}, [error, props.onLoadStart])}
							onLoadEnd={props.onLoadEnd}
						/>
					)}

					{displayRightArrow && (
						<button onClick={() => setPage((p) => p + 1)}>
							<ArrowFull className="h-3 w-3 fill-main stroke-main" />
						</button>
					)}
				</div>
				{error && error.length > 0 && (
					<div className={"ktext-error mt-2 w-full pt-1 text-center text-error"}>
						{error}
					</div>
				)}
			</>
		);
	}
);
