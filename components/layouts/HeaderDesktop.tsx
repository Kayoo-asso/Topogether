import React, { ReactNode, useEffect, useState } from "react";
import NextImage from "next/image";
import { ProfilePicture } from "components/atoms";
import { Dropdown, DropdownOption } from "components/molecules/form";
import Link from "next/link";
import { useAuth } from "helpers/services";
import { useRouter } from "next/router";
import { watchDependencies } from "helpers/quarky";
import ArrowFull from "assets/icons/arrow-full.svg";

interface HeaderDesktopProps {
	backLink: string;
	title: string;
	menuOptions?: DropdownOption[];
	displayLogin?: boolean;
	displayUser?: boolean;
	children?: ReactNode;
}

// TODO: start showing a loader as soon as a sign out happens?
export const HeaderDesktop: React.FC<HeaderDesktopProps> = watchDependencies(
	({
		displayLogin = false,
		displayUser = true,
		...props
	}: HeaderDesktopProps) => {
		const auth = useAuth();
		const user = auth.session();
		const router = useRouter();

		const [menuOpen, setMenuOpen] = useState(false);
		const [userMenuOpen, setUserMenuOpen] = useState(false);

		useEffect(() => {
			const handleKeydown = (e: KeyboardEvent) => {
				if (e.key === "Escape") {
					setMenuOpen(false);
					setUserMenuOpen(false);
				}
			};
			window.addEventListener("keydown", handleKeydown);
			return () => window.removeEventListener("keydown", handleKeydown);
		}, []);

		return (
			<div className="hidden h-header items-center bg-dark md:flex">
				<Link href={props.backLink}>
					<a className="relative h-[70%] w-1/12 cursor-pointer">
						<NextImage
							src="/assets/img/Logo_white_topogether.png"
							priority
							alt="Logo Topogether"
							layout="fill"
							objectFit="contain"
						/>
					</a>
				</Link>

				<div
					className="ktext-title mr-4 flex cursor-pointer flex-row items-center whitespace-nowrap text-white"
					onClick={() => setMenuOpen(!menuOpen)}
				>
					{props.title}
					{props.menuOptions && (
						<ArrowFull className="ml-[20px] mr-10 h-4 w-4 rotate-90 fill-white" />
					)}
					{props.menuOptions && menuOpen && (
						<Dropdown
							options={props.menuOptions}
							onSelect={() => setMenuOpen(false)}
							className="top-[7%]"
						/>
					)}
				</div>

				<div className="flex flex-auto flex-row items-center">
					{props.children}
				</div>

				{displayLogin && !user && (
					<Link href="/user/login">
						<a className="ktext-base mr-[3%] cursor-pointer text-white">
							Se connecter
						</a>
					</Link>
				)}

				{displayUser && user && (
					<div className="flex w-1/12 items-center justify-center">
						<div className="relative h-[45px] w-[45px]">
							<ProfilePicture
								image={user?.image}
								onClick={() => setUserMenuOpen((m) => !m)}
							/>
						</div>
						{userMenuOpen && (
							<Dropdown
								options={[
									{
										value: "Mon profil",
										action: () => router.push("/user/profile"),
									},
									{
										value: "Se déconnecter",
										action: async () => {
											const success = await auth.signOut();
											if (success) await router.push("/");
										},
									},
								]}
								className="-ml-[180px] mt-[180px] w-[200px]"
							/>
						)}
					</div>
				)}
			</div>
		);
	}
);

HeaderDesktop.displayName = "Header Desktop";
