import type { Metadata } from "next";
import { listContactMessages } from "@/lib/db";
import { ContactMessages } from "@/components/admin/ContactMessages";

export const metadata: Metadata = {
  title: "Contact messages | Admin console",
  description: "Read and manage customer enquiries for Rossis Biker Spot.",
};

export default async function AdminContactMessagesPage() {
  const messages = await listContactMessages();

  return <ContactMessages messages={messages} />;
}