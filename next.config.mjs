import { createMDX } from "fumadocs-mdx/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
};

const withMDX = createMDX({
  macro: { include: ["**/lib/source.ts"] },
});

export default withMDX(nextConfig);
