"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { parentCategories } from "@/lib/navigation";
import { formatPaise, cn } from "@/lib/utils";
import type { CategorySlug } from "@/lib/data";

export type AdminProductItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceInPaise: number;
  salePriceInPaise: number | null;
  stock: number;
  imageUrl: string | null;
  categoryId: string;
  subCategory: string | null;
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  category?: { id: string; name: string; slug: string } | null;
  orderItemsCount: number;
};

type CategoryOption = { id: string; name: string; slug: string };

type AdminProductsManagerProps = {
  initialProducts: AdminProductItem[];
  categories: CategoryOption[];
};

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

type EditState = {
  name: string;
  description: string;
  categoryId: string;
  price: string;
  salePrice: string;
  stock: string;
  subCategory: string;
  featured: boolean;
  active: boolean;
  currentImageUrl: string;
  removeImage: boolean;
  newImage: File | null;
  newImagePreview: string;
};

type EditErrors = Partial<
  Record<
    "name" | "description" | "categoryId" | "price" | "stock",
    string
  >
>;

type RefreshRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceInPaise: number;
  salePriceInPaise: number | null;
  stock: number;
  imageUrl: string | null;
  categoryId: string;
  subCategory: string | null;
  featured: boolean;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
  category?: AdminProductItem["category"];
  _count?: { orderItems: number };
};

function toItem(raw: RefreshRow): AdminProductItem {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description,
    priceInPaise: raw.priceInPaise,
    salePriceInPaise: raw.salePriceInPaise,
    stock: raw.stock,
    imageUrl: raw.imageUrl,
    categoryId: raw.categoryId,
    subCategory: raw.subCategory,
    featured: raw.featured,
    active: raw.active,
    createdAt: raw.createdAt ?? "",
    updatedAt: raw.updatedAt ?? "",
    category: raw.category ?? null,
    orderItemsCount: raw._count?.orderItems ?? 0,
  };
}

const emptyEdit: EditState = {
  name: "",
  description: "",
  categoryId: "",
  price: "",
  salePrice: "",
  stock: "0",
  subCategory: "",
  featured: false,
  active: true,
  currentImageUrl: "",
  removeImage: false,
  newImage: null,
  newImagePreview: "",
};

