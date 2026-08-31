import { ImageResponse } from "next/og";
import { BrandSeal } from "@/lib/brandSeal";

export async function GET() {
  return new ImageResponse(<BrandSeal size={512} />, { width: 512, height: 512 });
}
