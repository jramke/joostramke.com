// TODO: this maybe needs improvement, but it works for now

type PagePosition = "main" | "footer" | "offcanvas" | "legals" | "social";
type Page = {
    slug: string;
    title: string;
    positions: readonly PagePosition[];
    target: "_blank" | "_self" | null;
};

type Pages = {
    [key: string]: Page;
};

export const pages = {
    home: { slug: "/", title: "Home", target: null, positions: ["footer"] as PagePosition[] },

    projects: { slug: "/projects", title: "Projects", target: null, positions: ["main", "offcanvas", "footer"] as PagePosition[] },
    crafts: { slug: "https://crafts.joostramke.com", title: "Crafts", target: "_blank", positions: ["main", "offcanvas", "footer"] as PagePosition[] },
    gallery: { slug: "/gallery", title: "Gallery", target: null, positions: ["main", "offcanvas", "footer"] as PagePosition[] },
    about: { slug: "/about", title: "About", target: null, positions: ["main", "offcanvas", "footer"] as PagePosition[] },
    cv: { slug: "https://cv.joostramke.com", title: "CV", target: "_blank", positions: ["footer", "offcanvas"] as PagePosition[] },

    colophon: { slug: "/colophon", title: "Colophon", target: null, positions: ["legals"] as PagePosition[] },
    privacy: { slug: "/privacy", title: "Privacy", target: null, positions: ["legals"] as PagePosition[] },
    imprint: { slug: "/imprint", title: "Imprint", target: null, positions: ["legals"] as PagePosition[] },

    twitter: { slug: "https://twitter.com/jstrmk_", title: "x.com", target: "_blank", positions: ["social"] as PagePosition[] },
    github: { slug: "https://github.com/jramke", title: "Github", target: "_blank", positions: ["social"] as PagePosition[] },
    instagram: { slug: "https://instagram.com/jstrmk", title: "Instagram", target: "_blank", positions: ["social"] as PagePosition[] },
    email: { slug: "mailto:hey@joostramke.com", title: "Email", target: null, positions: ["social"] as PagePosition[] },

} as const satisfies Pages;

export const mainPages = filterPagesByPosition("main");
export const offcanvasPages = filterPagesByPosition("offcanvas");
export const footerPages = filterPagesByPosition("footer");
export const legalsPages = filterPagesByPosition("legals");
export const socialPages = filterPagesByPosition("social");

function filterPagesByPosition(position: PagePosition) {
    return Object.values(pages).filter((page) => page.positions.includes(position));
}