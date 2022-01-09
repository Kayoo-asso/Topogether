import dynamic from 'next/dynamic';

export const Device = dynamic(() => import('./Device'), { ssr: false });
