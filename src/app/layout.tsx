import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prueba Técnica - Plataforma Agrícola",
  description: "Aplicación desarrollada para una prueba técnica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
