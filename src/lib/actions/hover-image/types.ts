// import type { Picture } from "$lib/types";

export type HoverImageOptions = {
    image: string;
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