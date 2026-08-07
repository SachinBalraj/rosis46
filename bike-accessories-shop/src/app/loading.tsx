export default function Loading() {
  return (
    <div
      aria-label="Loading"
      className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-32 rounded-full bg-carbon-soft" />
        <div className="h-10 w-72 max-w-full rounded-xl bg-carbon-soft" />
        <div className="h-4 w-96 max-w-full rounded-full bg-carbon-soft" />
      </div>
      <div className="animate-pulse grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-80 rounded-2xl border border-line bg-carbon"
          />
        ))}
      </div>
    </div>
  );
}
