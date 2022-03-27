import { Breakpoint, Image, UUID } from "types"
import NextImage from "next/image";
import type {
    ImageProps as NextImageProps
} from "next/image";
import { Variants } from "helpers/variants";

export interface CFImageProps extends Omit<NextImageProps, 'src'> {
    image: Image,
    breakpoint: Breakpoint
}


export const CFImage: React.FC<CFImageProps> = ({ image, breakpoint, ...props }) => {
    const variant = Variants[image.ratio][breakpoint];
    const url = `https://imagedelivery.net/9m8hQCHM9NXY8VKZ1mHt-A/${image.id}/${variant}`;

    return <NextImage src={url} {...props} />

}
