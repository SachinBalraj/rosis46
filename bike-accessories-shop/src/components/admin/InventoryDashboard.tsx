"use client";

import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { parentCategories, subCategoryMap } from "@/lib/navigation";
import { AddProductModal } from "./AddProductModal";
import type { AddProductFormCategory } from "./AddProductForm";

type InventoryDashboardProps = {
  categories: AddProductFormCategory[];
};

type ModalState = {
  mainCategory: string;
  subCategory: string;
  categoryId: string;
} | null;

export function InventoryDashboard({ categories }: InventoryDashboardProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [modal, setModal] = useState<ModalState>(null);

  const toggle = (label: string) =>
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));

  const openModal = (mainCategory: string, subCategory: string) => {
    const parent = parentCategories.find(
      (item) => item.label.toUpperCase() === mainCategory.toUpperCase()
    );
    const dbCategorySlug = parent?.filters[0];
    const category = dbCategorySlug
      ? categories.find(
          (c) => c.name.toLowerCase() === dbCategorySlug.replace(/-/g, " ")
        ) ??
        categories.find(
          (c) => c.name.toLowerCase() === slugToLabel(dbCategorySlug)
        )
      : undefined;

    setModal({
      mainCategory: mainCategory.toUpperCase(),
      subCategory,
      categoryId: category?.id ?? "",
    });
  };

  return (
    <div>
      <h1 className="display-heading text-4xl text-foreground uppercase">
        Inventory dashboard
      </h1>
      <p className="mt-2 text-sm text-smoke">
        Browse every category and add products directly to a sub-category.
      </p>

      <div className="mt-8 space-y-4">
        {parentCategories.map((parent) => {
          const key = parent.label.toUpperCase();
          const subs = (subCategoryMap[key] ?? []).filter(
            (sub) => sub !== "ALL"
          );
          const isOpen = expanded[key] ?? false;

          return (
            <div
              key={key}
              className="border border-line bg-white"
            >
              <button
                type="button"
                onClick={() => toggle(key)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50"
              >
                <span className="font-display text-sm font-semibold tracking-widest text-foreground uppercase">
                  {key}
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    "h-5 w-5 text-smoke transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </button>

              {isOpen ? (
                <ul className="divide-y divide-gray-100 border-t border-line">
                  {subs.map((sub) => (
                    <li
                      key={sub}
                      className="flex items-center justify-between px-5 py-3"
                    >
                      <span className="text-sm font-medium text-foreground uppercase">
                        {sub}
                      </span>
                      <button
                        type="button"
                        onClick={() => openModal(key, sub)}
                        className="flex items-center gap-1.5 rounded border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold tracking-wider text-red-600 uppercase transition-colors hover:border-red-600 hover:bg-red-600 hover:text-white"
                      >
                        <Plus aria-hidden="true" className="h-4 w-4" />
                        Add product
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          );
        })}
      </div>

      <AddProductModal
        open={modal !== null}
        onClose={() => setModal(null)}
        onAdded={() => setModal(null)}
        mainCategory={modal?.mainCategory ?? ""}
        subCategory={modal?.subCategory ?? ""}
        initialCategoryId={modal?.categoryId ?? ""}
        categories={categories}
      />
    </div>
  );
}

function slugToLabel(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
