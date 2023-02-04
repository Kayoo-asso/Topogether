import { GeoCoordinates } from "types";

export const coordsToClipboard = (coords: GeoCoordinates, setFlashMessage?: React.Dispatch<React.SetStateAction<string | undefined>>) => {
    const data = [
        new ClipboardItem({
            "text/plain": new Blob(
                [coords[1] + "," + coords[0]],
                {
                    type: "text/plain",
                }
            ),
        }),
    ];
    navigator.clipboard.write(data).then(
        function () {
            if (setFlashMessage) setFlashMessage(
                "Coordonnées copiées dans le presse papier."
            );
        },
        function () {
            if (setFlashMessage) setFlashMessage("Impossible de copier les coordonées.");
        }
    );
}