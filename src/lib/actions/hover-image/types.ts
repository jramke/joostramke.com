export type HoverImageOptions = {
    maxVel?: number;
    lerp?: number;
    base?: number;
    delta?: number;
    useChild?: boolean;
    zIndex?: number;
    imgUrl?: string;
    attributes?: {
        [key: string]: string;
    }
};