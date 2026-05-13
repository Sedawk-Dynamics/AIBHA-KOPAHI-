import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kopahi — Authentic by Geography, Pure by Nature",
    short_name: "Kopahi",
    description: "GI-certified heritage of Northeast India.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4ede0",
    theme_color: "#2e3b2a",
    icons: [
      { src: "/Logo1.png", sizes: "192x192", type: "image/png" },
      { src: "/Logo1.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
