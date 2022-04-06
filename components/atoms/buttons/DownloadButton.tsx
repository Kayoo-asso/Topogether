import React from 'react';
import { LightTopo, Topo } from 'types';
import Download from 'assets/icons/download.svg';

interface DownloadButtonProps {
    downloaded?: boolean,
    className?: string,
    topo: Topo | LightTopo,
    onClick?: () => void,
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
    downloaded = false,
    ...props
}: DownloadButtonProps) => {

    return (
        <Download
            className={'cursor-pointer ' + (downloaded ? 'stroke-main h-6 w-6' : 'stroke-dark h-6 w-6')}
            onClick={props.onClick}
        />
    )
};