import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

interface GeoCameraProps {
    open?: boolean,
    onCapture?: (blob: Blob | null) => void,
    onClear?: () => void,
}

export const GeoCamera:React.FC<GeoCameraProps> = (props: GeoCameraProps) => {
  const [coordinates, setCoordinates] = useState('4.7593559, 42.3090598');
  const [isCalibrating, setIsCalibrating] = useState(false);

  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoConstraints = {
    width: 411,
    height: 765,
    facingMode: "user"
  };

  const handleCapture = React.useCallback(() => {
      if (webcamRef.current && canvasRef.current) {
        const context = canvasRef.current?.getContext("2d");

        const canvasW = canvasRef.current.width;
        const canvasCW = canvasRef.current.clientWidth;
        // const videoW = webcamRef.current.width;
        // const videoCW = webcamRef.current.clientWidth;
        // const offsetW = Math.max(Math.round((videoW - canvasW)/2), 0);

        const canvasH = canvasRef.current.height;
        const canvasCH = canvasRef.current.clientHeight;
        // const videoH = webcamRef.current.videoHeight;
        // const videoCH = webcamRef.current.clientHeight;
        // const offsetH = Math.max(Math.round((videoH - canvasCH)/2), 0);

        const image = new Image();
        image.src = webcamRef.current.getScreenshot() || '';
        image.onload = () => {
          console.log(image.height);
          // context?.drawImage(image,
            // offsetW, 
            // offsetH, 
            // canvasW, //La largeur de la partie de l'image source à dessiner dans le contexte
            // canvasCH*2.48, //La hauteur de la partie de l'image source à dessiner dans le contexte
            // 0, 
            // 0,
            // canvasW, // La largeur de l'image dessinée dans le contexte de la balise canvas
            // canvasCH*(300/411));

        };  
      }
    }, [webcamRef]);

  return (
    <div className='w-full relative h-[765px] overflow-hidden z-500'>
      <Webcam
        ref={webcamRef}
        className='h-[765px] absolute'
        screenshotFormat="image/jpeg"
        audio={false}
        width={411}
        height={765}
        videoConstraints={videoConstraints}
      />
      <canvas
          className='bg-main bg-opacity-50 w-full h-full absolute top-0 left-0'
          // height={videoRef.current?.clientHeight}
          // width={videoRef.current?.clientWidth}
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
  );
}