export function AdminProductsManager({
  initialProducts,
  categories,
}: AdminProductsManagerProps) {
  const router = useRouter();
  const [items, setItems] = useState<AdminProductItem[]>(initialProducts);
  const [query, setQuery] = useState("");
  const [mainFilter, setMainFilter] = useState("ALL");
  const [subFilter, setSubFilter] = useState("ALL");
  const [deleteTarget, setDeleteTarget] = useState<AdminProductItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminProductItem | null>(null);
  const [edit, setEdit] = useState<EditState>(emptyEdit);
  const [editErrors, setEditErrors] = useState<EditErrors>({});
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function refreshItems() {
    try {
      const res = await fetch("/api/admin/products");
      if (!res.ok) return;
      const data = (await res.json()) as { products: RefreshRow[] };
      setItems(data.products.map(toItem));
    } catch {
      // keep current list if the refresh fails
    }
  }

  const mainCategoryOf = (product: AdminProductItem): string => {
    const slug = product.category?.slug;
    if (!slug) return "UNCATEGORIZED";
    const parent = parentCategories.find((pc) =>
      pc.filters.includes(slug as CategorySlug)
    );
    return parent
      ? parent.label.toUpperCase()
      : (product.category?.name ?? "UNCATEGORIZED").toUpperCase();
  };

  const mainOptions = useMemo(
    () => ["ALL", ...parentCategories.map((p) => p.label.toUpperCase())],
    []
  );

  const subOptions = useMemo(() => {
    if (mainFilter === "ALL") return [] as string[];
    return (parentCategories.find((p) => p.label.toUpperCase() === mainFilter)
      ?.items ?? []) as string[];
  }, [mainFilter]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter((product) => {
      if (mainFilter !== "ALL" && mainCategoryOf(product) !== mainFilter) {
        return false;
      }
      if (subFilter !== "ALL" && (product.subCategory ?? "").toUpperCase() !== subFilter) {
        return false;
      }
      if (term) {
        const haystack = [
          product.name,
          product.subCategory ?? "",
          product.category?.name ?? "",
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
  }, [items, query, mainFilter, subFilter]);

  function handleMainFilterChange(value: string) {
    setMainFilter(value);
    setSubFilter("ALL");
  }

  function openEdit(product: AdminProductItem) {
    setEdit({
      name: product.name,
      description: product.description,
      categoryId: product.categoryId,
      price: String(product.priceInPaise / 100),
      salePrice:
        product.salePriceInPaise !== null
          ? String(product.salePriceInPaise / 100)
          : "",
      stock: String(product.stock),
      subCategory: product.subCategory ?? "",
      featured: product.featured,
      active: product.active,
      currentImageUrl: product.imageUrl ?? "",
      removeImage: false,
      newImage: null,
      newImagePreview: "",
    });
    setEditErrors({});
    setEditTarget(product);
  }

  function handleImagePick(file: File | undefined) {
    if (!file) return;
    if (!IMAGE_TYPES.includes(file.type)) {
      toast.error("Unsupported image type. Use PNG, JPEG, WebP or GIF.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("Image must be 5 MB or smaller.");
      return;
    }
    setEdit((prev) => ({
      ...prev,
      newImage: file,
      newImagePreview: URL.createObjectURL(file),
      removeImage: false,
    }));
  }

  async function saveEdit() {
    if (!editTarget) return;

    const errors: EditErrors = {};
    if (edit.name.trim().length < 2) {
      errors.name = "Product name must be at least 2 characters";
    }
    if (edit.description.trim().length < 10) {
      errors.description = "Describe the product in at least 10 characters";
    }
    if (!edit.categoryId) {
      errors.categoryId = "Choose a category";
    }
    const price = Number(edit.price);
    if (!Number.isFinite(price) || price <= 0) {
      errors.price = "Enter a valid price greater than zero";
    }
    const stock = Number(edit.stock);
    if (!Number.isFinite(stock) || stock < 0 || !Number.isInteger(stock)) {
      errors.stock = "Stock must be a whole number 0 or more";
    }
    setEditErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", edit.name);
      formData.append("description", edit.description);
      formData.append("price", String(price));
      if (edit.salePrice.trim() !== "") {
        formData.append("salePrice", edit.salePrice);
      }
      formData.append("stock", String(stock));
      formData.append("categoryId", edit.categoryId);
      formData.append("subCategory", edit.subCategory.trim());
      formData.append("featured", String(edit.featured));
      formData.append("active", String(edit.active));
      formData.append("removeImage", edit.removeImage ? "true" : "false");
      if (edit.newImage) {
        formData.append("image", edit.newImage);
      }

      const res = await fetch(`/api/admin/products/${editTarget.id}`, {
        method: "PATCH",
        body: formData,
      });
      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        toast.error(data.error ?? "Could not save the changes.");
        return;
      }

      toast.success("Product updated.");
      setEditTarget(null);
      await refreshItems();
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as { error?: string; ok?: boolean };

      if (!res.ok) {
        toast.error(data.error ?? "Could not delete this product.");
        return;
      }

      toast.success("Product deleted.");
      setDeleteTarget(null);
      await refreshItems();
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  const previewImage =
    edit.newImagePreview ||
    (!edit.removeImage ? edit.currentImageUrl : "");

  return (
    <div>
      <h1 className="display-heading text-rainbow text-4xl text-foreground uppercase">
        Products
      </h1>
      <p className="mt-2 text-sm text-smoke">
        Manage every product that customers see on the storefront.
      </p>

      <div className="mt-8 grid gap-3 border border-line bg-white p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-smoke"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products…"
            aria-label="Search products"
            className="w-full border border-line bg-white py-2.5 pr-3 pl-10 text-sm text-foreground placeholder:text-smoke focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="admin-products-main-filter" className="sr-only">
            Main category filter
          </label>
          <select
            id="admin-products-main-filter"
            value={mainFilter}
            onChange={(event) => handleMainFilterChange(event.target.value)}
            className="w-full border border-line bg-white px-3 py-2.5 text-sm text-foreground focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none sm:w-48"
          >
            {mainOptions.map((option) => (
              <option key={option} value={option}>
                {option === "ALL" ? "All categories" : option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="admin-products-sub-filter" className="sr-only">
            Sub category filter
          </label>
          <select
            id="admin-products-sub-filter"
            value={subFilter}
            disabled={mainFilter === "ALL"}
            onChange={(event) => setSubFilter(event.target.value)}
            className="w-full border border-line bg-white px-3 py-2.5 text-sm text-foreground disabled:cursor-not-allowed disabled:bg-carbon-soft focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none sm:w-52"
          >
            <option value="ALL">All sub categories</option>
            {subOptions.map((option) => (
              <option key={option} value={option}>
                {option.toLowerCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-4 text-sm text-smoke" aria-live="polite">
        Showing {filtered.length} of {items.length} products
      </p>

      {filtered.length === 0 ? (
        <div className="mt-6 border border-dashed border-line bg-white px-6 py-16 text-center">
          <p className="font-semibold text-foreground">No products found</p>
          <p className="mt-1 text-sm text-smoke">
            Try a different search or filter, or add a product from Inventory.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-6 hidden overflow-x-auto border border-line bg-white sm:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-carbon-soft text-xs tracking-widest text-smoke uppercase">
                  <th className="px-4 py-3 font-semibold">Image</th>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Sub category</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Stock</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((product) => (
                  <tr key={product.id} className="align-middle hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <ProductThumb imageUrl={product.imageUrl} name={product.name} />
                    </td>
                    <td className="max-w-[260px] px-4 py-3">
                      <p className="truncate font-semibold text-foreground">
                        {product.name}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-smoke">
                        {product.description}
                      </p>
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground uppercase">
                      {mainCategoryOf(product)}
                    </td>
                    <td className="px-4 py-3 text-foreground uppercase">
                      {product.subCategory ?? "—"}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {formatPaise(product.priceInPaise)}
                      {product.salePriceInPaise !== null &&
                      product.salePriceInPaise < product.priceInPaise ? (
                        <span className="block text-xs text-smoke line-through">
                          {formatPaise(product.priceInPaise)}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <StockLabel stock={product.stock} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge active={product.active} />
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <RowActions
                        onEdit={() => openEdit(product)}
                        onDelete={() => setDeleteTarget(product)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="mt-6 space-y-4 sm:hidden">
            {filtered.map((product) => (
              <li key={product.id} className="border border-line bg-white p-4">
                <div className="flex items-start gap-3">
                  <ProductThumb imageUrl={product.imageUrl} name={product.name} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-foreground">
                      {product.name}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="border border-line px-2 py-0.5 text-foreground uppercase">
                        {mainCategoryOf(product)}
                      </span>
                      {product.subCategory ? (
                        <span className="border border-line px-2 py-0.5 text-foreground uppercase">
                          {product.subCategory}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm">
                      <span className="font-semibold text-foreground">
                        {formatPaise(product.priceInPaise)}
                      </span>
                      <span className="ml-2 text-smoke">
                        · Stock {product.stock}
                      </span>
                    </p>
                    <div className="mt-1">
                      <StatusBadge active={product.active} />
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(product)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 border border-line bg-white px-3 py-2 text-xs font-semibold tracking-wider text-foreground uppercase transition-colors hover:border-brand hover:text-brand"
                  >
                    <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(product)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 border border-red-200 bg-white px-3 py-2 text-xs font-semibold tracking-wider text-red-600 uppercase transition-colors hover:border-red-600 hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {deleteTarget ? (
        <ConfirmDeleteDialog
          productName={deleteTarget.name}
          deleting={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      ) : null}

      {editTarget ? (
        <EditProductDialog
          editState={edit}
          errors={editErrors}
          saving={saving}
          categories={categories}
          previewImage={previewImage}
          hasUnsavedNewImage={Boolean(edit.newImage)}
          fileInputRef={fileInputRef}
          onFilePick={(file) => handleImagePick(file ?? undefined)}
          onRemoveImage={() =>
            setEdit((prev) => ({
              ...prev,
              removeImage: true,
              newImage: null,
              newImagePreview: "",
            }))
          }
          onClose={() => setEditTarget(null)}
          onSave={saveEdit}
          onChange={(patch) => setEdit((prev) => ({ ...prev, ...patch }))}
        />
      ) : null}
    </div>
  );
}

function ProductThumb({
  imageUrl,
  name,
}: {
  imageUrl: string | null;
  name: string;
}) {
  if (!imageUrl) {
    return (
      <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-dashed border-line bg-carbon-soft text-xs text-smoke uppercase">
        No img
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl}
      alt={name}
      referrerPolicy="no-referrer"
      className="h-16 w-16 shrink-0 border border-line object-cover"
    />
  );
}

function StockLabel({ stock }: { stock: number }) {
  if (stock > 0) {
    return <span className="font-medium text-foreground">{stock}</span>;
  }
  return <span className="font-medium text-red-600">Out of stock</span>;
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs font-semibold tracking-wider uppercase",
        active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
      )}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function RowActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <span className="inline-flex gap-2">
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex items-center gap-1.5 border border-line bg-white px-3 py-1.5 text-xs font-semibold tracking-wider text-foreground uppercase transition-colors hover:border-brand hover:text-brand"
      >
        <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
        Edit
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="inline-flex items-center gap-1.5 border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold tracking-wider text-red-600 uppercase transition-colors hover:border-red-600 hover:bg-red-600 hover:text-white"
      >
        <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
        Delete
      </button>
    </span>
  );
}

function ConfirmDeleteDialog({
  productName,
  deleting,
  onCancel,
  onConfirm,
}: {
  productName: string;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="w-full max-w-sm bg-white p-6 shadow-xl">
        <h2 id="delete-dialog-title" className="text-lg font-semibold text-foreground">
          Delete this product?
        </h2>
        <p className="mt-2 text-sm text-smoke">
          &ldquo;{productName}&rdquo; will be permanently removed from the store.
        </p>
        <p className="mt-1 text-sm text-smoke">
          This will also remove it from the storefront, its category and search.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="inline-flex h-11 items-center justify-center border border-line bg-white px-5 text-sm font-semibold tracking-widest text-foreground uppercase transition-colors hover:bg-carbon-soft disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="inline-flex h-11 items-center justify-center gap-2 bg-red-600 px-5 text-sm font-semibold tracking-widest text-white uppercase transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            {deleting ? (
              <>
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                Deleting…
              </>
            ) : (
              "Delete product"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputClass = (hasError: boolean) =>
  cn(
    "w-full border bg-white px-4 py-3 text-sm text-foreground placeholder:text-smoke focus:outline-none",
    hasError
      ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
      : "border-line focus:border-brand focus:ring-1 focus:ring-brand"
  );

const labelClass =
  "mb-2 block text-xs font-semibold tracking-widest text-foreground uppercase";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 text-sm text-rose-500">
      {message}
    </p>
  );
}

function EditProductDialog({
  editState: form,
  errors,
  saving,
  categories,
  previewImage,
  hasUnsavedNewImage,
  fileInputRef,
  onFilePick,
  onRemoveImage,
  onClose,
  onSave,
  onChange,
}: {
  editState: EditState;
  errors: EditErrors;
  saving: boolean;
  categories: CategoryOption[];
  previewImage: string;
  hasUnsavedNewImage: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFilePick: (file: File | undefined) => void;
  onRemoveImage: () => void;
  onClose: () => void;
  onSave: () => void;
  onChange: (patch: Partial<EditState>) => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white px-6 py-4">
          <h2 id="edit-dialog-title" className="text-lg font-semibold text-foreground">
            Edit product
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
            className="p-1 text-smoke transition-colors hover:text-foreground disabled:opacity-60"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 px-6 py-6">
          <div>
            <label htmlFor="edit-product-name" className={labelClass}>
              Product name
            </label>
            <input
              id="edit-product-name"
              type="text"
              value={form.name}
              onChange={(event) => onChange({ name: event.target.value })}
              aria-invalid={errors.name ? "true" : "false"}
              className={inputClass(Boolean(errors.name))}
            />
            <FieldError message={errors.name} />
          </div>

          <div>
            <label htmlFor="edit-product-description" className={labelClass}>
              Product description
            </label>
            <textarea
              id="edit-product-description"
              rows={3}
              value={form.description}
              onChange={(event) => onChange({ description: event.target.value })}
              aria-invalid={errors.description ? "true" : "false"}
              className={cn(inputClass(Boolean(errors.description)), "resize-y")}
            />
            <FieldError message={errors.description} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="edit-product-price" className={labelClass}>
                Price (₹)
              </label>
              <input
                id="edit-product-price"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(event) => onChange({ price: event.target.value })}
                aria-invalid={errors.price ? "true" : "false"}
                className={inputClass(Boolean(errors.price))}
              />
              <FieldError message={errors.price} />
            </div>
            <div>
              <label htmlFor="edit-product-sale-price" className={labelClass}>
                Sale price (₹) — optional
              </label>
              <input
                id="edit-product-sale-price"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                value={form.salePrice}
                onChange={(event) => onChange({ salePrice: event.target.value })}
                className={inputClass(false)}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="edit-product-stock" className={labelClass}>
                Stock quantity
              </label>
              <input
                id="edit-product-stock"
                type="number"
                inputMode="numeric"
                step="1"
                min="0"
                value={form.stock}
                onChange={(event) => onChange({ stock: event.target.value })}
                aria-invalid={errors.stock ? "true" : "false"}
                className={inputClass(Boolean(errors.stock))}
              />
              <FieldError message={errors.stock} />
            </div>
            <div>
              <label htmlFor="edit-product-category" className={labelClass}>
                Category
              </label>
              <select
                id="edit-product-category"
                value={form.categoryId}
                onChange={(event) => onChange({ categoryId: event.target.value })}
                aria-invalid={errors.categoryId ? "true" : "false"}
                className={inputClass(Boolean(errors.categoryId))}
              >
                <option value="">Choose a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <FieldError message={errors.categoryId} />
            </div>
          </div>

          <div>
            <label htmlFor="edit-product-subcategory" className={labelClass}>
              Sub category
            </label>
            <input
              id="edit-product-subcategory"
              type="text"
              placeholder="e.g. AXOR, ZEUS, GLOVES…"
              value={form.subCategory}
              onChange={(event) => onChange({ subCategory: event.target.value })}
              className={inputClass(false)}
            />
          </div>

          <div className="border border-line p-4">
            <h3 className="text-xs font-semibold tracking-widest text-foreground uppercase">
              Product image
            </h3>

            {previewImage ? (
              <div className="mt-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewImage}
                  alt="Current product image"
                  referrerPolicy="no-referrer"
                  className="h-40 w-40 border border-line object-cover"
                />
                {hasUnsavedNewImage ? (
                  <p className="mt-2 text-xs text-brand">
                    New image will be saved when you save changes.
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="mt-3 border border-dashed border-line bg-carbon-soft px-4 py-6 text-sm text-smoke">
                No image — the product will use a placeholder on the storefront.
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {form.currentImageUrl && !form.removeImage ? (
                <button
                  type="button"
                  onClick={onRemoveImage}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 border border-red-200 bg-white px-3 py-2 text-xs font-semibold tracking-wider text-red-600 uppercase transition-colors hover:border-red-600 hover:bg-red-600 hover:text-white disabled:opacity-60"
                >
                  <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                  Remove image
                </button>
              ) : null}
              {form.removeImage ? (
                <button
                  type="button"
                  onClick={() => onChange({ removeImage: false })}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 border border-line bg-white px-3 py-2 text-xs font-semibold tracking-wider text-foreground uppercase transition-colors hover:border-brand hover:text-brand disabled:opacity-60"
                >
                  Keep current image
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={saving}
                className="inline-flex items-center gap-1.5 border border-line bg-white px-3 py-2 text-xs font-semibold tracking-wider text-foreground uppercase transition-colors hover:border-brand hover:text-brand disabled:opacity-60"
              >
                Replace image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={(event) => onFilePick(event.target.files?.[0])}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) => onChange({ active: event.target.checked })}
                className="mt-0.5 h-5 w-5 shrink-0 border-line bg-white accent-brand"
              />
              <span>
                <span className="block text-sm font-semibold text-foreground">
                  Active on storefront
                </span>
                <span className="block text-sm text-smoke">
                  Visible to shoppers. Turn this off to deactivate a product
                  (useful for products linked to past orders).
                </span>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) => onChange({ featured: event.target.checked })}
                className="mt-0.5 h-5 w-5 shrink-0 border-line bg-white accent-brand"
              />
              <span>
                <span className="block text-sm font-semibold text-foreground">
                  Featured
                </span>
                <span className="block text-sm text-smoke">
                  Highlight this product on the home page.
                </span>
              </span>
            </label>
          </div>
        </div>

        <div className="sticky bottom-0 flex flex-col-reverse gap-2 border-t border-line bg-white px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="inline-flex h-12 items-center justify-center border border-line bg-white px-6 text-sm font-semibold tracking-widest text-foreground uppercase transition-colors hover:bg-carbon-soft disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex h-12 items-center justify-center gap-2 bg-brand px-8 text-sm font-semibold tracking-widest text-white uppercase transition-colors hover:bg-brand-deep disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}