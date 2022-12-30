import React, { useEffect, useRef, useState } from "react";
import { StringBetween, TopoTypes, User } from "types";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/router";
import { watchDependencies } from "helpers/quarky";
import { useBreakpoint, usePosition } from "helpers/hooks";
import { Header } from "components/layouts/Header";
import { TextInput } from "components/molecules";
import { TopoCreate, createTopo } from "helpers/quarkifyTopo";
import { encodeUUID } from "helpers/utils";
import { ValidateButton } from "components/atoms/buttons/ValidateButton";
import { SelectListMultiple } from "components/molecules/form/SelectListMultiple";
import { TopoTypesName } from "types/BitflagNames";
import { MapControl } from "components/map/MapControl";
import { toLonLat } from "ol/proj";
import { TopoMarkersLayer } from "components/map/markers/TopoMarkersLayer";

interface RootNewProps {
	user: User;
}

export const RootNew: React.FC<RootNewProps> = watchDependencies(
	(props: RootNewProps) => {
		const device = useBreakpoint();
		const router = useRouter();
		const { position } = usePosition();

		const [step, setStep] = useState(0);

		const [name, setName] = useState<string>();
		const [type, setType] = useState<TopoTypes>(TopoTypes.Boulder);
		// set initial position to user's location if possible
		const [longitude, setLongitude] = useState<number | undefined>(
			position ? position[0] : undefined
		);
		const [latitude, setLatitude] = useState<number | undefined>(
			position ? position[1] : undefined
		);

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

		const isValidStep0 = () => {
			// TODO : check if the name already exists
			if (!name) setNameError("Merci d'indiquer un nom valide");
			if (type === undefined || type === 0)
				setTypeError("Merci de sélectionner un type de spot");
			if (name && type !== undefined && !isNaN(type)) return true;
			else return false;
		};
		const isValidStep1 = () => {
			if (!latitude || isNaN(latitude)) setLatitudeError("Latitude invalide");
			if (!longitude || isNaN(longitude))
				setLongitudeError("Longitude invalide");
			if (latitude && !isNaN(latitude) && longitude && !isNaN(longitude))
				return true;
			else return false;
		};

		const goStep1 = () => {
			if (isValidStep0()) setStep(1);
		};
		const create = async () => {
			if (!isValidStep0()) setStep(0);
			else if (isValidStep1()) {
				setLoading(true);
				const topoData: TopoCreate = {
					id: uuid(),
					creator: props.user,
					name: name as StringBetween<1, 255>,
					status: 0,
					type: type,
					forbidden: false,
					location: [longitude!, latitude!],
					modified: new Date().toISOString(),
				};
				const newTopo = await createTopo(topoData);
				if (newTopo) {
					await router.push("/builder/" + encodeUUID(newTopo.id));
				} else {
					setCreationError("Une erreur est survenue. Merci de réessayer.");
				}
			}
		};

		useEffect(() => {
			document.addEventListener("keyup", (e) => {
				if (e.key === "Enter") {
					e.preventDefault();
					if (step === 0) goStep1();
					else create();
				}
			});
		});

		return (
			<>
				<Header
					title="Nouveau topo"
					backLink="/builder/dashboard"
					onBackClick={step > 0 ? () => setStep(step - 1) : undefined}
				/>

				<div
					className={
						"flex h-content w-full flex-row overflow-y-auto overflow-x-hidden bg-main pb-5 md:h-full " +
						(step === 1 ? "items-start" : "justify-center")
					}
				>
					<div className={"flex w-full flex-col items-center justify-center"}>
						{step === 0 && (
							<div className="flex h-full w-full flex-col justify-between px-[10%] pt-[45%] pb-[5%] md:pt-[20%]">
								<div className="flex w-full flex-col gap-20">
									<TextInput
										ref={nameInputRef}
										id="topo-name"
										label="Nom du topo"
										big
										white
										error={nameError}
										value={name}
										onChange={(e) => {
											setNameError(undefined);
											setName(e.target.value);
										}}
									/>

									<SelectListMultiple
										bitflagNames={TopoTypesName}
										value={type}
										white
										big={device === "desktop" ? true : false}
										justify={false}
										error={typeError}
										onChange={(val) => {
											setTypeError(undefined);
											setType(val);
										}}
									/>
								</div>

								<div className="flex w-full justify-center">
									<ValidateButton white onClick={goStep1} />
								</div>
							</div>
						)}

						{step === 1 && (
							<>
								<div className="ktext-subtitle w-[95%] py-5 text-center text-white">
									Vous pouvez cliquer sur la carte puis glisser le marqueur pour
									placer le topo.
								</div>
								<div className="mb-6 w-full h-[50vh] md:h-[55vh]">
									<MapControl 
										initialZoom={10}
										searchbarOptions={{ findPlaces: true }}
										onClick={(e) => {
											if (e.coordinate) {
												const lonlat = toLonLat(e.coordinate)
												setLongitude(lonlat[0]);
												setLatitude(lonlat[1]);
											}
										}}
										onUserMarkerClick={(pos) => {
											if (pos) {
												setLongitude(pos[0]);
												setLatitude(pos[1]);
											}
										}}
									>
										{latitude && longitude && (
											<TopoMarkersLayer 
												topos={[{ id: uuid(), type: type, location: [longitude, latitude] }]}
												draggable
												onDragEnd={(_, loc) => {
													setLongitude(loc[0]);
													setLatitude(loc[1]);
												}}
											/>
										)}
									</MapControl>
								</div>

								<div className="w-full px-[6%]">
									<div className="flex flex-row gap-4 md:gap-16 mb-6 md:mb-10">
										<TextInput
											id="topo-latitude"
											label="Latitude"
											error={latitudeError}
											white
											wrapperClassName="w-full"
											value={latitude}
											onChange={(e) => {
												setLatitudeError(undefined);
												setLatitude(parseFloat(e.target.value));
											}}
										/>
										<TextInput
											id="topo-longitude"
											label="Longitude"
											error={longitudeError}
											white
											wrapperClassName="w-full"
											value={longitude}
											onChange={(e) => {
												setLongitudeError(undefined);
												setLongitude(parseFloat(e.target.value));
											}}
										/>
									</div>

									<div className="flex w-full flex-row justify-center md:justify-between">
										{device === "desktop" && (
											<div
												className="flex cursor-pointer items-center text-white"
												onClick={() => setStep(0)}
											>
												Retour
											</div>
										)}
										<div>
											<ValidateButton
												white
												loading={loading}
												onClick={create}
											/>
											{creationError && (
												<div className="ktext-error mt-3 text-error">
													{creationError}
												</div>
											)}
										</div>
										{/* Just for alignment */}
										{device === "desktop" && <div></div>}
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
