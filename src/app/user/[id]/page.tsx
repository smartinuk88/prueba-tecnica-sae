import { notFound } from "next/navigation";
import { prisma } from "../../../../prisma/prisma_client";
import MapView from "@/components/MapView";
import Image from "next/image";
import Link from "next/link";
import ParcelaForm from "@/components/ParcelaForm";

type ParcelaRaw = {
  id: number;
  usuarioId: number;
  municipioId: number;
  municipio: string;
  provincia: string;
  geom: string;
};

type RecintoRaw = {
  id: number;
  parcelaId: number;
  cultivoId: number;
  fechaSiembra: Date | null;
  fechaCosecha: Date | null;
  cultivo: string;
  geom: string;
};

type Props = {
  params: Promise<{ id: string }>;
};

async function UserMapPage({ params }: Props) {
  const { id } = await params;
  const userId = parseInt(id);

  if (isNaN(userId)) notFound();

  const usuario = await prisma.usuario.findUnique({
    where: { id: userId },
    select: {
      id: true,
      nombre: true,
      email: true,
      profile: {
        select: { imagen: true },
      },
    },
  });

  if (!usuario) notFound();

  const parcelas: ParcelaRaw[] = await prisma.$queryRaw`
    SELECT 
      p.id,
      p."usuarioId",
      p."municipioId",
      m.nombre as municipio,
      pr.nombre as provincia,
      ST_AsGeoJSON(p.geom)::text as geom
    FROM "Parcela" p
    JOIN "Municipio" m ON m.id = p."municipioId"
    JOIN "Provincia" pr ON pr.id = m."provinciaId"
    WHERE p."usuarioId" = ${userId}
  `;

  const recintos: RecintoRaw[] = await prisma.$queryRaw`
    SELECT
      r.id,
      r."parcelaId",
      r."cultivoId",
      r."fechaSiembra",
      r."fechaCosecha",
      c.nombre as cultivo,
      ST_AsGeoJSON(r.geom)::text as geom
    FROM "Recinto" r
    JOIN "Cultivo" c ON c.id = r."cultivoId"
    WHERE r."parcelaId" IN (
      SELECT id FROM "Parcela" WHERE "usuarioId" = ${userId}
    )
  `;

  const municipios = await prisma.municipio.findMany({
    select: {
      id: true,
      nombre: true,
      provincia: {
        select: {
          id: true,
          nombre: true,
        },
      },
    },
    orderBy: { nombre: "asc" },
  });

  const provincias = await prisma.provincia.findMany({
    select: {
      id: true,
      nombre: true,
    },
    orderBy: { nombre: "asc" },
  });

  // Parse the GeoJSON strings into objects
  const parcelasWithGeom = parcelas.map((parcela) => ({
    ...parcela,
    geom: JSON.parse(parcela.geom),
  }));

  const recintosWithGeom = recintos.map((recinto) => ({
    ...recinto,
    fechaSiembra: recinto.fechaSiembra
      ? new Date(recinto.fechaSiembra).toLocaleDateString("es-ES")
      : null,
    fechaCosecha: recinto.fechaCosecha
      ? new Date(recinto.fechaCosecha).toLocaleDateString("es-ES")
      : null,
    geom: JSON.parse(recinto.geom),
  }));

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
            {parcelasWithGeom.length}{" "}
            {parcelasWithGeom.length === 1 ? "parcela" : "parcelas"}
          </p>
        </div>

        <MapView
          parcelas={parcelasWithGeom}
          recintos={recintosWithGeom}
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
