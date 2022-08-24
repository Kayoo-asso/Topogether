import React, { useCallback } from "react";
import { ImageInput, TextArea, TextInput } from "components";
import { Quark, QuarkArray, watchDependencies } from "helpers/quarky";
import { Description, Email, Manager, Name, Topo } from "types";
import { Button } from "components/atoms";
import { v4 } from "uuid";

interface ManagementFormProps {
	managers: QuarkArray<Manager>
	className?: string;
}

export const ManagementForm: React.FC<ManagementFormProps> = watchDependencies(
	(props: ManagementFormProps) => {

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
								onChange={useCallback((images) => {
									managerQuark.set(m => ({
										...m,
										image: images[0],
									}));
								}, [managerQuark])}
								onDelete={useCallback(() => {
									managerQuark.set(m => ({
										...m,
										image: undefined,
									}));
								}, [managerQuark])}
							/>
						</div>
						<TextInput
							id="manager-name"
							label="Nom de la structure"
							value={manager.name}
							onChange={useCallback((e) =>
								managerQuark.set(m => ({
									...m,
									name: e.target.value as Name,
								}))
							, [managerQuark])}
						/>
					</div>

					<TextInput
						id="manager-adress"
						label="Adresse"
						value={manager.address}
						onChange={useCallback((e) =>
							managerQuark.set(m => ({
								...m,
								address: e.target.value as Name,
							}))
						, [managerQuark])}
					/>
					<div className="flex flex-row gap-3">
						<TextInput
							id="manager-zip"
							label="Code postal"
							type="number"
							value={manager.zip}
							onChange={useCallback((e) =>
								managerQuark.set(m => ({
									...m,
									zip: parseInt(e.target.value),
								}))
							, [managerQuark])}
						/>
						<TextInput
							id="manager-city"
							label="Ville"
							value={manager.city}
							onChange={useCallback((e) =>
								managerQuark.set(m => ({
									...m,
									city: e.target.value as Name,
								}))
							, [managerQuark])}
						/>
					</div>

					<TextArea
						id="manager-description"
						label="Description"
						value={manager.description}
						onChange={useCallback((e) =>
							managerQuark.set(m => ({
								...m,
								description: e.target.value as Description,
							}))
						, [managerQuark])}
					/>

					<div className="ktext-subtitle">Contact</div>

					<TextInput
						id="manager-contact-name"
						label="Nom"
						value={manager.contactName}
						onChange={useCallback((e) =>
							managerQuark.set(m => ({
								...m,
								contactName: e.target.value as Name,
							}))
						, [managerQuark])}
					/>
					<TextInput
						id="manager-contact-mail"
						label="Email"
						value={manager.contactMail}
						onChange={useCallback((e) =>
							managerQuark.set(m => ({
								...m,
								contactMail: e.target.value as Email,
							}))
						, [managerQuark])}
					/>
					<TextInput
						id="manager-contact-phone"
						label="Téléphone"
						value={manager.contactPhone}
						onChange={useCallback((e) =>
							managerQuark.set(m => ({
								...m,
								contactPhone: e.target.value as Name,
							}))
						, [managerQuark])}
					/>

					<div className="pb-6 w-full">
						<Button
							content="Supprimer"
							fullWidth
							onClick={useCallback(() => 
								props.managers.removeQuark(managerQuark), 
							[props.managers, managerQuark])}
						/>
					</div>
				</div>
			);
		}
	}
);

ManagementForm.displayName = "ManagementForm";
