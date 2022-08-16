import React, { useEffect, useRef } from "react";
import { ImageInput, TextArea, TextInput } from "components";
import { Quark, watchDependencies } from "helpers/quarky";
import { Description, Email, Name, Topo } from "types";
import { Button } from "components/atoms";
import { useBreakpoint } from "helpers/hooks";
import { v4 } from "uuid";

interface ManagementFormProps {
	topo: Quark<Topo>;
	className?: string;
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

		const managers = props.topo().managers

		if (managers.length < 1) {
			return (
				<div className="w-full pt-[10%]" onClick={(e) => e.stopPropagation()}>
					<Button
						content="Ajouter un gestionnaire"
						fullWidth
						onClick={() => {
							managers.push({
								id: v4(),
								name: "" as Name,
								contactName: "" as Name,
							})
						}}
					/>
				</div>
			);
		} else {
			const managerQuark = managers.quarkAt(0);
			const manager = managerQuark();
			return (
				<div
					className={
						"flex h-full flex-col gap-6 pb-[25px] md:pb-[60px] overflow-scroll " +
						(props.className ? props.className : "")
					}
					onClick={(e) => e.stopPropagation()}
				>
					<div className="flex flex-row items-end gap-6">
						<div className="w-32 md:mt-4">
							<ImageInput
								value={manager.image}
								onChange={(images) => {
									managerQuark.set({
										...manager,
										image: images[0],
									});
								}}
								onDelete={() => {
									managerQuark.set({
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
								managerQuark.set({
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
							managerQuark.set({
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
								managerQuark.set({
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
								managerQuark.set({
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
							managerQuark.set({
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
							managerQuark.set({
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
							managerQuark.set({
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
							managerQuark.set({
								...manager,
								contactPhone: e.target.value as Name,
							})
						}
					/>

					<Button
						content="Supprimer"
						onClick={() => managers.removeQuark(managerQuark)}
					/>
				</div>
			);
		}
	}
);

ManagementForm.displayName = "ManagementForm";
