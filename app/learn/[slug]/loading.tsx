import Navbar from "@/components/Navbar";

/** Skeleton hiện khi navigate sang bài mới — giữ layout ổn định. */
export default function LessonLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-parchment">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <div className="mb-4 h-4 w-32 animate-pulse rounded bg-cream-2/70" />

        {/* Header skeleton */}
        <div className="border-b border-gold/40 pb-6">
          <div className="flex gap-2">
            <div className="h-5 w-24 animate-pulse rounded-full bg-cream-2/70" />
            <div className="h-5 w-16 animate-pulse rounded-full bg-cream-2/70" />
          </div>
          <div className="mt-4 h-9 w-3/4 animate-pulse rounded bg-cream-2/70" />
          <div className="mt-2 h-9 w-1/2 animate-pulse rounded bg-cream-2/70" />

          {/* Story hook skeleton */}
          <div className="mt-5 rounded-md border-l-4 border-teal-2 bg-cream-2/40 p-4">
            <div className="h-3 w-28 animate-pulse rounded bg-cream-2/70" />
            <div className="mt-3 space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-cream-2/70" />
              <div className="h-3 w-11/12 animate-pulse rounded bg-cream-2/70" />
              <div className="h-3 w-3/4 animate-pulse rounded bg-cream-2/70" />
            </div>
          </div>
        </div>

        {/* Sections skeleton */}
        <div className="mt-8 space-y-10">
          {[0, 1].map((i) => (
            <div key={i}>
              <div className="h-7 w-1/2 animate-pulse rounded bg-cream-2/70" />
              <div className="mt-3 space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-cream-2/70" />
                <div className="h-3 w-11/12 animate-pulse rounded bg-cream-2/70" />
                <div className="h-3 w-10/12 animate-pulse rounded bg-cream-2/70" />
              </div>
              <div className="mt-5 h-40 animate-pulse rounded-md bg-cream-2/40" />
            </div>
          ))}
        </div>

        {/* Quiz skeleton */}
        <div className="mt-12 h-32 animate-pulse rounded-lg bg-cream-2/40" />
      </main>
    </div>
  );
}
