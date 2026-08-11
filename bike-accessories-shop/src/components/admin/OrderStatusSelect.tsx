"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ORDER_STATUS_VALUES } from "@/lib/admin-validation";
import { cn } from "@/lib/utils";

const statusLabel: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

type OrderStatusSelectProps = {
  orderId: string;
  status: string;
};

export function OrderStatusSelect({ orderId, status }: OrderStatusSelectProps) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);

  const onChange = async (next: string) => {
    if (next === value) return;

    const previous = value;
    setValue(next);
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = (await response.json()) as { order?: { status: string }; error?: string };

      if (!response.ok) {
        setValue(previous);
        toast.error(data.error ?? "Could not update the order status.");
        return;
      }

      toast.success(
        `Order marked as ${statusLabel[next]?.toLowerCase() ?? next}.`
      );
      router.refresh();
    } catch {
      setValue(previous);
      toast.error("Could not update the order status.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative inline-flex">
      <select
        aria-label="Fulfilment status"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={saving}
        className={cn(
          "w-full min-w-36 cursor-pointer appearance-none border bg-white py-1.5 pl-3 pr-9 text-sm font-semibold focus:outline-none disabled:opacity-60",
          value === "CANCELLED"
            ? "border-rose-500/50 text-rose-600"
            : value === "DELIVERED"
              ? "border-emerald-600/50 text-emerald-700"
              : value === "SHIPPED"
                ? "border-brand/50 text-brand"
                : "border-line text-foreground focus:border-brand"
        )}
      >
        {ORDER_STATUS_VALUES.map((option) => (
          <option key={option} value={option}>
            {statusLabel[option]}
          </option>
        ))}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-3 flex items-center"
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin text-smoke" />
        ) : (
          <svg
            className="h-4 w-4 text-smoke"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </span>
    </div>
  );
}
