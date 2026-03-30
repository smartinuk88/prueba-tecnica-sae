"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../../prisma/prisma_client";

// DELETE PARCELA
export async function deleteParcela(parcelaId: number, usuarioId: number) {
  try {
    // First delete all recintos belonging to this parcela
    // (foreign key constraint requires this)
    await prisma.$executeRaw`
      DELETE FROM "Recinto" WHERE "parcelaId" = ${parcelaId}
    `;

    // Then delete the parcela itself
    await prisma.$executeRaw`
      DELETE FROM "Parcela" 
      WHERE id = ${parcelaId} AND "usuarioId" = ${usuarioId}
    `;

    revalidatePath(`/user/${usuarioId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting parcela:", error);
    return { success: false, error: "No se ha podido eliminar la parcela" };
  }
}

// CREATE MUNICIPIO (if new)
async function getOrCreateMunicipio(
  municipioId: number | null,
  newMunicipioNombre: string | null,
  provinciaId: number | null,
): Promise<number> {
  // If existing municipio selected, return its id
  if (municipioId) return municipioId;

  // Otherwise create new municipio
  if (!newMunicipioNombre || !provinciaId) {
    throw new Error("Nombre de municipio y provincia son obligatorios");
  }

  // Check if municipio already exists with this name in this provincia
  const existing = await prisma.municipio.findFirst({
    where: {
      nombre: { equals: newMunicipioNombre, mode: "insensitive" },
      provinciaId,
    },
  });

  if (existing) return existing.id;

  // Create new municipio
  const created = await prisma.municipio.create({
    data: {
      nombre: newMunicipioNombre,
      provinciaId,
    },
  });

  return created.id;
}

// ADD PARCELA
export async function addParcela(formData: FormData) {
  const usuarioId = parseInt(formData.get("usuarioId") as string);
  const geojson = formData.get("geojson") as string;
  const municipioId = formData.get("municipioId")
    ? parseInt(formData.get("municipioId") as string)
    : null;
  const newMunicipioNombre = formData.get("newMunicipioNombre") as
    | string
    | null;
  const provinciaId = formData.get("provinciaId")
    ? parseInt(formData.get("provinciaId") as string)
    : null;

  // Validate GeoJSON
  let parsedGeojson: { type: string; coordinates: number[][][] };
  try {
    parsedGeojson = JSON.parse(geojson);
    if (parsedGeojson.type !== "Polygon" || !parsedGeojson.coordinates) {
      throw new Error("Invalid GeoJSON");
    }
  } catch {
    return {
      success: false,
      error:
        "El GeoJSON no es válido. Asegúrate de pegar solo el objeto geometry de tipo Polygon.",
    };
  }

  // Validate municipio selection
  if (!municipioId && (!newMunicipioNombre || !provinciaId)) {
    return {
      success: false,
      error: "Selecciona un municipio o introduce uno nuevo con su provincia.",
    };
  }

  try {
    const resolvedMunicipioId = await getOrCreateMunicipio(
      municipioId,
      newMunicipioNombre,
      provinciaId,
    );

    await prisma.$executeRaw`
      INSERT INTO "Parcela" ("usuarioId", "municipioId", geom)
      VALUES (
        ${usuarioId},
        ${resolvedMunicipioId},
        ST_GeomFromGeoJSON(${JSON.stringify(parsedGeojson)})
      )
    `;

    revalidatePath(`/user/${usuarioId}`);
    return { success: true };
  } catch (error) {
    console.error("Error adding parcela:", error);
    return { success: false, error: "No se ha podido añadir la parcela." };
  }
}
