import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    lifeStage?: string | null;
    familyType?: string | null;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      lifeStage?: string | null;
      familyType?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    lifeStage?: string | null;
    familyType?: string | null;
  }
}
