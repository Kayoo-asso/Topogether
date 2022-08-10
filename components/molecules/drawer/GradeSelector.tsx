import React, { useCallback } from "react";
import { Grade, LightGrade } from "types";
import Circle from "assets/icons/circle.svg";
import { Portal } from "helpers/hooks";
import { ValidateButton } from "components/atoms/buttons/ValidateButton";

interface GradeselectorProps {
	open: boolean;
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
	grade?: Grade;
	onGradeSelect: (grade?: Grade) => void;
}

const normalGrade = [9, 8, 7, 6, 5] as const;
export const getLightGradeColorClass = (g: LightGrade) => {
    switch (g) {
        case 3:
            return "fill-grade-3";
        case 4:
            return "fill-grade-4";    
        case 5:
            return "fill-grade-5";
        case 6:
            return "fill-grade-6";
        case 7:
            return "fill-grade-7";
        case 8:
            return "fill-grade-8";
        case 9:
            return "fill-grade-9";
        case 'P':
            return "fill-grey-light";
    }
};

export const GradeSelector: React.FC<GradeselectorProps> = (
	props: GradeselectorProps
) => {

    const getNormalGradeLine = (g: typeof normalGrade[number]) => (
        <div className="w-full flex flex-row justify-between items-center" key={g}>
            <Circle className={"w-full mr-2 h-6 " + getLightGradeColorClass(g)} />
            {getInteractionDiv(g + "a" as Grade, g + 'A')}
            {getInteractionDiv(g + "a+" as Grade, 'A+')}
            {getInteractionDiv(g + "b" as Grade, 'B')}
            {getInteractionDiv(g + "b+" as Grade, 'B+')}
            {getInteractionDiv(g + "c" as Grade, 'C')}
            {getInteractionDiv(g + "c+" as Grade, 'C+')}
        </div>
    );

    const getInteractionDiv = useCallback((g: Grade, label?: string) => (
        <div 
            className={"w-full rounded-sm p-1 justify-center cursor-pointer flex flex-row" + (props.grade === g ? ' text-white bg-main font-semibold' : '')}
            onClick={() => props.onGradeSelect(g)}
        >
            {label || g}
        </div>
    ), [props.grade]);

	return (
        <Portal open={props.open}>
            <div className='w-full h-full bg-dark bg-opacity-95 flex flex-col px-8 absolute top-0 left-0 z-full'>
                
                <div className="w-full h-[7vh] flex justify-center items-center text-white ktext-title">
                    Choisir la difficulté
                </div>

                <div className="w-full flex-1 flex flex-col gap-12 justify-center items-center text-grey-light ktext-title">
                    {normalGrade.map(g => getNormalGradeLine(g))}

                    <div className="w-full flex flex-row justify-between items-center">
                        <Circle className={"w-full mr-2 h-6 " + getLightGradeColorClass(4)} />
                        {getInteractionDiv("4")}
                        {getInteractionDiv("4+")}
                        <Circle className={"w-full mr-2 h-6 " + getLightGradeColorClass(3)} />
                        {getInteractionDiv("3")}
                        {getInteractionDiv("3+")}
                    </div>

                    <div className="w-full flex justify-center">
                        <div 
                            className={"rounded-sm p-2 cursor-pointer flex flex-row" + (!props.grade ? ' text-white bg-main font-semibold' : '')}
                            onClick={() => props.onGradeSelect(undefined)}
                        >
                            <Circle className={"mr-2 h-6 w-6 " + getLightGradeColorClass('P')} /> Projet
                        </div>
                    </div>
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

GradeSelector.displayName = "GradeSelector";