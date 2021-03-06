import React from "react";
import { Image } from "types";
import { CFImage } from "./CFImage";
import { Loading } from "./buttons/Loading";

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
			className={`relative z-20 h-full overflow-hidden rounded-full border border-main shadow w-full${
				props.onClick ? " cursor-pointer" : ""
			}`}
			onClick={() => {
				props.onClick && props.onClick();
			}}
		>
			{loading && (
				<div className="flex h-full w-full items-center justify-center bg-white">
					<Loading bgWhite={false} SVGClassName="w-12 h-12" />
				</div>
			)}
			{!loading && (
				<CFImage
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
