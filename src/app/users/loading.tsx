export default function UsersLoading() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <div className="h-9 w-36 bg-gray-200 rounded-lg animate-pulse mb-2" />
          <div className="h-5 w-56 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Search input skeleton */}
        <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse mb-6" />

        {/* Filter buttons skeleton */}
        <div className="flex gap-3 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-9 w-28 bg-gray-200 rounded-full animate-pulse"
            />
          ))}
        </div>

        {/* Result count skeleton */}
        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-6" />

        {/* Cards grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
                <div className="flex-1">
                  <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 w-44 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <div className="h-7 w-24 bg-gray-200 rounded-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
