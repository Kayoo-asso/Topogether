import { useRef, useState, forwardRef, useEffect, useCallback } from "react";
// eslint-disable-next-line import/no-cycle
import { ImageButton, ProfilePicture, RoundButton } from "../../atoms";
import { api, ImageUploadErrorReason } from "helpers/services";
import { Img } from "types";
import { setReactRef } from "helpers/utils";
import Spinner from "assets/icons/spinner.svg";
import Camera from "assets/icons/camera.svg";

interface ImageInputProps {
	label?: string;
	multiple?: boolean;
	value?: Img;
	button?: "square" | "profile" | "builder";
	size?: "little" | "big";
	activated?: boolean;
	onChange: (images: Img[]) => void;
	onDelete?: () => void;
	onError?: (err: string) => void;
	onLoadStart?: () => void;
	onLoadEnd?: () => void;
}

export const ImageInput = forwardRef<HTMLInputElement, ImageInputProps>(
	(
		{
			multiple = false,
			button = "square",
			size = "little",
			activated = true,
			...props
		}: ImageInputProps,
		parentRef
	) => {
		const fileInputRef = useRef<HTMLInputElement>();

		const [error, setError] = useState<string>();
		const [loading, setLoading] = useState<boolean>(false);

		const handleFileInput = async (files: FileList) => {
			const errorcount = {
				[ImageUploadErrorReason.NonImage]: 0,
				[ImageUploadErrorReason.CompressionError]: 0,
				[ImageUploadErrorReason.UploadError]: 0,
			};
			if (props.onLoadStart) props.onLoadStart();
			setLoading(true);

			const { images, errors } = await api.images.uploadMany(files);
			for (const err of errors) {
				errorcount[err.reason]++;
			}

			setLoading(false);
			if (props.onLoadEnd) props.onLoadEnd();
			props.onChange(images);
			let error = "";
			if (errorcount[ImageUploadErrorReason.NonImage] === 1)
				error += "Un des fichiers n'est pas une image valide.\n";
			else if (errorcount[ImageUploadErrorReason.NonImage] > 1)
				error +=
					errorcount[ImageUploadErrorReason.NonImage] +
					" fichers ne sont pas des images valides.\n";
			if (errorcount[ImageUploadErrorReason.CompressionError] === 1)
				error += "Un des fichiers est trop lourds.\n";
			else if (errorcount[ImageUploadErrorReason.CompressionError] > 1)
				error +=
					errorcount[ImageUploadErrorReason.CompressionError] +
					" fichiers sont trop lourds.\n";
			if (errorcount[ImageUploadErrorReason.UploadError] === 1)
				error += "Un des fichiers n'a pas pu être uploadé.";
			else if (errorcount[ImageUploadErrorReason.UploadError] > 1)
				error +=
					errorcount[ImageUploadErrorReason.UploadError] +
					" fichiers n'ont pas pu être uploadés.";
			setError(error);

			if (props.onError && error.length > 0) props.onError(error);
		};
		useEffect(() => {
			if (props.onError && error && error.length > 0) props.onError(error);
		}, [error, props.onError]);

		return (
			<>
				<input
					type="file"
					accept="image/png, image/jpg, image/jpeg, image/webp"
					className="hidden"
					multiple={multiple}
					ref={(ref) => {
						setReactRef(fileInputRef, ref);
						setReactRef(parentRef, ref);
					}}
					onChange={(e) => {
						if (e?.target?.files) {
							handleFileInput(e.target.files);
						}
					}}
				/>
				{button === "profile" && (
					<ProfilePicture
						image={props.value}
						input
						loading={loading}
						onClick={useCallback(() => {
							if (!loading && fileInputRef.current)
								fileInputRef.current.click();
						}, [loading])}
					/>
				)}
				{button === "builder" && (
					<RoundButton
						buttonSize={size === "little" ? 45 : 60}
						onClick={useCallback(() => {
							if (!loading && activated && fileInputRef.current)
								fileInputRef.current.click();
						}, [loading, activated])}
					>
						{!loading && (
							<Camera
								className={
									"h-6 w-6 " + (activated ? "stroke-main" : "stroke-grey-light")
								}
							/>
						)}
						{loading && (
							<Spinner className="m-2 h-6 w-6 animate-spin stroke-main" />
						)}
					</RoundButton>
				)}
				{button === "square" && (
					<ImageButton
						text={props.label}
						image={props.value}
						loading={loading}
						activated={activated}
						onClick={useCallback(() => {
							if (!loading && fileInputRef.current)
								fileInputRef.current.click();
						}, [loading])}
						onDelete={props.onDelete}
					/>
				)}
				{!props.onError && (
					<div
						className={`ktext-error pt-1 text-error md:h-22 md:w-22 ${
							error && error.length > 0 ? "" : "hidden"
						}`}
					>
						{error}
					</div>
				)}
			</>
		);
	}
);
