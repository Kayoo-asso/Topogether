import React from "react";
import Link from "next/link";
import { Button } from "~/components/buttons/Button";
import { useUser } from "@clerk/nextjs";
import { getAuthMetadata } from "~/server/auth";

import Track from "assets/icons/track.svg";
import MarkerIcon from "assets/icons/marker-stroke.svg";
import UserIcon from "assets/icons/user.svg";
import KeyIcon from "assets/icons/key.svg";

interface LeftbarDesktopProps {
	currentMenuItem?: "BUILDER" | "MAP" | "USER" | "ADMIN";
}

export function LeftbarDesktop({
	currentMenuItem = "MAP",
}: LeftbarDesktopProps) {
	const { user } = useUser();
	const userMeta = getAuthMetadata(user);

	return (
		<div className="z-200 hidden h-full w-[280px] min-w-[280px] flex-col border-r border-grey-medium bg-white px-8 py-10 md:flex">
			<div className="mb-20 mt-2">
				<div>
					Bonjour{" "}
					<span className="ktext-subtitle text-main">{user?.username}</span> !
				</div>
			</div>

			<div className="flex flex-1 flex-col gap-10">
				<Link className="flex flex-row" href="/builder/dashboard">
					<Track
						className={`mr-4 h-6 w-6 ${
							currentMenuItem === "BUILDER" ? "stroke-main" : "stroke-dark"
						}`}
					/>
					<span
						className={`ktext-title ${
							currentMenuItem === "BUILDER" ? "text-main" : "text-dark"
						}`}
					>
						Topos
					</span>
				</Link>
				<Link className="flex flex-row" href="/">
					<MarkerIcon
						className={`mr-4 h-6 w-6 stroke-2 ${
							currentMenuItem === "MAP" ? "stroke-main" : "stroke-dark"
						}`}
					/>
					<span
						className={`ktext-title ${
							currentMenuItem === "MAP" ? "text-main" : "text-dark"
						}`}
					>
						Carte
					</span>
				</Link>
				<Link className="flex flex-row" href="/profile">
					<UserIcon
						className={`mr-4 h-6 w-6 stroke-2 ${
							currentMenuItem === "USER" ? "stroke-main" : "stroke-dark"
						}`}
					/>
					<span
						className={`ktext-title ${
							currentMenuItem === "USER" ? "text-main" : "text-dark"
						}`}
					>
						Profile
					</span>
				</Link>
				{userMeta?.role === "admin" && (
					<Link className="flex flex-row" href="/admin">
						<KeyIcon
							className={`mr-4 h-6 w-6 ${
								currentMenuItem === "ADMIN" ? "stroke-main" : "stroke-dark"
							}`}
						/>
						<span
							className={`ktext-title ${
								currentMenuItem === "ADMIN" ? "text-main" : "text-dark"
							}`}
						>
							Admin
						</span>
					</Link>
				)}
			</div>

			<Button content="Nouveau topo" href="/builder/new" fullWidth />
		</div>
	);
}

LeftbarDesktop.displayName = "Leftbar Desktop";
