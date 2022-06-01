import React from 'react';
import Link from 'next/link';
import { Loading } from 'components/layouts';
import { useLoader } from 'helpers';

interface ButtonProps {
    content: string,
    className?: string,
    white?: boolean,
    activated?: boolean,
    loading?: boolean,
    useLoaderOnClick?: boolean,
    fullWidth?: boolean,
    href?: string,
    onClick?: () => void,
}

export const Button: React.FC<ButtonProps> = ({
    white = false,
    fullWidth = false,
    activated = true,
    loading = false,
    className = '',
    ...props
}: ButtonProps) => {
    const [Loader, showLoader] = useLoader();

    const getUIClasses = () => {
        if (activated && !loading) {
            if (white) return 'text-main bg-white border-2 border-main hover:text-main-light hover:border-main-light';
            else return 'text-white bg-main hover:bg-main-light';
        }
        else return 'bg-grey-light text-white cursor-default';
    }
    const button = (
        <button
            className={`ktext-subtitle flex flex-row items-center justify-center gap-5 shadow rounded-full px-4 py-3 lg:px-8 h-[45px] lg:h-[50px] ${getUIClasses()} ${fullWidth ? 'w-full ' : ''} ${className}`}
            onClick={() => {
                if (!loading && activated && props.onClick && !props.href) props.onClick();
                if (props.useLoaderOnClick) showLoader();
            }}
        >
            <div>{props.content}</div>
            {loading &&
                <div>
                    <Loading SVGClassName='h-6 w-6 stroke-white' bgWhite={false} />
                </div>
            }
        </button>
    );

    return (
        <>
            {(props.href && activated) ?
                <>
                    <Link href={props.href || ''}>
                        <a>
                            {button}
                        </a>
                    </Link>
                </> : <>{button}</>
            }
            <Loader />
        </>
        );
}
