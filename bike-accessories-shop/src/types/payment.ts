export type PaymentEventStatus = "RECEIVED" | "PROCESSED" | "FAILED";

export type DbPaymentEvent = {
  id: string;
  providerEventId: string;
  provider: string;
  orderId: string | null;
  status: PaymentEventStatus;
  payload: unknown;
  createdAt: Date;
};