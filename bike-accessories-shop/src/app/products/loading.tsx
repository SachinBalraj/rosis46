import { ProductGridSkeleton } from "@/components/products/ProductGridSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-32 rounded-full bg-carbon-soft" />
        <div className="h-10 w-72 rounded-xl bg-carbon-soft" />
        <div className="h-4 w-96 max-w-full rounded-full bg-carbon-soft" />
      </div>
      <div className="mt-10">
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
}
