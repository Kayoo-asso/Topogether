import React from 'react'
import Image from 'next/image'
import { Icon } from '..'
import { image } from 'types'

interface ImageButtonProps {
    text: string,
    image?: image,
    loading?: boolean,
    onClick: () => void,
}

export const ImageButton: React.FC<ImageButtonProps> = props => {
    return (
        <>           
            <div 
                className='ktext-label text-center shadow text-main p-2 border-main border-2 w-22 h-22 flex flex-col justify-center cursor-pointer'
                onClick={props.onClick}
            >    
                {props.loading && 
                    <Icon
                        name="spinner"
                        className="stroke-main w-10 h-10 animate-spin"
                        center
                    />
                }
                {!props.loading && props.image &&
                    <Image 
                        src={props.image.url}
                        placeholder='blur'
                    />
                }
                {!props.loading && !props.image &&
                    <span >{props.text}</span>
                }
            </div>
        </>        
    )
}

ImageButton.defaultProps = {
    loading: false,
}