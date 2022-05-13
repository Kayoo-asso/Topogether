import React from 'react';
import { LightTopo, Topo } from 'types';
import Download from 'assets/icons/download.svg';

interface DownloadButtonProps {
    downloaded?: boolean,
    className?: string,
    topo: Topo | LightTopo,
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
    downloaded = false,
    ...props
}: DownloadButtonProps) => {

    const toggle = () => {
        alert("Fonctionnalité à venir");
    }

    return (
        <Download
            className={'cursor-pointer ' + (downloaded ? 'stroke-main h-5 w-5' : 'stroke-dark h-5 w-5')}
            onClick={toggle}
        />
    )
};