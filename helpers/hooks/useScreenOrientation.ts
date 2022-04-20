import { useEffect, useState } from 'react';

type OrientationType = "landscape-primary" | "landscape-secondary" | "portrait-primary" | "portrait-secondary"

export const useScreenOrientation = (): OrientationType | undefined => {
    const [orientation, setOrientation] = useState<OrientationType | undefined>(undefined);
    useEffect(() => {
        const handleOrientationChange= () => setOrientation(window.screen.orientation.type);
        window.addEventListener('orientationchange', handleOrientationChange);
        return () => window.removeEventListener('orientationchange', handleOrientationChange);
    }, []);
    
    return orientation;
}