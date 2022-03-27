import { Breakpoint, Image } from "types"
import NextImage from "next/image";
import type {
    ImageProps as NextImageProps
} from "next/image";
import { Variants } from "helpers/variants";
import { staticUrl } from "helpers";
import { useBreakpoint } from "helpers/hooks/useBreakpoints";

export interface CFImageProps extends Omit<NextImageProps, 'src'> {
    image?: Image,
    breakpoint?: Breakpoint
}

export const CFImage: React.FC<CFImageProps> = ({ image, breakpoint, ...props }) => {
    const bp = useBreakpoint();
    let url = staticUrl.defaultKayoo;
    let variant = Variants["1:1"][breakpoint || bp];
    if (image) {
        variant = Variants[image.ratio][breakpoint || bp];
        url = `https://imagedelivery.net/9m8hQCHM9NXY8VKZ1mHt-A/${image.id}/${variant}`;
    }

    return <NextImage src={url} {...props} />

}
