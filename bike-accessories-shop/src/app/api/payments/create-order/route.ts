import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import {
  listProductsByIds,
  findRecentDuplicateOrder,
  reserveStock,
  restoreStock,
  createOrderAndItems,
  deleteOrderWithItems,
  setOrderRazorpayOrderId,
} from "@/lib/db";
import { authOptions } from "@/auth";
import { createOrderRequestSchema } from "@/lib/validation";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import {
  createRazorpayOrder,
  getRazorpayKeyId,
} from "@/lib/payments";

const FREE_SHIPPING_THRESHOLD_PAISE = 99900;
const SHIPPING_FEE_PAISE = 7900;
const DUPLICATE_WINDOW_MS = 15 * 60 * 1000;

function shippingInPaise(subtotalInPaise: number) {
  return subtotalInPaise >= FREE_SHIPPING_THRESHOLD_PAISE ? 0 : SHIPPING_FEE_PAISE;
}

function cartSignature(items: { id: string; quantity: number }[]): string {
  return [...items]
    .map((line) => `${line.id}:${line.quantity}`)
    .sort()
    .join("|");
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ?? null;

  const limited = rateLimit({
    key: `create-order:${getClientIp(request)}`,
    limit: 20,
    windowMs: 10 * 60 * 1000,
  });
  if (!limited.ok) {
    return NextResponse.json({ error: limited.message }, { status: 429 });
  }

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
  const products = (await listProductsByIds(productIds)).filter(
    (product) => product.active
  );
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

  const requestedSignature = cartSignature(items);

  const duplicateOrder = await findRecentDuplicateOrder(
    customer.email,
    new Date(Date.now() - DUPLICATE_WINDOW_MS)
  );

  if (
    duplicateOrder &&
    duplicateOrder.razorpayOrderId &&
    cartSignature(
      duplicateOrder.items.map((item) => ({
        id: item.productId,
        quantity: item.quantity,
      }))
    ) === requestedSignature
  ) {
    return NextResponse.json({
      orderId: duplicateOrder.id,
      razorpayOrderId: duplicateOrder.razorpayOrderId,
      keyId: getRazorpayKeyId(),
      amount: duplicateOrder.totalInPaise,
      currency: "INR",
      customer: {
        name: customer.fullName,
        email: customer.email,
        contact: customer.phone,
      },
    });
  }

  let orderId: string;
  const stockLines = lines.map((line) => ({
    productId: line.product.id,
    quantity: line.quantity,
  }));
  try {
    const reservation = await reserveStock(
      lines.map((line) => ({
        productId: line.product.id,
        quantity: line.quantity,
        unitPriceInPaise: line.unitPriceInPaise,
      }))
    );
    if (!reservation.ok) {
      return NextResponse.json(
        { error: "Not enough stock available for one of your items." },
        { status: 409 }
      );
    }

    try {
      orderId = await createOrderAndItems({
        userId,
        customerName: customer.fullName,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        customerAddress: `${customer.address}, ${customer.city}, ${customer.state} ${customer.postalCode}`,
        subtotalInPaise,
        shippingInPaise: shippingInPaiseValue,
        totalInPaise,
        items: lines.map((line) => ({
          productId: line.product.id,
          quantity: line.quantity,
          unitPriceInPaise: line.unitPriceInPaise,
        })),
      });
    } catch (error) {
      await restoreStock(stockLines);
      throw error;
    }
  } catch (error) {
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
      receipt: orderId,
      notes: { orderId, customerEmail: customer.email },
    });
  } catch (error) {
    console.error("Failed to create Razorpay order:", error);
    try {
      await restoreStock(stockLines);
      await deleteOrderWithItems(orderId);
    } catch (cleanupError) {
      console.error("Failed to roll back reserved stock:", cleanupError);
    }
    return NextResponse.json(
      { error: "Failed to start payment. Please try again." },
      { status: 502 }
    );
  }

  try {
    await setOrderRazorpayOrderId(orderId, razorpayOrder.id);
  } catch (error) {
    console.error("Failed to persist razorpay order id:", error);
  }

  return NextResponse.json({
    orderId,
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
