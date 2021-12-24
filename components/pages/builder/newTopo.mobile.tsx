import React from 'react';

interface NewTopoMobileProps {
    createTopo: () => void,
}

export const NewTopoMobile: React.FC<NewTopoMobileProps> = (props: NewTopoMobileProps) => {
    return (
        <div className='h-full w-full flex flex-col bg-main'>
            {/* CONTENT GOES HERE */}
        </div>
    )
}