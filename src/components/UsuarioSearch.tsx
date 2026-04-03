"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import UsuarioCard from "./UsuarioCard";
import { Usuario } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

type Filter = "todos" | "con-parcelas" | "sin-parcelas";

type Props = {
  initialUsuarios: Usuario[];
};

const fetchUsuarios = async (queryString: string): Promise<Usuario[]> => {
  const res = await fetch(`/api/usuarios?${queryString}`);
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error ?? "Error fetching usuarios");
  }
  return res.json();
};

function UsuarioSearch({ initialUsuarios }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialSearch = searchParams.get("search") ?? "";
  const initialFilter = (searchParams.get("filter") as Filter) ?? "todos";

  const [search, setSearch] = useState(initialSearch);
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [usuarios, setUsuarios] = useState<Usuario[]>(initialUsuarios);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  //Update URL when search or filter changes
  const updateUrl = useCallback(
    (searchValue: string, filterValue: Filter) => {
      const params = new URLSearchParams();
      if (searchValue) params.set("search", searchValue);
      if (filterValue !== "todos") params.set("filter", filterValue);

      const queryString = params.toString();
      router.replace(queryString ? `/users?${queryString}` : "/users");
    },
    [router],
  );

  // Debounced URL update — waits 500ms after user stops typing
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      updateUrl(search, filter);
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search, filter, updateUrl]);

  // Fetch when URL params change
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchUsuarios(searchParams.toString());
        setUsuarios(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [searchParams]);

  const filterButtons: { label: string; value: Filter }[] = [
    { label: "Todos", value: "todos" },
    { label: "Con parcelas", value: "con-parcelas" },
    { label: "Sin parcelas", value: "sin-parcelas" },
  ];

  return (
    <div>
      {/* Search input */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o email..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-900 placeholder-gray-400"
        />
      </div>

      {/* Filter buttons */}
      <div className="flex gap-3 mb-8">
        {filterButtons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => {
              setFilter(btn.value);
              updateUrl(search, btn.value);
            }}
            className={`px-4 py-2 rounded-full cursor-pointer text-sm font-medium transition-all duration-200 ${
              filter === btn.value
                ? "bg-green-600 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:border-green-400"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-gray-500 text-sm mb-6">
        {loading
          ? "Buscando..."
          : `${usuarios.length} ${usuarios.length === 1 ? "usuario encontrado" : "usuarios encontrados"}`}
      </p>

      {/* Cards grid */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-200 ${loading ? "opacity-50" : "opacity-100"}`}
      >
        {usuarios.map((usuario) => (
          <UsuarioCard
            key={usuario.id}
            id={usuario.id}
            nombre={usuario.nombre}
            email={usuario.email}
            numeroParcelas={usuario._count.parcelas}
            imagen={usuario.profile?.imagen}
          />
        ))}
      </div>

      {/* Empty state */}
      {!loading && usuarios.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No se encontraron usuarios</p>
          <p className="text-sm mt-1">Prueba con otros términos de búsqueda</p>
        </div>
      )}
    </div>
  );
}
export default UsuarioSearch;
