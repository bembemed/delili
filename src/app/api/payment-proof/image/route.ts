import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPaymentProofSignature } from "@/lib/paymentProofLink";

/** Serves a candidate's payment screenshot as raw image bytes at a signed,
 * unguessable URL — the only way to hand WasenderAPI a public image URL
 * without exposing every screenshot at a predictable path. Not linked from
 * anywhere in the site's own UI. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  const sig = url.searchParams.get("sig");

  if (!userId || !sig || !verifyPaymentProofSignature(userId, sig)) {
    return NextResponse.json({ error: "Invalid or expired link." }, { status: 404 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { paymentScreenshot: true } });
  if (!user?.paymentScreenshot) {
    return NextResponse.json({ error: "No screenshot on file." }, { status: 404 });
  }

  const match = user.paymentScreenshot.match(/^data:(image\/[a-z]+);base64,(.+)$/);
  if (!match) {
    return NextResponse.json({ error: "Malformed screenshot data." }, { status: 500 });
  }

  const [, mimeType, base64Data] = match;
  const bytes = Buffer.from(base64Data, "base64");

  return new NextResponse(bytes, {
    headers: {
      "Content-Type": mimeType,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
