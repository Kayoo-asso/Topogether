import { LightTopo } from "~/server/queries";
import { usePosition } from "~/components/providers/UserPositionProvider";

interface WorldMapProps {
	lightTopos: LightTopo[];
}

export function WorldMap({ lightTopos }: WorldMapProps) {
	const { position } = usePosition();
	const initialZoom = 5;

  return <div className="relative h-full w-full">
    
  </div>
}
