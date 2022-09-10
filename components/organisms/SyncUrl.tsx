import { SelectedInfo, useSelectStore } from 'components/pages/selectStore';
import { useBreakpoint } from 'helpers/hooks';
import { decodeUUID, encodeUUID } from 'helpers/utils';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { isUUID, Topo, UUID } from 'types';

interface SyncUrlProps {
    topo: Topo,
}

export const SyncUrl: React.FC<SyncUrlProps> = (props: SyncUrlProps) => {
    const router = useRouter();
    const breakpoint = useBreakpoint();

    const selectedItem = useSelectStore(s => s.item);
    const selectedInfo = useSelectStore(s => s.info);
    const select = useSelectStore(s => s.select);

    // Sync URL with selectedItem
    useEffect(() => {
        const { i, p, w, b, t } = router.query;
        if (p) {
            const pId = decodeUUID(p as string);
            if (isUUID(pId)) {					
                const pQ = props.topo.parkings.findQuark((p) => p.id === pId);
                if (pQ) select.parking(pQ);
            }
        }
        else if (w) {
            const wId = decodeUUID(w as string);
            if (isUUID(wId)) {					
                const wQ = props.topo.waypoints.findQuark((w) => w.id === wId);
                if (wQ) select.waypoint(wQ);
            }
        }
        if (b) {
            const bId = decodeUUID(b as string);
            if (isUUID(bId)) {					
                const bQ = props.topo.boulders.findQuark((b) => b.id === bId);
                if (bQ) {	
                    if (t) {
                        const tId = decodeUUID(t as string);
                        if (isUUID(tId)) {					
                            const tQ = bQ().tracks.findQuark((t) => t.id === tId);
                            if (tQ) select.track(tQ, bQ);
                        }
                    }
                    else select.boulder(bQ);
                }
            }
        }
        if (i) select.info(i as SelectedInfo, breakpoint)
    }, []);

    useEffect(() => {
        let newQ: { id?: UUID, i?: SelectedInfo, p?: string, w?: string, b?: string, t?: string } = { ...router.query };
        delete newQ.id;

        if (selectedInfo === 'NONE') delete newQ.i;
        else if (router.query.i !== selectedInfo) newQ.i = selectedInfo;
    
        delete newQ.p; delete newQ.w; delete newQ.b; delete newQ.t;
        const type = selectedItem.type;
        if (type !== 'none') {
            const id = encodeUUID(selectedItem.value().id);
            if (type === 'parking') newQ.p = id;
            else if (type === 'waypoint') newQ.w = id;
            else if (type === 'boulder') { 
                newQ.b = id;
                if (selectedItem.selectedTrack) newQ.t = encodeUUID(selectedItem.selectedTrack().id)
            }
        }
        
        router.push(
            {
                pathname: window.location.href.split("?")[0],
                query: newQ,
            },
            undefined,
            { shallow: true }
        );
    }, [selectedInfo, selectedItem]);

    return null;
}