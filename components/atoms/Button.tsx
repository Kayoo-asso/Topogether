import React from 'react'
import Link from 'next/link';
import { color } from 'components/types';

type ButtonProps = {
    content: string,
    color: color,
} & ({
    href: string,
    onClick: null,
} | {
    href: null,
    onClick: () => void,
})

export const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
    let classes: string = 'text-'

    return (
        <>
            {props.href && 
                <Link href={props.href}>
                    <button className='bg-'>
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
