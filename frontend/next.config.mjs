/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "*",
        protocol: "https",
      },
      {
        hostname: "localhost",
        protocol: "http",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
