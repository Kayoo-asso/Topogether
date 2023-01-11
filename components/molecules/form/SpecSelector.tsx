import { ValidateButton } from "components/atoms/buttons/ValidateButton";
import { listFlags } from "helpers/bitflags";
import { Portal } from "helpers/hooks";
import React, { useState } from "react";
import { TrackSpec } from "types";
import { BodyPositionName, HoldTypeName, TrackDangerName, TrackSpecName, TrackStyleName } from "types/BitflagNames";
import { SelectListMultiple } from "./SelectListMultiple";
import { TextInput } from "./TextInput";

interface SpecSelectorProps {
    value: TrackSpec;
    onChange: (v: TrackSpec) => void,
}

export const SpecSelector: React.FC<SpecSelectorProps> = (
	props: SpecSelectorProps
) => {
    const [specSelectorOpen, setSpecSelectorOpen] = useState(false);

	return (
        <>
            <TextInput
                id='spec-input'
                label='Spécifications'	
                value={props.value && listFlags(props.value, TrackSpecName).join(", ")}
                readOnly
                pointer
                onClick={() => setSpecSelectorOpen(true)}
            />

            <Portal open={specSelectorOpen}>
                <div className='w-full h-full bg-dark bg-opacity-95 flex flex-col px-8 py-8 overflow-auto hide-scrollbar absolute top-0 left-0 z-full md:px-[15%]'>
                    
                    <div className="w-full h-[7vh] flex justify-center items-center text-white ktext-title">
                        Choisir les spécifications
                    </div>

                    <div className="w-full flex-1 flex flex-col justify-center items-center text-grey-light ktext-title">
                        <div className="pb-3">
                            <div className="text-center ktext-base-little border-second-light border-b py-1 text-second-light">Dangers</div>
                            <SelectListMultiple
                                bitflagNames={TrackDangerName}
                                value={props.value}
                                white
                                onChange={props.onChange}
                            />
                        </div>

                        <div className="pb-3">
                            <div className="text-center ktext-base-little border-second-light border-b py-1 text-second-light">Type de voie</div>
                            <SelectListMultiple
                                bitflagNames={TrackStyleName}
                                value={props.value}
                                white
                                onChange={props.onChange}
                            />
                        </div>
                        
                        <div className="pb-3">
                            <div className="text-center ktext-base-little border-second-light border-b py-1 text-second-light">Type de prises</div>
                            <SelectListMultiple
                                bitflagNames={HoldTypeName}
                                value={props.value}
                                white
                                onChange={props.onChange}
                            />
                        </div>

                        <div className="pb-3">
                            <div className="text-center ktext-base-little border-second-light border-b py-1 text-second-light">Techniques</div>
                            <SelectListMultiple
                                bitflagNames={BodyPositionName}
                                value={props.value}
                                white
                                onChange={props.onChange}
                            />
                        </div>
                    </div>

                    <div className="w-full h-[10vh] flex justify-center">
                        <ValidateButton
                            onClick={() => setSpecSelectorOpen(false)}
                        />
                    </div>

                </div>
            </Portal>
        </>
	);
};

SpecSelector.displayName = "SpecSelector";