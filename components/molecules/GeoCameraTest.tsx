import React, { useRef, useState } from 'react';
import { distanceLatLng, LivenessRef, useAsyncEffect, useUserMedia } from 'helpers';
import { Icon } from 'components';

interface GeoCameraProps {
    open?: boolean,
    onCapture?: (blob: Blob | null) => void,
    onClose?: () => void,
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

    useAsyncEffect((isAlive: LivenessRef) => {
        const options = {
            // Timeout = 3 seconds (default = infinite). TODO: agree on the best value
            timeout: 3000,
            enableHighAccuracy: true,
        };
        const onPosChange = (pos: GeolocationPosition) => {
            if (isAlive.current) {
                const dist = distanceLatLng(coords.lat, coords.lng, pos.coords.latitude, pos.coords.longitude)
                console.log(dist);
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
        
    }, [])

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const parentRef = useRef<HTMLDivElement>(null);

    const mediaStream = useUserMedia(CAPTURE_OPTIONS);    
    if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
        videoRef.current.srcObject = mediaStream;
    } 
    const handleCanPlay = () => {
        if (videoRef.current) videoRef.current.play();
    }
    const handleCapture = () => {
        if (parentRef.current && videoRef.current) {
            const temp: HTMLCanvasElement = document.createElement('canvas');
            // may need to use offsetWidth for scrollbars / pading
            const containerWidth = parentRef.current.clientWidth;
            const containerHeight = parentRef.current.clientHeight;
            const videoWidth = videoRef.current.videoWidth;
            const videoHeight = videoRef.current.videoHeight;
            // the actual offsetLeft is negative when using negative margins
            const offsetLeft = - videoRef.current.offsetLeft;
            const offsetTop = videoRef.current.offsetTop;
            const scale = videoRef.current.offsetWidth / videoWidth;
            temp.width = containerWidth;
            temp.height = containerHeight;
            // note: assuming not null
            const tempContext = temp.getContext('2d')!;
            // may need to switch both in case the device is small
            // const scale = temp.height / temp.width; 
            console.log('Offset left: ', offsetLeft);
            console.log('Offset top: ', offsetTop);
            console.log('Container width: ', containerWidth);
            console.log('Container height: ', containerHeight);
            console.log('Video width: ', videoWidth);
            console.log('Video height: ', videoHeight);
            console.log('Video offset width: ', videoRef.current.offsetWidth);
            console.log('Video offset height: ', videoRef.current.offsetHeight);
            tempContext.drawImage(
                videoRef.current,
                offsetLeft / scale, offsetTop / scale,
                temp.width / scale, temp.height / scale,
                0, 0,
                temp.width, temp.height
            );
            const imageData = temp.toDataURL();
            const tmpLink = document.createElement('a');
            tmpLink.download = 'capture.png';
            tmpLink.href = imageData
            document.body.appendChild(tmpLink);
            tmpLink.click();
            document.body.removeChild(tmpLink);
        }

        // if (canvasRef.current && videoRef.current) {
        //     const context = canvasRef.current.getContext('2d');
        //     context?.drawImage(); 
        //     canvasRef.current.toBlob(blob => {
        //         props.onCapture && props.onCapture(blob)
        //     }, "image/jpeg", 1);
        // }
    }

    if (!open) return null;
    return (
            <div className='w-full h-contentPlusShell relative overflow-hidden z-500' ref={parentRef}>
                <video 
                    ref={videoRef} 
                    onCanPlay={handleCanPlay} 
                    autoPlay 
                    playsInline 
                    muted
                    className='h-full max-w-none -mx-[50%]'
                    // className='h-full max-w-none absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'
                />
                <canvas
                    className='bg-main w-full -my-[100%]'
                    ref={canvasRef}

                />

                <div 
                    className='absolute shadow bg-white rounded-full h-[60px] w-[60px] bottom-[10vh] left-[50%] translate-x-[-50%] z-40'
                    onClick={handleCapture}
                ></div>
                {!isCalibrating &&
                    <div className='text-white ktext-label absolute bottom-[2vh] left-[50%] translate-x-[-50%] z-40'>{coords.lat + ', ' + coords.lng}</div>
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

                <div 
                    className='absolute z-100 top-4 right-4'
                    onClick={props.onClose}
                >
                    <Icon 
                        name='clear'
                        SVGClassName='stroke-white h-8 w-8'
                    />
                </div>
            </div>
    )
}