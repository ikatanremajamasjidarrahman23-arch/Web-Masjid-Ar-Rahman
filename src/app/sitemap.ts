import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://dkm-arrahman.vercel.app";
  const routes = ["", "/profil", "/kajian", "/galeri", "/buletin", "/donasi", "/irmas", "/ukm"];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}

