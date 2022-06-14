import React, { useEffect, useState } from 'react';
import NextImage from 'next/image';
import { staticUrl } from 'helpers';
import Share from 'assets/icons/share.svg';
import { Button } from 'components';

type BeforeInstallPromptEvent = Event & {
    prompt(): Promise<void>,
    readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const NoStandalone: React.FC = () => {
    const [isIos, setIsIos] = useState(false); 
    useEffect(() => {
        setIsIos([
            'iPad Simulator',
            'iPhone Simulator',
            'iPod Simulator',
            'iPad',
            'iPhone',
            'iPod'
          ].includes(navigator.platform)
          // iPad on iOS 13 detection
          || (navigator.userAgent.includes("Mac") && "ontouchend" in document));        
    }, []);

    const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent>();
    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            setInstallPromptEvent(e as BeforeInstallPromptEvent);
        });
    }, []);

    return (
        <div id="content" className="h-screen w-screen bg-main flex flex-col justify-center items-center text-white py-10 px-6">
            <div className="ktext-big-title">Topogether</div>
            <div className="h-[150px] w-[150px] relative my-14">
                <NextImage
                    src={staticUrl.logo_white}
                    priority
                    alt="Logo Topogether"
                    layout="fill"
                    objectFit="contain"
                />
            </div>

            <div className="mb-6">
                <strong>Pour installer l'application :</strong>
            </div>

            {isIos &&
                <div className='flex flex-col gap-2 justify-start'>
                    <div className="flex flex-row items-center gap-2">1. Cliquer sur le bouton <strong>Partager</strong><Share className='w-6 h-6 stroke-white' /></div>    
                    <div>2. Choisir <strong>Sur l'écran d'accueil +</strong></div>
                    <div>3. Cliquer sur <strong>Ajouter</strong></div>
                    <div>4. L'application est installée !</div>
                </div>
            }
            {!isIos &&
                <>
                    <div className="flex flex-row gap-2">1. Cliquer sur <strong>Installer </strong></div>
                    {installPromptEvent && 
                        <div>
                            <Button
                                content="Installer"
                                white
                                onClick={async () => {
                                    installPromptEvent.prompt();
                                    // TODO: do something with installPromptEvent.userChoice;
                                    // const { outcome } = await installPromptEvent.userChoice;

                                    // can only use the installPromptEvent once
                                    setInstallPromptEvent(undefined);
                                }}
                            />
                        </div>
                    }
                    <div>2. Suivez les instructions</div>
                    <div>3. L'application est installée !</div>
                </>
            }
        </div>
    )
}

export default NoStandalone;