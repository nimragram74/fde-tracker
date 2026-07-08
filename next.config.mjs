/** @type {import('next').NextConfig} */
const nextConfig = {
  // Always emit the self-contained 'standalone' server bundle. Both the
  // container (Dockerfile) and App Service deploy run `node server.js` from it.
  // (`next start` still works locally against the same build.)
  output: "standalone",
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
