import React from "react";
import { Button, ImageInput, Select, TextArea, TextInput } from "components";
import { Quark, watchDependencies } from "helpers/quarky";
import { Description, TopoAccess } from "types";
import { DifficultyName, selectOptions } from "types/EnumNames";

interface AccessFormProps {
	access: Quark<TopoAccess>;
	className?: string;
	onCreateAccess: () => void;
	onDeleteAccess: (access: Quark<TopoAccess>) => void;
}

export const AccessForm: React.FC<AccessFormProps> = watchDependencies(
	(props: AccessFormProps) => {
		if (!props.access) {
			return (
				<div className="w-full pt-[10%]" onClick={(e) => e.stopPropagation()}>
					<Button
						content="Ajouter une marche d'approche"
						fullWidth
						onClick={props.onCreateAccess}
					/>
				</div>
			);
		} else {
			const access = props.access();
			return (
				<>
					<div
						className={
							"flex min-h-[85%] flex-col gap-6 pb-[25px] md:pb-[60px] " +
							(props.className ? props.className : "")
						}
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex flex-row items-end gap-6">
							<Select
								id="access-difficulty"
								label="Difficulté"
								options={selectOptions(DifficultyName)}
								value={access.difficulty}
								onChange={(value) => {
									props.access.set({
										...access,
										difficulty: value,
									});
								}}
							/>
							<TextInput
								id="access-duration"
								label="Durée (min)"
								type="number"
								step={1}
								value={access.duration}
								onChange={(e) =>
									props.access.set({
										...access,
										duration: parseInt(e.target.value),
									})
								}
							/>
						</div>

						<div className="ktext-subtitle mt-3">Etapes</div>
						<div className="flex flex-col gap-6 overflow-auto">
							{/* TODO : scroll to the new step when it is created */}
							{access.steps?.map((step, index) => {
								const newSteps = access.steps!;
								return (
									<div className="flex flex-col gap-2" key={index}>
										<div
											className="ktext-base-little mt-3 cursor-pointer text-main"
											onClick={() => {
												newSteps.splice(index, 1);
												props.access.set({
													...access,
													steps: newSteps,
												});
											}}
										>
											Supprimer l'étape
										</div>
										<div className="flex flex-row items-start gap-6">
											<div className="w-32">
												<ImageInput
													value={step.image}
													onChange={(images) => {
														newSteps[index].image = images[0];
														props.access.set({
															...access,
															steps: newSteps,
														});
													}}
												/>
											</div>
											<TextArea
												id={"step" + index + "-description"}
												label="Description"
												value={step.description}
												onChange={(e) => {
													newSteps[index].description = e.target
														.value as Description;
													props.access.set({
														...access,
														steps: newSteps,
													});
												}}
											/>
										</div>
									</div>
								);
							})}
						</div>

						<Button
							content="Ajouter une étape"
							onClick={() => {
								const newSteps = access.steps || [];
								newSteps.push({
									description: "" as Description,
								});
								props.access.set({
									...access,
									steps: newSteps,
								});
							}}
						/>
					</div>

					<Button
						content="Supprimer"
						fullWidth
						onClick={() => props.onDeleteAccess(props.access)}
					/>
				</>
			);
		}
	}
);

AccessForm.displayName = "AccessForm";
