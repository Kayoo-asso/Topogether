import React, { useRef, useState } from 'react';
import { useUserMedia } from 'helpers';

interface GeoCameraProps {
    open?: boolean,
    onCapture?: (blob: Blob | null) => void,
}

export const GeoCamera: React.FC<GeoCameraProps> = ({
    open = false,
    ...props
}: GeoCameraProps) => {
    const [coordinates, setCoordinates] = useState('4.7593559, 42.3090598');
    const [isCalibrating, setIsCalibrating] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const CAPTURE_OPTIONS = {
        audio: false,
        video: { facingMode: "environment" },
    };  
    const mediaStream = useUserMedia(CAPTURE_OPTIONS);    
    if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
        videoRef.current.srcObject = mediaStream;
    } 
    const handleCanPlay = () => {
        if (videoRef.current) videoRef.current.play();
    }

    
    const handleCapture = () => {
        if (canvasRef.current && videoRef.current) {
            const context = canvasRef.current.getContext("2d");

            const canvasCW = canvasRef.current.clientWidth;
            const canvasCH = canvasRef.current.clientHeight;
            const videoW = videoRef.current.videoWidth;
            const videoH = videoRef.current.videoHeight;
            const videoCW = videoRef.current.clientWidth;
            const videoCH = videoRef.current.clientHeight;

            const ratioW = videoW/videoCW;
            const ratioH = videoH/videoCH;
            const offsetW = Math.max(Math.round((videoW - canvasCW*ratioW)/2), 0);
            const offsetH = Math.max(Math.round((videoH - canvasCH*ratioH)/2), 0);
           
            context?.drawImage(videoRef.current, 
                offsetW, 
                offsetH, 
                canvasCW*ratioW, //La largeur de la partie de l'image source à dessiner dans le contexte
                canvasCH*ratioH, //La hauteur de la partie de l'image source à dessiner dans le contexte
                0, 
                0,
                canvasCW, // La largeur de l'image dessinée dans le contexte de la balise canvas
                canvasCH // La hauteur de l'image dessinée dans le contexte de la balise canvas
            ); 
            canvasRef.current.toBlob(blob => {
                props.onCapture && props.onCapture(blob)
            }, "image/jpeg", 1);
        }
    }
    

    if (!open) return null;
    return (
            <div 
                className='w-full relative h-[765px] overflow-hidden z-500'
            >
                <video 
                    ref={videoRef} 
                    onCanPlay={handleCanPlay} 
                    autoPlay 
                    playsInline 
                    muted
                    className='h-full max-w-none absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'
                />
                <canvas
                    className='bg-main bg-opacity-50 w-full h-full absolute top-0 left-0'
                    // height={videoRef.current?.clientHeight}
                    // width={videoRef.current?.clientWidth}
                    height={765}
                    width={411}
                    ref={canvasRef}
                />

                <div 
                    className='absolute shadow bg-white rounded-full h-[60px] w-[60px] bottom-[10vh] left-[50%] translate-x-[-50%] z-40'
                    onClick={handleCapture}
                ></div>
                {!isCalibrating &&
                    <div className='text-white ktext-label absolute bottom-[2vh] left-[50%] translate-x-[-50%] z-40'>{coordinates}</div>
                }
                {isCalibrating &&
                    <div className='h-full w-full absolute flex flex-col justify-center items-center z-50 text-white ktext-base bg-black bg-opacity-90'>
                        <div className='mb-10 text-center'>
                            Calibrage de la caméra <br />
                            Merci de patienter...
                        </div>

                        <span>{coordinates}</span>
                    </div>
                }
            </div>
    )
}