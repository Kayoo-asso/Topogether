import { useUser } from "@clerk/nextjs";
import MarkerIcon from "assets/icons/marker-stroke.svg";
import Track from "assets/icons/track.svg";
import UserIcon from "assets/icons/user.svg";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { classNames } from "~/utils";

export function ShellMobile() {
	const router = useRouter();
	const { user } = useUser();

	let activeTab = 1;
	if (router.pathname.includes("user")) {
		activeTab = 0;
	} else if (router.pathname.includes("builder")) {
		activeTab = 2;
	}

	return (
		<>
			<div className="flex h-full w-screen bg-dark">
				<Link
					href={user ? "/profile" : "/login"}
					className={classNames(
						"flex h-full flex-1 items-center justify-center",
						activeTab === 0 && "border-t-6 border-t-main"
					)}
				>
					<UserIcon
						className={`h-5 w-5 ${
							activeTab === 0 ? "stroke-main" : "stroke-white"
						} `}
					/>
				</Link>

				{/* TODO: verify this link works correctly, since the logic was simplified */}
				<Link
					href={
						activeTab === 1
							? { pathname: router.pathname, query: router.query }
							: "/"
					}
					className={classNames(
						"flex h-full flex-1 items-center justify-center",
						activeTab === 1 && "border-t-6 border-t-main"
					)}
				>
					<MarkerIcon
						className={`h-6 w-6 stroke-1 ${
							activeTab === 1 ? "stroke-main" : "stroke-white"
						} `}
					/>
				</Link>

				<Link
					href={"/builder/dashboard"}
					className={classNames(
						"flex h-full flex-1 items-center justify-center",
						activeTab === 2 && "border-t-6 border-t-main"
					)}
				>
					<Track
						className={`my-auto h-5 w-5 stroke-1 ${
							activeTab === 2 ? "stroke-main" : "stroke-white"
						} `}
					/>
				</Link>
			</div>
		</>
	);
}

ShellMobile.displayName = "ShellMobile";
