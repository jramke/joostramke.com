import type { Picture } from "$lib/types";

export type HoverImageOptions = {
    image: Picture;
    maxVel?: number;
    lerp?: number;
    base?: number;
    delta?: number;
    useChild?: boolean;
    zIndex?: number;
    attributes?: {
        [key: string]: string;
    }
};