import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.ieeestudentbranchkiit.in";
  const lastModified = new Date();

  return [
    {
      url: `${baseUrl}/`,
      lastModified,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
    },
    {
      url: `${baseUrl}/events`,
      lastModified,
    },
    {
      url: `${baseUrl}/members`,
      lastModified,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
    },
  ];
}
