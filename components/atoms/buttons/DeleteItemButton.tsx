import React from "react";
import { RoundButton } from "./RoundButton";
import { SelectedItem } from "components/pages/selectStore";
import { useDeleteStore } from "components/pages/deleteStore";

import BinIcon from "assets/icons/bin.svg";

interface DeleteItemButtonProps {
    item: SelectedItem;
    white?: boolean,
}

export const DeleteItemButton: React.FC<DeleteItemButtonProps> = ({
    white = false,
    ...props
}: DeleteItemButtonProps) => {
    const del = useDeleteStore(d => d.delete);
    
    return (
        <RoundButton 
            white={white}
            onClick={() => del.item(props.item)}
        >
            <BinIcon className={"h-6 w-6 stroke-2 " + (white ? "stroke-main" : "stroke-white")} />
        </RoundButton>
    )
}

DeleteItemButton.displayName = "DeleteItemButton";