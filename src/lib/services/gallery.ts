import type { Gallery, Picture } from "$lib/types";

class GalleryService {
    private static instance: GalleryService | null = null;
    paths: Record<string, any>;
    images: Record<string, any>;

    constructor() {
        this.paths = import.meta.glob('../../content/gallery/**/index.md', { eager: true });
        this.images = import.meta.glob('../../content/gallery/**/image.jpg', { 
            eager: true, 
            query: {
                enhanced: true
            }
        });
    }

    public static getInstance() {
        if (!GalleryService.instance) {
            GalleryService.instance = new GalleryService();
        }
        return GalleryService.instance;
    }

    async getGallery() {
        let gallery: Gallery[] = [];
        
        for (const [path, file] of Object.entries(this.paths)) {
            const { slug } = path.match(/content\/gallery\/(?<slug>.*)\/index.md/)?.groups ?? {};
            if (file && typeof file  === 'object' && 'metadata' in file && slug) {
                const image = await this.buildGalleryItemMetadata(file, slug);
                gallery.push(image);
            }
        }

        gallery = gallery.sort((first, second) => {
            return +first.slug - +second.slug;
        });
        
        return gallery;
    }

	private async buildGalleryItemMetadata(file: any, slug: string) {
		const image = await this.getGalleryImage(slug);
		const fileMetadata = file.metadata as Omit<Gallery, 'slug' | 'image'>;
		const metadata = { ...fileMetadata, slug, image } satisfies Gallery;
	
		return metadata;
	}

    private async getGalleryImage(slug: string) {
        const imagePath = Object.keys(this.images).find((path) => path.includes(slug));
        if (!imagePath) {
            throw new Error(`Image not found: Couldn't find ${slug} in images object.`);
        }
        const imageModule = this.images[imagePath];
        const image = imageModule.default as Picture;
        
		return image;
	}
}

export const galleryService = GalleryService.getInstance();