export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="border border-line bg-white">
          <div className="aspect-[4/3] skeleton" />
          <div className="flex flex-col gap-3 p-5">
            <div className="h-3 w-16 bg-carbon-soft" />
            <div className="h-5 w-3/4 bg-carbon-soft" />
            <div className="h-3 w-full bg-carbon-soft" />
            <div className="h-3 w-2/3 bg-carbon-soft" />
            <div className="mt-2 h-11 w-full bg-carbon-soft" />
          </div>
        </li>
      ))}
    </ul>
  );
}
