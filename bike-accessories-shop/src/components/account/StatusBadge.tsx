import { cn } from "@/lib/utils";

const orderStatusStyles: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "Pending",
    className: "border-amber-400/30 bg-amber-400/10 text-amber-400",
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "border-sky-400/30 bg-sky-400/10 text-sky-400",
  },
  PROCESSING: {
    label: "Processing",
    className: "border-violet-400/30 bg-violet-400/10 text-violet-400",
  },
  SHIPPED: {
    label: "Shipped",
    className: "border-brand/30 bg-brand/10 text-brand",
  },
  DELIVERED: {
    label: "Delivered",
    className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-400",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "border-rose-400/30 bg-rose-400/10 text-rose-400",
  },
};

const paymentStatusStyles: Record<
  string,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Payment pending",
    className: "border-amber-400/30 bg-amber-400/10 text-amber-400",
  },
  PAID: {
    label: "Paid",
    className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-400",
  },
  FAILED: {
    label: "Payment failed",
    className: "border-rose-400/30 bg-rose-400/10 text-rose-400",
  },
  REFUNDED: {
    label: "Refunded",
    className: "border-sky-400/30 bg-sky-400/10 text-sky-400",
  },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const config = orderStatusStyles[status] ?? {
    label: status,
    className: "border-line bg-carbon-soft text-smoke",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: string }) {
  const config = paymentStatusStyles[status] ?? {
    label: status,
    className: "border-line bg-carbon-soft text-smoke",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
