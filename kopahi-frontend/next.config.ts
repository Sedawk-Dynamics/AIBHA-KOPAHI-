import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  trailingSlash: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
  async redirects() {
    const SHOP = "https://shop.kopahi.com";
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.kopahi.com" }],
        destination: "https://kopahi.com/:path*",
        permanent: true,
      },
      // Retired in-app commerce/content routes → WordPress shop.
      { source: "/products", destination: `${SHOP}/shop/`, permanent: true },
      { source: "/products/:path*", destination: `${SHOP}/shop/`, permanent: true },
      { source: "/journal", destination: `${SHOP}/blog/`, permanent: true },
      { source: "/journal/:path*", destination: `${SHOP}/blog/`, permanent: true },
      { source: "/cart", destination: `${SHOP}/cart/`, permanent: true },
      { source: "/checkout", destination: `${SHOP}/checkout/`, permanent: true },
      { source: "/login", destination: `${SHOP}/my-account/`, permanent: true },
      { source: "/signup", destination: `${SHOP}/my-account/`, permanent: true },
      { source: "/vendor-signup", destination: `${SHOP}/my-account/`, permanent: true },
      { source: "/forgot-password", destination: `${SHOP}/my-account/lost-password/`, permanent: true },
      { source: "/reset-password/:path*", destination: `${SHOP}/my-account/lost-password/`, permanent: true },
      { source: "/dashboard", destination: `${SHOP}/dashboard/`, permanent: true },
      { source: "/dashboard/:path*", destination: `${SHOP}/dashboard/`, permanent: true },
    ];
  },
};

export default nextConfig;
