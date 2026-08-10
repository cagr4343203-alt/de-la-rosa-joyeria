import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perforación de oreja en Encarnación",
  description:
    "Reservá tu turno para perforación de oreja en Dela Rosa Joyería y Relojería.",
  alternates: {
    canonical: "/reservas",
  },
};

export default function ReservationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
