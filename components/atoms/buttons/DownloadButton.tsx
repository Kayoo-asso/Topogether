import React from 'react';
import { Signal } from 'helpers/quarky';
import { LightTopo, Topo } from 'types';
import { Icon } from '../Icon';

interface DownloadButtonProps {
    downloaded?: boolean,
    className?: string,
    topo: Signal<Topo> | Signal<LightTopo>
    onClick?: () => void,
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
    downloaded = false,
    ...props
}: DownloadButtonProps) => {
    
    return (
        <Icon
          name='download'
          wrapperClassName={props.className}
          SVGClassName={downloaded ? 'stroke-main h-6 w-6' : 'stroke-dark h-6 w-6'}
          onClick={props.onClick}
        />
    )
};