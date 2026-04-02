import { prisma } from "../../../prisma/prisma_client";
import type { Usuario } from "@/types";

export async function getUsuarios(): Promise<Usuario[]> {
  return prisma.usuario.findMany({
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
