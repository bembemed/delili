import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      examId: string;
      examSlug: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    examId: string;
    examSlug: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    examId?: string;
    examSlug?: string;
  }
}
