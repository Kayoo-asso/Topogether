import React from "react";
import { QuarkArray, watchDependencies } from "helpers/quarky";
import { Description, Email, Manager, Name } from "types";
import { v4 } from "uuid";
import { Button } from "components/atoms/buttons/Button";
import { ImageInput } from "components/molecules/form/ImageInput";
import { TextInput } from "components/molecules/form/TextInput";
import { TextArea } from "components/molecules/form/TextArea";
import { useDeleteStore } from "components/store/deleteStore";

interface ManagementFormProps {
	managers: QuarkArray<Manager>
	className?: string;
}

export const ManagementForm: React.FC<ManagementFormProps> = watchDependencies(
	(props: ManagementFormProps) => {
		const del = useDeleteStore(d => d.delete);

		if (props.managers.length < 1) {
			return (
				<div className="w-full pt-[10%]" onClick={(e) => e.stopPropagation()}>
					<Button
						content="Ajouter un gestionnaire"
						fullWidth
						onClick={() => {
							props.managers.push({
								id: v4(),
								name: "" as Name,
								contactName: "" as Name,
							})
						}}
					/>
				</div>
			);
		} else {
			const managerQuark = props.managers.quarkAt(0);
			const manager = managerQuark();
			return (
				<div
					className={
						"flex flex-col h-full gap-6 overflow-scroll " +
						(props.className ? props.className : "")
					}
					onClick={(e) => e.stopPropagation()}
				>
					<div className="flex w-full ktext-subtitle mb-1">Gestionnaire du spot</div>
					<div className="flex flex-row items-end gap-6">
						<div className="w-32 md:mt-4">
							<ImageInput
								value={manager.image}
								onChange={(images) => {
									managerQuark.set(m => ({
										...m,
										image: images[0],
									}));
								}}
								onDelete={() => {
									managerQuark.set(m => ({
										...m,
										image: undefined,
									}));
								}}
							/>
						</div>
						<TextInput
							id="manager-name"
							label="Nom de la structure"
							value={manager.name}
							onChange={(e) =>
								managerQuark.set(m => ({
									...m,
									name: e.target.value as Name,
								}))
							}
						/>
					</div>

					<TextInput
						id="manager-adress"
						label="Adresse"
						value={manager.address}
						onChange={(e) =>
							managerQuark.set(m => ({
								...m,
								address: e.target.value as Name,
							}))
						}
					/>
					<div className="flex flex-row gap-3">
						<TextInput
							id="manager-zip"
							label="Code postal"
							type="number"
							value={manager.zip}
							onChange={(e) =>
								managerQuark.set(m => ({
									...m,
									zip: parseInt(e.target.value),
								}))
							}
						/>
						<TextInput
							id="manager-city"
							label="Ville"
							value={manager.city}
							onChange={(e) =>
								managerQuark.set(m => ({
									...m,
									city: e.target.value as Name,
								}))
							}
						/>
					</div>

					<TextArea
						id="manager-description"
						label="Description"
						value={manager.description}
						onChange={(e) =>
							managerQuark.set(m => ({
								...m,
								description: e.target.value as Description,
							}))
						}
					/>

					<div className="ktext-subtitle">Contact</div>

					<TextInput
						id="manager-contact-name"
						label="Nom"
						value={manager.contactName}
						onChange={(e) =>
							managerQuark.set(m => ({
								...m,
								contactName: e.target.value as Name,
							}))
						}
					/>
					<TextInput
						id="manager-contact-mail"
						label="Email"
						value={manager.contactMail}
						onChange={(e) =>
							managerQuark.set(m => ({
								...m,
								contactMail: e.target.value as Email,
							}))
						}
					/>
					<TextInput
						id="manager-contact-phone"
						label="Téléphone"
						value={manager.contactPhone}
						onChange={(e) =>
							managerQuark.set(m => ({
								...m,
								contactPhone: e.target.value as Name,
							}))
						}
					/>

					<div className="pb-6 w-full">
						<Button
							content="Supprimer"
							fullWidth
							onClick={() => del.item({ type: 'manager', value: managerQuark })}
						/>
					</div>
				</div>
			);
		}
	}
);

ManagementForm.displayName = "ManagementForm";
