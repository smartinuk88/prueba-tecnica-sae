"use client";

import { useRouter } from "next/navigation";

type Props = {
  id: number;
  nombre: string;
  email: string;
  numeroParcelas: number;
};

function UsuarioCard({ id, nombre, email, numeroParcelas }: Props) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/user/${id}`)}
      className="cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-green-400 transition-all duration-200"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-700 font-bold text-lg">
          {nombre.charAt(0)}
        </div>
        <div>
          <h2 className="font-semibold text-gray-900 text-lg">{nombre}</h2>
          <p className="text-gray-500 text-sm">{email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600 border-t border-gray-100 pt-4">
        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">
          {numeroParcelas} {numeroParcelas === 1 ? "parcela" : "parcelas"}
        </span>
      </div>
    </div>
  );
}
export default UsuarioCard;
