import { PrismaClient } from "@prisma/client";
import { writeFileSync } from "fs";
import { resolve } from "path";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ include: { attempts: true } });
  const paymentChannels = await prisma.paymentChannel.findMany();

  const snapshot = { users, paymentChannels, exportedAt: new Date().toISOString() };
  const outPath = resolve(__dirname, "../real-data-backup.json");
  writeFileSync(outPath, JSON.stringify(snapshot, null, 2));

  console.log(`Exported ${users.length} users, ${paymentChannels.length} payment channels -> ${outPath}`);
}

main().finally(() => prisma.$disconnect());
