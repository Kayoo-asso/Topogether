import React, { useContext, useState } from "react";
import { QuarkArray } from "helpers/quarky";
import { Manager } from "types";
import { CFImage } from "components/atoms/CFImage";
import { SlideoverMobile, SlideoverLeftDesktop, Flash } from "components/atoms";
import { TabOption, Tabs } from "components/layouts/Tabs";
import { useBreakpoint } from "helpers/hooks";

interface ManagementSlideoverProps {
	managers: QuarkArray<Manager>;
	open?: boolean;
	className?: string;
	onClose: () => void;
}

export const ManagementSlideover: React.FC<ManagementSlideoverProps> = ({
	open = true,
	...props
}: ManagementSlideoverProps) => {
	const breakpoint = useBreakpoint();
	const [flashMessage, setFlashMessage] = useState<string>();
	const [managerTab, setManagerTab] = useState(0);
	const manager = props.managers
		? props.managers.toArray()[managerTab]
		: undefined;

	const getTabOptions = (): TabOption[] => {
		const tabs: TabOption[] = [];
		for (let idx = 0; idx < props.managers.length; idx++) {
			tabs.push({
				label: `manager ${idx}`,
				color: "main",
				action: () => setManagerTab(idx),
			});
		}
		return tabs;
	};

	const managementContent = () => {
		if (!manager)
			return (
				<div className="flex h-full flex-col pt-5 md:pt-0">
					<div className="flex flex-col px-6 pt-5 md:px-0 md:pt-0">
						<div className="ktext-big-title mt-4 mb-6 w-full text-center md:mb-3">
							Aucun gestionnaire référencé pour ce spot
						</div>
					</div>
				</div>
			);
		else
			return (
				<div className="flex h-full flex-col pt-5 md:pt-0">
					<div className="flex flex-col px-6 pt-5 md:px-0 md:pt-0">
						<div className="ktext-big-title mt-4 mb-6 w-full text-center md:hidden">
							{"Gestionnaire" +
								(props.managers.length > 1 ? "s" : "") +
								" du spot"}
						</div>

						{props.managers.length > 1 && (
							<Tabs tabs={getTabOptions()} className="pt-4 pb-6" />
						)}
						<div className="flex flex-row items-center justify-end gap-6 pb-6 md:pt-8">
							{manager.image && (
								<div className="relative mt-2 min-h-[100px] w-1/2">
									<CFImage
										image={manager.image}
										alt={"Logo gestionnaire " + managerTab}
										sizeHint="30vw"
										objectFit="contain"
									/>
								</div>
							)}
							{manager.name && (
								<div className="w-1/2">
									<span className="font-semibold">{manager.name}</span>
								</div>
							)}
						</div>

						<div className="flex flex-row gap-4">
							<div className="flex w-1/2 flex-col gap-1">
								<div className="ktext-subtitle">Adresse</div>
								<div className="ktext-base-little">{manager.address}</div>
								<div className="ktext-base-little">
									{manager.zip} {manager.city}
								</div>
							</div>

							<div className="flex w-1/2 flex-col gap-1">
								<div className="ktext-subtitle">Coordonnées</div>
								<div className="ktext-base-little">{manager.contactName}</div>
								{manager.contactPhone && (
									<div className="ktext-base-little">
										{manager.contactPhone}
									</div>
								)}
								{manager.contactMail && (
									<div
										className="ktext-base-little cursor-pointer overflow-hidden text-main"
										onClick={() => {
											const data = [
												new ClipboardItem({
													"text/plain": new Blob([manager.contactMail!], {
														type: "text/plain",
													}),
												}),
											];
											navigator.clipboard.write(data).then(
												function () {
													setFlashMessage("Email copié dans le presse papier.");
												},
												function () {
													setFlashMessage("Impossible de copier l'email.");
												}
											);
										}}
									>
										{manager.contactMail}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			);
	};

	return (
		<>
			{breakpoint === "mobile" && (
				<SlideoverMobile onClose={props.onClose}>
					{managementContent()}
				</SlideoverMobile>
			)}
			{breakpoint !== "mobile" && (
				<SlideoverLeftDesktop
					title={
						"Gestionnaire" + (props.managers.length > 1 ? "s" : "") + " du spot"
					}
					open={open}
					onClose={props.onClose}
					className={props.className}
				>
					{managementContent()}
				</SlideoverLeftDesktop>
			)}

			<Flash open={!!flashMessage} onClose={() => setFlashMessage(undefined)}>
				{flashMessage}
			</Flash>
		</>
	);
};
