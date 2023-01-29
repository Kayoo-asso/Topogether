import React, { useState } from "react";
import { GeoCoordinates } from "types";

import Copy from "/assets/icons/copy.svg";
import { Flash } from "../overlays/Flash";

interface ShareButtonProps {
    location: GeoCoordinates;
	className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = (props: ShareButtonProps) => {
    const [flashMessage, setFlashMessage] = useState<string>();

    const handleClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.preventDefault(); e.stopPropagation();
        const data = [
            new ClipboardItem({
                "text/plain": new Blob(
                    [props.location[1] + "," + props.location[0]],
                    {
                        type: "text/plain",
                    }
                ),
            }),
        ];
        navigator.clipboard.write(data).then(
            function () {
                setFlashMessage("Coordonnées copiées dans le presse papier.");
            },
            function () {
                setFlashMessage("Impossible de copier les coordonées.");
            }
        );
    }

    return (
        <>
            <Copy
                className={`h-5 w-5 stroke-main stroke-[1.5px] md:cursor-pointer ${props.className}`}
                onClick={handleClick}
            />

            <Flash open={!!flashMessage} onClose={() => setFlashMessage(undefined)}>
				{flashMessage}
			</Flash>
        </>
    );
}

ShareButton.displayName = "ShareButton";
