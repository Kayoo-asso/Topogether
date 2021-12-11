import React from 'react';
import { ReactSVG } from 'react-svg';
import { color } from 'types/types';

interface IconProps {
    name: string,
    color?: color,
    strokeColored?: boolean,
    fillColored?: boolean,
    size?: number,
    rotation?: number,
    onClick?: () => void,
}

export const Icon: React.FC<IconProps> = props => { 
    console.log(props);
    return (
        <>
            <ReactSVG 
                src={"/assets/icons/_"+props.name+".svg"}
                wrapper='span'
                beforeInjection={svg => {
                    svg.setAttribute('class', 'text-second')
                    svg.setAttribute('style', `
                        transform: rotate(${props.rotation}deg);
                    `)
                  }}
                loading={() => <span>Loading...</span>}
                onClick={props.onClick}
            />
        </>        
    )
}

Icon.defaultProps = {
    color: 'main',
}