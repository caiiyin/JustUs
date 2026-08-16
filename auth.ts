import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) return null;

        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
          lifeStage: user.life_stage,
          familyType: user.family_type,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.lifeStage = user.lifeStage;
        token.familyType = user.familyType;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.lifeStage = token.lifeStage;
      session.user.familyType = token.familyType;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
