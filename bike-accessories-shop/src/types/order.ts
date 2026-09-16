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
  paymentMethod?: string | null;
  customerAddressLine1?: string | null;
  customerAddressLine2?: string | null;
  customerLandmark?: string | null;
  customerDistrict?: string | null;
  customerCity?: string | null;
  customerState?: string | null;
  customerPostalCode?: string | null;
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

export type AdminOrderItemRow = {
  id: string;
  productId: string;
  name: string;
  imageUrl: string | null;
  categoryName: string | null;
  quantity: number;
  unitPriceInPaise: number;
};

export type AdminOrderRow = DbOrder & {
  itemCount: number;
  items: AdminOrderItemRow[];
};

export type NewOrderItem = {
  productId: string;
  quantity: number;
  unitPriceInPaise: number;
};