export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <li
          key={i}
          className="animate-pulse overflow-hidden rounded-2xl border border-line bg-carbon"
        >
          <div className="aspect-[4/3] bg-carbon-soft" />
          <div className="flex flex-col gap-3 p-4">
            <div className="h-3 w-16 rounded-full bg-carbon-soft" />
            <div className="h-4 w-3/4 rounded-full bg-carbon-soft" />
            <div className="h-3 w-full rounded-full bg-carbon-soft" />
            <div className="h-3 w-2/3 rounded-full bg-carbon-soft" />
            <div className="mt-2 h-9 w-full rounded-xl bg-carbon-soft" />
          </div>
        </li>
      ))}
    </ul>
  );
}
