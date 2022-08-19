import React, { useCallback } from "react";
import { Button, ImageInput, Select, TextArea, TextInput } from "components";
import { Quark, watchDependencies } from "helpers/quarky";
import { Description, Difficulty, Topo } from "types";
import { DifficultyName, selectOptions } from "types/EnumNames";
import { v4 } from "uuid";

interface AccessFormProps {
	topo: Quark<Topo>;
	className?: string;
}

export const AccessForm: React.FC<AccessFormProps> = watchDependencies(
	(props: AccessFormProps) => {
		const accesses = props.topo().accesses;
		if (accesses.length < 1) {
			return (
				<div className="w-full pt-[10%]" onClick={(e) => e.stopPropagation()}>
					<Button
						content="Ajouter une marche d'approche"
						fullWidth
						onClick={() => {
							accesses.push({
								id: v4(),
								steps: [],
							})
						}}
					/>
				</div>
			);
		} else {
			const accessQuark = accesses.quarkAt(0);
			const access = accessQuark();
			return (
				<>
					<div
						className={`flex flex-col max-h-[85%] gap-6 pb-[25px] md:pb-[60px] pt-[20px] overflow-scroll ${
							props.className ? props.className : ""
						}`}
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex flex-row items-end gap-6">
							<Select
								id="access-difficulty"
								label="Difficulté"
								options={selectOptions(DifficultyName)}
								value={access.difficulty}
								onChange={useCallback((value: Difficulty) => {
									accessQuark.set(a => ({
										...a,
										difficulty: value,
									}));
								}, [accessQuark])}
							/>
							<TextInput
								id="access-duration"
								label="Durée (min)"
								type="number"
								step={1}
								value={access.duration}
								onChange={useCallback((e) =>
									accessQuark.set(a => ({
										...a,
										duration: parseInt(e.target.value),
									}))
								, [accessQuark])}
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
											onClick={useCallback(() => {
												newSteps.splice(index, 1);
												accessQuark.set(a => ({
													...a,
													steps: newSteps,
												}));
											}, [newSteps, accessQuark])}
										>
											Supprimer l'étape
										</div>
										<div className="flex flex-row items-start gap-6">
											<div className="w-32">
												<ImageInput
													value={step.image}
													onChange={useCallback((images) => {
														newSteps[index].image = images[0];
														accessQuark.set(a => ({
															...a,
															steps: newSteps,
														}));
													}, [newSteps[index].image, accessQuark])}
												/>
											</div>
											<TextArea
												id={"step" + index + "-description"}
												label="Description"
												value={step.description}
												onChange={useCallback((e) => {
													newSteps[index].description = e.target.value as Description;
														accessQuark.set(a => ({
														...a,
														steps: newSteps,
													}));
												}, [newSteps[index].description, accessQuark])}
											/>
										</div>
									</div>
								);
							})}
						</div>

						<Button
							content="Ajouter une étape"
							onClick={useCallback(() => {
								const newSteps = access.steps || [];
								newSteps.push({
									description: "" as Description,
								});
								accessQuark.set(a => ({
									...a,
									steps: newSteps,
								}));
							}, [access.steps, accessQuark])}
						/>

					</div>

					<Button
						content="Supprimer"
						fullWidth
						onClick={useCallback(() => accesses.removeQuark(accessQuark), [accesses, accessQuark])}
					/>
				</>
			);
		}
	}
);

AccessForm.displayName = "AccessForm";
