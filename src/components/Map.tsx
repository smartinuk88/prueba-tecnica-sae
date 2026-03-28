"use client";

import { MapContainer, TileLayer, Polygon, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";

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

// GeoJSON coordinates are [lng, lat] but Leaflet expects [lat, lng]
function toLatLng(coordinates: number[][][]): LatLngExpression[] {
  return coordinates[0].map(([lng, lat]) => [lat, lng]);
}

// Calculate the centre of all parcelas for initial map position
function getCentre(parcelas: Parcela[]): LatLngExpression {
  if (parcelas.length === 0) return [38.0, -1.13];
  const allCoords = parcelas.flatMap((p) =>
    p.geom.coordinates[0].map(([lng, lat]) => ({ lat, lng })),
  );
  const avgLat =
    allCoords.reduce((sum, c) => sum + c.lat, 0) / allCoords.length;
  const avgLng =
    allCoords.reduce((sum, c) => sum + c.lng, 0) / allCoords.length;
  return [avgLat, avgLng];
}

function Map({ parcelas, recintos }: Props) {
  const centre = getCentre(parcelas);
  return (
    <MapContainer
      center={centre}
      zoom={13}
      style={{ height: "600px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Parcelas — green polygons */}
      {parcelas.map((parcela) => (
        <Polygon
          key={`parcela-${parcela.id}`}
          positions={toLatLng(parcela.geom.coordinates)}
          pathOptions={{
            color: "#15803d",
            fillColor: "#22c55e",
            fillOpacity: 0.3,
            weight: 2,
          }}
        >
          <Tooltip sticky>
            <div className="text-sm">
              <p className="font-semibold text-gray-900 mb-1">
                Parcela {parcela.id}
              </p>
              <p>
                <span className="text-gray-500">Provincia:</span>{" "}
                {parcela.provincia}
              </p>
              <p>
                <span className="text-gray-500">Municipio:</span>{" "}
                {parcela.municipio}
              </p>
              <p>
                <span className="text-gray-500">Recintos:</span>{" "}
                {parcela.recintoCount}
              </p>
            </div>
          </Tooltip>
        </Polygon>
      ))}

      {/* Recintos — amber polygons */}
      {recintos.map((recinto) => (
        <Polygon
          key={`recinto-${recinto.id}`}
          positions={toLatLng(recinto.geom.coordinates)}
          pathOptions={{
            color: "#b45309",
            fillColor: "#f59e0b",
            fillOpacity: 0.5,
            weight: 2,
          }}
        >
          <Tooltip sticky>
            <div className="text-sm">
              <p className="font-semibold text-gray-900 mb-1">
                Recinto {recinto.id}
              </p>
              <p>
                <span className="text-gray-500">Cultivo:</span>{" "}
                {recinto.cultivo}
              </p>
              <p>
                <span className="text-gray-500">Siembra:</span>{" "}
                {recinto.fechaSiembra ?? "—"}
              </p>
              <p>
                <span className="text-gray-500">Cosecha:</span>{" "}
                {recinto.fechaCosecha ?? "—"}
              </p>
            </div>
          </Tooltip>
        </Polygon>
      ))}
    </MapContainer>
  );
}
export default Map;
