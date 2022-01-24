import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className: string;
}

export const Card: React.FC<CardProps> = (props: CardProps) => (
  <div className={`m-2 w-[140px] h-[140px] lg:w-80 lg:h-52 lg:m-8 rounded-lg shadow flex ${props.className}`}>
    {props.children}
  </div>
);
