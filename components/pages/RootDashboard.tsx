import React, { useRef, useState } from "react";
import { LightTopoOld } from "types";
import { watchDependencies } from "helpers/quarky";
import { HeaderDesktop } from "components/layouts/HeaderDesktop";
import { LeftbarDesktop } from "components/layouts/Leftbar.desktop";
import { MyTopos } from "components/organisms/dashboard/MyTopos";
import { TabsFly } from "components/layouts/TabsFly";
import { DlTopos } from "components/organisms/dashboard/dl/DlTopos";
import { LikedTopos } from "components/organisms/dashboard/liked/LikedTopos";

import UserTopoIcon from "assets/icons/user-topo.svg";
import Heart from "assets/icons/heart.svg";
import Download from "assets/icons/download.svg";

interface RootDashboardProps {
	myTopos: LightTopoOld[];
	likedTopos: LightTopoOld[];
	dlTopos: LightTopoOld[];
}

export const RootDashboard: React.FC<RootDashboardProps> = watchDependencies(
	(props: RootDashboardProps) => {
		const [tab, setTab] = useState<"MY" | "DL" | "LIKED">("MY");
		const [displayTabs, setDisplayTabs] = useState(true);
		const ref = useRef<HTMLDivElement>(null);

		return (
			<>
				<HeaderDesktop backLink="/" title="Mes topos" />

				<div className="flex h-content w-full flex-row md:h-full">
					<LeftbarDesktop currentMenuItem="BUILDER" />

					<div
						ref={ref}
						className="h-contentPlusHeader w-full overflow-y-auto overflow-x-hidden bg-white pb-28 md:h-contentPlusShell"
					>
						{tab === "MY" && <MyTopos myTopos={props.myTopos} pageRef={ref} />}
						{tab === "LIKED" && <LikedTopos likedTopos={props.likedTopos} />}
						{tab === "DL" && (
							<DlTopos
								dlTopos={props.dlTopos}
								setDisplayTabs={setDisplayTabs}
							/>
						)}

						<div
							className={`${
								displayTabs ? "" : "hidden"
							} absolute bottom-[12vh] left-0 flex w-full justify-center md:bottom-8 md:left-[calc(300px+1%)] md:w-[calc(100%-300px)]`}
						>
							<TabsFly
								tabs={[
									{
										icon: UserTopoIcon,
										iconStroke: true,
										label: "Mes topos",
										color: "main",
										action: () => setTab("MY"),
									},
									{
										icon: Download,
										iconStroke: true,
										label: "Topos téléchargés",
										color: "main",
										action: () => setTab("DL"),
									},
									{
										icon: Heart,
										iconStroke: true,
										iconFill: tab === "LIKED" ? true : false,
										label: "Topos favoris",
										color: "main",
										action: () => setTab("LIKED"),
									},
								]}
							/>
						</div>
					</div>
				</div>
			</>
		);
	}
);

RootDashboard.displayName = "RootDashboard";
