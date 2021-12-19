import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className: string;
}

export const Card: React.FC<CardProps> = (props: CardProps) => (
  <div className={`w-80 h-56 rounded-lg shadow flex ${props.className}`}>
    {props.children}
  </div>
);
