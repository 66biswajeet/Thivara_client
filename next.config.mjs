/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    // Use environment variables for different environments
    API_PROD_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
    ADMIN_HOST: process.env.NEXT_PUBLIC_ADMIN_HOST || "http://localhost:3000",
    storageURL: process.env.NEXT_PUBLIC_STORAGE_URL || "http://localhost:3000",
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      // Allow Cloudinary images used by admin panel
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  module: {
    rules: [
      { test: /\.(ts|tsx|jsx)$/, loader: "ts-loader" },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      {
        test: /\.(gif|svg|jpg|png|mp3)$/,
        use: ["file-loader"],
      },
    ],
  },
  // other boilerplate config goes down here
};

export default nextConfig;
