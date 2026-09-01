import rawProjects from "./portfolio-projects.json";

export type PortfolioProject = {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  liveUrl: string | null;
  featured: boolean;
  order: number;
  year: string;
  projectType: string;
};

export const PORTFOLIO_PROJECTS = rawProjects as PortfolioProject[];

export const PORTFOLIO_PROJECT_SLUGS = new Set(PORTFOLIO_PROJECTS.map((project) => project.slug));

export const PORTFOLIO_FEATURED_PROJECTS = PORTFOLIO_PROJECTS.filter((project) => project.featured);

export function toPortfolioProject(project: PortfolioProject) {
  return {
    id: project.slug,
    slug: project.slug,
    title: project.title,
    description: null,
    client: null,
    category: project.category,
    tags: [...project.tags],
    year: project.year,
    coverImage: null,
    liveUrl: project.liveUrl,
    featured: project.featured,
    order: project.order,
    projectType: project.projectType,
  };
}
