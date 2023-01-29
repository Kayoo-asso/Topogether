import React from "react";

interface CloseButtonProps {
	className?: string;
    onClose?: () => void;
}

export const CloseButton: React.FC<CloseButtonProps> = (props: CloseButtonProps) => {
    return (
        <div
            className={`text-main ktext-section-title md:cursor-pointer ${props.className}`}
            onClick={(e) => {
                e.preventDefault(); e.stopPropagation();
                props.onClose && props.onClose();
            }}
        >X</div>
    );
}

CloseButton.displayName = "CloseButton";
