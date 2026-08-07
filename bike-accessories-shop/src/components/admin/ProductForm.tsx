"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, BadgePercent, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  adminProductSchema,
  type AdminProductFormInput,
  type AdminProductFormOutput,
} from "@/lib/admin-validation";
import { paiseToRupees, formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export type ProductFormCategory = {
  id: string;
  name: string;
};

export type ProductFormProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceInPaise: number;
  salePriceInPaise: number | null;
  stock: number;
  imageUrl: string | null;
  categoryId: string;
  featured: boolean;
  active: boolean;
};

type ProductFormProps = {
  categories: ProductFormCategory[];
  product?: ProductFormProduct;
};

const inputClass = (hasError: boolean) =>
  cn(
    "w-full rounded-xl border bg-carbon px-4 py-3 text-sm text-white placeholder:text-smoke focus:outline-none",
    hasError
      ? "border-rose-500/70 focus:border-rose-500"
      : "border-line focus:border-lime"
  );

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const isEditing = Boolean(product);
  const [salePriceEnabled, setSalePriceEnabled] = useState(
    Boolean(product?.salePriceInPaise)
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AdminProductFormInput, unknown, AdminProductFormOutput>({
    resolver: zodResolver(adminProductSchema),
    defaultValues: product
      ? {
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: paiseToRupees(product.priceInPaise),
          salePrice:
            product.salePriceInPaise !== null
              ? paiseToRupees(product.salePriceInPaise)
              : undefined,
          stock: product.stock,
          imageUrl: product.imageUrl ?? "",
          categoryId: product.categoryId,
          featured: product.featured,
          active: product.active,
        }
      : {
          name: "",
          slug: "",
          description: "",
          price: undefined,
          salePrice: undefined,
          stock: 0,
          imageUrl: "",
          categoryId: "",
          featured: false,
          active: true,
        },
  });

  const imageUrl = useWatch({ control, name: "imageUrl" }) as
    | string
    | undefined;
  const priceRaw = useWatch({ control, name: "price" });
  const salePriceRaw = useWatch({ control, name: "salePrice" });
  const priceNum = Number(priceRaw);
  const saleNum = Number(salePriceRaw);
  const hasDiscount =
    Number.isFinite(priceNum) &&
    Number.isFinite(saleNum) &&
    saleNum > 0 &&
    saleNum < priceNum;

  const toggleSalePrice = () => {
    setSalePriceEnabled((enabled) => {
      if (enabled) setValue("salePrice", "");
      return !enabled;
    });
  };

  const onSubmit = async (values: AdminProductFormOutput) => {
    const url = isEditing ? `/api/admin/products/${product!.id}` : "/api/admin/products";
    const method = isEditing ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = (await response.json()) as { product?: unknown; error?: string };

    if (!response.ok) {
      toast.error(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    toast.success(
      isEditing ? "Product updated." : "Product created — it's live on the storefront."
    );
    router.push("/admin/products");
    router.refresh();
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-sm font-medium text-lime transition-colors hover:text-lime-deep"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to products
      </Link>

      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
        {isEditing ? "Edit product" : "New product"}
      </h1>
      <p className="mt-2 text-sm text-smoke">
        {isEditing
          ? "Update the details below. Changes go live immediately."
          : "Add a product to the storefront. Prices are in Indian Rupees."}
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-8 space-y-8"
      >
        <div className="rounded-3xl border border-line bg-carbon p-6 sm:p-8">
          <h2 className="text-lg font-bold text-white">Product details</h2>

          <div className="mt-6 space-y-5">
            <div>
              <label htmlFor="product-name" className="mb-2 block text-sm font-medium text-white">
                Name
              </label>
              <input
                id="product-name"
                type="text"
                placeholder="e.g. Aero Road Helmet"
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
              <label htmlFor="product-slug" className="mb-2 block text-sm font-medium text-white">
                Slug
              </label>
              <input
                id="product-slug"
                type="text"
                placeholder="Leave blank to auto-generate from the name"
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
                  Used in the product URL. Only lowercase letters, numbers and
                  hyphens.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="product-description" className="mb-2 block text-sm font-medium text-white">
                Description
              </label>
              <textarea
                id="product-description"
                rows={4}
                placeholder="Materials, specs, what makes it great…"
                aria-invalid={errors.description ? "true" : "false"}
                className={cn(inputClass(Boolean(errors.description)), "resize-y")}
                {...register("description")}
              />
              {errors.description ? (
                <p role="alert" className="mt-1.5 text-sm text-rose-400">
                  {errors.description.message}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="product-category" className="mb-2 block text-sm font-medium text-white">
                Category
              </label>
              <select
                id="product-category"
                aria-invalid={errors.categoryId ? "true" : "false"}
                className={inputClass(Boolean(errors.categoryId))}
                {...register("categoryId")}
              >
                <option value="">Choose a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId ? (
                <p role="alert" className="mt-1.5 text-sm text-rose-400">
                  {errors.categoryId.message}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-line bg-carbon p-6 sm:p-8">
          <h2 className="text-lg font-bold text-white">Pricing & stock</h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="product-price" className="mb-2 block text-sm font-medium text-white">
                Regular price (₹)
              </label>
              <input
                id="product-price"
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
                <p role="alert" className="mt-1.5 text-sm text-rose-400">
                  {errors.price.message}
                </p>
              ) : null}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="product-sale-price"
                  className="flex items-center gap-2 text-sm font-medium text-white"
                >
                  <BadgePercent aria-hidden="true" className="h-4 w-4 text-lime" />
                  Sale price (₹)
                </label>
                <button
                  type="button"
                  onClick={toggleSalePrice}
                  className="text-xs font-medium text-lime transition-colors hover:text-lime-deep"
                >
                  {salePriceEnabled ? "Remove sale price" : "Add sale price"}
                </button>
              </div>
              {salePriceEnabled ? (
                <>
                  <input
                    id="product-sale-price"
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    aria-invalid={errors.salePrice ? "true" : "false"}
                    className={inputClass(Boolean(errors.salePrice))}
                    {...register("salePrice")}
                  />
                  {errors.salePrice ? (
                    <p role="alert" className="mt-1.5 text-sm text-rose-400">
                      {errors.salePrice.message}
                    </p>
                  ) : null}
                </>
              ) : (
                <p className="rounded-xl border border-line bg-night px-4 py-3 text-sm text-smoke">
                  No discount — full price applies.
                </p>
              )}
            </div>

            {hasDiscount ? (
              <p className="sm:col-span-2 rounded-xl border border-lime/30 bg-lime/10 px-4 py-3 text-sm font-medium text-lime">
                Shoppers see {formatPrice(saleNum)} —{" "}
                {formatPrice(priceNum - saleNum)} off (
                {Math.round(((priceNum - saleNum) / priceNum) * 100)}%).
              </p>
            ) : null}
          </div>

          <div className="mt-5">
            <label htmlFor="product-stock" className="mb-2 block text-sm font-medium text-white">
              Stock on hand
            </label>
            <input
              id="product-stock"
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
              <p role="alert" className="mt-1.5 text-sm text-rose-400">
                {errors.stock.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="rounded-3xl border border-line bg-carbon p-6 sm:p-8">
          <h2 className="text-lg font-bold text-white">Image</h2>

          <div className="mt-6">
            <label htmlFor="product-image" className="mb-2 block text-sm font-medium text-white">
              Image URL
            </label>
            <input
              id="product-image"
              type="url"
              placeholder="https://…/helmet.png"
              aria-invalid={errors.imageUrl ? "true" : "false"}
              className={inputClass(Boolean(errors.imageUrl))}
              {...register("imageUrl")}
            />
            {errors.imageUrl ? (
              <p role="alert" className="mt-1.5 text-sm text-rose-400">
                {errors.imageUrl.message}
              </p>
            ) : (
              <p className="mt-1.5 text-xs text-smoke">
                Paste an image URL or leave blank to use a placeholder.
              </p>
            )}
          </div>

          {imageUrl ? (
            <div className="mt-5">
              <p className="mb-2 text-sm font-medium text-white">Preview</p>
              <div className="flex h-40 w-full items-center justify-center overflow-hidden rounded-2xl border border-line bg-night">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>

        <div className="rounded-3xl border border-line bg-carbon p-6 sm:p-8">
          <h2 className="text-lg font-bold text-white">Storefront visibility</h2>

          <div className="mt-6 flex flex-col gap-5">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-0.5 h-5 w-5 shrink-0 rounded border-line bg-night accent-lime"
                {...register("featured")}
              />
              <span>
                <span className="block text-sm font-semibold text-white">
                  Featured product
                </span>
                <span className="block text-sm text-smoke">
                  Highlight this product on the home page.
                </span>
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-0.5 h-5 w-5 shrink-0 rounded border-line bg-night accent-lime"
                {...register("active")}
              />
              <span>
                <span className="block text-sm font-semibold text-white">
                  Active on storefront
                </span>
                <span className="block text-sm text-smoke">
                  Visible to shoppers and in stock-checkout. Turn this off to
                  hide the product without deleting it.
                </span>
              </span>
            </label>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 pb-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/admin/products")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : isEditing ? (
              "Save changes"
            ) : (
              "Create product"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
