import React, { useState } from "react";
import { GeoCoordinates } from "types";

import Copy from "/assets/icons/copy.svg";
import { Flash } from "../overlays/Flash";
import { coordsToClipboard } from "helpers/coordsToClipboard";

interface ShareButtonProps {
    location: GeoCoordinates;
	className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = (props: ShareButtonProps) => {
    const [flashMessage, setFlashMessage] = useState<string>();

    const handleClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.preventDefault(); e.stopPropagation();
        coordsToClipboard(props.location, setFlashMessage);
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
