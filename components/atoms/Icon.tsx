import React from 'react';
import { ReactSVG } from 'react-svg';

interface IconProps {
    name: string,
    className?: string,
    onClick?: () => void,
}

export const Icon: React.FC<IconProps> = props => { 

    return (
        <>
            <ReactSVG 
                src={"/assets/icons/_"+props.name+".svg"}
                wrapper='span'
                beforeInjection={svg => {
                    svg.setAttribute('class', `${props.className}`)
                  }}
                loading={() => <span className='ktext-subtext'>Loading...</span>}
                onClick={props.onClick}
            />
        </>        
    )
}