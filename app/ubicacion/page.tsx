import { ArrowUpRight, Clock3, MapPin, MessageCircle } from "lucide-react";
import { whatsappHref } from "@/lib/store";
import {
  getLocationContent,
  getSiteSettings,
} from "@/sanity/lib/site-content";

export const metadata = {
  title: "Ubicación y horarios en Encarnación",
  description:
    "Visitá Dela Rosa Joyería en Encarnación. Consultá horarios, ubicación y contacto.",
  alternates: {
    canonical: "/ubicacion",
  },
};

export default async function LocationPage() {
  const [content, settings] = await Promise.all([
    getLocationContent(),
    getSiteSettings(),
  ]);

  return (
    <section className="location-page">
      <div className="location-details">
        <span className="kicker kicker-light">{content.kicker}</span>
        <h1>{content.title}</h1>
        <p>{content.description}</p>
        <address>{settings.address}</address>
        <div className="location-data">
          <span>
            <MapPin size={18} />
            Atención en el local
          </span>
          <span>
            <Clock3 size={18} />
            {content.hoursFeature}
          </span>
        </div>
        <div className="location-hours">
          <strong>{content.hoursTitle}</strong>
          {settings.hours.map((schedule) => (
            <div key={schedule._key}>
              <span>{schedule.days}</span>
              <p>
                {schedule.times.map((time) => (
                  <time key={time}>{time}</time>
                ))}
              </p>
            </div>
          ))}
        </div>
        <div className="location-buttons">
          <a
            className="button button-gold"
            href={settings.mapsUrl}
            target="_blank"
            rel="noreferrer"
          >
            {content.mapsButtonLabel} <ArrowUpRight size={17} />
          </a>
          <a
            className="button button-outline-light"
            href={whatsappHref(
              content.whatsappMessage,
              settings.whatsappNumber,
            )}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={17} /> {content.whatsappButtonLabel}
          </a>
        </div>
      </div>
      <a
        className="location-map"
        href={settings.mapsUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Abrir la ubicación de Dela Rosa en Google Maps"
      >
        <div className="map-grid" />
        <span className="map-road map-road-one" />
        <span className="map-road map-road-two" />
        <span className="map-road map-road-three" />
        <div className="map-marker">
          <MapPin size={30} />
          <strong>{content.mapTitle}</strong>
          <small>{content.mapSubtitle}</small>
        </div>
        <p>
          {content.mapFooterLabel} <ArrowUpRight size={16} />
        </p>
      </a>
    </section>
  );
}
