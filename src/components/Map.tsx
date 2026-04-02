"use client";

import {
  MapContainer,
  TileLayer,
  Polygon,
  Tooltip,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";
import { Parcela, Recinto } from "@/types";

type Props = {
  parcelas: Parcela[];
  recintos: Recinto[];
  onDeleteRequest: (parcela: Parcela) => void;
};

// GeoJSON coordinates are [lng, lat] but Leaflet expects [lat, lng]
function toLatLng(coordinates: number[][][]): LatLngExpression[] {
  return coordinates[0].map(([lng, lat]) => [lat, lng]);
}

// Centre the first parcela
function getCentre(parcelas: Parcela[]): LatLngExpression {
  if (parcelas.length === 0) return [38.0, -1.13];

  // Centre on the first parcela's first coordinate
  const firstCoords = parcelas[0].geom.coordinates[0];
  const lats = firstCoords.map(([, lat]) => lat);
  const lngs = firstCoords.map(([lng]) => lng);
  const avgLat = lats.reduce((sum, lat) => sum + lat, 0) / lats.length;
  const avgLng = lngs.reduce((sum, lng) => sum + lng, 0) / lngs.length;

  return [avgLat, avgLng];
}

function Map({ parcelas, recintos, onDeleteRequest }: Props) {
  const centre = getCentre(parcelas);

  return (
    <div>
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

            <Popup>
              <div className="text-sm ">
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
                  <span className="text-gray-500 mb-3">Recintos:</span>{" "}
                  {parcela.recintoCount}
                </p>
                <button
                  onClick={() => onDeleteRequest(parcela)}
                  className="w-full px-2 py-1 bg-red-50 text-red-600 border border-red-200 rounded text-xs font-medium hover:bg-red-100 cursor-pointer"
                >
                  Eliminar parcela
                </button>
              </div>
            </Popup>
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
    </div>
  );
}
export default Map;
