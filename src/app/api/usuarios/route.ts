import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma_client";

// Valid filter values
const VALID_FILTERS = ["todos", "con-parcelas", "sin-parcelas"] as const;
type Filter = (typeof VALID_FILTERS)[number];

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const search = searchParams.get("search") ?? "";
  const filter = searchParams.get("filter") ?? "todos";

  // Validate search length
  if (search.length > 100) {
    return NextResponse.json(
      { error: "El parámetro search no puede superar los 100 caracteres" },
      { status: 400 },
    );
  }

  // Validate filter value
  if (!VALID_FILTERS.includes(filter as Filter)) {
    return NextResponse.json(
      {
        error: `El parámetro filter debe ser uno de: ${VALID_FILTERS.join(", ")}`,
      },
      { status: 400 },
    );
  }

  try {
    const usuarios = await prisma.usuario.findMany({
      where: {
        AND: [
          // Search filter — matches nombre or email case-insensitively
          search
            ? {
                OR: [
                  { nombre: { contains: search, mode: "insensitive" } },
                  { email: { contains: search, mode: "insensitive" } },
                ],
              }
            : {},
          // Parcela filter
          filter === "con-parcelas"
            ? { parcelas: { some: {} } }
            : filter === "sin-parcelas"
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

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error("Error fetching usuarios:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
