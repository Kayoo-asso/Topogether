import React, { useContext, useEffect, useRef, useState } from "react";
import { StringBetween, TopoType, User } from "types";
import Link from "next/link";
import { v4 } from "uuid";
import { useRouter } from "next/router";
import { useCreateQuark, watchDependencies } from "helpers/quarky";
import { selectOptions, TopoTypeName } from "types/EnumNames";
import { usePosition } from "helpers/hooks";
import { Button } from "components/atoms";
import { Header } from "components/layouts/Header";
import { MapControl, CreatingTopoMarker } from "components/map";
import { TextInput, Select } from "components/molecules";
import { fontainebleauLocation } from "helpers/constants";
import { TopoCreate, createTopo } from "helpers/quarkifyTopo";
import { encodeUUID } from "helpers/utils";

interface RootNewProps {
	user: User;
}

export const RootNew: React.FC<RootNewProps> = watchDependencies(
	(props: RootNewProps) => {
		const router = useRouter();
		const { position } = usePosition();

		const [step, setStep] = useState(0);

		const topoData: TopoCreate = {
			id: v4(),
			creator: props.user,
			name: "" as StringBetween<1, 255>,
			status: 0,
			type: undefined,
			forbidden: false,
			location: position || fontainebleauLocation, // set initial position to user's location
			modified: new Date().toISOString(),
		};

		const topoQuark = useCreateQuark<TopoCreate>(topoData);
		const topo = topoQuark();

		const [loading, setLoading] = useState<boolean>(false);
		const [nameError, setNameError] = useState<string>();
		const [typeError, setTypeError] = useState<string>();
		const [latitudeError, setLatitudeError] = useState<string>();
		const [longitudeError, setLongitudeError] = useState<string>();
		const [creationError, setCreationError] = useState<string>();

		const nameInputRef = useRef<HTMLInputElement>(null);
		useEffect(() => {
			if (nameInputRef.current) nameInputRef.current.focus();
		}, [nameInputRef]);

		const goStep1 = () => {
			// TODO : check if the name already exists
			if (!topo.name) setNameError("Merci d'indiquer un nom valide");
			else setStep(1);
		};
		const goStep2 = () => {
			if (topo.type && isNaN(topo.type))
				setTypeError("Merci d'indiquer un type de spot");
			else setStep(2);
		};

		const create = async () => {
			setLoading(true);
			const newTopo = await createTopo(topo);
			if (newTopo) {
				await router.push("/builder/" + encodeUUID(newTopo.id));
			} else {
				setCreationError("Une erreur est survenue. Merci de réessayer.");
			}
		};

		useEffect(() => {
			document.addEventListener("keyup", (e) => {
				if (e.key === "Enter") {
					e.preventDefault();
					if (step === 0) goStep1();
					else if (step === 1) goStep2();
					else create();
				}
			});
		});

		return (
			<>
				<Header backLink="/builder/dashboard" title="Nouveau topo" />

				<div
					className={
						"flex h-content w-full flex-row overflow-y-auto overflow-x-hidden bg-main pb-5 md:h-full " +
						(step === 2 ? "items-start" : "justify-center")
					}
				>
					<div className={"flex w-full flex-col items-center justify-center"}>
						{step === 0 && (
							<div className="w-full px-[10%]">
								<TextInput
									ref={nameInputRef}
									id="topo-name"
									label="Nom du topo"
									big
									white
									wrapperClassName="w-full mb-10"
									error={nameError}
									value={topo.name}
									onChange={(e) => {
										setNameError(undefined);
										topoQuark.set({
											...topo,
											name: e.target.value as StringBetween<1, 255>,
										});
									}}
								/>
								<div className="md :justify-end flex w-full flex-row items-center  justify-between">
									<Link href="/builder/dashboard">
										<a className="ktext-base-little cursor-pointer text-white md:mr-16">
											Annuler
										</a>
									</Link>
									<Button content="Suivant" white onClick={goStep1} />
								</div>
							</div>
						)}

						{step === 1 && (
							<div className="w-full px-[10%]">
								<Select
									id="topo-type"
									label="Type de spot"
									options={selectOptions(TopoTypeName)}
									big
									white
									wrapperClassname="w-full mb-10"
									value={topo.type}
									error={typeError}
									onChange={(val: TopoType) => {
										setTypeError(undefined);
										topoQuark.set({
											...topo,
											type: val,
										});
									}}
								/>
								<div className="flex w-full flex-row items-center justify-between md:justify-end">
									<div
										className="ktext-base-little cursor-pointer text-white md:mr-16"
										onClick={() => setStep(0)}
									>
										Retour
									</div>
									<Button
										content="Suivant"
										white
										onClick={goStep2}
										activated={!loading}
									/>
								</div>
							</div>
						)}

						{step === 2 && (
							<>
								<div className="mb-10 h-[55vh] w-full md:mb-16 md:h-[65vh]">
									<MapControl
										initialZoom={10}
										searchbarOptions={{ findPlaces: true }}
										onClick={(e) => {
											if (e.latLng) {
												topoQuark.set({
													...topo,
													location: [e.latLng.lng(), e.latLng.lat()],
												});
											}
										}}
										onUserMarkerClick={(e) => {
											if (e.latLng) {
												topoQuark.set({
													...topo,
													location: [e.latLng.lng(), e.latLng.lat()],
												});
											}
										}}
									>
										<CreatingTopoMarker topo={topoQuark} draggable />
									</MapControl>
								</div>

								<div className="w-full px-[10%]">
									<div className="flex flex-row gap-4 md:gap-16">
										<TextInput
											id="topo-latitude"
											label="Latitude"
											error={latitudeError}
											white
											wrapperClassName="w-full mb-10"
											value={topo.location[1] || ""}
											onChange={(e) => {
												setLatitudeError(undefined);
												topoQuark.set({
													...topo,
													location: [
														topo.location[0],
														parseFloat(e.target.value),
													],
												});
											}}
										/>
										<TextInput
											id="topo-longitude"
											label="Longitude"
											error={longitudeError}
											white
											wrapperClassName="w-full mb-10"
											value={topo.location[0] || ""}
											onChange={(e) => {
												setLongitudeError(undefined);
												topoQuark.set({
													...topo,
													location: [
														parseFloat(e.target.value),
														topo.location[1],
													],
												});
											}}
										/>
									</div>
									<div className="flex w-full flex-row items-center justify-between md:justify-end">
										<div
											className="ktext-base-little cursor-pointer text-white md:mr-16"
											onClick={() => setStep(1)}
										>
											Retour
										</div>
										<Button
											content="Créer"
											white
											loading={loading}
											onClick={() => {
												if (isNaN(topo.location[1]))
													setLatitudeError("Latitude invalide");
												if (isNaN(topo.location[0]))
													setLongitudeError("Longitude invalide");
												if (
													!isNaN(topo.location[1]) &&
													!isNaN(topo.location[0])
												)
													create();
											}}
										/>
										{creationError && (
											<div className="ktext-error">{creationError}</div>
										)}
									</div>
								</div>
							</>
						)}
					</div>
				</div>
			</>
		);
	}
);