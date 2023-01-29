import React, { useEffect, useState } from 'react';
import { sync, SyncStatus } from "helpers/services";
import { watchDependencies } from 'helpers/quarky';

import NoNetwork1 from "assets/icons/network-indicator/no-network1.svg";
import NoNetwork2 from "assets/icons/network-indicator/no-network2.svg";
import Saved1 from "assets/icons/network-indicator/saved1.svg";
import Saved2 from "assets/icons/network-indicator/saved2.svg";
import Saved3 from "assets/icons/network-indicator/saved3.svg";
import Saving1 from "assets/icons/network-indicator/saving1.svg";
import Saving2 from "assets/icons/network-indicator/saving2.svg";
import Saving3 from "assets/icons/network-indicator/saving3.svg";

const enum NetIcon {
    Saved1,
    Saved2,
    Saved3,
    Saving1,
    Saving2,
    Saving3,
    NoNet1,
    NoNet2,
}

export const NetworkIndicator: React.FC = watchDependencies(() => {
    const [icon, setIcon] = useState<NetIcon>(NetIcon.NoNet1);

    const syncStatus = sync.status();
    const isOnline = sync.isOnline();
    useEffect(() => {
        // console.log("is online ?")
        // console.log(isOnline);
        // console.log("sync status ?")
        // console.log(syncStatus);

        let interval: NodeJS.Timer;
        
        if (syncStatus === SyncStatus.UpToDate) {
            setIcon(NetIcon.Saved1);
            setTimeout(() => {
                setIcon(NetIcon.Saved2);
                setTimeout(() => setIcon(NetIcon.Saved3), 100);
            }, 50);
        }
        else if (isOnline) {
            interval = setInterval(() => {
                setIcon(icon => icon === NetIcon.Saving3 ? NetIcon.Saving2 : icon === NetIcon.Saving2 ? NetIcon.Saving1 : NetIcon.Saving3);
            }, 150);
        }
        else {
            interval = setInterval(() => {
               setIcon(icon => icon === NetIcon.NoNet1 ? NetIcon.NoNet2 : NetIcon.NoNet1);
           }, 1000);
        }

        return () => clearInterval(interval);
    }, [isOnline, syncStatus]);

    return (
        <>
            <div className={icon === NetIcon.Saved1 ? '' : 'hidden'}><Saved1 /></div>
            <div className={icon === NetIcon.Saved2 ? '' : 'hidden'}><Saved2 /></div>
            <div className={icon === NetIcon.Saved3 ? '' : 'hidden'}><Saved3 /></div>
            <div className={icon === NetIcon.Saving1 ? '' : 'hidden'}><Saving1 /></div>
            <div className={icon === NetIcon.Saving2 ? '' : 'hidden'}><Saving2 /></div>
            <div className={icon === NetIcon.Saving3 ? '' : 'hidden'}><Saving3 /></div>
            <div className={icon === NetIcon.NoNet1 ? '' : 'hidden'}><NoNetwork1 /></div>
            <div className={icon === NetIcon.NoNet2 ? '' : 'hidden'}><NoNetwork2 /></div>
        </>
    )
});

NetworkIndicator.displayName = 'NetworkIndicator';