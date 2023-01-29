import React, { useCallback, useEffect, useRef, useState } from "react";
import { Quark, watchDependencies } from "helpers/quarky";
import { Name, Sector } from "types";

import Clear from "assets/icons/clear.svg";
import { Portal } from "helpers/hooks/useModal";
import { TextInput } from "components/molecules/form/TextInput";
import { Button } from "components/atoms/buttons/Button";

interface ModalRenameSectorProps {
	sector: Quark<Sector>;
	firstNaming?: boolean,
	onClose: () => void;
}

export const ModalRenameSector: React.FC<ModalRenameSectorProps> = watchDependencies(({
	firstNaming = false,
	...props}: ModalRenameSectorProps) => {
	const sector = props.sector();

	const [sectorNameError, setSectorNameError] = useState<string>();

	const inputRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
			inputRef.current.addEventListener("keydown", handleUserKeyPress);
			return () => {
				if (inputRef.current)
					inputRef.current.removeEventListener("keydown", handleUserKeyPress);
			};
		}
	}, [inputRef.current]);

	const handleUserKeyPress = useCallback((e: KeyboardEvent) => {
		e.stopPropagation();
		if (e.key === "Enter") props.onClose();
		if (e.key === "Escape") props.onClose();
	}, []);
	useEffect(() => {
		window.addEventListener("keydown", handleUserKeyPress);
		return () => {
			window.removeEventListener("keydown", handleUserKeyPress);
		};
	}, [handleUserKeyPress]);

	return (
		<Portal id="modal" open>
			<div
				className={`absolute top-0 left-0 h-screen w-screen bg-black bg-opacity-80`}
				style={{ zIndex: 9999 }} //No tailwind for this - bug with zIndex
				onClick={props.onClose}
				tabIndex={-1}
			>
				<div
					className="absolute top-[45%] left-[50%] min-h-[25%] w-11/12 translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white shadow md:top-[50%] md:w-5/12"
					// Avoid closing the modal when we click here (otherwise propagates to the backdrop)
					onClick={(e) => e.stopPropagation()}
				>
					<div className="flex flex-col gap-6 p-6 pt-10">
						{firstNaming && 
							<div className="flex flex-col gap-16">
								<div className="ktext-fun-title text-main text-center">Secteur créé !</div>
								<div className="ktext-base text-grey-medium">Est-ce qu'il a déjà un petit nom ?</div>
							</div>
						}

						{!firstNaming && <div className="ktext-base text-grey-medium">Renommer le secteur</div>}
						<TextInput
							ref={inputRef}
							id="sector-name"
							error={sectorNameError}
							value={sector.name}
							onChange={(e) => {
								props.sector.set((s) => ({
									...s,
									name: e.target.value as Name,
								}));
								if (e.target.value.length > 2) setSectorNameError(undefined);
								else
									setSectorNameError("Le nom doit avoir plus de 2 caractères");
							}}
						/>
						<Button
							content="valider"
							fullWidth
							activated={sector.name.length > 2}
							onClick={() => props.onClose()}
						/>
					</div>

					<div
						className="absolute top-3 right-3 md:cursor-pointer"
						onClick={props.onClose}
					>
						<Clear className="h-8 w-8 stroke-dark" />
					</div>
				</div>
			</div>
		</Portal>
	);
});
