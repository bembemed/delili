import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { routing } from "@/i18n/routing";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: `/${routing.defaultLocale}/connexion`,
  },
  providers: [
    Credentials({
      credentials: {
        phone: { label: "Téléphone", type: "tel" },
        password: { label: "Mot de passe", type: "password" },
      },
      authorize: async (credentials) => {
        const phone = credentials?.phone as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!phone || !password) return null;

        const user = await prisma.user.findUnique({ where: { phone }, include: { exam: true } });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          examId: user.examId,
          examSlug: user.exam.slug,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.examId = user.examId;
        token.examSlug = user.examSlug;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;
        session.user.examId = token.examId as string;
        session.user.examSlug = token.examSlug as string;
      }
      return session;
    },
  },
});
