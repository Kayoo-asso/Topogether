import { Icon } from 'components';
import React from 'react';

export const Loading: React.FC = () => {
    return (
        <div className='flex flex-col w-full h-full items-center justify-center bg-white'>
            <Icon
                name="spinner"
                SVGClassName="stroke-main w-24 h-24 animate-spin m-2"
                center
            />
        </div>
    )
}