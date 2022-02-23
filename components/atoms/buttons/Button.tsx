import React from 'react';
import Link from 'next/link';

interface ButtonProps {
  content: string,
  className?: string,
  white?: boolean,
  activated?: boolean,
  fullWidth?: boolean,
  href?: string,
  onClick?: () => void,
}

export const Button: React.FC<ButtonProps> = ({
  white = false,
  fullWidth = false,
  activated = true,
  ...props
}: ButtonProps) => {
    const getUIClasses = () => {
        if (activated) {
            if (white) return 'text-main bg-white border-2 border-main hover:text-main-light hover:border-main-light';
            else return 'text-white bg-main hover:bg-main-light';
        }
        else return 'bg-grey-light text-white cursor-default';
    }
    const button = (<button
            className={`ktext-subtitle shadow rounded-full px-4 py-3 lg:px-8 h-[45px] lg:h-[50px] ${getUIClasses()} ${fullWidth ? 'w-full ' : ''} ${props.className}`}
            onClick={() => {
                if (activated && props.onClick && !props.href) props.onClick()
            }}
        >
            {props.content}
        </button>);
        
    return ((props.href && activated) ?
        <>
            <Link href={props.href || ''} passHref>
                {button}
            </Link>
        </>
        : <>{button}</>);
}
