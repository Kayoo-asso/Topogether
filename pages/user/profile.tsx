import { useCallback, useState } from "react";
import {
	Button,
	ImageInput,
	ProfileForm,
	LikedList,
	DownloadedList,
} from "components";
import { DBLightTopo, LightTopo, User } from "types";
import { api, useAuth } from "helpers/services";
import { Header } from "components/layouts/Header";
import { LeftbarDesktop } from "components/layouts/Leftbar.desktop";
import { Tabs } from "components/layouts/Tabs";
import { quarkifyLightTopos } from "helpers/quarkifyTopo";
import {
	withRouting,
	getSessionId,
	loginRedirect,
	getUserInitialProps,
} from "helpers/serverStuff";

import UserIcon from "assets/icons/user.svg";
import Heart from "assets/icons/heart.svg";
import Download from "assets/icons/download.svg";
import { ProfileContent } from "components/organisms/user/ProfileContent";
import { useCreateQuark } from "helpers/quarky";

type ProfileProps = {
	user: User;
	likedTopos: DBLightTopo[];
};

const ProfilePage = withRouting<ProfileProps>({
	async getInitialProps(ctx) {
		const userId = getSessionId(ctx);
		if (!userId) {
			return loginRedirect("/user/profile");
		}
		const [user, likedTopos] = await Promise.all([
			// using this function instead of `fetchUser(userId)` avoids a fetch on the client
			getUserInitialProps(ctx),
			api.getLikedTopos(userId),
		]);
		if (!user) {
			return loginRedirect("/user/profile");
		}

		return {
			props: {
				user,
				likedTopos,
			},
		};
	},
	render(props) {
		const auth = useAuth();
		const userQuark = useCreateQuark(props.user);
		const user = userQuark();

		const [displayModifyProfile, setDisplayModifyProfile] = useState(true);
		const [imageError, setImageError] = useState<string>();
		//////

		const [selectedTab, setSelectedTab] = useState<
			"PROFILE" | "LIKED" | "DOWNLOADED"
		>("PROFILE");
		

		const [likedTopos, setLikedTopos] = useState(props.likedTopos);

		const unlikeTopo = useCallback(
			(topo: LightTopo) => {
				if (topo) {
					topo.liked.set(false);
					const newLikedTopos = likedTopos.filter((t) => t.id !== topo.id);
					setLikedTopos(newLikedTopos);
				}
			},
			[likedTopos]
		);

		return (
			<>
				<Header backLink="/" title="Profile" />

				<div className="flex h-content w-full flex-row overflow-auto bg-white md:h-full">
					<LeftbarDesktop currentMenuItem="USER" />

					<div className="relative flex h-full w-full flex-col justify-start overflow-x-hidden md:px-12">
						<div className="flex flex-row justify-center rounded-lg px-6 pb-8 pt-12 md:justify-start md:pb-12 md:pt-[16px]">
							<div className="relative h-[100px] w-[100px] cursor-pointer">
								<ImageInput
									button="profile"
									value={user.image}
									onChange={async (images) => {
										const newUser = {
											...user,
											image: images[0],
										};
										const res = await auth.updateUserInfo(newUser);
										if (!res) setImageError("Une erreur est survenue.");
										else userQuark.set(newUser);
									}}
								/>
								{imageError &&
									<div className="ktext-error text-error">{imageError}</div>
								}
							</div>

							<div className="ml-6 hidden w-1/2 flex-col md:flex justify-center">
									<div className="ktext-subtitle">{user.userName}</div>
									{user.role === "ADMIN" && (
										<div className="ktext-label text-main">
											Super-administrateur
										</div>
									)}
							</div>

							{user.role === "ADMIN" && (
								<div className="absolute right-[5%] top-[5%]">
									<Button content="Admin" href="/admin" white />
								</div>
							)}
						</div>

						{/* <div
							className={
								"w-full " + (selectedTab === "PROFILE" ? "mb-8 md:mb-12" : "")
							}
						>
							<Tabs
								tabs={[
									{
										icon: UserIcon,
										iconStroke: true,
										iconClassName: "w-6 h-6 stroke-2",
										color: "main",
										action: () => setSelectedTab("PROFILE"),
									},
									{
										icon: Heart,
										iconStroke: true,
										iconFill: selectedTab === "LIKED" ? true : false,
										iconClassName: "w-6 h-6",
										color: "main",
										action: () => setSelectedTab("LIKED"),
									},
									{
										icon: Download,
										iconStroke: true,
										iconClassName: "w-6 h-6",
										color: "main",
										action: () => setSelectedTab("DOWNLOADED"),
									},
								]}
							/>
						</div> */}

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

						{/* {selectedTab === "LIKED" && (
							<LikedList
								likedTopos={quarkifyLightTopos(likedTopos)}
								onUnlikeTopo={(topo) => unlikeTopo(topo)}
							/>
						)}

						{selectedTab === "DOWNLOADED" && (
							<DownloadedList
								downloadedTopos={[]} //TODO
							/>
						)} */}
					</div>
				</div>
			</>
		);
	},
});

export default ProfilePage;
