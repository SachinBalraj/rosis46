"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgePercent, Loader2, PackagePlus } from "lucide-react";
import { toast } from "sonner";
import {
  adminProductSchema,
  type AdminProductFormInput,
  type AdminProductFormOutput,
} from "@/lib/admin-validation";
import { cn } from "@/lib/utils";

export type AddProductFormCategory = {
  id: string;
  name: string;
};

type AddProductFormProps = {
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

export function AddProductForm({ categories }: AddProductFormProps) {
  const [salePriceEnabled, setSalePriceEnabled] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminProductFormInput, unknown, AdminProductFormOutput>({
    resolver: zodResolver(adminProductSchema),
    defaultValues: {
      name: "",
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

  const toggleSalePrice = () => {
    setSalePriceEnabled((enabled) => {
      if (enabled) setValue("salePrice", "");
      return !enabled;
    });
  };

  const onSubmit = async (values: AdminProductFormOutput) => {
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(data.error ?? "Could not add the product. Please try again.");
        return;
      }

      toast.success("Product added — it's live on the storefront.");
      reset();
      setSalePriceEnabled(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h1 className="display-heading text-4xl text-foreground uppercase">
        Add product
      </h1>
      <p className="mt-2 text-sm text-smoke">
        Add a product to the storefront. Prices are in Indian Rupees.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-8 space-y-6"
      >
        <div className="border border-line bg-white p-6 sm:p-8">
          <h2 className="border-b border-line pb-4 font-display text-sm font-semibold tracking-widest uppercase">
            Product details
          </h2>

          <div className="mt-6 space-y-5">
            <div>
              <label htmlFor="product-name" className={labelClass}>
                Product name
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
                <p role="alert" className="mt-1.5 text-sm text-rose-500">
                  {errors.name.message}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="product-description" className={labelClass}>
                Product description
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
                <p role="alert" className="mt-1.5 text-sm text-rose-500">
                  {errors.description.message}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="product-category" className={labelClass}>
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
                <p role="alert" className="mt-1.5 text-sm text-rose-500">
                  {errors.categoryId.message}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="border border-line bg-white p-6 sm:p-8">
          <h2 className="border-b border-line pb-4 font-display text-sm font-semibold tracking-widest uppercase">
            Pricing & stock
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="product-price" className={labelClass}>
                Price (₹)
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
                <p role="alert" className="mt-1.5 text-sm text-rose-500">
                  {errors.price.message}
                </p>
              ) : null}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="product-sale-price"
                  className="flex items-center gap-2 text-xs font-semibold tracking-widest text-foreground uppercase"
                >
                  <BadgePercent aria-hidden="true" className="h-4 w-4 text-brand" />
                  Sale price (₹)
                </label>
                <button
                  type="button"
                  onClick={toggleSalePrice}
                  className="text-xs font-medium text-brand transition-colors hover:text-brand-deep"
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
                    <p role="alert" className="mt-1.5 text-sm text-rose-500">
                      {errors.salePrice.message}
                    </p>
                  ) : null}
                </>
              ) : (
                <p className="border border-dashed border-line bg-carbon-soft px-4 py-3 text-sm text-smoke">
                  No discount — full price applies.
                </p>
              )}
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="product-stock" className={labelClass}>
              Stock quantity
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
              <p role="alert" className="mt-1.5 text-sm text-rose-500">
                {errors.stock.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="border border-line bg-white p-6 sm:p-8">
          <h2 className="border-b border-line pb-4 font-display text-sm font-semibold tracking-widest uppercase">
            Image
          </h2>

          <div className="mt-6">
            <label htmlFor="product-image" className={labelClass}>
              Product image URL
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
              <p role="alert" className="mt-1.5 text-sm text-rose-500">
                {errors.imageUrl.message}
              </p>
            ) : (
              <p className="mt-1.5 text-xs text-smoke">
                Paste an image URL or leave blank to use a placeholder.
              </p>
            )}
          </div>
        </div>

        <div className="border border-line bg-white p-6 sm:p-8">
          <h2 className="border-b border-line pb-4 font-display text-sm font-semibold tracking-widest uppercase">
            Storefront visibility
          </h2>

          <div className="mt-6 flex flex-col gap-5">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-0.5 h-5 w-5 shrink-0 border-line bg-white accent-brand"
                {...register("featured")}
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

            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-0.5 h-5 w-5 shrink-0 border-line bg-white accent-brand"
                {...register("active")}
              />
              <span>
                <span className="block text-sm font-semibold text-foreground">
                  Active
                </span>
                <span className="block text-sm text-smoke">
                  Visible to shoppers on the storefront.
                </span>
              </span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-12 w-full items-center justify-center gap-2 bg-brand px-8 text-sm font-semibold tracking-widest text-white uppercase transition-all duration-200 hover:bg-brand-deep active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
              Adding…
            </>
          ) : (
            <>
              <PackagePlus aria-hidden="true" className="h-4 w-4" />
              Add product
            </>
          )}
        </button>
      </form>
    </div>
  );
}
