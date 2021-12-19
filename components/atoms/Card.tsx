import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className: string;
}

export const Card: React.FC<CardProps> = (props: CardProps) => (
  <div className={`m-2 w-36 h-36 lg:w-80 mg:h-52 rounded-lg shadow flex ${props.className}`}>
    {props.children}
  </div>
);
