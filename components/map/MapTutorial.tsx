import { Button } from "components/atoms/buttons/Button";
import { staticUrl } from "helpers/constants";
import { useModal } from "helpers/hooks/useModal"
import Image from "next/image";
import { useState } from "react";

export const MapTutorial: React.FC = () => {

    const [ModalTutorial, showModalTutorial] = useModal();
    const [step, setStep] = useState(0);

    return (
        <ModalTutorial>
            <div className="flex flex-col">
                <div className="ktext-title text-main">Création de secteurs</div>
                <div className="text-grey-light">Comment créé-t-on des secteurs sur Topogether</div>
                <Image 
                    src={staticUrl.defaultKayoo}
                />
                <div className="">
                    Une fois le bouton 'Nouveau secteur' sélectionné, cliquer une première fois sur la carte pour placer le premier point.
                </div>
            </div>
        </ModalTutorial>
    )
}

MapTutorial.displayName = "MapTutorial";
