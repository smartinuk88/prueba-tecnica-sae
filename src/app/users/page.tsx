import UsuarioCard from "@/components/UsuarioCard";
import { prisma } from "../../../prisma/prisma_client";

async function UsersPage() {
  const usuarios = await prisma.usuario.findMany({
    select: {
      id: true,
      nombre: true,
      email: true,
      profile: {
        select: {
          imagen: true,
        },
      },
      _count: {
        select: { parcelas: true },
      },
    },
    orderBy: {
      nombre: "asc",
    },
  });
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-500 mt-2">
            {usuarios.length}{" "}
            {usuarios.length === 1
              ? "usuario registrado"
              : "usuarios registrados"}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {usuarios.map((usuario) => (
            <UsuarioCard
              key={usuario.id}
              id={usuario.id}
              nombre={usuario.nombre}
              email={usuario.email}
              imagen={usuario.profile?.imagen}
              numeroParcelas={usuario._count.parcelas}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
export default UsersPage;
