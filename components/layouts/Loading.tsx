import { Icon } from 'components';
import React from 'react';

interface LoadingProps {
    SVGClassName?: string
    bgWhite?: boolean,
}

export const Loading: React.FC<LoadingProps> = ({
    SVGClassName = 'w-24 h-24',
    bgWhite = true,
}) => {
    return (
        <div className={'flex flex-col w-full h-full items-center justify-center'+(bgWhite ? ' bg-white' : '')}>
            <Icon
                name="spinner"
                SVGClassName={"stroke-main animate-spin m-2 "+SVGClassName}
                center
            />
        </div>
    )
}