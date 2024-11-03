import type { Picture, Project } from '$lib/types';
import { dev } from '$app/environment';

class ProjectService {
	private static instance: ProjectService | null = null;
	private thumbnails: Record<string, any>;
	private paths: Record<string, any>;

	constructor() {
		this.thumbnails = import.meta.glob('../../content/projects/*/thumbnail.jpg', {
			eager: true,
			query: { enhanced: true }
		});

		this.paths = import.meta.glob('../../content/projects/**/index.md', { eager: true });
	}

	public static getInstance() {
        if (!ProjectService.instance) {
            ProjectService.instance = new ProjectService();
        }
        return ProjectService.instance;
    }

	async getProject(slug: string) {
		const projectPath = Object.keys(this.paths).find((path) => path.includes(slug));
		if (!projectPath) {
			throw new Error(`Project not found: Couldn't find ${slug} in paths object.`);
		}

		const project = this.paths[projectPath];

		const metadata = await this.buildProjectMetadata(project, slug);

		return {
			meta: metadata,
			content: project.default,
		};
	}

	async getProjects() {
		const projects = await this.buildProjectList(this.paths);
		return this.categorizeProjects(projects);
	}

	private async getProjectThumbnail(slug: string) {
		const thumbnailPath = Object.keys(this.thumbnails).find((path) => path.includes(slug));
		if (!thumbnailPath) {
			throw new Error(`Thumbnail not found: Couldn't find ${slug} in thumbnails object.`);
		}
		const thumbnailModule = this.thumbnails[thumbnailPath];
		// const thumbnailModule = await import(`$content/projects/${slug}/thumbnail.jpg?enhanced`);
		// const thumbnailModule = await import(`$content/projects/${slug}/thumbnail.jpg`);
		const thumbnail = thumbnailModule.default as Picture;

		return thumbnail;
	}

	private async buildProjectMetadata(file: any, slug: string) {
		const thumbnail = await this.getProjectThumbnail(slug);
		const fileMetadata = file.metadata as Omit<Project, 'slug' | 'thumbnail'>;
		const metadata = { ...fileMetadata, slug, thumbnail } satisfies Project;
	
		return metadata;
	}

	private async buildProjectList(paths: Record<string, any>) {
		const projects: Project[] = [];

		for (const [path, file] of Object.entries(paths)) {
			const { slug } = path.match(/content\/projects\/(?<slug>.*)\/index.md/)?.groups ?? {};

			if (file && typeof file === 'object' && 'metadata' in file && slug) {
				const project = await this.buildProjectMetadata(file, slug);
				if (project?.hidden && !dev) continue;

				projects.push(project);
			}
		}

		return projects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	}

	private categorizeProjects(projects: Project[]) {
		let highlights: Project[] = [];
		let archived: Project[] = [];
		let latest: Project[] = [];

		projects.forEach((project) => {
			if (project.highlight) {
				highlights.push(project);
			}

			if (project.archived) {
				archived.push(project);
			} else {
				latest.push(project);
			}
		});

		return {
			highlights,
			archived,
			latest
		};
	}
}

export const projectService = ProjectService.getInstance();