import React, { useCallback, useRef, useState } from 'react';
import { distanceLatLng, fromLatLng, useUserMedia } from 'helpers';
import { GeoCoordinates, MapToolEnum } from 'types';
import { useGeolocation } from 'helpers/hooks/useGeolocation';
import ArrowFull from 'assets/icons/arrow-full.svg';
import Clear from 'assets/icons/clear.svg';
import Spinner from 'assets/icons/spinner.svg';

interface GeoCameraProps {
    open?: boolean,
    currentTool: MapToolEnum,
    onChangeTool: (tool: MapToolEnum) => void,
    onCapture?: (file: File, coordinates: GeoCoordinates) => void,
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
    const [distance, setDistance] = useState(0);
    const [isCalibrating, setIsCalibrating] = useState(true);
    const [displayToolbar, setDisplayToolbar] = useState(false);

    const [loading, setLoading] = useState(false);

    const [displayItemSelectMenu, setDisplayItemSelectMenu] = useState(false);
    useGeolocation({
        onPosChange: (pos) => {
            const dist = distanceLatLng(coords.lat, coords.lng, pos.coords.latitude, pos.coords.longitude);
            setDistance(dist);
            const calibrating = dist > 5 && process.env.NODE_ENV !== "development";
            setIsCalibrating(calibrating);
            setCoords({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            });
        },
        onError: useCallback((err) => {
            if (err.code === 3) {
                console.log('Geolocation timed out!');
            }
            else {
                console.log('Geolocation error:', err);
            }
        }, [])
    });

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

    const itemType = props.currentTool === 'PARKING'
        ? 'parking'
        : props.currentTool === 'WAYPOINT'
            ? 'point de repère'
            : 'bloc';    

    if (!open) return null;
    return (
        <div className='w-full h-full absolute overflow-hidden z-1000'>
            {loading && 
                <div className='flex justify-center items-center w-full h-full bg-dark bg-opacity-80 absolute z-1000'>
                    <Spinner
                        className="stroke-main w-10 h-10 animate-spin m-2"
                    />
                </div>
            }
            <div className='absolute z-100 top-4 left-4'>
                <div 
                    className={'flex flex-row items-center ' + (props.currentTool === 'PARKING' ? 'text-second' : props.currentTool === 'WAYPOINT' ? 'text-third' : 'text-main')}
                    onClick={() => setDisplayItemSelectMenu(d => !d)}
                >
                    Créer un {itemType}
                    <ArrowFull
                        className={'h-3 w-3 rotate-90 ml-3' + 
                            (displayItemSelectMenu ? ' -rotate-90' : '') +
                            (props.currentTool === 'WAYPOINT' ? ' fill-third' : props.currentTool === 'PARKING' ? ' fill-second' : ' fill-main') 
                        }
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
                <Clear 
                    className='cursor-pointer stroke-white h-8 w-8'
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
                        Calibrage de la géolocalisation <br />
                        Merci de patienter...
                    </div>

                    <span>{coords.lat + ', ' + coords.lng}</span>
                    <div>{distance + 'm'}</div>
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
                                if (blob) {
                                    const file: File = new File([blob], "CameraPhoto", { type: "image/jpeg" });
                                    props.onCapture && props.onCapture(file, fromLatLng(coords));
                                }
                            }, "image/jpeg", 1);
                            removeCapture();
                            setLoading(true);
                        }}
                    >Valider</div>
                </div>
            }
        </div>
    )
}