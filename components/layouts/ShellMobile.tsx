/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { watchDependencies } from "helpers/quarky";
import { useAuth } from "helpers/services";

import Track from "assets/icons/track.svg";
import UserIcon from "assets/icons/user.svg";
import MarkerIcon from "assets/icons/marker-stroke.svg";

export const ShellMobile: React.FC = watchDependencies(() => {
	const router = useRouter();
	const auth = useAuth();
	const session = auth.session();

	let activeTab = 1;
	if (router.pathname.includes("user")) {
		activeTab = 0;
	} else if (router.pathname.includes("builder")) {
		activeTab = 2;
	}

	return (
		<>
			<div className="flex h-full w-screen bg-dark">
				<Link href={session ? "/user/profile" : "/user/login"}>
					<a
						className={`flex h-full flex-1 items-center justify-center ${
							activeTab === 0 ? "border-t-6 border-t-main" : ""
						}`}
					>
						<UserIcon
							className={`h-5 w-5 ${
								activeTab === 0 ? "stroke-main" : "stroke-white"
							} `}
						/>
					</a>
				</Link>

				{/* TODO: verify this link works correctly, since the logic was simplified */}
				<Link href={activeTab === 1 ? {pathname: router.pathname, query: router.query } : "/"}>
					<a
						className={`flex h-full flex-1 items-center justify-center ${
							activeTab === 1 ? "border-t-6 border-t-main" : ""
						}`}
					>
						<MarkerIcon
							className={`h-6 w-6 stroke-1 ${
								activeTab === 1 ? "stroke-main" : "stroke-white"
							} `}
						/>
					</a>
				</Link>

				<Link href={"/builder/dashboard"}>
					<a
						className={`flex h-full flex-1 items-center justify-center ${
							activeTab === 2 ? "border-t-6 border-t-main" : ""
						}`}
					>
						<Track
							className={`my-auto h-5 w-5 stroke-1 ${
								activeTab === 2 ? "stroke-main" : "stroke-white"
							} `}
						/>
					</a>
				</Link>
			</div>
		</>
	);
});

ShellMobile.displayName = "ShellMobile";
