export type Role = "CUSTOMER" | "ADMIN";

export type DbUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  passwordHash: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};