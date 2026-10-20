import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "preploom.vercel.app",
        port: "",
        pathname: "/hero1-Photoroom.png",
        search: "",
      },
      {
        protocol: "https",
        hostname: "preploom.vercel.app",
        port: "",
        pathname: "/light-logo.png",
        search: "",
      },
      {
        protocol: "https",
        hostname: "preploom.vercel.app",
        port: "",
        pathname: "/dark-logo.png",
        search: "",
      },
      {
        protocol: "https",
        hostname: "preploom.vercel.app",
        port: "",
        pathname: "/editorial/preploom-study-system.png",
        search: "",
      },
    ],
  },
};

export default nextConfig;
