import React from 'react'
import Link from 'next/link';
import { baseColor } from 'components/types';

type ButtonProps = {
    content: string,
    color: baseColor,
    fullWidth?: boolean,
} & ({
    href: string,
    onClick?: null,
} | {
    href?: null,
    onClick: () => void,
})

export const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
    let classes: string = 'text-';

    return (
        <>
            {props.href && 
                <Link href={props.href}>
                    <button 
                        className={
                            'text-white ktext-subtitle shadow bg-main hover:bg-main-light rounded-full py-3 px-8 ' 
                            + (props.fullWidth ? 'w-full ' : '')
                        }
                    >
                        {props.content}
                    </button>
                </Link>
            }

            {props.onClick &&
                <button
                    className={classes}
                    onClick={props.onClick}
                >
                    {props.content}
                </button>
            }
        </>        
    )
}
