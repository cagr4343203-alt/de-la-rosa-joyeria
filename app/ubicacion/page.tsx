import { ArrowUpRight, Clock3, MapPin, MessageCircle } from "lucide-react";
import { MAPS_URL, whatsappHref } from "@/lib/store";

export const metadata = {
  title: "Ubicación",
  description:
    "Visitá DELAROSA en Calle Estigarribia y Constitución, Encarnación.",
};

export default function LocationPage() {
  return (
    <section className="location-page">
      <div className="location-details">
        <span className="kicker kicker-light">El local</span>
        <h1>Vení a conocernos</h1>
        <p>
          Calle Estigarribia y Constitución
          <br />
          Encarnación, Paraguay
        </p>
        <div className="location-data">
          <span>
            <MapPin size={18} />
            Atención en el local
          </span>
          <span>
            <Clock3 size={18} />
            Consultá el horario del día
          </span>
        </div>
        <div className="location-buttons">
          <a
            className="button button-gold"
            href={MAPS_URL}
            target="_blank"
            rel="noreferrer"
          >
            Abrir Google Maps <ArrowUpRight size={17} />
          </a>
          <a
            className="button button-outline-light"
            href={whatsappHref(
              "Hola DELAROSA, quiero consultar el horario para visitar el local.",
            )}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={17} /> Consultar horario
          </a>
        </div>
      </div>
      <a
        className="location-map"
        href={MAPS_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Abrir la ubicación de DELAROSA en Google Maps"
      >
        <div className="map-grid" />
        <span className="map-road map-road-one" />
        <span className="map-road map-road-two" />
        <span className="map-road map-road-three" />
        <div className="map-marker">
          <MapPin size={30} />
          <strong>DELAROSA</strong>
          <small>Estigarribia y Constitución</small>
        </div>
        <p>
          Abrir ubicación <ArrowUpRight size={16} />
        </p>
      </a>
    </section>
  );
}
