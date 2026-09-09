export type ContactMessageStatus = "NEW" | "READ" | "REPLIED" | "ARCHIVED";

export type DbContactMessage = {
  id: string;
  name: string;
  email: string;
  contactNumber: string | null;
  message: string;
  status: ContactMessageStatus;
  createdAt: Date;
  updatedAt: Date;
};