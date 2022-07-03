import React, { useEffect, useRef } from "react";
import { ImageInput, TextArea, TextInput } from "components";
import { Quark, watchDependencies } from "helpers/quarky";
import { Description, Email, Manager, Name, UUID } from "types";
import { Button } from "components/atoms";
import { useBreakpoint } from "helpers/hooks";

interface ManagementFormProps {
	manager: Quark<Manager>;
	className?: string;
	onCreateManager: () => void;
	onDeleteManager: (manager: Quark<Manager>) => void;
}

export const ManagementForm: React.FC<ManagementFormProps> = watchDependencies(
	(props: ManagementFormProps) => {
		const breakpoint = useBreakpoint();
		const nameInputRef = useRef<HTMLInputElement>(null);

		useEffect(() => {
			if (breakpoint === "desktop" && nameInputRef.current) {
				nameInputRef.current.focus();
			}
		}, []);

		if (!props.manager) {
			return (
				<div className="w-full pt-[10%]" onClick={(e) => e.stopPropagation()}>
					<Button content="Ajouter un gestionnaire" fullWidth onClick={props.onCreateManager} />
				</div>
			);
		} else {
			const manager = props.manager();
			return (
				<div
					className={"flex flex-col gap-6 h-full " + (props.className ? props.className : "")}
					onClick={(e) => e.stopPropagation()}
				>
					<div className="flex flex-row gap-6 items-end">
						<div className="w-32 md:mt-4">
							<ImageInput
								value={manager.image}
								onChange={(images) => {
									props.manager.set({
										...manager,
										image: images[0],
									});
								}}
								onDelete={() => {
									props.manager.set({
										...manager,
										image: undefined,
									});
								}}
							/>
						</div>
						<TextInput
							ref={nameInputRef}
							id="manager-name"
							label="Nom de la structure"
							value={manager.name}
							onChange={(e) =>
								props.manager.set({
									...manager,
									name: e.target.value as Name,
								})
							}
						/>
					</div>

					<TextInput
						id="manager-adress"
						label="Adresse"
						value={manager.address}
						onChange={(e) =>
							props.manager.set({
								...manager,
								address: e.target.value as Name,
							})
						}
					/>
					<div className="flex flex-row gap-3">
						<TextInput
							id="manager-zip"
							label="Code postal"
							type="number"
							value={manager.zip}
							onChange={(e) =>
								props.manager.set({
									...manager,
									zip: parseInt(e.target.value),
								})
							}
						/>
						<TextInput
							id="manager-city"
							label="Ville"
							value={manager.city}
							onChange={(e) =>
								props.manager.set({
									...manager,
									city: e.target.value as Name,
								})
							}
						/>
					</div>

					<TextArea
						id="manager-description"
						label="Description"
						value={manager.description}
						onChange={(e) =>
							props.manager.set({
								...manager,
								description: e.target.value as Description,
							})
						}
					/>

					<div className="ktext-subtitle">Contact</div>

					<TextInput
						id="manager-contact-name"
						label="Nom"
						value={manager.contactName}
						onChange={(e) =>
							props.manager.set({
								...manager,
								contactName: e.target.value as Name,
							})
						}
					/>
					<TextInput
						id="manager-contact-mail"
						label="Email"
						value={manager.contactMail}
						onChange={(e) =>
							props.manager.set({
								...manager,
								contactMail: e.target.value as Email,
							})
						}
					/>
					<TextInput
						id="manager-contact-phone"
						label="Téléphone"
						value={manager.contactPhone}
						onChange={(e) =>
							props.manager.set({
								...manager,
								contactPhone: e.target.value as Name,
							})
						}
					/>

					<Button content="Supprimer" onClick={() => props.onDeleteManager(props.manager)} />
				</div>
			);
		}
	}
);

ManagementForm.displayName = "ManagementForm";
