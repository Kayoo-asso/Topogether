import React, { useContext } from 'react';
import { Button } from 'components';
import { UserContext } from 'helpers';

interface LeftbarBuilderDesktopProps {
    onValidate: () => void,
}

export const LeftbarBuilderDesktop: React.FC<LeftbarBuilderDesktopProps> = (props: LeftbarBuilderDesktopProps) => {
    const { session } = useContext(UserContext);
    
    if (!session) return null;
    return (
        <div className='bg-white border-r border-grey-medium w-[300px] h-full hidden md:flex flex-col px-8 py-10 z-100'>
            


            <Button 
                content='Valider le topo'
                onClick={props.onValidate}
            />
        </div>
    )
}