import React, { useCallback } from "react";
import { Grade } from "types";
import Circle from "assets/icons/circle.svg";
import { ValidateButton } from "components/atoms/buttons/ValidateButton";
import { Portal } from "helpers/hooks/useModal";
import { useDrawerStore } from "components/store/drawerStore";
import { SelectedBoulder, useSelectStore } from "components/store/selectStore";
import { getFillLightGradeColorClass } from "helpers/gradeColors";

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
            <Circle className={"w-full mr-2 h-6 " + getFillLightGradeColorClass(g)} />
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
            <div className='w-full h-full bg-dark bg-opacity-95 flex flex-col px-8 absolute top-0 left-0 z-full md:px-[15%]'>
                
                <div className="w-full h-[7vh] flex justify-center items-center text-white ktext-title">
                    Choisir la difficulté
                </div>

                <div className="w-full flex-1 flex flex-col gap-12 justify-center items-center text-grey-light ktext-title">
                    {normalGrade.map(g => getNormalGradeLine(g))}

                    <div className="w-full flex flex-row justify-between items-center">
                        <Circle className={"w-full mr-2 h-6 " + getFillLightGradeColorClass(4)} />
                        {getInteractionDiv("4")}
                        {getInteractionDiv("4+")}
                        <Circle className={"w-full mr-2 h-6 " + getFillLightGradeColorClass(3)} />
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
                            <Circle className={"mr-2 h-6 w-6 " + getFillLightGradeColorClass('P')} /> Projet
                        </div>
                    </div>
                </div>

                <div className="w-full h-[10vh] flex justify-center">
                    <ValidateButton
                        onClick={closeGradeSelector}
                    />
                </div>

            </div>
        </Portal>
	);
};

GradeSelector.displayName = "GradeSelector";