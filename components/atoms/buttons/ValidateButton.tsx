import React from "react";
import { RoundButton } from "./RoundButton";
import CheckIcon from "assets/icons/checked.svg";
import { Loading } from "./Loading";

interface ValidateButtonProps {
    white?: boolean,
    loading?: boolean,
    onClick: () => void,
}

export const ValidateButton: React.FC<ValidateButtonProps> = ({
    white = false,
    loading = false,
    ...props
}: ValidateButtonProps) => (
    <RoundButton 
        white={white}
        onClick={props.onClick}
    >
        {!loading &&
            <CheckIcon className={"h-6 w-6 " + (white ? "fill-main stroke-main" : "fill-white stroke-white")} />
        }
        {loading &&
		    <Loading SVGClassName={"h-6 w-6 " + (white ? "stroke-main" : "stroke-white")} bgWhite={false} />
        }
    </RoundButton>
)