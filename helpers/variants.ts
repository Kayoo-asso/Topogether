// Variant ratios:
// - 3:4
// - 4:3
// - 16:9
// - 9:16
// - 1:1

export const Variants = {
    "3:4": {
        sm: "sm34",
        md: "md34",
        lg: "lg34",
        xl: "xl34",
    },
    "4:3": {
        sm: "sm43",
        md: "md43",
        lg: "lg43",
        xl: "xl43",
    },
    "16:9": {
        sm: "sm169", // 854 x 480
        md: "md169", // 1366 x 768
        lg: "lg169", // 1600 x 900
        xl: "xl169", // 2048 x 1152
    },
    "9:16": {
        sm: "sm916", // 480 x 854
        md: "md916", // 768 x 1366
        lg: "lg916", // 900 x 1600
        xl: "xl916", // 1152 x 2048
    },
    "1:1": {
        sm: "sm11", // 480 x 480
        md: "md11", // 768 x 768
        lg: "lg11", // 900 x 900
        xl: "xl11", // 1152 x 1152
    }
}

const size = (width: number, height: number) => ({ width, height });

export const VariantSizes = {
    "16:9": {
        sm: size(854, 460),
        md: size(1366, 768),
        lg: size(1600, 900),
        xl: size(2048, 1152),
    },
    "9:16": {
        sm: size(480, 854),
        md: size(768, 1366),
        lg: size(900, 1600),
        xl: size(1152, 2048)
    }
}

export const VariantWidths = [16, 32, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840] as const;
export type VariantWidth = typeof VariantWidths[number]

type VW<W extends number> = `${W}vw`;
type PX<W extends number> = `${W}px`;
export type ViewportWidth = VW<number>;
export type PixelWidth = PX<number>;

export type SourceSize = ViewportWidth | PixelWidth;