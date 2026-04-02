import { prisma } from "../../../prisma/prisma_client";
import type { Parcela, Recinto, Municipio, Provincia } from "@/types";

type ParcelaRow = {
  id: number;
  usuarioId: number;
  municipioId: number;
  municipio: string;
  provincia: string;
  geom: string;
};

type RecintoRow = {
  id: number;
  parcelaId: number;
  cultivoId: number;
  fechaSiembra: Date | null;
  fechaCosecha: Date | null;
  cultivo: string;
  geom: string;
};

export async function getParcelasByUsuario(userId: number): Promise<Parcela[]> {
  const rows: ParcelaRow[] = await prisma.$queryRaw`
    SELECT 
      p.id,
      p."usuarioId",
      p."municipioId",
      m.nombre as municipio,
      pr.nombre as provincia,
      ST_AsGeoJSON(p.geom) as geom
    FROM "Parcela" p
    JOIN "Municipio" m ON m.id = p."municipioId"
    JOIN "Provincia" pr ON pr.id = m."provinciaId"
    WHERE p."usuarioId" = ${userId}
  `;

  return rows.map((row) => ({
    ...row,
    geom: JSON.parse(row.geom),
  }));
}

export async function getRecintosByUsuario(userId: number): Promise<Recinto[]> {
  const rows: RecintoRow[] = await prisma.$queryRaw`
    SELECT
      r.id,
      r."parcelaId",
      r."cultivoId",
      r."fechaSiembra",
      r."fechaCosecha",
      c.nombre as cultivo,
      ST_AsGeoJSON(r.geom) as geom
    FROM "Recinto" r
    JOIN "Cultivo" c ON c.id = r."cultivoId"
    WHERE r."parcelaId" IN (
      SELECT id FROM "Parcela" WHERE "usuarioId" = ${userId}
    )
  `;

  return rows.map((row) => ({
    ...row,
    fechaSiembra: row.fechaSiembra
      ? new Date(row.fechaSiembra).toLocaleDateString("es-ES")
      : null,
    fechaCosecha: row.fechaCosecha
      ? new Date(row.fechaCosecha).toLocaleDateString("es-ES")
      : null,
    geom: JSON.parse(row.geom),
  }));
}

export async function getMunicipios(): Promise<Municipio[]> {
  return prisma.municipio.findMany({
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
}

export async function getProvincias(): Promise<Provincia[]> {
  return prisma.provincia.findMany({
    select: {
      id: true,
      nombre: true,
    },
    orderBy: { nombre: "asc" },
  });
}
