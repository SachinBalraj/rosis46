export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type OrderItemRef = {
  id: string;
  productId: string;
  quantity: number;
  unitPriceInPaise: number;
  product?: { id: string; name: string; imageUrl: string | null };
};

export type DbOrder = {
  id: string;
  userId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  subtotalInPaise: number;
  shippingInPaise: number;
  totalInPaise: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItemRef[];
};

export type NewOrderItem = {
  productId: string;
  quantity: number;
  unitPriceInPaise: number;
};