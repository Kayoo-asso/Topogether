import React from 'react';
import { ReactSVG } from 'react-svg';

interface IconProps {
    name: string,
    className: string,
    center?: boolean,
    onClick?: () => void,
}

export const Icon: React.FC<IconProps> = props => { 

    return (
        <>
            <ReactSVG 
                src={"/assets/icons/_"+props.name+".svg"}
                wrapper='span'
                className={props.center ? 'flex flex-col justify-center items-center' : ''}
                beforeInjection={svg => {
                    svg.setAttribute('class', `${props.className}`)
                  }}
                loading={() => <span className='ktext-subtext'>Loading...</span>}
                onClick={props.onClick}
            />
        </>        
    )
}

Icon.defaultProps = {
    className: 'stroke-main h-8 w-8',
    center: false,
}
