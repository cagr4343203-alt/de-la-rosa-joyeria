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
  Watch,
} from "lucide-react";
import { MotionReveal } from "@/components/motion-reveal";
import { ProductCard } from "@/components/product-card";
import { MAPS_URL, STORE_ADDRESS, whatsappHref } from "@/lib/store";
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
    image: "/products/gifts/bombilla-04.jpg",
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
      <MotionReveal
        as="section"
        className="home-hero"
        direction="none"
        observeOnly
      >
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
              alt="Anillos de Dela Rosa"
              fill
              priority
              sizes="(max-width: 900px) 76vw, 36vw"
            />
          </figure>
          <figure className="hero-photo hero-photo-small">
            <Image
              src="/products/05-pulsera.jpg"
              alt="Pulsera de Dela Rosa"
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
      </MotionReveal>

      <MotionReveal
        as="section"
        className="service-band"
        aria-label="Servicios destacados"
        distance={22}
      >
        <article>
          <Gem size={24} />
          <div>
            <strong>Joyas seleccionadas</strong>
            <span>Oro 18K, plata y enchapados</span>
          </div>
        </article>

        <article>
          <Watch size={24} />
          <div>
            <strong>Relojes</strong>
            <span>Modelos clásicos y contemporáneos</span>
          </div>
        </article>

        <article>
          <Gift size={24} />
          <div>
            <strong>Regalos especiales</strong>
            <span>Bombillas, bolígrafos y más detalles</span>
          </div>
        </article>

        <article>
          <CalendarDays size={24} />
          <div>
            <strong>Perforación de oreja</strong>
            <span>Reservá fecha y horario por WhatsApp</span>
          </div>
        </article>
      </MotionReveal>

      <section className="home-section category-section">
        <MotionReveal className="section-heading" distance={24}>
          <div>
            <span className="kicker">Comprar por categoría</span>
            <h2>Encontrá ese detalle especial</h2>
          </div>
          <Link className="text-link" href="/productos">
            Ver todo el catálogo <ArrowUpRight size={16} />
          </Link>
        </MotionReveal>
        <div className="category-grid">
          {categoryCards.map((card, index) => (
            <MotionReveal
              key={card.title}
              className="category-card-motion"
              delay={index * 60}
              distance={26}
            >
              <Link
                className="category-card"
                href={`/productos?categoria=${encodeURIComponent(card.title)}`}
              >
                <Image
                  src={card.image}
                  alt=""
                  fill
                  loading="lazy"
                  quality={70}
                  sizes="(max-width: 700px) 50vw, (max-width: 1100px) 50vw, 25vw"
                />
                <span>{card.eyebrow}</span>
                <h3>{card.title}</h3>
                <i>
                  <ArrowUpRight size={18} />
                </i>
              </Link>
            </MotionReveal>
          ))}
        </div>
      </section>

      <section className="home-section featured-section">
        <MotionReveal className="section-heading" distance={24}>
          <div>
            <span className="kicker">Selección Dela Rosa</span>
            <h2>Productos destacados</h2>
          </div>
          <p>
            Agregá tus favoritos al carrito o consultá la disponibilidad
            directamente por WhatsApp.
          </p>
        </MotionReveal>
        <div className="featured-grid">
          {featured.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              motionIndex={index}
            />
          ))}
        </div>
      </section>

      <section className="piercing-cta">
        <MotionReveal
          className="piercing-copy"
          direction="left"
          distance={34}
        >
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
        </MotionReveal>
        <MotionReveal
          as="figure"
          className="piercing-showcase"
          direction="scale"
          delay={120}
          distance={20}
        >
          <Image
            src="/products/piercing-reference-client.png"
            alt="Perforación de oreja realizada con aros plateados"
            fill
            sizes="(max-width: 900px) 82vw, 32vw"
          />
          <figcaption>
            <span>Servicio con reserva</span>
            <strong>Inspiración para tu próximo estilo</strong>
          </figcaption>
        </MotionReveal>
      </section>

      <section className="history-teaser">
        <MotionReveal
          className="history-logo"
          direction="left"
          distance={34}
        >
          <Image
            src="/logo-delarosa-blanco.jpg"
            alt="Logo de Dela Rosa"
            fill
            loading="lazy"
            quality={70}
            sizes="(max-width: 800px) 88vw, 42vw"
          />
        </MotionReveal>
        <MotionReveal
          className="history-copy"
          direction="right"
          delay={100}
          distance={34}
        >
          <span className="kicker">Nuestra historia</span>
          <h2>Desde el 2003 formando parte de tus momentos.</h2>
          <p>
            Gracias por elegirnos para celebrar aniversarios, logros, regalos y
            recuerdos que duran para siempre.
          </p>
          <Link className="text-link" href="/nosotros">
            Conocé Dela Rosa <ArrowUpRight size={16} />
          </Link>
        </MotionReveal>
      </section>

      <MotionReveal
        as="section"
        className="location-teaser"
        distance={24}
      >
        <div>
          <span className="kicker kicker-light">Nuestra casa</span>
          <h2>Te esperamos en Encarnación.</h2>
          <p>{STORE_ADDRESS}.</p>
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
            "Hola Dela Rosa, quiero consultar el horario del local.",
          )}
          target="_blank"
          rel="noreferrer"
        >
          Consultar horario <ArrowUpRight size={17} />
        </a>
      </MotionReveal>
    </>
  );
}
