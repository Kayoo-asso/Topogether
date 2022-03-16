import React from 'react';
import { Quark, watchDependencies } from 'helpers/quarky';
import { Topo } from 'types';
import { computeBuilderProgress } from 'helpers';

interface BuilderProgressIndicatorProps {
    topo: Quark<Topo>,
}

export const BuilderProgressIndicator: React.FC<BuilderProgressIndicatorProps> = watchDependencies(
    (props: BuilderProgressIndicatorProps) => {
        return (<div className='w-10 h-10 rounded-full flex items-center justify-center border-2 border-white text-white ktext-light'>
            {Math.round(computeBuilderProgress(props.topo()) * 100)}%
        </div>)
    });

BuilderProgressIndicator.displayName = "BuilderProgressIndicator";