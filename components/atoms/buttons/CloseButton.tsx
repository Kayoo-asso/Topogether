import React from "react";

import Copy from "/assets/icons/copy.svg";

interface CloseButtonProps {
	className?: string;
    onClose: () => void;
}

export const CloseButton: React.FC<CloseButtonProps> = (props: CloseButtonProps) => {
    return (
        <div
            className={`text-main ktext-section-title md:cursor-pointer ${props.className}`}
            onClick={(e) => {
                e.preventDefault(); e.stopPropagation();
                props.onClose();
            }}
        >X</div>
    );
}

CloseButton.displayName = "CloseButton";
