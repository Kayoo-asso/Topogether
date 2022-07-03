import React from "react";
import { Image } from "types";
import { CFImage } from "./CFImage";
import defaultProfilePicture from "public/assets/img/Default_profile_picture.png";

interface ProfilePictureProps {
	image?: Image;
	loading?: boolean;
	onClick?: () => void;
}

export const ProfilePicture: React.FC<ProfilePictureProps> = ({
	loading = false,
	...props
}: ProfilePictureProps) => {
	return (
		<div
			className={`shadow relative rounded-full border border-main overflow-hidden z-20 h-full w-full${
				props.onClick ? " cursor-pointer" : ""
			}`}
			onClick={() => {
				props.onClick && props.onClick();
			}}
		>
			<CFImage
				image={props.image}
				className="rounded-full h-full"
				objectFit="cover"
				alt="Photo de profil"
				sizeHint="25vw"
				forceLoading={loading}
				defaultImage={defaultProfilePicture}
			/>
		</div>
	);
};
