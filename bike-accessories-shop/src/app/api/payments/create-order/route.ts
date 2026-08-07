import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/auth";
import { createOrderRequestSchema } from "@/lib/validation";
import {
  createRazorpayOrder,
  getRazorpayKeyId,
} from "@/lib/payments";

const FREE_SHIPPING_THRESHOLD_PAISE = 99900;
const SHIPPING_FEE_PAISE = 7900;

function shippingInPaise(subtotalInPaise: number) {
  return subtotalInPaise >= FREE_SHIPPING_THRESHOLD_PAISE ? 0 : SHIPPING_FEE_PAISE;
}

class InsufficientStockError extends Error {
  constructor(productId: string) {
    super(`Insufficient stock for product ${productId}`);
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ?? null;

  let parsed;
  try {
    parsed = createOrderRequestSchema.safeParse(await request.json());
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

  const { customer, items } = parsed.data;

  const productIds = [...new Set(items.map((line) => line.id))];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, active: true },
  });
  const productById = new Map(products.map((product) => [product.id, product]));

  for (const line of items) {
    const product = productById.get(line.id);
    if (!product) {
      return NextResponse.json(
        { error: "One of your items is no longer in the catalogue." },
        { status: 409 }
      );
    }
    if (line.quantity > product.stock) {
      return NextResponse.json(
        {
          error: `Only ${product.stock} unit${product.stock === 1 ? "" : "s"} of ${product.name} left in stock.`,
        },
        { status: 409 }
      );
    }
  }

  const lines = items.map((line) => {
    const product = productById.get(line.id)!;
    const unitPriceInPaise = product.salePriceInPaise ?? product.priceInPaise;
    return { product, quantity: line.quantity, unitPriceInPaise };
  });

  const subtotalInPaise = lines.reduce(
    (sum, line) => sum + line.unitPriceInPaise * line.quantity,
    0
  );
  const shippingInPaiseValue = shippingInPaise(subtotalInPaise);
  const totalInPaise = subtotalInPaise + shippingInPaiseValue;

  let order;
  try {
    order = await prisma.$transaction(async (tx) => {
      for (const line of lines) {
        const updated = await tx.product.updateMany({
          where: {
            id: line.product.id,
            active: true,
            stock: { gte: line.quantity },
          },
          data: { stock: { decrement: line.quantity } },
        });
        if (updated.count !== 1) {
          throw new InsufficientStockError(line.product.id);
        }
      }

      return tx.order.create({
        data: {
          userId,
          customerName: customer.fullName,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          customerAddress: `${customer.address}, ${customer.city}, ${customer.state} ${customer.postalCode}`,
          subtotalInPaise,
          shippingInPaise: shippingInPaiseValue,
          totalInPaise,
          status: "PENDING",
          paymentStatus: "PENDING",
          items: {
            create: lines.map((line) => ({
              productId: line.product.id,
              quantity: line.quantity,
              unitPriceInPaise: line.unitPriceInPaise,
            })),
          },
        },
      });
    });
  } catch (error) {
    if (error instanceof InsufficientStockError) {
      return NextResponse.json(
        { error: "Not enough stock available for one of your items." },
        { status: 409 }
      );
    }
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }

  let razorpayOrder;
  try {
    razorpayOrder = await createRazorpayOrder({
      amountInPaise: totalInPaise,
      receipt: order.id,
      notes: { orderId: order.id, customerEmail: customer.email },
    });
  } catch (error) {
    console.error("Failed to create Razorpay order:", error);
    try {
      await prisma.$transaction([
        ...lines.map((line) =>
          prisma.product.update({
            where: { id: line.product.id },
            data: { stock: { increment: line.quantity } },
          })
        ),
        prisma.order.delete({ where: { id: order.id } }),
      ]);
    } catch (cleanupError) {
      console.error("Failed to roll back reserved stock:", cleanupError);
    }
    return NextResponse.json(
      { error: "Failed to start payment. Please try again." },
      { status: 502 }
    );
  }

  try {
    await prisma.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: razorpayOrder.id },
    });
  } catch (error) {
    console.error("Failed to persist razorpay order id:", error);
  }

  return NextResponse.json({
    orderId: order.id,
    razorpayOrderId: razorpayOrder.id,
    keyId: getRazorpayKeyId(),
    amount: Number(razorpayOrder.amount),
    currency: razorpayOrder.currency,
    customer: {
      name: customer.fullName,
      email: customer.email,
      contact: customer.phone,
    },
  });
}
