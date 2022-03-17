import { useEffect } from "react";

export type GeolocationCallbacks = {
    onPosChange: (pos: GeolocationPosition) => void;
    onError: (err: GeolocationPositionError) => void;
}

/**
 * Provide callbacks to `navigator.geolocation.watchPosition`, while ensuring no memory leaks happen.
 * 
 * Options are hardcoded to a 3s timeout and high accuracy for now.
 * Change the hook to expose them, if needed.
 */
// Note: previous versions used `useAsyncEffect`, but I don't think it's needed?
// Look into it, in case there are bugs.
export function useGeolocation(callbacks: GeolocationCallbacks) {
    useEffect(() => {
        const options: PositionOptions = {
            timeout: 3000,
            enableHighAccuracy: true
        };
        const watcher = navigator.geolocation.watchPosition(
            callbacks.onPosChange,
            callbacks.onError,
            options
        );
    
        return () => navigator.geolocation.clearWatch(watcher);
    }, [callbacks.onPosChange, callbacks.onError]);
}