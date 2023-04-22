import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import ArrowFull from "assets/icons/arrow-full.svg";
import { Dropdown, DropdownOption } from "components/molecules/form/Dropdown";
import { ProfilePicture } from "components/atoms/ProfilePicture";
import { useClerk, useUser } from "@clerk/nextjs";
import { getAuthMetadata } from "~/server/auth";

type HeaderDesktopProps = React.PropsWithChildren<{
	title: string;
	menuOptions?: DropdownOption[];
	displayLogin?: boolean;
	displayUser?: boolean;
	backLink: string;
	onBackClick?: () => void;
}>;

// TODO: start showing a loader as soon as a sign out happens?
export const HeaderDesktop = ({
	displayLogin = false,
	displayUser = true,
	...props
}: HeaderDesktopProps) => {
	const { user } = useUser();
	const userMeta = getAuthMetadata(user);
	const { signOut } = useClerk();
	const router = useRouter();

	const [menuOpen, setMenuOpen] = useState(false);
	const [userMenuOpen, setUserMenuOpen] = useState(false);

	const wrapLink = (elts: ReactElement<any, any>) => {
		if (props.onBackClick)
			return (
				<button
					onClick={() => {
						props.onBackClick!();
						router.push(props.backLink);
					}}
				>
					{elts}
				</button>
			);
		else return <Link href={props.backLink}>{elts}</Link>;
	};

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
			<div className={`relative h-[70%] w-1/12 md:cursor-pointer`}>
				{wrapLink(
					<Image
						src="/assets/img/Logo_white_topogether.png"
						width={60}
						height={60}
						priority
						alt="Logo Topogether"
					/>
				)}
			</div>

			<div
				className={`ktext-title mr-4 flex flex-row items-center whitespace-nowrap text-white md:cursor-pointer`}
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
				<Link href="/user/login"
          className="ktext-base mr-[3%] text-white md:cursor-pointer"
        >
						Se connecter
				</Link>
			)}

			{displayUser && user && (
				<div className="flex w-1/12 items-center justify-center">
					<div className="relative h-[45px] w-[45px]">
						<ProfilePicture
							image={userMeta?.image}
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
										await signOut();
										await router.push("/");
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
};

HeaderDesktop.displayName = "HeaderDesktop";
