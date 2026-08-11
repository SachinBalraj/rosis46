import type { DefaultSession } from "next-auth";

type RossisRole = "CUSTOMER" | "ADMIN";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: RossisRole;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: RossisRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: RossisRole;
  }
}
