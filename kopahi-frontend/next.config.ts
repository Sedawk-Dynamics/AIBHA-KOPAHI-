import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  trailingSlash: false,
  turbopack: {
    root: path.join(__dirname),
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
      // The :path regex excludes anything containing a dot so static files in
      // public/products/ (images etc.) are still served.
      { source: "/products", destination: `${SHOP}/shop/`, permanent: true },
      { source: "/products/:path((?!.*\\.).*)", destination: `${SHOP}/shop/`, permanent: true },
      { source: "/shop", destination: `${SHOP}/shop/`, permanent: true },
      { source: "/blog", destination: `${SHOP}/blog/`, permanent: true },
      { source: "/blog/:path((?!.*\\.).*)", destination: `${SHOP}/blog/`, permanent: true },
      // NOTE: /journal intentionally NOT redirected yet — the journal pages
      // stay live on kopahi.com until their essays are migrated into the
      // WordPress blog. Re-add the /journal redirects when deleting app/journal.
      { source: "/cart", destination: `${SHOP}/cart/`, permanent: true },
      { source: "/checkout", destination: `${SHOP}/checkout/`, permanent: true },
      { source: "/login", destination: `${SHOP}/my-account/`, permanent: true },
      { source: "/signup", destination: `${SHOP}/my-account/`, permanent: true },
      { source: "/vendor-signup", destination: `${SHOP}/my-account/`, permanent: true },
      { source: "/join", destination: `${SHOP}/my-account/`, permanent: true },
      { source: "/forgot-password", destination: `${SHOP}/my-account/lost-password/`, permanent: true },
      { source: "/reset-password/:path*", destination: `${SHOP}/my-account/lost-password/`, permanent: true },
      { source: "/track-order", destination: `${SHOP}/my-account/orders/`, permanent: true },
      { source: "/dashboard", destination: `${SHOP}/dashboard/`, permanent: true },
      { source: "/dashboard/:path*", destination: `${SHOP}/dashboard/`, permanent: true },
      { source: "/add-product", destination: `${SHOP}/dashboard/`, permanent: true },
      { source: "/manage-products", destination: `${SHOP}/dashboard/`, permanent: true },
      { source: "/inventory", destination: `${SHOP}/dashboard/`, permanent: true },
      { source: "/orders", destination: `${SHOP}/dashboard/`, permanent: true },
      { source: "/payouts", destination: `${SHOP}/dashboard/`, permanent: true },
      { source: "/vendor-requests", destination: `${SHOP}/dashboard/`, permanent: true },
      { source: "/settings", destination: `${SHOP}/dashboard/`, permanent: true },
      // Retired brand-site routes → their kept equivalents.
      { source: "/support", destination: "/contact", permanent: true },
      { source: "/partners", destination: "/b2b", permanent: true },
      { source: "/about/farmers", destination: "/farmers", permanent: true },
    ];
  },
};

export default nextConfig;
