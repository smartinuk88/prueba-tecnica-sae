import { prisma } from "../../../prisma/prisma_client";
import type { Usuario } from "@/types";

const VALID_FILTERS = ["todos", "con-parcelas", "sin-parcelas"] as const;
type Filter = (typeof VALID_FILTERS)[number];

export async function getUsuarios(
  search?: string,
  filter?: string,
): Promise<Usuario[]> {
  const validFilter = VALID_FILTERS.includes(filter as Filter)
    ? (filter as Filter)
    : "todos";

  return prisma.usuario.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { nombre: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        validFilter === "con-parcelas"
          ? { parcelas: { some: {} } }
          : validFilter === "sin-parcelas"
            ? { parcelas: { none: {} } }
            : {},
      ],
    },
    select: {
      id: true,
      nombre: true,
      email: true,
      profile: {
        select: { imagen: true },
      },
      _count: {
        select: { parcelas: true },
      },
    },
    orderBy: { nombre: "asc" },
  });
}

export async function getUsuarioById(id: number) {
  return prisma.usuario.findUnique({
    where: { id },
    select: {
      id: true,
      nombre: true,
      email: true,
      profile: {
        select: { imagen: true },
      },
    },
  });
}
