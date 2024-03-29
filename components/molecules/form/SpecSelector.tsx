import React, { useCallback, useState } from "react";
import { ValidateButton } from "components/atoms/buttons/ValidateButton";
import { listFlags, toggleFlag } from "helpers/bitflags";
import { TrackSpec } from "types";
import { BodyPositionName, HoldTypeName, TrackPersonnalityName, TrackSpecName, TrackStyleName } from "types/BitflagNames";
import { SelectListMultiple } from "./SelectListMultiple";
import { TextInput } from "./TextInput";
import { Portal } from "helpers/hooks/useModal";

interface SpecSelectorProps {
    value: TrackSpec;
    onChange: (v: TrackSpec) => void,
}

export const SpecSelector: React.FC<SpecSelectorProps> = (
	props: SpecSelectorProps
) => {
    const [specSelectorOpen, setSpecSelectorOpen] = useState(false);
    const [tempValue, setTempValue] = useState(props.value);
    const nbSpec = listFlags(tempValue, TrackSpecName).length;

    const updateTempValue = useCallback((v: TrackSpec) => {
        setTempValue(tv => toggleFlag(tv, v))
    }, []);

    const handleValidate = useCallback(() => {
        props.onChange(tempValue);
        setSpecSelectorOpen(false);
    }, [tempValue]);

	return (
        <>
            <TextInput
                id='spec-input'
                label='Spécifications'	
                value={nbSpec > 0 ? nbSpec + ' sélection' + (nbSpec > 1 ? 's' : '') : ''}
                readOnly
                pointer
                boldValue
                onClick={() => setSpecSelectorOpen(true)}
            />

            <Portal open={specSelectorOpen}>
                <div className='w-full h-full bg-dark bg-opacity-95 flex flex-col px-8 py-8 overflow-auto hide-scrollbar absolute top-0 left-0 z-full md:px-[15%]'>
                    
                    <div className="w-full h-[7vh] flex justify-center items-center text-white ktext-title">
                        Choisir les spécifications
                    </div>

                    <div className="w-full flex-1 flex flex-col justify-center items-center text-grey-light ktext-title">
                        <div className="pb-3">
                            <div className="text-center ktext-base-little border-second-light border-b py-1 text-second-light">Personnalité</div>
                            <SelectListMultiple
                                bitflagNames={TrackPersonnalityName}
                                value={tempValue}
                                white
                                onChange={updateTempValue}
                            />
                        </div>

                        <div className="pb-3">
                            <div className="text-center ktext-base-little border-second-light border-b py-1 text-second-light">Type de voie</div>
                            <SelectListMultiple
                                bitflagNames={TrackStyleName}
                                value={tempValue}
                                white
                                onChange={updateTempValue}
                            />
                        </div>
                        
                        <div className="pb-3">
                            <div className="text-center ktext-base-little border-second-light border-b py-1 text-second-light">Type de prises</div>
                            <SelectListMultiple
                                bitflagNames={HoldTypeName}
                                value={tempValue}
                                white
                                onChange={updateTempValue}
                            />
                        </div>

                        <div className="pb-3">
                            <div className="text-center ktext-base-little border-second-light border-b py-1 text-second-light">Techniques</div>
                            <SelectListMultiple
                                bitflagNames={BodyPositionName}
                                value={tempValue}
                                white
                                onChange={updateTempValue}
                            />
                        </div>
                    </div>

                    <div className="w-full h-[10vh] flex justify-center">
                        <ValidateButton
                            onClick={handleValidate}
                        />
                    </div>

                </div>
            </Portal>
        </>
	);
};

SpecSelector.displayName = "SpecSelector";