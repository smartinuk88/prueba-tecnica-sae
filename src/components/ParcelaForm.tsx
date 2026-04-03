"use client";

import { useState, useTransition, useRef } from "react";
import { addParcela } from "@/app/actions/parcelas";
import { Municipio, Provincia } from "@/types";

type Props = {
  usuarioId: number;
  municipios: Municipio[];
  provincias: Provincia[];
};

export default function ParcelaForm({
  usuarioId,
  municipios,
  provincias,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [geojson, setGeojson] = useState("");
  const [municipioId, setMunicipioId] = useState<string>("");
  const [isNewMunicipio, setIsNewMunicipio] = useState(false);
  const [newMunicipioNombre, setNewMunicipioNombre] = useState("");
  const [provinciaId, setProvinciaId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const formRef = useRef<HTMLDivElement>(null);

  const resetForm = () => {
    setGeojson("");
    setMunicipioId("");
    setIsNewMunicipio(false);
    setNewMunicipioNombre("");
    setProvinciaId("");
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  const handleSubmit = () => {
    setError(null);

    const formData = new FormData();
    formData.append("usuarioId", String(usuarioId));
    formData.append("geojson", geojson);

    if (isNewMunicipio) {
      formData.append("newMunicipioNombre", newMunicipioNombre);
      formData.append("provinciaId", provinciaId);
    } else {
      formData.append("municipioId", municipioId);
    }

    startTransition(async () => {
      const result = await addParcela(formData);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setError(result.error ?? "Error desconocido");
      }
    });
  };

  return (
    <div className="mt-6">
      {!isOpen ? (
        <button
          onClick={() => {
            setIsOpen(true);
            setTimeout(() => {
              formRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }, 50);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors duration-200 cursor-pointer text-sm"
        >
          + Añadir parcela
        </button>
      ) : (
        <div
          ref={formRef}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6 w-full">
            <h3 className="font-semibold text-gray-900 text-lg flex-1">
              Añadir nueva parcela
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 cursor-pointer text-xl font-bold"
            >
              ✕
            </button>
          </div>

          {/* GeoJSON input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Geometría (GeoJSON)
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Dibuja un polígono en{" "}
              <a
                href="https://geojson.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline"
              >
                geojson.io
              </a>{" "}
              y pega aquí el objeto{" "}
              <code className="bg-gray-100 px-1 rounded">geometry</code>.
            </p>
            <textarea
              value={geojson}
              onChange={(e) => setGeojson(e.target.value)}
              rows={6}
              placeholder='{"coordinates":[[[...}], "type":"Polygon"}'
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
            />
          </div>

          {/* Municipio selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Municipio
            </label>

            {!isNewMunicipio ? (
              <div className="flex gap-2">
                <select
                  value={municipioId}
                  onChange={(e) => setMunicipioId(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="">Selecciona un municipio</option>
                  {municipios.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre} ({m.provincia.nombre})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    setIsNewMunicipio(true);
                    setMunicipioId("");
                  }}
                  className="px-3 py-2 text-sm text-green-600 border border-green-300 rounded-lg hover:bg-green-50 cursor-pointer whitespace-nowrap"
                >
                  + Nuevo
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newMunicipioNombre}
                    onChange={(e) => setNewMunicipioNombre(e.target.value)}
                    placeholder="Nombre del municipio"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                  <button
                    onClick={() => {
                      setIsNewMunicipio(false);
                      setNewMunicipioNombre("");
                      setProvinciaId("");
                    }}
                    className="px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
                <select
                  value={provinciaId}
                  onChange={(e) => setProvinciaId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="">Selecciona una provincia</option>
                  {provincias.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
              ✓ Parcela añadida correctamente
            </div>
          )}

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Guardando..." : "Añadir parcela"}
          </button>
        </div>
      )}
    </div>
  );
}
