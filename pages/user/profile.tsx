import { useCallback, useState } from "react";
import {
	Button,
	ImageInput,
	ProfileForm,
} from "components";
import { User } from "types";
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
import { useCreateQuark } from "helpers/quarky";

type ProfileProps = {
	user: User;
};

const ProfilePage = withRouting<ProfileProps>({
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

		return {
			props: {
				user
			},
		};
	},
	render(props) {
		const auth = useAuth();
		const userQuark = useCreateQuark(props.user);
		const user = userQuark();

		const [displayModifyProfile, setDisplayModifyProfile] = useState(false);
		const [imageError, setImageError] = useState<string>();

		return (
			<>
				<Header 
					title="Profile"
					backLink="/" 
					onBackClick={displayModifyProfile ? () => setDisplayModifyProfile(false) : undefined}
				/>

				<div className="flex h-content w-full flex-row overflow-auto bg-white md:h-full">
					<LeftbarDesktop currentMenuItem="USER" />

					<div className="relative flex h-full w-full flex-col justify-start overflow-x-hidden md:px-12">
						<div className="flex flex-row rounded-lg px-5 md:px-6 pb-8 pt-12 justify-start md:pb-12 md:pt-[16px]">
							<div className="relative h-[100px] w-[100px] cursor-pointer">
								<ImageInput
									button="profile"
									value={user.image}
									onChange={useCallback(async (images) => {
										const newUser = {
											...user,
											image: images[0],
										};
										const res = await auth.updateUserInfo(newUser);
										if (!res) setImageError("Une erreur est survenue.");
										else userQuark.set(newUser);
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
								user={user}
								onModifyButtonClick={() => setDisplayModifyProfile(true)}
							/>
						}

						{displayModifyProfile && (
							<ProfileForm
							userQuark={userQuark}
								setDisplayModifyProfile={setDisplayModifyProfile}
							/>
						)}

					</div>
				</div>
			</>
		);
	},
});

export default ProfilePage;
