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
import { MAPS_URL, whatsappHref } from "@/lib/store";
import { LOCAL_BUSINESS_JSON_LD } from "@/lib/seo";
import {
  getHomePage,
  type HomeServiceIcon,
} from "@/sanity/lib/homepage";
import { getProducts } from "@/sanity/lib/products";

const serviceIcons = {
  gem: Gem,
  watch: Watch,
  gift: Gift,
  calendar: CalendarDays,
} satisfies Record<HomeServiceIcon, typeof Gem>;

export default async function Home() {
  const [products, home] = await Promise.all([getProducts(), getHomePage()]);
  const productsById = new Map(
    products.map((product) => [String(product.id), product]),
  );
  const selectedFeatured = home.featured.productIds
    .map((id) => productsById.get(id))
    .filter((product) => product !== undefined);
  const featured = selectedFeatured.length
    ? selectedFeatured.slice(0, 4)
    : products.slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(LOCAL_BUSINESS_JSON_LD).replace(/</g, "\\u003c"),
        }}
      />
      <MotionReveal
        as="section"
        className="home-hero"
        direction="none"
        observeOnly
      >
        <div className="hero-copy">
          <span className="kicker kicker-light">
            {home.hero.kicker}
          </span>
          <h1>
            {home.hero.title}
            <em>{home.hero.emphasis}</em>
          </h1>
          <p>{home.hero.description}</p>
          <div className="hero-actions">
            <Link className="button button-gold" href="/productos">
              {home.hero.primaryActionLabel} <ArrowUpRight size={17} />
            </Link>
            <Link className="button button-outline-light" href="/reservas">
              <CalendarDays size={17} /> {home.hero.secondaryActionLabel}
            </Link>
          </div>
          <div className="hero-trust">
            <span>
              <Gem size={17} />
              {home.hero.trustFirst}
            </span>
            <span>
              <ShieldCheck size={17} />
              {home.hero.trustSecond}
            </span>
          </div>
        </div>

        <div className="hero-gallery">
          <div className="hero-halo" />
          <figure className="hero-photo hero-photo-main">
            <Image
              src={home.hero.mainImage.src}
              alt={home.hero.mainImage.alt}
              fill
              priority
              sizes="(max-width: 900px) 76vw, 36vw"
            />
          </figure>
          <figure className="hero-photo hero-photo-small">
            <Image
              src={home.hero.secondaryImage.src}
              alt={home.hero.secondaryImage.alt}
              fill
              priority
              sizes="(max-width: 900px) 45vw, 20vw"
            />
          </figure>
          <Link className="hero-reserve-card" href="/reservas">
            <span>{home.hero.reserveEyebrow}</span>
            <strong>{home.hero.reserveTitle}</strong>
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
        {home.services.items.map((service) => {
          const Icon = serviceIcons[service.icon] ?? Gem;
          return (
            <article key={service._key}>
              <Icon size={24} />
              <div>
                <strong>{service.title}</strong>
                <span>{service.description}</span>
              </div>
            </article>
          );
        })}
      </MotionReveal>

      <section className="home-section category-section">
        <MotionReveal className="section-heading" distance={24}>
          <div>
            <span className="kicker">{home.categories.kicker}</span>
            <h2>{home.categories.title}</h2>
          </div>
          <Link className="text-link" href="/productos">
            {home.categories.linkLabel} <ArrowUpRight size={16} />
          </Link>
        </MotionReveal>
        <div className="category-grid">
          {home.categories.cards.map((card, index) => (
            <MotionReveal
              key={card._key}
              className="category-card-motion"
              delay={index * 60}
              distance={26}
            >
              <Link
                className="category-card"
                href={`/productos?categoria=${encodeURIComponent(card.category)}`}
              >
                <Image
                  src={card.image.src}
                  alt={card.image.alt}
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
            <span className="kicker">{home.featured.kicker}</span>
            <h2>{home.featured.title}</h2>
          </div>
          <p>{home.featured.description}</p>
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
          <span className="kicker kicker-light">{home.piercing.kicker}</span>
          <h2>{home.piercing.title}</h2>
          <p>{home.piercing.description}</p>
          <div className="piercing-points">
            <span>
              <Clock3 size={18} /> {home.piercing.firstPoint}
            </span>
            <span>
              <ShieldCheck size={18} /> {home.piercing.secondPoint}
            </span>
          </div>
          <Link className="button button-gold" href="/reservas">
            {home.piercing.buttonLabel} <ArrowUpRight size={17} />
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
            src={home.piercing.image.src}
            alt={home.piercing.image.alt}
            fill
            sizes="(max-width: 900px) 82vw, 32vw"
          />
          <figcaption>
            <span>{home.piercing.captionEyebrow}</span>
            <strong>{home.piercing.captionTitle}</strong>
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
            src={home.history.image.src}
            alt={home.history.image.alt}
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
          <span className="kicker">{home.history.kicker}</span>
          <h2>{home.history.title}</h2>
          <p>{home.history.description}</p>
          <Link className="text-link" href="/nosotros">
            {home.history.linkLabel} <ArrowUpRight size={16} />
          </Link>
        </MotionReveal>
      </section>

      <MotionReveal
        as="section"
        className="location-teaser"
        distance={24}
      >
        <div>
          <span className="kicker kicker-light">{home.location.kicker}</span>
          <h2>{home.location.title}</h2>
          <p>{home.location.description}</p>
        </div>
        <a
          className="button button-outline-light"
          href={MAPS_URL}
          target="_blank"
          rel="noreferrer"
        >
          <MapPin size={17} /> {home.location.mapLabel}
        </a>
        <a
          className="button button-gold"
          href={whatsappHref(
            "Hola Dela Rosa, quiero consultar el horario del local.",
          )}
          target="_blank"
          rel="noreferrer"
        >
          {home.location.whatsappLabel} <ArrowUpRight size={17} />
        </a>
      </MotionReveal>
    </>
  );
}
