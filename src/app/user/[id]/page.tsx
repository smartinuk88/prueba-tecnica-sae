import { notFound } from "next/navigation";
import MapView from "@/components/MapView";
import Image from "next/image";
import Link from "next/link";
import ParcelaForm from "@/components/ParcelaForm";
import { getUsuarioById } from "@/lib/db/usuarios";
import { Parcela, Recinto } from "@/types";
import {
  getMunicipios,
  getParcelasByUsuario,
  getProvincias,
  getRecintosByUsuario,
} from "@/lib/db/parcelas";

type Props = {
  params: Promise<{ id: string }>;
};

async function UserMapPage({ params }: Props) {
  const { id } = await params;
  const userId = parseInt(id);

  if (isNaN(userId)) notFound();

  const usuario = await getUsuarioById(userId);

  if (!usuario) notFound();

  const parcelas: Parcela[] = await getParcelasByUsuario(userId);
  const recintos: Recinto[] = await getRecintosByUsuario(userId);
  const municipios = await getMunicipios();
  const provincias = await getProvincias();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link
            className="text-green-600 hover:text-green-800 text-sm font-medium mb-4 inline-block"
            href="/users"
          >
            ← Volver a usuarios
          </Link>
          <div className="flex items-center gap-4 mt-2">
            {usuario.profile?.imagen && (
              <Image
                src={usuario.profile.imagen}
                alt={usuario.nombre}
                width={64}
                height={64}
                className="rounded-full bg-green-100"
              />
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{usuario.nombre}</h1>
          <p className="text-gray-500 mt-1">{usuario.email}</p>
          <p className="text-sm text-green-700 font-medium mt-2">
            {parcelas.length} {parcelas.length === 1 ? "parcela" : "parcelas"}
          </p>
        </div>

        <MapView
          parcelas={parcelas}
          recintos={recintos}
          usuarioId={usuario.id}
        />

        <ParcelaForm
          usuarioId={usuario.id}
          municipios={municipios}
          provincias={provincias}
        />
      </div>
    </main>
  );
}
export default UserMapPage;
