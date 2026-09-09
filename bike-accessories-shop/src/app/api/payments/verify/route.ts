import { NextRequest, NextResponse } from "next/server";
import { findOrderByRazorpayOrderId, markOrderPaid } from "@/lib/db";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { verifyPaymentRequestSchema } from "@/lib/validation";
import { verifyPaymentSignature } from "@/lib/payments";

export async function POST(request: NextRequest) {
  const limited = rateLimit({
    key: `verify:${getClientIp(request)}`,
    limit: 30,
    windowMs: 10 * 60 * 1000,
  });
  if (!limited.ok) {
    return NextResponse.json({ error: limited.message }, { status: 429 });
  }

  let parsed;
  try {
    parsed = verifyPaymentRequestSchema.safeParse(await request.json());
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  const { razorpayOrderId, razorpayPaymentId, signature } = parsed.data;

  const order = await findOrderByRazorpayOrderId(razorpayOrderId);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.paymentStatus === "PAID") {
    return NextResponse.json({
      verified: true,
      orderId: order.id,
      alreadyProcessed: true,
    });
  }

  if (
    !verifyPaymentSignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature,
    })
  ) {
    console.error(
      `Payment signature verification failed for order ${order.id}`
    );
    return NextResponse.json(
      { error: "Payment signature verification failed" },
      { status: 400 }
    );
  }

  const updated = await markOrderPaid(order.id, razorpayPaymentId);

  if (updated === 0) {
    return NextResponse.json({
      verified: true,
      orderId: order.id,
      alreadyProcessed: true,
    });
  }

  return NextResponse.json({ verified: true, orderId: order.id });
}
