import React, { useCallback } from "react";
import { Grade, gradeToLightGrade } from "types";
import Circle from "assets/icons/circle.svg";
import { ValidateButton } from "components/atoms/buttons/ValidateButton";
import { Portal } from "helpers/hooks/useModal";
import { useDrawerStore } from "components/store/drawerStore";
import { SelectedBoulder, useSelectStore } from "components/store/selectStore";

const getFillGradeColorClass = (g: Grade | undefined) => {
    if (!g) return "fill-grey-light";
    const lightGrade = gradeToLightGrade(g);
    switch (lightGrade) {
        case 3: return "fill-grade-3";
        case 4: return "fill-grade-4"; break;
        case 5: return "fill-grade-5"; break;
        case 6: return "fill-grade-6"; break;
        case 7: return "fill-grade-7"; break;
        case 8: return "fill-grade-8"; break;
        case 9: return "fill-grade-9"; break;
        case 'P': return "fill-grey-light"; break;
    }
};

interface GradeselectorProps {}

const normalGrade = [9, 8, 7, 6, 5] as const;

export const GradeSelector: React.FC<GradeselectorProps> = (
	props: GradeselectorProps
) => {
    const isOpenGradeSelectorOpen = useDrawerStore(d => d.isGradeSelectorOpen);
    const closeGradeSelector = useDrawerStore(d => d.closeGradeSelector);
    const selectedBoulder = useSelectStore(s => s.item as SelectedBoulder);
    const grade = selectedBoulder.selectedTrack!().grade;

    const changeGrade = useCallback((g?: Grade) => {
        selectedBoulder.selectedTrack!.set(t => ({
            ...t,
            grade: g,
        }))
    }, [selectedBoulder]);

    const getNormalGradeLine = (g: typeof normalGrade[number]) => (
        <div className="w-full flex flex-row justify-between items-center" key={g}>
            <Circle className={"w-full mr-2 h-6 " + getFillGradeColorClass(g.toString() as Grade)} />
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
            className={"w-full rounded-sm p-1 justify-center md:cursor-pointer flex flex-row" + (grade === g ? ' text-white bg-main font-semibold' : '')}
            onClick={(e) => {
                e.stopPropagation(); e.preventDefault();
                changeGrade(g)
            }}
        >
            {label || g}
        </div>
    ), [grade]);

	return (
        <Portal open={isOpenGradeSelectorOpen}>
            <div className='w-full h-full bg-dark bg-opacity-95 flex flex-col px-8 py-3 absolute top-0 left-0 z-full md:px-[25%]'>
                
                <div className="w-full flex justify-center items-center text-white ktext-title">
                    Choisir la difficulté
                </div>

                <div className="w-full flex-1 flex flex-col justify-evenly items-center text-grey-light ktext-title">
                    {normalGrade.map(g => getNormalGradeLine(g))}

                    <div className="w-full flex flex-row justify-between items-center">
                        <Circle className={"w-full mr-2 h-6 " + getFillGradeColorClass('4')} />
                        {getInteractionDiv("4")}
                        {getInteractionDiv("4+")}
                        <Circle className={"w-full mr-2 h-6 " + getFillGradeColorClass('3')} />
                        {getInteractionDiv("3")}
                        {getInteractionDiv("3+")}
                        <div className='w-full'></div>
                    </div>

                    <div className="w-full flex justify-center">
                        <div 
                            className={"rounded-sm p-2 md:cursor-pointer flex flex-row" + (!grade ? ' text-white bg-main font-semibold' : '')}
                            onClick={(e) => {
                                e.stopPropagation(); e.preventDefault();
                                changeGrade(undefined);
                            }}
                        >
                            <Circle className={"mr-2 h-6 w-6 " + getFillGradeColorClass(undefined)} /> Projet
                        </div>
                    </div>
                </div>

                <div className="w-full flex justify-center">
                    <ValidateButton
                        onClick={closeGradeSelector}
                    />
                </div>

            </div>
        </Portal>
	);
};

GradeSelector.displayName = "GradeSelector";