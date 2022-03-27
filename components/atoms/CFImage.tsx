import { Breakpoint, Image } from "types"
import NextImage from "next/image";
import type {
    ImageProps as NextImageProps
} from "next/image";
import { Variants } from "helpers/variants";
import { staticUrl } from "helpers";
import { useBreakpoint } from "helpers/hooks/useBreakpoints";
import { cloudflareUrl } from "helpers/cloudflareUrl";

export interface CFImageProps extends Omit<NextImageProps, 'src'> {
    image?: Image,
    breakpoint?: Breakpoint
}

export const CFImage: React.FC<CFImageProps> = ({ image, breakpoint, ...props }) => {
    const bp = useBreakpoint();
    let url = staticUrl.defaultKayoo;
    if (image) {
        url = cloudflareUrl(image, breakpoint ?? bp);
    }

    return <NextImage src={url} {...props} />

}
