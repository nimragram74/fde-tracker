/** @type {import('next').NextConfig} */
const nextConfig = {
  // Container builds (Dockerfile sets BUILD_STANDALONE=1) use the self-contained
  // 'standalone' output. App Service builds on the server (Oryx) and runs
  // `next start` against the normal build.
  output: process.env.BUILD_STANDALONE ? "standalone" : undefined,
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // Server Actions are used for progress updates and admin config.
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
