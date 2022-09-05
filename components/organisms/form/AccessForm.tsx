import React from "react";
import { Button, ImageInput, Select, TextArea, TextInput } from "components";
import { QuarkArray, watchDependencies } from "helpers/quarky";
import { Description, Difficulty, TopoAccess } from "types";
import { DifficultyName, selectOptions } from "types/EnumNames";
import { v4 } from "uuid";

interface AccessFormProps {
	accesses: QuarkArray<TopoAccess>;
	className?: string;
}

export const AccessForm: React.FC<AccessFormProps> = watchDependencies(
	(props: AccessFormProps) => {
		const accessQuark = props.accesses.quarkAt(0);
		const access = accessQuark ? accessQuark() : undefined;
		
		return (
			<>
				{props.accesses.length < 1 &&	
					<div className="w-full pt-[10%]" onClick={(e) => e.stopPropagation()}>
						<Button
							content="Ajouter une marche d'approche"
							fullWidth
							onClick={() => {
								props.accesses.push({
									id: v4(),
									steps: [],
								})
							}}
						/>
					</div>
				}
				{props.accesses.length > 0 && accessQuark && access &&
					<>
						<div
							className={`flex flex-col max-h-[90%] gap-6 pb-6 overflow-auto ${
								props.className ? props.className : ""
							}`}
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex w-full ktext-subtitle mb-1">Marche d'approche</div>
							<div className="flex flex-row items-end gap-6">
								<Select
									id="access-difficulty"
									label="Difficulté"
									options={selectOptions(DifficultyName)}
									value={access.difficulty}
									onChange={(value: Difficulty) => {
										accessQuark.set(a => ({
											...a,
											difficulty: value,
										}));
									}}
								/>
								<TextInput
									id="access-duration"
									label="Durée (min)"
									type="number"
									step={1}
									value={access.duration}
									onChange={(e) =>
										accessQuark.set(a => ({
											...a,
											duration: parseInt(e.target.value),
										}))
									}
								/>
							</div>

							<div className="ktext-subtitle mt-3">Etapes</div>
							<div className="flex flex-col gap-6">
								{/* TODO : scroll to the new step when it is created */}
								{access.steps?.map((step, index) => {
									const newSteps = access.steps!;
									return (
										<div className="flex flex-col gap-2" key={index}>
											<div
												className="ktext-base-little mt-3 cursor-pointer text-main"
												onClick={() => {
													newSteps.splice(index, 1);
													accessQuark.set(a => ({
														...a,
														steps: newSteps,
													}));
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
															accessQuark.set(a => ({
																...a,
																steps: newSteps,
															}));
														}}
													/>
												</div>
												<TextArea
													id={"step" + index + "-description"}
													label="Description"
													value={step.description}
													onChange={(e) => {
														newSteps[index].description = e.target.value as Description;
															accessQuark.set(a => ({
															...a,
															steps: newSteps,
														}));
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
									accessQuark.set(a => ({
										...a,
										steps: newSteps,
									}));
								}}
							/>

						</div>

						<Button
							content="Supprimer"
							fullWidth
							onClick={() => props.accesses.removeQuark(accessQuark)}
						/>
					</>
				}
			</>
		)
	}
);

AccessForm.displayName = "AccessForm";
