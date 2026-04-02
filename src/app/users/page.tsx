export const revalidate = 60;
import { getUsuarios } from "@/lib/db/usuarios";
import UsuarioSearch from "@/components/UsuarioSearch";

async function UsersPage() {
  const usuarios = await getUsuarios();

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-500 mt-2">
            Plataforma de agricultura regenerativa
          </p>
        </div>
        <UsuarioSearch initialUsuarios={usuarios} />
      </div>
    </main>
  );
}
export default UsersPage;
