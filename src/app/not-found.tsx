import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl">🌱</span>
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Página no encontrada
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          La página que buscas no existe o ha sido movida.
        </p>
        <Link
          href="/users"
          className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors duration-200 inline-block"
        >
          Volver a usuarios
        </Link>
      </div>
    </main>
  );
}
