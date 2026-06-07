import Navbar from "@/components/Navbar";

/** Skeleton hiện khi navigate sang /la-so — giữ layout ổn định. */
export default function LaSoLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-parchment">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {/* Breadcrumb back */}
        <div className="mb-4 h-4 w-36 animate-pulse rounded bg-cream-2/70" />

        {/* Header */}
        <div className="mb-6">
          <div className="h-3 w-24 animate-pulse rounded bg-cream-2/70" />
          <div className="mt-2 h-9 w-3/4 animate-pulse rounded bg-cream-2/70 md:h-10" />
          <div className="mt-3 space-y-2">
            <div className="h-3 w-full animate-pulse rounded bg-cream-2/70" />
            <div className="h-3 w-10/12 animate-pulse rounded bg-cream-2/70" />
          </div>
        </div>

        {/* Form card */}
        <div className="rounded-lg border border-gold/40 bg-teal-2 p-6">
          <div className="h-5 w-40 animate-pulse rounded bg-teal-3/60" />
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="h-3 w-20 animate-pulse rounded bg-teal-3/50" />
                <div className="mt-2 h-10 w-full animate-pulse rounded bg-teal-3/40" />
              </div>
            ))}
          </div>
          <div className="mt-6 h-11 w-40 animate-pulse rounded bg-red-ink-2/60" />
        </div>

        {/* Result area placeholder */}
        <div className="mt-8 space-y-4">
          <div className="h-6 w-48 animate-pulse rounded bg-cream-2/70" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-md bg-cream-2/50"
              />
            ))}
          </div>
          <div className="mt-4 h-96 animate-pulse rounded-md bg-cream-2/40" />
        </div>
      </main>
    </div>
  );
}
