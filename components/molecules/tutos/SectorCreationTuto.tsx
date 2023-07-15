import { Button } from "components/atoms/buttons/Button";
import { useTutoStore } from "components/store/tutoStore";
import { staticUrl } from "helpers/constants";
import { useBreakpoint } from "helpers/hooks/DeviceProvider";
import { useModal } from "helpers/hooks/useModal"
import Image from "next/image";
import { useEffect, useState } from "react";

export const SectorCreationTuto: React.FC = () => {
    const bp = useBreakpoint();
    const opened = useTutoStore(t => t.value === 'SECTOR_CREATION');
    const hideTuto = useTutoStore(t => t.hideTuto);

    const [ModalTutorial, showModalTutorial, hideModalTutorial] = useModal();

    useEffect(() => {
        if (opened) showModalTutorial();
        else hideModalTutorial();
    }, [opened]);

    const images = [
        staticUrl.illuSectorCreation5,
        staticUrl.illuSectorCreation1,
        staticUrl.illuSectorCreation2,
        staticUrl.illuSectorCreation3,
        staticUrl.illuSectorCreation4,
        staticUrl.illuSectorCreation4,
    ];
    const contents = [
        <>Cliquer sur la carte pour <span className="font-semibold">poser des points</span> aux angles du secteur.</>,
        <>Cliquer sur le premier point du secteur pour le refermer et <span className="font-semibold">le terminer</span>.</>,
        <>Cliquer sur le secteur pour <span className="font-semibold">le modifier, le déplacer ou le supprimer</span>.</>,
        <>Cliquer sur l'un des côtés du secteur pour <span className="font-semibold">ajouter un point sur le tracé</span>.</>,
        <>Cliquer-glisser un point <span className="font-semibold">pour modifier le tracé</span>.</>,
        <>Cliquer sur un point {bp === 'mobile' ? 'en maintenant la pression 2 secondes pour' : 'en maintenant la touche "alt" appuyée pour'} <span className="font-semibold">supprimer un point du tracé</span>.</>

    ];

    const [step, setStep] = useState(0);
    const handleClose = () => {
        setStep(0);
        hideTuto();
    }

    return (
        <ModalTutorial
            onClose={handleClose}
        >
            <div className="flex flex-col gap-3 md:px-10">
                <div className="ktext-section-title text-main">Création de secteurs</div>

                <div className="py-4">
                    <Image 
                        className="rounded-lg"
                        src={images[step]}
                        width={400}
                        height={400}
                        objectFit="contain"
                    />              
                    <div className="ktext-base-little pt-3">
                        {contents[step]}
                    </div>
                </div>

                <div className="flex flex-row pt-5 items-center">
                    <Button 
                        className="w-1/2"
                        content={step < 5 ? "Suivant" : "Terminer"}
                        onClick={() => step < 5 ? setStep(s => s < 6 ? s + 1 : 0) : handleClose()}
                    />
                    <div className="ktext-title text-grey-medium w-1/2 flex justify-end">{step+1} / {images.length}</div>
                </div>
            </div>
        </ModalTutorial>
    )
}

SectorCreationTuto.displayName = "SectorCreationTuto";
