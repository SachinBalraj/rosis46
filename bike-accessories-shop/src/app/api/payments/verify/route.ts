import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPaymentRequestSchema } from "@/lib/validation";
import { verifyPaymentSignature } from "@/lib/payments";

export async function POST(request: NextRequest) {
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

  const order = await prisma.order.findUnique({
    where: { razorpayOrderId },
  });

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

  const updated = await prisma.order.updateMany({
    where: { id: order.id, paymentStatus: "PENDING" },
    data: {
      paymentStatus: "PAID",
      status: "CONFIRMED",
      razorpayPaymentId,
    },
  });

  if (updated.count === 0) {
    return NextResponse.json({
      verified: true,
      orderId: order.id,
      alreadyProcessed: true,
    });
  }

  return NextResponse.json({ verified: true, orderId: order.id });
}
