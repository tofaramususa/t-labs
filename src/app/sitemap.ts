import type { MetadataRoute } from "next";

export const baseUrl = "https://yourdomain.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	// TODO: Add blog posts when blog is implemented
	// const blogs = getBlogPosts().map((post) => ({
	//   url: `${baseUrl}/blog/${post.slug}`,
	//   lastModified: post.metadata.publishedAt,
	// }));

	const routes = ["", "/about", "/contact"].map((route) => ({
		url: `${baseUrl}${route}`,
		lastModified: new Date().toISOString().split("T")[0],
	}));

	return routes;
}
