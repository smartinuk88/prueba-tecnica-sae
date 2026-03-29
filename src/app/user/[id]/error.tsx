"use client";

import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function MapError({ error, reset }: Props) {
  useEffect(() => {
    console.error("Map page error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <a
          href="/users"
          className="text-green-600 hover:text-green-800 text-sm font-medium mb-8 inline-block"
        >
          ← Volver a usuarios
        </a>
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Algo ha salido mal
          </h2>
          <p className="text-gray-500 mb-8 max-w-md">
            No se ha podido cargar el mapa. Por favor, inténtalo de nuevo.
          </p>

          <button
            onClick={reset}
            className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors duration-200 cursor-pointer"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    </main>
  );
}
