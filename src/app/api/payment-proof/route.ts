import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ~4MB image, base64-encoded (roughly 4/3 the raw byte size) plus data-URI prefix headroom.
const MAX_SCREENSHOT_LENGTH = 5_600_000;

const bodySchema = z.object({
  screenshot: z
    .string()
    .min(1)
    .max(MAX_SCREENSHOT_LENGTH)
    .regex(/^data:image\/(png|jpe?g|webp);base64,/, "invalid"),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "NOT_AUTHENTICATED" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_FILE" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { subscriptionStatus: true },
  });
  if (!user) {
    return NextResponse.json({ error: "NOT_AUTHENTICATED" }, { status: 401 });
  }
  if (user.subscriptionStatus === "PENDING_REVIEW" || user.subscriptionStatus === "APPROVED") {
    return NextResponse.json({ error: "ALREADY_SUBMITTED" }, { status: 409 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      paymentScreenshot: parsed.data.screenshot,
      subscriptionStatus: "PENDING_REVIEW",
      rejectionReason: null,
    },
  });

  return NextResponse.json({ ok: true });
}
