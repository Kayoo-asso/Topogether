import React from "react";
import { Button } from "components";
import Link from "next/link";
import { watchDependencies } from "helpers/quarky";
import { useSession } from "helpers/services";

import TopoIcon from "assets/icons/topo.svg";
import MarkerIcon from "assets/icons/marker-stroke.svg";
import UserIcon from "assets/icons/user.svg";
import KeyIcon from "assets/icons/key.svg";

interface LeftbarDesktopProps {
	currentMenuItem?: "BUILDER" | "MAP" | "USER" | "ADMIN";
}

export const LeftbarDesktop: React.FC<LeftbarDesktopProps> = watchDependencies(
	({ currentMenuItem = "MAP" }: LeftbarDesktopProps) => {
		const user = useSession();

		return (
			<div className="z-200 hidden h-full w-[280px] min-w-[280px] flex-col border-r border-grey-medium bg-white px-8 py-10 md:flex">
				<div className="mb-20 mt-2">
					<div>
						Bonjour{" "}
						<span className="ktext-subtitle text-main">{user?.userName}</span> !
					</div>
				</div>

				<div className="flex flex-1 flex-col gap-10">
					<Link href="/builder/dashboard">
						<a className="flex flex-row">
							<TopoIcon
								className={`mr-4 h-6 w-6 ${
									currentMenuItem === "BUILDER" ? "stroke-main" : "stroke-dark"
								}`}
							/>
							<span
								className={`ktext-title ${
									currentMenuItem === "BUILDER" ? "text-main" : "text-dark"
								}`}
							>
								Mes topos
							</span>
						</a>
					</Link>
					<Link href="/">
						<a className="flex flex-row">
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
						</a>
					</Link>
					<Link href="/user/profile">
						<a className="flex flex-row">
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
						</a>
					</Link>
					{user?.role === "ADMIN" && (
						<Link href="/admin">
							<a className="flex flex-row">
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
							</a>
						</Link>
					)}
				</div>

				<Button content="Nouveau topo" href="/builder/new" fullWidth />
			</div>
		);
	}
);

LeftbarDesktop.displayName = "Leftbar Desktop";
