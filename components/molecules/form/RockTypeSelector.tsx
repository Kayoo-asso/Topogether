import React, { useCallback } from "react";
import { RockTypes, Topo } from "types";
import { Portal } from "helpers/hooks";
import { ValidateButton } from "components/atoms/buttons/ValidateButton";
import { MultipleSelectTouch } from "./MultipleSelectTouch";
import { Quark } from "helpers/quarky";
import { toggleFlag } from "helpers/bitflags";
import { rockNames } from "types/BitflagNames";

interface RockTypeSelectorProps {
	open: boolean;
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    topo: Quark<Topo>,
	// grade?: Grade;
	// onGradeSelect: (grade?: Grade) => void;
}

export const RockTypeSelector: React.FC<RockTypeSelectorProps> = (
	props: RockTypeSelectorProps
) => {
    const topo = props.topo();

	return (
        <Portal open={props.open}>
            <div className='w-full h-full bg-dark bg-opacity-95 flex flex-col px-8 absolute top-0 left-0 z-full md:px-[15%]'>
                
                <div className="w-full h-[7vh] flex justify-center items-center text-white ktext-title">
                    Choisir le type de roche
                </div>

                <div className="w-full flex-1 flex flex-col gap-12 justify-center items-center text-grey-light ktext-title">
                    <MultipleSelectTouch<RockTypes>
                        bitflagNames={rockNames}
                        value={topo.rockTypes}
                        white
                        big
                        onChange={useCallback((value) => {
                            props.topo.set(t => ({
                                ...t,
                                rockTypes: toggleFlag(t.rockTypes, value),
                            }));
                        }, [props.topo])}
                    />
                </div>

                <div className="w-full h-[10vh] flex justify-center">
                    <ValidateButton
                        onClick={() => props.setOpen && props.setOpen(false)}
                    />
                </div>

            </div>
        </Portal>
	);
};

RockTypeSelector.displayName = "RockTypeSelector";