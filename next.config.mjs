import { createMDX } from "fumadocs-mdx/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [{ source: "/docs/:path*.md", destination: "/llm/:path*" }];
  },
};

const withMDX = createMDX({
  macro: { include: ["**/lib/source.ts"] },
});

export default withMDX(nextConfig);
