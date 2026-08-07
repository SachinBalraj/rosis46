import type { DefaultSession } from "next-auth";

type RideReadyRole = "CUSTOMER" | "ADMIN";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: RideReadyRole;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: RideReadyRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: RideReadyRole;
  }
}
