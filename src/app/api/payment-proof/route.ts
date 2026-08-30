import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppImage, toE164Mauritania } from "@/lib/wasender";
import { buildPaymentProofImageUrl } from "@/lib/paymentProofLink";

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
    select: { name: true, phone: true, subscriptionStatus: true, exam: { select: { corpsFr: true } } },
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

  const adminNumber = process.env.PAYMENT_ADMIN_WHATSAPP_NUMBER;
  if (adminNumber) {
    const imageUrl = buildPaymentProofImageUrl(session.user.id);
    const caption = `🔔 Nouveau justificatif de paiement\n\nCandidat : ${user.name}\nTéléphone : ${user.phone}\nConcours : ${user.exam.corpsFr}\n\nÀ vérifier dans l'espace admin.`;
    void sendWhatsAppImage(toE164Mauritania(adminNumber), imageUrl, caption);
  }

  return NextResponse.json({ ok: true });
}
