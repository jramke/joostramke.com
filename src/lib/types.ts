export type Picture = {
    /**
     * Key is format. Value is srcset.
     */
    sources: Record<string, string>;
    img: {
        src: string;
        w: number;
        h: number;
    };
}

export type Project = {
    title: string;
    date: string;
    tags: Array<'Design' | 'Development'>;
    client: string;
    thumbnail: string;
    thumbnailAlt?: string;
    media: Array<string>;
    hidden?: boolean;
    slug: string;
    highlight?: boolean;
    externalLink?: string;
    githubLink?: string;
    archived?: boolean;
};

export type Gallery = {
    print?: string;
    orientation: 'portrait' | 'landscape';
    image: Picture;
    slug: string;
};