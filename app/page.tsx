import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Gem,
  Gift,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { MAPS_URL, whatsappHref } from "@/lib/store";
import { getProducts } from "@/sanity/lib/products";

const categoryCards = [
  {
    title: "Anillos",
    eyebrow: "Momentos únicos",
    image: "/products/06-joya.jpg",
  },
  {
    title: "Aros",
    eyebrow: "Brillo cotidiano",
    image: "/products/04-aros.jpg",
  },
  {
    title: "Bombillas",
    eyebrow: "Detalles para regalar",
    image: "/products/12-regalos-bombilla-boligrafo.png",
    position: "left center",
  },
  {
    title: "Pulseras",
    eyebrow: "Plata 925 bañada en oro",
    image: "/products/client/pulsera-tennis-gold.jpeg",
  },
];

export default async function Home() {
  const products = await getProducts();
  const featured = products.slice(0, 4);

  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <span className="kicker kicker-light">Encarnación · Desde 2003</span>
          <h1>
            El detalle exclusivo
            <em>para ese momento especial.</em>
          </h1>
          <p>
            Joyas, relojes y regalos seleccionados para acompañar historias que
            merecen ser recordadas.
          </p>
          <div className="hero-actions">
            <Link className="button button-gold" href="/productos">
              Ver productos <ArrowUpRight size={17} />
            </Link>
            <Link className="button button-outline-light" href="/reservas">
              <CalendarDays size={17} /> Reservar perforación
            </Link>
          </div>
          <div className="hero-trust">
            <span>
              <Gem size={17} />
              Oro, plata y relojería
            </span>
            <span>
              <ShieldCheck size={17} />
              Atención personalizada
            </span>
          </div>
        </div>

        <div className="hero-gallery">
          <div className="hero-halo" />
          <figure className="hero-photo hero-photo-main">
            <Image
              src="/products/06-joya.jpg"
              alt="Anillos de DELAROSA"
              fill
              priority
              sizes="(max-width: 900px) 76vw, 36vw"
            />
          </figure>
          <figure className="hero-photo hero-photo-small">
            <Image
              src="/products/05-pulsera.jpg"
              alt="Pulsera de DELAROSA"
              fill
              priority
              sizes="(max-width: 900px) 45vw, 20vw"
            />
          </figure>
          <Link className="hero-reserve-card" href="/reservas">
            <span>Agenda disponible</span>
            <strong>Reservá tu perforación</strong>
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>

      <section className="service-band" aria-label="Servicios destacados">
        <article>
          <Gem size={24} />
          <div>
            <strong>Joyas seleccionadas</strong>
            <span>Oro 18K, plata y enchapados</span>
          </div>
        </article>
        <article>
          <CalendarDays size={24} />
          <div>
            <strong>Perforación de oreja</strong>
            <span>Reservá fecha y horario por WhatsApp</span>
          </div>
        </article>
        <article>
          <Gift size={24} />
          <div>
            <strong>Regalos especiales</strong>
            <span>Bombillas, bolígrafos y más detalles</span>
          </div>
        </article>
      </section>

      <section className="home-section category-section">
        <div className="section-heading">
          <div>
            <span className="kicker">Comprar por categoría</span>
            <h2>Encontrá ese detalle especial</h2>
          </div>
          <Link className="text-link" href="/productos">
            Ver todo el catálogo <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="category-grid">
          {categoryCards.map((card) => (
            <Link
              key={card.title}
              className="category-card"
              href={`/productos?categoria=${encodeURIComponent(card.title)}`}
            >
              <Image
                src={card.image}
                alt=""
                fill
                loading="eager"
                quality={70}
                sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 25vw"
                style={{ objectPosition: card.position }}
              />
              <span>{card.eyebrow}</span>
              <h3>{card.title}</h3>
              <i>
                <ArrowUpRight size={18} />
              </i>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section featured-section">
        <div className="section-heading">
          <div>
            <span className="kicker">Selección DELAROSA</span>
            <h2>Productos destacados</h2>
          </div>
          <p>
            Agregá tus favoritos al carrito o consultá la disponibilidad
            directamente por WhatsApp.
          </p>
        </div>
        <div className="featured-grid">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              eager
            />
          ))}
        </div>
      </section>

      <section className="piercing-cta">
        <div className="piercing-copy">
          <span className="kicker kicker-light">Reserva de perforación</span>
          <h2>Tu nuevo brillo, con atención personalizada.</h2>
          <p>
            Elegí fecha, horario y cantidad de perforaciones. Preparamos tu
            solicitud y la confirmamos contigo por WhatsApp.
          </p>
          <div className="piercing-points">
            <span>
              <Clock3 size={18} /> Reserva rápida
            </span>
            <span>
              <ShieldCheck size={18} /> Cuidado y orientación
            </span>
          </div>
          <Link className="button button-gold" href="/reservas">
            Reservar ahora <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="piercing-number" aria-hidden="true">
          <span>01</span>
          <strong>PERFORACIÓN</strong>
        </div>
      </section>

      <section className="history-teaser">
        <div className="history-logo">
          <Image
            src="/logo-delarosa-blanco.jpg"
            alt="Logo de DELAROSA"
            fill
            loading="eager"
            quality={70}
            sizes="(max-width: 800px) 88vw, 42vw"
          />
        </div>
        <div className="history-copy">
          <span className="kicker">Nuestra historia</span>
          <h2>Desde el 2003 formando parte de tus momentos.</h2>
          <p>
            Gracias por elegirnos para celebrar aniversarios, logros, regalos y
            recuerdos que duran para siempre.
          </p>
          <Link className="text-link" href="/nosotros">
            Conocé DELAROSA <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      <section className="location-teaser">
        <div>
          <span className="kicker kicker-light">Nuestra casa</span>
          <h2>Te esperamos en Encarnación.</h2>
          <p>Calle Estigarribia y Constitución, Encarnación, Paraguay.</p>
        </div>
        <a
          className="button button-outline-light"
          href={MAPS_URL}
          target="_blank"
          rel="noreferrer"
        >
          <MapPin size={17} /> Cómo llegar
        </a>
        <a
          className="button button-gold"
          href={whatsappHref(
            "Hola DELAROSA, quiero consultar el horario del local.",
          )}
          target="_blank"
          rel="noreferrer"
        >
          Consultar horario <ArrowUpRight size={17} />
        </a>
      </section>
    </>
  );
}
