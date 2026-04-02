"use client";

import dynamic from "next/dynamic";
import { useState, useRef, useTransition } from "react";
import { deleteParcela } from "@/app/actions/parcelas";
import { Parcela, Recinto } from "@/types";

type Props = {
  parcelas: Parcela[];
  recintos: Recinto[];
  usuarioId: number;
};

// Dynamically import the actual map to avoid SSR issues
const Map = dynamic<{
  parcelas: Parcela[];
  recintos: Recinto[];
  usuarioId: number;
  onDeleteRequest: (parcela: Parcela) => void;
}>(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div className="h-150 w-full flex items-center justify-center bg-gray-100">
      <p className="text-gray-500">Cargando mapa...</p>
    </div>
  ),
});

function MapView({ parcelas, recintos, usuarioId }: Props) {
  const [selectedParcela, setSelectedParcela] = useState<Parcela | null>(null);
  const [isPending, startTransition] = useTransition();
  const confirmRef = useRef<HTMLDivElement>(null);

  const handleDeleteRequest = (parcela: Parcela) => {
    setSelectedParcela(parcela);
    setTimeout(() => {
      confirmRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  };

  const handleDelete = () => {
    if (!selectedParcela) return;
    startTransition(async () => {
      const result = await deleteParcela(selectedParcela.id, usuarioId);
      if (result.success) {
        setSelectedParcela(null);
      } else {
        console.error(result.error);
      }
    });
  };

  // Enrich parcelas with recinto count
  const parcelasEnriched = parcelas.map((p) => ({
    ...p,
    recintoCount: recintos.filter((r) => r.parcelaId === p.id).length,
  }));

  return (
    <div>
      <div className="rounded-xl overflow-hidden shadow-md border border-gray-200 mb-4">
        <Map
          parcelas={parcelasEnriched}
          recintos={recintos}
          usuarioId={usuarioId}
          onDeleteRequest={handleDeleteRequest}
        />
      </div>

      {/* Delete confirmation panel */}
      {selectedParcela && (
        <div
          ref={confirmRef}
          className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl"
        >
          <p className="text-sm font-semibold text-red-700 mb-1">
            ¿Eliminar Parcela {selectedParcela.id}?
          </p>
          <p className="text-xs text-red-600 mb-4">
            Se eliminarán también todos sus recintos asociados. Esta acción no
            se puede deshacer.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 cursor-pointer disabled:opacity-50"
            >
              {isPending ? "Eliminando..." : "Confirmar eliminación"}
            </button>
            <button
              onClick={() => setSelectedParcela(null)}
              className="px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-lg text-sm font-medium hover:border-gray-400 cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default MapView;
