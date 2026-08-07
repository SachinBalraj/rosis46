"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EyeOff, Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "./ConfirmDialog";

type ProductActionsProps = {
  id: string;
  name: string;
  active: boolean;
  orderItemCount: number;
};

export function ProductActions({
  id,
  name,
  active,
  orderItemCount,
}: ProductActionsProps) {
  const router = useRouter();
  const [toggling, setToggling] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const canDelete = orderItemCount === 0;

  const onToggle = async () => {
    setToggling(true);
    try {
      const response = await fetch(`/api/admin/products/${id}/toggle`, {
        method: "PATCH",
      });
      const data = (await response.json()) as { product?: { active: boolean }; error?: string };

      if (!response.ok) {
        toast.error(data.error ?? "Could not update the product.");
        return;
      }

      toast.success(
        data.product?.active
          ? `${name} is now visible on the storefront.`
          : `${name} is now hidden from shoppers.`
      );
      router.refresh();
    } finally {
      setToggling(false);
    }
  };

  const onDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok) {
        toast.error(data.error ?? "Could not delete the product.");
        setConfirmingDelete(false);
        return;
      }

      toast.success(`${name} was deleted.`);
      setConfirmingDelete(false);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onToggle}
          disabled={toggling}
          aria-label={active ? `Hide ${name}` : `Show ${name}`}
          title={active ? "Hide from storefront" : "Show on storefront"}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-smoke transition-colors hover:border-lime/40 hover:text-lime disabled:opacity-50"
        >
          <EyeOff aria-hidden="true" className="h-4 w-4" />
        </button>
        <Link
          href={`/admin/products/${id}/edit`}
          aria-label={`Edit ${name}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-smoke transition-colors hover:border-lime/40 hover:text-lime"
        >
          <Pencil aria-hidden="true" className="h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={() => {
            if (!canDelete) {
              toast.error(
                `${name} has order history and can't be deleted. Deactivate it instead.`
              );
              return;
            }
            setConfirmingDelete(true);
          }}
          disabled={deleting}
          aria-label={`Delete ${name}`}
          title={
            canDelete
              ? "Delete product"
              : "Can't delete — has order history"
          }
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-smoke transition-colors hover:border-rose-400/40 hover:text-rose-400 disabled:opacity-50"
        >
          {deleting ? (
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 aria-hidden="true" className="h-4 w-4" />
          )}
        </button>
      </div>

      <ConfirmDialog
        open={confirmingDelete}
        title={`Delete "${name}"?`}
        description="This permanently removes the product from the catalogue. This action can't be undone."
        confirmLabel="Delete product"
        loading={deleting}
        onConfirm={onDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </>
  );
}
