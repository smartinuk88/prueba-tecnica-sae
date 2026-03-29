export default function MapLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          {/* Back link skeleton */}
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-4" />
          {/* User header skeleton */}

          <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse mb-2" />

          <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-36 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Map skeleton */}
        <div className="rounded-xl overflow-hidden shadow-md border border-gray-200 bg-gray-200 animate-pulse h-150 w-full flex items-center justify-center">
          <p className="text-gray-400 text-sm">Cargando mapa...</p>
        </div>
      </div>
    </main>
  );
}
