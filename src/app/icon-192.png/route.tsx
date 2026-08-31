import { ImageResponse } from "next/og";
import { BrandSeal } from "@/lib/brandSeal";

export async function GET() {
  return new ImageResponse(<BrandSeal size={192} />, { width: 192, height: 192 });
}
