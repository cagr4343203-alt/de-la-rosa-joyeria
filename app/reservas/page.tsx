import { ReservationPageContent } from "@/components/reservation-page-content";
import {
  getReservationContent,
  getSiteSettings,
} from "@/sanity/lib/site-content";

export default async function ReservationsPage() {
  const [content, settings] = await Promise.all([
    getReservationContent(),
    getSiteSettings(),
  ]);

  return (
    <ReservationPageContent
      content={content}
      whatsappNumber={settings.whatsappNumber}
    />
  );
}
