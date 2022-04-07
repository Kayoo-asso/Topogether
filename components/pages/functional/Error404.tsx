import Link from 'next/link';
import React from 'react';
import NextImage from 'next/image';
import { Header } from 'components/layouts/header/Header';

interface Error404Props {
    title: string,
}

export const Error404: React.FC<Error404Props> = (props: Error404Props) => {

    return (
        <>
            <Header
                title={props.title}
                backLink='#'
            />
            <Link href='/'>
                <a className='w-full h-full relative bg-white flex items-center justify-center cursor-pointer'>
                    <NextImage 
                        src='/assets/img/404_error_topo_climbing.png'
                        priority
                        alt="Erreur 404"
                        layout="fill"
                        objectFit="contain"
                    />
                </a>
            </Link>
        </>
    )
}