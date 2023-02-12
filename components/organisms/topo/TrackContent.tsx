import { GradeCircle } from 'components/atoms/GradeCircle';
import { SelectedBoulder, useSelectStore } from 'components/pages/selectStore';
import { listFlags } from 'helpers/bitflags';
import React from 'react';
import { gradeToLightGrade } from 'types';
import { TrackSpecName } from 'types/BitflagNames';
import { OrientationName } from 'types/EnumNames';
import { ItemsHeaderButtons } from '../ItemsHeaderButtons';

export const TrackContent: React.FC = () => {
    const track = useSelectStore(s => s.item as SelectedBoulder).selectedTrack!();

    return (
        
        <div className="my-6 flex flex-col px-6 relative">

            <div className="mb-2 flex flex-row items-center">
                <GradeCircle grade={gradeToLightGrade(track.grade)} />
                <div className="ktext-big-title ml-3">{track.name}</div>
            </div>

            {track.isTraverse && (
                <div className="ktext-label text-grey-medium">Traversée</div>
            )}
            {track.isSittingStart && (
                <div className="ktext-label text-grey-medium">Départ assis</div>
            )}
            {track.mustSee && (
                <div className="ktext-label text-grey-medium">Incontournable !</div>
            )}

            <div className="ktext-base-little mt-4">{track.description}</div>

            <div className="mt-4 flex flex-col gap-3">
                <div>
                    <span className="ktext-subtitle">Techniques : </span>
                    {listFlags(track.spec!, TrackSpecName).join(", ")}
                </div>

                <div>
                    <span className="ktext-subtitle">Orientation :</span>
                    {OrientationName[track.orientation!]}
                </div>
            </div>
        </div>
    )
}