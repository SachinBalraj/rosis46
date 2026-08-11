import { cn } from "@/lib/utils";

const orderStatusStyles: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "Pending",
    className: "border-brand/40 bg-brand/10 text-brand",
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "border-brand/50 bg-brand/10 text-brand",
  },
  PROCESSING: {
    label: "Processing",
    className: "border-brand bg-brand/15 text-brand-deep",
  },
  SHIPPED: {
    label: "Shipped",
    className: "border-brand bg-brand text-white",
  },
  DELIVERED: {
    label: "Delivered",
    className: "border-emerald-600/40 bg-emerald-50 text-emerald-700",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "border-rose-500/40 bg-rose-50 text-rose-600",
  },
};

const paymentStatusStyles: Record<
  string,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Payment pending",
    className: "border-brand/40 bg-brand/10 text-brand",
  },
  PAID: {
    label: "Paid",
    className: "border-emerald-600/40 bg-emerald-50 text-emerald-700",
  },
  FAILED: {
    label: "Payment failed",
    className: "border-rose-500/40 bg-rose-50 text-rose-600",
  },
  REFUNDED: {
    label: "Refunded",
    className: "border-foreground bg-carbon-soft text-foreground",
  },
};

function Badge({ status, styles }: { status: string; styles: Record<string, { label: string; className: string }> }) {
  const config = styles[status] ?? {
    label: status,
    className: "border-line bg-carbon-soft text-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center border px-3 py-1 text-xs font-semibold tracking-wide uppercase",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}

export function OrderStatusBadge({ status }: { status: string }) {
  return <Badge status={status} styles={orderStatusStyles} />;
}

export function PaymentStatusBadge({ status }: { status: string }) {
  return <Badge status={status} styles={paymentStatusStyles} />;
}
