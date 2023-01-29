import React, { useEffect, useState } from "react";
import NextImage from "next/image";
import { staticUrl } from "helpers/constants";
import Share from "assets/icons/share.svg";
import { useDevice } from "helpers/hooks/DeviceProvider";
import { Button } from "components/atoms/buttons/Button";

type BeforeInstallPromptEvent = Event & {
	prompt(): Promise<void>;
	readonly userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const NoStandalone: React.FC = () => {
	const device = useDevice();
	const isIos = device.apple.device;

	const [installPromptEvent, setInstallPromptEvent] =
		useState<BeforeInstallPromptEvent>();
	useEffect(() => {
		const onInstallPrompt = (e: Event) => {
			e.preventDefault();
			setInstallPromptEvent(e as BeforeInstallPromptEvent);
		};
		window.addEventListener("beforeinstallprompt", onInstallPrompt);
		return () =>
			window.removeEventListener("beforeinstallprompt", onInstallPrompt);
	}, []);

	return (
		<div
			id="content"
			className="flex h-screen w-screen flex-col items-center justify-center bg-main py-10 px-6 text-white"
		>
			<div className="ktext-big-title">Topogether</div>
			<div className="relative my-14 h-[150px] w-[150px]">
				<NextImage
					src={staticUrl.logo_white}
					priority
					alt="Logo Topogether"
					layout="fill"
					objectFit="contain"
				/>
			</div>

			<div className="mb-6">
				<strong>Pour installer l'application :</strong>
			</div>

			{isIos && (
				<div className="flex flex-col justify-start gap-2">
					<div className="flex flex-row items-center gap-2">
						1. Cliquer sur le bouton <strong>Partager</strong>
						<Share className="h-6 w-6 stroke-white" />
					</div>
					<div>
						2. Choisir <strong>Sur l'écran d'accueil +</strong>
					</div>
					<div>
						3. Cliquer sur <strong>Ajouter</strong>
					</div>
					<div>4. L'application est installée !</div>
				</div>
			)}
			{!isIos && installPromptEvent && (
				<>
					<div className="flex flex-row gap-2">
						1. Cliquer sur <strong>Installer </strong>
					</div>
					<div className="py-3">
						<Button
							content="Installer"
							white
							onClick={async () => {
								installPromptEvent.prompt();
								// TODO: do something with installPromptEvent.userChoice;
								// const { outcome } = await installPromptEvent.userChoice;

								// can only use the installPromptEvent once
								// setInstallPromptEvent(null);
							}}
						/>
					</div>
					<div>2. Suivre les instructions</div>
					<div>3. L'application est installée !</div>
				</>
			)}
			{!isIos && !installPromptEvent && (
				<>
					<div>1. Ouvrir les paramètres de la page</div>
					<div className="flex flex-row gap-2">
						2. Cliquer sur <strong>Installer l'application</strong>
					</div>
					<div>3. Suivre les instructions</div>
					<div>4. L'application est installée !</div>
				</>
			)}
		</div>
	);
};

export default NoStandalone;
