import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Delili — دليلي",
    short_name: "Delili",
    description: "Préparez le concours de la fonction publique mauritanienne : tests QCM, corrections détaillées et suivi de progression.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fbf9f2",
    theme_color: "#0b3d2c",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
