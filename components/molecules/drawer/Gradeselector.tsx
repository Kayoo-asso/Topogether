import { Icon } from 'components';
import React, { useEffect, useRef, useState } from 'react';
import { Grade, grades } from 'types';

interface GradeselectorDrawerProps {
    grade?: Grade,
    onGradeSelect: (grade: Grade) => void,
}

export const Gradeselector: React.FC<GradeselectorDrawerProps> = (props: GradeselectorDrawerProps) => {
    const selectorContainerRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);

    const getGradeColorClass = (grade: Grade) => {
        const lightGrade = parseInt(grade[0]);
        switch (lightGrade) {
            case 3:
                return 'fill-grade-3';
            case 4:
                return 'fill-grade-4';
            case 5:
                return 'fill-grade-5';
            case 6:
                return 'fill-grade-6';
            case 7:
                return 'fill-grade-7';
            case 8:
                return 'fill-grade-8';
            case 9:
                return 'fill-grade-9';
        }
    }

    useEffect(() => {
        if (selectorContainerRef.current) {
            selectorContainerRef.current.scrollIntoView({ behavior: 'auto'});
        }
    }, [selectorContainerRef, open])

    return (
       <>
        <span
            className={'flex flex-row cursor-pointer items-center ' + (props.grade ? 'ktext-base text-white' : 'ktext-title text-grey-medium')}
            onClick={() => setOpen(!open)}
        >
            <Icon 
                name='circle'
                SVGClassName={'h-6 w-6 mr-2 ' + (props.grade ? getGradeColorClass(props.grade) : 'fill-grey-medium')}
            />
            {props.grade ? props.grade : 'Diff'}
        </span>

        {open &&
            <div className='absolute flex bottom-0 h-[520px] pt-8 flex-col gap-5 items-start bg-dark rounded-t-full mt-8 mb-[7vh] overflow-y-scroll overflow-x-hidden hide-scrollbar right-[17%] md:right-[5%]'>
                {[...grades].reverse().map(grade => (
                    <span
                        key={grade}
                        className='flex flex-row items-center text-white ktext-base px-3 cursor-pointer'
                        onClick={() => {
                            props.onGradeSelect(grade);
                            setOpen(false);
                        }}
                    >
                        <Icon 
                            name='circle'
                            SVGClassName={'h-6 w-6 mr-2 ' + getGradeColorClass(grade)}
                        />
                        {grade}
                    </span>
                ))}
                <span ref={selectorContainerRef}></span>
            </div>
        }
       </> 
    )
}