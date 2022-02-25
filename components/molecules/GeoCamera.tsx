import React, { useRef, useState } from 'react';
import { distanceLatLng, useAsyncEffect, useUserMedia } from 'helpers';
import { Icon } from 'components';
import { GeoCoordinates, MapToolEnum } from 'types';

interface GeoCameraProps {
    open?: boolean,
    currentTool: MapToolEnum,
    onChangeTool: (tool: MapToolEnum) => void,
    onCapture?: (blob: Blob | null, coordinates: GeoCoordinates) => void,
    onClose: () => void,
}

const CAPTURE_OPTIONS = {
    audio: false,
    video: { facingMode: "environment" },
};  

export const GeoCamera: React.FC<GeoCameraProps> = ({
    open = true,
    ...props
}: GeoCameraProps) => {
    const [coords, setCoords] = useState({
        lat: 0,
        lng: 0,
    });
    const [isCalibrating, setIsCalibrating] = useState(true);
    const [displayToolbar, setDisplayToolbar] = useState(false);

    const [displayItemSelectMenu, setDisplayItemSelectMenu] = useState(false);

    useAsyncEffect((isAlive) => {
        const options = {
            // Timeout = 3 seconds (default = infinite). TODO: agree on the best value
            timeout: 3000,
            enableHighAccuracy: true,
        };
        const onPosChange = (pos: GeolocationPosition) => {
            if (isAlive.current) {
                const dist = distanceLatLng(coords.lat, coords.lng, pos.coords.latitude, pos.coords.longitude)
                if (dist < 5 || true) {
                    setIsCalibrating(false);
                    navigator.geolocation.clearWatch(watcher);
                }
                setCoords({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                });
            }
        };
        const onError = (err: GeolocationPositionError) => {
            if (err.code === 3) {
                console.log('Geolocation timed out!');
            }
        }
        const watcher = navigator.geolocation.watchPosition(onPosChange, onError, options);
    }, []);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

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

            if (context) {
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
                
                try {
                    context.drawImage(videoRef.current, 
                        offsetW, 
                        offsetH, 
                        canvasCW*ratioW, //La largeur de la partie de l'image source à dessiner dans le contexte
                        canvasCH*ratioH, //La hauteur de la partie de l'image source à dessiner dans le contexte
                        0, 
                        0,
                        canvasCW, // La largeur de l'image dessinée dans le contexte de la balise canvas
                        canvasCH // La hauteur de l'image dessinée dans le contexte de la balise canvas
                    );
                    setDisplayToolbar(true);
                } catch (err) {
                    console.log(err);
                }
            }
        }
    }
    const removeCapture = () => {
        if (canvasRef.current && videoRef.current) {
            const context = canvasRef.current.getContext("2d");
            if (context) {
                try {
                    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
                    setDisplayToolbar(false);
                } catch (err) {
                    console.log(err);
                }
            }
        }
    }

    const itemType = props.currentTool === 'PARKING' ? 'parking' :
        props.currentTool === 'WAYPOINT' ? 'point de repère' : 'bloc';    

    if (!open) return null;
    return (
        <div className='w-full h-full absolute overflow-hidden z-1000'>
            <div className='absolute z-100 top-4 left-4'>
                <div 
                    className={'flex flex-row items-center ' + (props.currentTool === 'PARKING' ? 'text-second' : props.currentTool === 'WAYPOINT' ? 'text-third' : 'text-main')}
                    onClick={() => setDisplayItemSelectMenu(d => !d)}
                >
                    Créer un {itemType}
                    <Icon 
                        name='arrow-full'
                        SVGClassName={'fill-main h-3 w-3 rotate-90 ml-3' + (displayItemSelectMenu ? ' -rotate-90' : '')}
                    />
                </div>
                {displayItemSelectMenu &&
                    <div className='text-white' onClick={() => setDisplayItemSelectMenu(false)}>
                        {props.currentTool !== 'ROCK' && <div className='mt-1 text-main' onClick={() => props.onChangeTool('ROCK')}>Créer un bloc</div>}
                        {props.currentTool !== 'PARKING' && <div className='mt-1 text-second' onClick={() => props.onChangeTool('PARKING')}>Créer un parking</div>}
                        {props.currentTool !== 'WAYPOINT' && <div className='mt-1 text-third' onClick={() => props.onChangeTool('WAYPOINT')}>Créer un point de repère</div>}
                    </div>
                }
            </div>
            <div 
                className='absolute z-100 top-4 right-4'
                onClick={props.onClose}
            >
                <Icon 
                    name='clear'
                    SVGClassName='stroke-white h-8 w-8'
                    onClick={props.onClose}
                />
            </div>

            <video 
                ref={videoRef} 
                onCanPlay={handleCanPlay} 
                autoPlay 
                playsInline 
                muted
                className='h-full max-w-none absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'
            />
            <canvas
                ref={canvasRef}
                className='w-full h-full absolute top-0 left-0'
                height={canvasRef.current?.clientHeight}
                width={canvasRef.current?.clientWidth}
            />

            <div 
                className='absolute shadow bg-white rounded-full h-[60px] w-[60px] bottom-[15vh] left-[50%] translate-x-[-50%] z-40'
                onClick={handleCapture}
            ></div>
            {!isCalibrating &&
                <div className='text-white ktext-label absolute bottom-[10vh] left-[50%] translate-x-[-50%] z-40'>{coords.lat + ', ' + coords.lng}</div>
            }
            {isCalibrating &&
                <div className='h-full w-full absolute flex flex-col justify-center items-center z-50 text-white ktext-base bg-black bg-opacity-90'>
                    <div className='mb-10 text-center'>
                        Calibrage de la caméra <br />
                        Merci de patienter...
                    </div>

                    <span>{coords.lat + ', ' + coords.lng}</span>
                </div>
            }

            {displayToolbar &&
                <div className='fixed flex flex-row justify-between items-center p-6 bottom-0 w-full h-[8vh] bg-dark bg-opacity-60 text-main'>
                    <div 
                        className='ktext-base-little cursor-pointer'
                        onClick={removeCapture}
                    >Reprendre</div>
                    <div 
                        className='ktext-base-little cursor-pointer'
                        onClick={() => {
                            canvasRef.current?.toBlob(blob => {
                                props.onCapture && props.onCapture(blob, coords);
                            }, "image/jpeg", 1);
                            removeCapture();
                            props.onClose();
                        }}
                    >Valider</div>
                </div>
            }
        </div>
    )
}