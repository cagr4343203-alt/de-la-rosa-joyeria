import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reserva de perforación",
  description:
    "Reservá tu turno para perforación de oreja en DELAROSA Joyería y Relojería.",
};

export default function ReservationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
