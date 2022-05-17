import React, { useEffect } from 'react';
import NextImage from 'next/image';
import { staticUrl } from 'helpers';
import Share from 'assets/icons/share.svg';

const NoStandalone: React.FC = () => {
    let isIos = false; 
    useEffect(() => {
        isIos = [
            'iPad Simulator',
            'iPhone Simulator',
            'iPod Simulator',
            'iPad',
            'iPhone',
            'iPod'
          ].includes(navigator.platform)
          // iPad on iOS 13 detection
          || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
    }, []);

    return (
        <div id="content" className="h-screen w-screen bg-main flex flex-col gap-2 justify-center items-center text-white py-10 px-6">
            <div className="ktext-big-title">Topogether</div>
            <div className="h-[150px] w-[150px] relative my-12">
                <NextImage
                    src={staticUrl.logo_white}
                    priority
                    alt="Logo Topogether"
                    layout="fill"
                    objectFit="contain"
                />
            </div>

            <div className="mb-5">
                <strong>Pour installer l'application :</strong>
            </div>

            {isIos &&
                <>
                    <div className="flex flex-row gap-2">1. Cliquer sur le bouton <strong>Partager </strong><Share className='w-6 h-6 stroke-white' /></div>    
                    <div>2. Choisir <strong>Sur l'écran d'accueil +</strong></div>
                    <div>3. L'application est installée !</div>
                </>
            }
            {!isIos &&
                <>
                    <div className="flex flex-row gap-2">1. Cliquer sur <strong>Installer </strong></div>    
                    <div>2. Suivez les instructions</div>
                    <div>3. L'application est installée !</div>
                </>
            }
        </div>
    )
}

export default NoStandalone;