import { NextRequest, NextResponse } from "next/server";
import {
  findPaymentEvent,
  insertPaymentEvent,
  findOrderByRazorpayOrderId,
  markOrderPaid,
  setPaymentEventStatus,
} from "@/lib/db";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { verifyWebhookSignature } from "@/lib/payments";

export const runtime = "nodejs";

type RazorpayWebhookPayload = {
  event?: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        amount?: number;
        currency?: string;
        status?: string;
        captured?: boolean;
      };
    };
  };
};

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  const limited = rateLimit({
    key: `webhook:${getClientIp(request)}`,
    limit: 120,
    windowMs: 60 * 1000,
  });
  if (!limited.ok) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  if (!signature || !verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let payload: RazorpayWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as RazorpayWebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid webhook body" }, { status: 400 });
  }

  const payment = payload.payload?.payment?.entity;
  if (!payment || typeof payment.id !== "string" || payment.id === "") {
    return NextResponse.json({ ok: true });
  }

  const paymentId = payment.id;

  const existing = await findPaymentEvent(paymentId);
  if (existing?.status === "PROCESSED") {
    return NextResponse.json({ ok: true, idempotent: true });
  }

  const order =
    typeof payment.order_id === "string" && payment.order_id !== ""
      ? await findOrderByRazorpayOrderId(payment.order_id)
      : null;

  try {
    if (!existing) {
      const inserted = await insertPaymentEvent({
        providerEventId: paymentId,
        orderId: order?.id ?? null,
        payload,
      });
      if (inserted === "duplicate") {
        return NextResponse.json({ ok: true, idempotent: true });
      }
    }

    const isCaptured =
      payload.event === "payment.captured" &&
      payment.status === "captured" &&
      payment.currency === "INR";

    if (isCaptured && order) {
      if (payment.amount === order.totalInPaise) {
        await markOrderPaid(order.id, paymentId);
      } else {
        console.error(
          `Webhook amount mismatch for order ${order.id}: expected ${order.totalInPaise}, got ${payment.amount}`
        );
      }
    }

    await setPaymentEventStatus(paymentId, "PROCESSED");
  } catch (error) {
    console.error("Failed to process Razorpay webhook:", error);
  }

  return NextResponse.json({ ok: true });
}
