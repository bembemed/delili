import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppImageToMany, toE164Mauritania } from "@/lib/wasender";
import { buildPaymentProofImageUrl } from "@/lib/paymentProofLink";

const phoneRegex = /^(?:\+?222)?[2-4]\d{7}$/;
// ~4MB image, base64-encoded (roughly 4/3 the raw byte size) plus data-URI prefix headroom.
const MAX_SCREENSHOT_LENGTH = 5_600_000;

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z
    .string()
    .transform((v) => v.replace(/[\s-]/g, ""))
    .refine((v) => phoneRegex.test(v), "invalid"),
  password: z.string().min(6),
  examId: z.string().min(1),
  screenshot: z
    .string()
    .min(1)
    .max(MAX_SCREENSHOT_LENGTH)
    .regex(/^data:image\/(png|jpe?g|webp);base64,/, "invalid"),
});

function fieldErrorCode(path: PropertyKey[]) {
  const field = path[0];
  if (field === "name") return "INVALID_NAME";
  if (field === "phone") return "INVALID_PHONE";
  if (field === "password") return "INVALID_PASSWORD";
  if (field === "examId") return "INVALID_EXAM";
  if (field === "screenshot") return "INVALID_FILE";
  return "GENERIC";
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    const code = fieldErrorCode(parsed.error.issues[0]?.path ?? []);
    return NextResponse.json({ error: code }, { status: 400 });
  }

  const { name, phone, password, examId, screenshot } = parsed.data;

  const exam = await prisma.quiz.findUnique({ where: { id: examId } });
  if (!exam) {
    return NextResponse.json({ error: "INVALID_EXAM" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) {
    return NextResponse.json({ error: "PHONE_TAKEN" }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      phone,
      password: hashed,
      examId,
      paymentScreenshot: screenshot,
      subscriptionStatus: "PENDING_REVIEW",
    },
  });

  const adminNumbers = (process.env.PAYMENT_ADMIN_WHATSAPP_NUMBERS ?? "")
    .split(",")
    .map((n) => n.trim())
    .filter(Boolean);
  if (adminNumbers.length > 0) {
    const imageUrl = buildPaymentProofImageUrl(user.id);
    const caption = `🔔 Nouveau justificatif de paiement\n\nCandidat : ${name}\nTéléphone : ${phone}\nConcours : ${exam.corpsFr}\n\nÀ vérifier dans l'espace admin.`;
    void sendWhatsAppImageToMany(adminNumbers.map(toE164Mauritania), imageUrl, caption);
  }

  return NextResponse.json({ id: user.id, name: user.name, phone: user.phone });
}
