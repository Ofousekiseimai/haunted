import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* /map and /map2 said nothing to a reader or to a crawler. The old paths are
     kept as permanent redirects so existing links and anything already indexed
     still land in the right place. */
  async redirects() {
    return [
      { source: "/map", destination: "/chartis-efimerides", permanent: true },
      { source: "/map2", destination: "/chartis-laografia", permanent: true },
    ];
  },
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "haunted.gr",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
};

export default nextConfig;
