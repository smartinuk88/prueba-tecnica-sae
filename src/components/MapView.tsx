"use client";

import dynamic from "next/dynamic";

type Parcela = {
  id: number;
  municipio: string;
  provincia: string;
  geom: GeoJSON.Polygon;
  recintoCount?: number;
};

type Recinto = {
  id: number;
  parcelaId: number;
  cultivo: string;
  fechaSiembra: string | null;
  fechaCosecha: string | null;
  geom: GeoJSON.Polygon;
};

type Props = {
  parcelas: Parcela[];
  recintos: Recinto[];
};

// Dynamically import the actual map to avoid SSR issues
const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div className="h-150 w-full flex items-center justify-center bg-gray-100">
      <p className="text-gray-500">Cargando mapa...</p>
    </div>
  ),
});

function MapView({ parcelas, recintos }: Props) {
  // Enrich parcelas with recinto count
  const parcelasEnriched = parcelas.map((p) => ({
    ...p,
    recintoCount: recintos.filter((r) => r.parcelaId === p.id).length,
  }));

  return <Map parcelas={parcelasEnriched} recintos={recintos} />;
}
export default MapView;
