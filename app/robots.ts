import type { MetadataRoute } from "next";

const BASE_URL = "https://haunted.gr";

export default function robots(): MetadataRoute.Robots {
  return {
    sitemap: `${BASE_URL}/sitemap.xml`,
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/private", "/search"],
        crawlDelay: 3,
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/images/"],
      },
      {
        userAgent: "archive.org_bot",
        crawlDelay: 10,
      },
    ],
  };
}

