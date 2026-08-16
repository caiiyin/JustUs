import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    lifeStageTags: string[]; // 한국어 표시명 배열
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      lifeStageTags: string[];
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    lifeStageTags: string[];
  }
}
