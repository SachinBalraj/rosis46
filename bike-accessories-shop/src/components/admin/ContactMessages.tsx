"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTACT_MESSAGE_STATUS_VALUES } from "@/lib/admin-validation";

type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  contactNumber: string | null;
  message: string;
  status: string;
  createdAt: Date | string;
};

type ContactMessagesProps = {
  messages: ContactMessageRow[];
};

const statusStyles: Record<string, { label: string; className: string }> = {
  NEW: {
    label: "New",
    className: "border-brand bg-brand text-white",
  },
  READ: {
    label: "Read",
    className: "border-foreground/40 bg-carbon-soft text-foreground",
  },
  REPLIED: {
    label: "Replied",
    className: "border-emerald-600/40 bg-emerald-50 text-emerald-700",
  },
  ARCHIVED: {
    label: "Archived",
    className: "border-line bg-carbon-soft text-smoke",
  },
};

function StatusBadge({ status }: { status: string }) {
  const config = statusStyles[status] ?? {
    label: status,
    className: "border-line bg-carbon-soft text-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center border px-2.5 py-0.5 text-[11px] font-semibold tracking-widest uppercase",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}

function formatDate(value: Date | string) {
  const date = new Date(value);
  return `${date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}, ${date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

type FilterValue = "ALL" | (typeof CONTACT_MESSAGE_STATUS_VALUES)[number];

export function ContactMessages({ messages }: ContactMessagesProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterValue>("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const counts = messages.reduce<Record<string, number>>(
    (acc, message) => {
      acc[message.status] = (acc[message.status] ?? 0) + 1;
      return acc;
    },
    { ALL: messages.length }
  );

  const visible =
    filter === "ALL"
      ? messages
      : messages.filter((message) => message.status === filter);

  const selected =
    messages.find((message) => message.id === selectedId) ?? null;

  const updateStatus = async (status: string) => {
    if (!selected || busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/contact-messages/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error ?? "Could not update the status");
      }
      toast.success(`Marked as ${status.toLowerCase()}.`);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update the status."
      );
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!selected || busy) return;
    if (!window.confirm("Delete this message permanently?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/contact-messages/${selected.id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error ?? "Could not delete the message");
      }
      toast.success("Message deleted.");
      setSelectedId(null);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not delete the message."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h1 className="display-heading text-rainbow text-4xl text-foreground uppercase">
        Contact messages
      </h1>
      <p className="mt-2 text-sm text-smoke">
        Enquiries sent from the contact page. Mark a message as read, replied or
        archived, or delete it once handled.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {(["ALL", ...CONTACT_MESSAGE_STATUS_VALUES] as FilterValue[]).map(
          (value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
              className={cn(
                "inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs font-semibold tracking-widest uppercase transition-colors",
                filter === value
                  ? "border-black bg-black text-white"
                  : "border-line bg-white text-smoke hover:border-foreground hover:text-foreground"
              )}
            >
              {value}
              <span
                className={cn(
                  "rounded-full px-1.5 text-[11px] font-bold",
                  filter === value ? "bg-white text-black" : "bg-carbon-soft"
                )}
              >
                {counts[value] ?? 0}
              </span>
            </button>
          )
        )}
      </div>

      {selected ? (
        <section
          aria-label={`Message from ${selected.name}`}
          className="mt-6 border border-line bg-white"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-carbon-soft px-5 py-3">
            <h2 className="font-display text-sm font-semibold tracking-widest text-foreground uppercase">
              Message from {selected.name}
            </h2>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-smoke uppercase transition-colors hover:text-foreground"
            >
              <EyeOff aria-hidden="true" className="h-4 w-4" />
              Close
            </button>
          </div>

          <div className="grid gap-x-6 gap-y-4 px-5 py-5 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold tracking-widest text-smoke uppercase">
                Name
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">
                {selected.name}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-widest text-smoke uppercase">
                Email
              </dt>
              <dd className="mt-1 break-all text-sm text-foreground">
                {selected.email}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-widest text-smoke uppercase">
                Contact number
              </dt>
              <dd className="mt-1 text-sm text-foreground">
                {selected.contactNumber ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-widest text-smoke uppercase">
                Submitted
              </dt>
              <dd className="mt-1 text-sm text-foreground">
                {formatDate(selected.createdAt)}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold tracking-widest text-smoke uppercase">
                Status
              </dt>
              <dd className="mt-1">
                <StatusBadge status={selected.status} />
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold tracking-widest text-smoke uppercase">
                Message
              </dt>
              <dd className="mt-2 rounded border border-line bg-carbon-soft/60 p-4 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                {selected.message}
              </dd>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-line bg-carbon-soft px-5 py-4">
            {CONTACT_MESSAGE_STATUS_VALUES.map((status) => (
              <button
                key={status}
                type="button"
                disabled={busy || selected.status === status}
                onClick={() => updateStatus(status)}
                className={cn(
                  "border px-3 py-1.5 text-xs font-semibold tracking-widest uppercase transition-colors disabled:opacity-50",
                  selected.status === status
                    ? "border-brand bg-brand text-white"
                    : "border-line bg-white text-smoke hover:border-foreground hover:text-foreground"
                )}
              >
                {status}
              </button>
            ))}
            <span className="flex-1" />
            <button
              type="button"
              disabled={busy}
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 border border-rose-500/40 bg-rose-50 px-3 py-1.5 text-xs font-semibold tracking-widest text-rose-600 uppercase transition-colors hover:border-rose-600 hover:bg-rose-600 hover:text-white disabled:opacity-50"
            >
              <Trash2 aria-hidden="true" className="h-4 w-4" />
              Delete
            </button>
          </div>
        </section>
      ) : null}

      <div className="mt-6 border border-line bg-white">
        <div className="hidden items-center gap-3 border-b border-line bg-carbon-soft px-4 py-2.5 text-xs font-semibold tracking-widest text-smoke uppercase md:grid md:grid-cols-[1.2fr_1.4fr_0.9fr_2fr_0.8fr_1.1fr_auto]">
          <span>Name</span>
          <span>Email</span>
          <span>Phone</span>
          <span>Message</span>
          <span>Status</span>
          <span>Date</span>
          <span />
        </div>

        {visible.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-smoke">
            No messages here yet.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {visible.map((message) => {
              const isSelected = message.id === selectedId;
              return (
                <li
                  key={message.id}
                  className={cn(
                    "flex flex-col gap-2 px-4 py-3 transition-colors",
                    isSelected ? "bg-brand/5" : "hover:bg-carbon-soft/60"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {message.name}
                      </p>
                      <p className="truncate text-xs text-smoke">
                        {message.email}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <StatusBadge status={message.status} />
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedId((prev) =>
                            prev === message.id ? null : message.id
                          )
                        }
                        aria-expanded={isSelected}
                        className={cn(
                          "inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-[11px] font-semibold tracking-widest uppercase transition-colors",
                          isSelected
                            ? "border-black bg-black text-white"
                            : "border-line bg-white text-smoke hover:border-foreground hover:text-foreground"
                        )}
                      >
                        <Eye aria-hidden="true" className="h-3.5 w-3.5" />
                        {isSelected ? "Viewing" : "View"}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-smoke">
                    <span>{message.contactNumber ?? "—"}</span>
                    <span className="truncate">{formatDate(message.createdAt)}</span>
                  </div>
                  <p className="line-clamp-2 text-sm leading-relaxed text-foreground/90">
                    {message.message}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}