import { useEffect, useState } from "react";

export const useIsIos = () => {
    const [isIos, setIsIos] = useState(false); 
    useEffect(() => {
        setIsIos([
            'iPad Simulator',
            'iPhone Simulator',
            'iPod Simulator',
            'iPad',
            'iPhone',
            'iPod'
          ].includes(navigator.platform)
          // iPad on iOS 13 detection
          || (navigator.userAgent.includes("Mac") && "ontouchend" in document));        
    }, []);

    return isIos;
}