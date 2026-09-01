"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, PackagePlus, X } from "lucide-react";
import { toast } from "sonner";
import {
  adminProductSchema,
  type AdminProductFormInput,
  type AdminProductFormOutput,
} from "@/lib/admin-validation";
import { cn } from "@/lib/utils";
import type { AddProductFormCategory } from "./AddProductForm";

type AddProductModalProps = {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
  mainCategory: string;
  subCategory: string;
  initialCategoryId: string;
  categories: AddProductFormCategory[];
};

const inputClass = (hasError: boolean) =>
  cn(
    "w-full border bg-white px-4 py-3 text-sm text-foreground placeholder:text-smoke focus:outline-none",
    hasError
      ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
      : "border-line focus:border-brand focus:ring-1 focus:ring-brand"
  );

const labelClass =
  "mb-2 block text-xs font-semibold tracking-widest text-foreground uppercase";

export function AddProductModal({
  open,
  onClose,
  onAdded,
  mainCategory,
  subCategory,
  initialCategoryId,
  categories,
}: AddProductModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminProductFormInput, unknown, AdminProductFormOutput>({
    resolver: zodResolver(adminProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: undefined,
      stock: 0,
      imageUrl: "",
      categoryId: initialCategoryId,
      featured: false,
      active: true,
    },
  });

  if (!open) return null;

  const selectedCategory = categories.find((c) => c.id === initialCategoryId);

  const clearImage = () => {
    setSelectedFile(null);
    setImagePreview("");
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (values: AdminProductFormOutput) => {
    try {
      const formData = new FormData();
      formData.set("name", values.name);
      formData.set("description", values.description);
      formData.set("price", String(values.price));
      formData.set("salePrice", values.salePrice ? String(values.salePrice) : "");
      formData.set("stock", String(values.stock));
      formData.set("categoryId", values.categoryId);
      formData.set("featured", String(values.featured));
      formData.set("active", String(values.active));
      formData.set("imageUrl", values.imageUrl ?? "");
      if (selectedFile) formData.set("image", selectedFile);

      const response = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(data.error ?? "Could not add the product. Please try again.");
        return;
      }

      toast.success(`Product added to ${subCategory}.`);
      clearImage();
      reset();
      onAdded();
      onClose();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`Add product to ${subCategory}`}
    >
      <div className="my-8 w-full max-w-2xl border border-line bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div>
            <h2 className="font-display text-lg font-semibold tracking-widest text-foreground uppercase">
              Add product
            </h2>
            <p className="mt-1 text-sm text-smoke">
              Adding to <span className="font-semibold">{mainCategory}</span> /
              <span className="font-semibold"> {subCategory}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-md p-2 text-smoke transition-colors hover:bg-gray-100 hover:text-foreground"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 px-6 py-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Main category</label>
              <input
                type="text"
                value={mainCategory}
                disabled
                className={cn(inputClass(false), "cursor-not-allowed bg-gray-100 text-gray-500")}
              />
            </div>
            <div>
              <label className={labelClass}>Sub category</label>
              <input
                type="text"
                value={subCategory}
                disabled
                className={cn(inputClass(false), "cursor-not-allowed bg-gray-100 text-gray-500")}
              />
            </div>
          </div>

          <div>
            <label htmlFor="modal-product-name" className={labelClass}>
              Product title
            </label>
            <input
              id="modal-product-name"
              type="text"
              placeholder="e.g. Aero Road Helmet"
              aria-invalid={errors.name ? "true" : "false"}
              className={inputClass(Boolean(errors.name))}
              {...register("name")}
            />
            {errors.name ? (
              <p role="alert" className="mt-1.5 text-sm text-rose-500">
                {errors.name.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="modal-product-price" className={labelClass}>
                Price (₹)
              </label>
              <input
                id="modal-product-price"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                placeholder="0.00"
                aria-invalid={errors.price ? "true" : "false"}
                className={inputClass(Boolean(errors.price))}
                {...register("price")}
              />
              {errors.price ? (
                <p role="alert" className="mt-1.5 text-sm text-rose-500">
                  {errors.price.message}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="modal-product-stock" className={labelClass}>
                Stock
              </label>
              <input
                id="modal-product-stock"
                type="number"
                inputMode="numeric"
                step="1"
                min="0"
                placeholder="0"
                aria-invalid={errors.stock ? "true" : "false"}
                className={inputClass(Boolean(errors.stock))}
                {...register("stock")}
              />
              {errors.stock ? (
                <p role="alert" className="mt-1.5 text-sm text-rose-500">
                  {errors.stock.message}
                </p>
              ) : null}
            </div>
          </div>

          <div>
            <label htmlFor="modal-product-image" className={labelClass}>
              Product image
            </label>
            <input
              id="modal-product-image"
              type="file"
              accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
              onChange={handleImageChange}
              className="sr-only"
            />
            {imagePreview ? (
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="h-32 w-32 rounded-md border border-gray-200 object-cover"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="text-xs font-semibold text-red-600 uppercase transition-colors hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label
                htmlFor="modal-product-image"
                className={cn(
                  inputClass(false),
                  "flex cursor-pointer flex-col items-center justify-center border-dashed border-2 py-8 text-center transition-colors hover:border-brand hover:bg-gray-50"
                )}
              >
                <ImagePlus aria-hidden="true" className="h-8 w-8 text-smoke" />
                <span className="mt-2 text-sm font-medium text-foreground">
                  Click to upload an image
                </span>
                <span className="mt-1 text-xs text-smoke">
                  PNG, JPEG or WebP — leave empty to use a placeholder
                </span>
              </label>
            )}
          </div>

          <div>
            <label htmlFor="modal-product-description" className={labelClass}>
              Description
            </label>
            <textarea
              id="modal-product-description"
              rows={4}
              placeholder="Materials, specs, what makes it great…"
              aria-invalid={errors.description ? "true" : "false"}
              className={cn(inputClass(Boolean(errors.description)), "resize-y")}
              {...register("description")}
            />
            {errors.description ? (
              <p role="alert" className="mt-1.5 text-sm text-rose-500">
                {errors.description.message}
              </p>
            ) : null}
          </div>

          <div className="text-xs text-smoke">
            Storefront category:{" "}
            <span className="font-semibold text-foreground">
              {selectedCategory?.name ?? initialCategoryId}
            </span>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center border border-line px-6 text-sm font-semibold tracking-widest text-foreground uppercase transition-colors hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-11 items-center justify-center gap-2 bg-brand px-6 text-sm font-semibold tracking-widest text-white uppercase transition-all duration-200 hover:bg-brand-deep active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <PackagePlus aria-hidden="true" className="h-4 w-4" />
                  Save
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
