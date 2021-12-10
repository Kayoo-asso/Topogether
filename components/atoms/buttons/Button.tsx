import React from 'react'
import Link from 'next/link';
import { baseColor } from 'components/types';

type ButtonProps = {
    content: string,
    color: baseColor,
    fullWidth: boolean,
} & ({
    href: string,
    onClick: null,
} | {
    href: null,
    onClick: () => void,
})

export const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
    let classes: string = 'text-';

    return (
        <>
            {props.href && 
                <Link href={props.href}>
                    <button className={'text-white bg-main rounded-full py-5 px-4 ' + (props.fullWidth ? 'min-w-full ' : '')}>
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
