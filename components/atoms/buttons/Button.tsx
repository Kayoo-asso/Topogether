import React from 'react';
import Link from 'next/link';

interface ButtonProps {
  content: string,
  white?: boolean,
  fullWidth?: boolean,
  href?: string,
  onClick?: () => void,
}

export const Button: React.FC<ButtonProps> = (props) => (
  <button
    className={
                    `ktext-subtitle shadow rounded-full py-3 px-8${
                      props.white
                        ? ' text-main bg-white border-2 border-main hover:text-main-light hover:border-main-light'
                        : ' text-white bg-main hover:bg-main-light'
                    }${props.fullWidth ? ' w-full ' : ''}`
                }
    onClick={props.onClick}
  >
    <Link href={props.href || ''}>
      {props.content}
    </Link>
  </button>
);
