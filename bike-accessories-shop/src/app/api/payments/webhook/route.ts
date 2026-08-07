import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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
        status?: string;
        captured?: boolean;
      };
    };
  };
};

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

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

  const existing = await prisma.paymentEvent.findUnique({
    where: { providerEventId: paymentId },
  });
  if (existing) {
    return NextResponse.json({ ok: true, idempotent: true });
  }

  const order =
    typeof payment.order_id === "string" && payment.order_id !== ""
      ? await prisma.order.findUnique({
          where: { razorpayOrderId: payment.order_id },
          select: { id: true, totalInPaise: true, paymentStatus: true },
        })
      : null;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.paymentEvent.create({
        data: {
          providerEventId: paymentId,
          provider: "razorpay",
          orderId: order?.id ?? null,
          status: "RECEIVED",
          payload,
        },
      });

      const isCaptured =
        payload.event === "payment.captured" && payment.status === "captured";

      if (isCaptured && order) {
        if (payment.amount === order.totalInPaise) {
          await tx.order.updateMany({
            where: { id: order.id, paymentStatus: "PENDING" },
            data: {
              paymentStatus: "PAID",
              status: "CONFIRMED",
              razorpayPaymentId: paymentId,
            },
          });
        } else {
          console.error(
            `Webhook amount mismatch for order ${order.id}: expected ${order.totalInPaise}, got ${payment.amount}`
          );
        }
      }

      await tx.paymentEvent.update({
        where: { providerEventId: paymentId },
        data: { status: "PROCESSED" },
      });
    });
  } catch (error) {
    console.error("Failed to process Razorpay webhook:", error);
  }

  return NextResponse.json({ ok: true });
}
