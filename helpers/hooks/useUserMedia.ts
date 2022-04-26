import { useState, useEffect } from "react";

export function useUserMedia(requestedMedia: MediaStreamConstraints) {
  const [mediaStream, setMediaStream] = useState<MediaStream>();

  useEffect(() => {
    async function enableStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(requestedMedia);
        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();
        const settings = track.getSettings();
        // alert(settings);
        // alert('zoom' in settings);
        // alert(JSON.stringify(track.getCapabilities()));
        setMediaStream(stream);
      } catch(err) {
        // Removed for brevity
      }
    }

    if (!mediaStream) {
      enableStream();
    } else {
      return function cleanup() {
        mediaStream.getTracks().forEach(track => {
          track.stop();
        });
      }
    }
  }, [mediaStream, requestedMedia]);

  return mediaStream;
}