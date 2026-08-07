"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  adminCategorySchema,
  type AdminCategoryFormInput,
  type AdminCategoryFormOutput,
} from "@/lib/admin-validation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "./ConfirmDialog";

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  productCount: number;
};

type CategoryManagerProps = {
  categories: CategoryRow[];
};

const inputClass = (hasError: boolean) =>
  cn(
    "w-full rounded-xl border bg-carbon px-4 py-3 text-sm text-white placeholder:text-smoke focus:outline-none",
    hasError
      ? "border-rose-500/70 focus:border-rose-500"
      : "border-line focus:border-lime"
  );

export function CategoryManager({ categories }: CategoryManagerProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<CategoryRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const isEditing = editingId !== null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminCategoryFormInput, unknown, AdminCategoryFormOutput>({
    resolver: zodResolver(adminCategorySchema),
    defaultValues: { name: "", slug: "", image: "" },
  });

  const startEdit = (category: CategoryRow) => {
    setEditingId(category.id);
    reset({
      name: category.name,
      slug: category.slug,
      image: category.image ?? "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    reset({ name: "", slug: "", image: "" });
  };

  const onSubmit = async (values: AdminCategoryFormOutput) => {
    const url = editingId
      ? `/api/admin/categories/${editingId}`
      : "/api/admin/categories";
    const method = editingId ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = (await response.json()) as { error?: string };

    if (!response.ok) {
      toast.error(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    toast.success(
      editingId ? "Category updated." : "Category created."
    );
    cancelEdit();
    router.refresh();
  };

  const onDelete = async () => {
    if (!deletingCategory) return;
    if (deletingCategory.productCount > 0) {
      toast.error(
        `Move or delete ${deletingCategory.productCount} product${
          deletingCategory.productCount === 1 ? "" : "s"
        } before deleting ${deletingCategory.name}.`
      );
      setDeletingCategory(null);
      return;
    }
    setDeleting(true);
    try {
      const response = await fetch(
        `/api/admin/categories/${deletingCategory.id}`,
        { method: "DELETE" }
      );
      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok) {
        toast.error(data.error ?? "Could not delete the category.");
        setDeletingCategory(null);
        return;
      }

      toast.success(`${deletingCategory.name} was deleted.`);
      setDeletingCategory(null);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div>
        <h2 className="text-lg font-bold text-white">
          Categories ({categories.length})
        </h2>
        <p className="mt-1 text-sm text-smoke">
          Manage how products are grouped on the storefront.
        </p>

        {categories.length === 0 ? (
          <div className="mt-6 flex flex-col items-center rounded-3xl border border-dashed border-line bg-carbon/60 px-6 py-16 text-center">
            <p className="text-lg font-bold text-white">No categories yet</p>
            <p className="mt-2 max-w-sm text-sm text-smoke">
              Create your first category to start organising products.
            </p>
          </div>
        ) : (
          <ul className="mt-6 flex flex-col gap-3">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex items-center gap-4 rounded-2xl border border-line bg-carbon p-4"
              >
                {category.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={category.image}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-xl border border-line bg-night object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lime/10 text-sm font-bold text-lime">
                    {category.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">
                    {category.name}
                  </p>
                  <p className="truncate text-xs text-smoke">
                    /{category.slug} · {category.productCount} product
                    {category.productCount === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(category)}
                    aria-label={`Edit ${category.name}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-smoke transition-colors hover:border-lime/40 hover:text-lime"
                  >
                    <Pencil aria-hidden="true" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingCategory(category)}
                    aria-label={`Delete ${category.name}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-smoke transition-colors hover:border-rose-400/40 hover:text-rose-400"
                  >
                    <Trash2 aria-hidden="true" className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="h-fit rounded-3xl border border-line bg-carbon p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          {isEditing ? (
            <>
              <Pencil aria-hidden="true" className="h-5 w-5 text-lime" />
              Edit category
            </>
          ) : (
            <>
              <Plus aria-hidden="true" className="h-5 w-5 text-lime" />
              New category
            </>
          )}
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-6 space-y-5"
        >
          <div>
            <label htmlFor="category-name" className="mb-2 block text-sm font-medium text-white">
              Name
            </label>
            <input
              id="category-name"
              type="text"
              placeholder="e.g. Helmets"
              aria-invalid={errors.name ? "true" : "false"}
              className={inputClass(Boolean(errors.name))}
              {...register("name")}
            />
            {errors.name ? (
              <p role="alert" className="mt-1.5 text-sm text-rose-400">
                {errors.name.message}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="category-slug" className="mb-2 block text-sm font-medium text-white">
              Slug
            </label>
            <input
              id="category-slug"
              type="text"
              placeholder="Leave blank to auto-generate"
              aria-invalid={errors.slug ? "true" : "false"}
              className={inputClass(Boolean(errors.slug))}
              {...register("slug")}
            />
            {errors.slug ? (
              <p role="alert" className="mt-1.5 text-sm text-rose-400">
                {errors.slug.message}
              </p>
            ) : (
              <p className="mt-1.5 text-xs text-smoke">
                Used in category URLs, e.g. /products?category=helmets
              </p>
            )}
          </div>

          <div>
            <label htmlFor="category-image" className="mb-2 block text-sm font-medium text-white">
              Image URL
            </label>
            <input
              id="category-image"
              type="url"
              placeholder="https://…/helmets.svg"
              aria-invalid={errors.image ? "true" : "false"}
              className={inputClass(Boolean(errors.image))}
              {...register("image")}
            />
            {errors.image ? (
              <p role="alert" className="mt-1.5 text-sm text-rose-400">
                {errors.image.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
            {isEditing ? (
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={cancelEdit}
              >
                Cancel
              </Button>
            ) : null}
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : isEditing ? (
                "Save changes"
              ) : (
                "Add category"
              )}
            </Button>
          </div>
        </form>
      </div>

      <ConfirmDialog
        open={deletingCategory !== null}
        title={`Delete "${deletingCategory?.name ?? ""}"?`}
        description={
          deletingCategory?.productCount
            ? `This category still contains ${deletingCategory.productCount} product${
                deletingCategory.productCount === 1 ? "" : "s"
              }. Move or delete them first — categories with products can't be removed.`
            : "This permanently removes the category. Products keep working but will be left without a category."
        }
        confirmLabel={
          deletingCategory?.productCount
            ? "Move products first"
            : "Delete category"
        }
        confirmDisabled={Boolean(deletingCategory?.productCount)}
        loading={deleting}
        onConfirm={onDelete}
        onCancel={() => setDeletingCategory(null)}
      />
    </div>
  );
}
