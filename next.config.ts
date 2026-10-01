import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Old site addresses, so existing links and Google results land on the right new pages.
  async redirects() {
    return [
      { source: "/services", destination: "/sourcing", permanent: true },
      { source: "/pricing", destination: "/sourcing#pricing", permanent: true },
      { source: "/start-brief", destination: "/sourcing#request", permanent: true },
    ];
  },
};

export default nextConfig;