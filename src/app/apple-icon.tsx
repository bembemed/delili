import { ImageResponse } from "next/og";
import { BrandSeal } from "@/lib/brandSeal";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<BrandSeal size={180} />, size);
}
