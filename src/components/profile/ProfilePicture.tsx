import React from "react";
import { Img } from "~/types";
import { Image } from "~/components/ui/Image";
import { Loading } from "~/components/buttons/Loading";

import defaultProfilePicture from "public/assets/img/Default_profile_picture.png";
import ChangePhotoIcon from "assets/icons/change-photo.svg";

interface ProfilePictureProps {
	image?: Img;
	input?: boolean;
	loading?: boolean;
	onClick?: () => void;
}

export const ProfilePicture: React.FC<ProfilePictureProps> = ({
	loading = false,
	...props
}: ProfilePictureProps) => {
	return (
		<div
			className={`relative z-20 h-full overflow-hidden rounded-full border border-main shadow w-full${
				props.onClick ? " md:cursor-pointer" : ""
			}`}
			onClick={() => {
				props.onClick && props.onClick();
			}}
		>
			{props.input && (
				<div className="absolute flex h-full w-full items-center justify-center bg-dark bg-opacity-30 hover:bg-opacity-50">
					<ChangePhotoIcon className="h-8 w-8 stroke-white stroke-2" />
				</div>
			)}
			{loading && (
				<div className="flex h-full w-full items-center justify-center bg-white">
					<Loading bgWhite={false} SVGClassName="w-12 h-12" />
				</div>
			)}
			{!loading && (
				<Image
					image={props.image}
					objectFit="cover"
					alt="Photo de profil"
					sizeHint="25vw"
					defaultImage={defaultProfilePicture}
				/>
			)}
		</div>
	);
};
