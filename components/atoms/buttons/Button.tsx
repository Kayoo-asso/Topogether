import React from 'react';
import Link from 'next/link';

interface ButtonProps {
  content: string,
  className?: string,
  white?: boolean,
  fullWidth?: boolean,
  href?: string,
  onClick?: () => void,
}

export const Button: React.FC<ButtonProps> = ({
  white = false,
  fullWidth = false,
  ...props
}: ButtonProps) => (
  <button
    className={
                  `ktext-subtitle shadow rounded-full py-3 lg:px-8 h-[50px] px-5 ${
                    white
                      ? 'text-main bg-white border-2 border-main hover:text-main-light hover:border-main-light'
                      : 'text-white bg-main hover:bg-main-light'
                  } ${fullWidth ? 'w-full ' : ''} ${props.className}`
              }
    onClick={props.onClick}
  >
    <Link href={props.href || ''}>
      {props.content}
    </Link>
  </button>
);
