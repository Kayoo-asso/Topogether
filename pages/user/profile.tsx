import { useCallback, useState } from "react";
import { useAuth } from "helpers/services";
import { Header } from "components/layouts/Header";
import { LeftbarDesktop } from "components/layouts/Leftbar.desktop";
import {
	withRouting,
	getSessionId,
	loginRedirect,
	getUserInitialProps,
} from "helpers/serverStuff";

import { ProfileContent } from "components/organisms/user/ProfileContent";
import { watchDependencies } from "helpers/quarky";
import { ImageInput } from "components/molecules/form/ImageInput";
import { Button } from "components/atoms/buttons/Button";
import { ProfileForm } from "components/organisms/user/ProfileForm";

const ProfilePage = withRouting({
	async getInitialProps(ctx) {
		const userId = getSessionId(ctx);
		if (!userId) {
			return loginRedirect("/user/profile");
		}

		// using this function instead of `fetchUser(userId)` avoids a fetch on the client
		const user = await getUserInitialProps(ctx);	
		if (!user) {
			return loginRedirect("/user/profile");
		}

		return { props: {} };
	},
	render: watchDependencies(props => {
		const auth = useAuth();
		const user = auth.session()!;

		const [displayModifyProfile, setDisplayModifyProfile] = useState(false);
		const [imageError, setImageError] = useState<string>();

		return (
			<>
				<Header 
					title="Profil"
					backLink="/" 
					onBackClick={displayModifyProfile ? () => setDisplayModifyProfile(false) : undefined}
				/>

				<div className="flex h-content w-full flex-row overflow-auto bg-white md:h-full">
					<LeftbarDesktop currentMenuItem="USER" />

					<div className="relative flex h-full w-full flex-col justify-start overflow-x-hidden md:px-12">
						<div className="flex flex-row rounded-lg px-5 md:px-6 pb-8 pt-12 justify-start md:pb-12 md:pt-[16px]">
							<div className="relative h-[100px] w-[100px] md:cursor-pointer">
								<ImageInput
									button="profile"
									value={auth.session()!.image}
									onChange={useCallback(async (images) => {
										const res = await auth.updateUserInfo({
											...user,
											image: images[0],
										});
										if (!res) setImageError("Une erreur est survenue.");
									}, [user])}
								/>
								{imageError &&
									<div className="ktext-error text-error">{imageError}</div>
								}
							</div>

							<div className="ml-4 w-1/2 flex flex-col justify-center">
									<div className="ktext-subtitle">{user.userName}</div>
									{user.role === "ADMIN" && (
										<div className="ktext-label text-main">
											Super-administrateur
										</div>
									)}
							</div>

							{user.role === "ADMIN" && (
								<div className="absolute right-[5%] top-[3%]">
									<Button content="Admin" href="/admin" white />
								</div>
							)}
						</div>

						{!displayModifyProfile &&
							<ProfileContent 
								setDisplayModifyProfile={setDisplayModifyProfile}
							/>
						}

						{displayModifyProfile && (
							<ProfileForm
								setDisplayModifyProfile={setDisplayModifyProfile}
							/>
						)}

					</div>
				</div>
			</>
		);
	}),
});

export default ProfilePage;
