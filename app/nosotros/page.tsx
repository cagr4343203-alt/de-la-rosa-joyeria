import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Gem, Heart, Sparkles } from "lucide-react";
import { FACEBOOK_URL, INSTAGRAM_URL, TIKTOK_URL } from "@/lib/store";

export const metadata = {
  title: "Nuestra historia",
  description:
    "Desde 2003, Dela Rosa acompaña los momentos especiales de Encarnación.",
};

export default function AboutPage() {
  return (
    <>
      <section className="about-hero">
        <div className="about-logo">
          <Image
            src="/logo-delarosa-negro.jpg"
            alt="Logo de Dela Rosa"
            fill
            priority
            sizes="(max-width: 820px) 86vw, 43vw"
          />
        </div>
        <div className="about-copy">
          <span className="kicker">Nuestra historia</span>
          <h1>Desde el 2003 formando parte de tus momentos.</h1>
          <p>
            Gracias por elegirnos para convertir un detalle en un recuerdo. En
            Dela Rosa seleccionamos joyas, relojes y regalos con una atención
            cercana y personalizada.
          </p>
          <Link className="button button-dark" href="/productos">
            Conocer productos <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>

      <section className="values-section">
        <article>
          <Gem size={25} />
          <span>01</span>
          <h2>Selección</h2>
          <p>Piezas elegidas para celebrar momentos únicos.</p>
        </article>
        <article>
          <Heart size={25} />
          <span>02</span>
          <h2>Cercanía</h2>
          <p>Te acompañamos a encontrar el detalle indicado.</p>
        </article>
        <article>
          <Sparkles size={25} />
          <span>03</span>
          <h2>Experiencia</h2>
          <p>Más de dos décadas formando parte de Encarnación.</p>
        </article>
      </section>

      <section className="social-story">
        <span className="kicker kicker-light">Seguinos</span>
        <h2>Descubrí novedades y piezas recién llegadas.</h2>
        <div className="social-story-grid">
          <a
            className="social-story-card is-instagram"
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
          >
            <span className="social-story-icon">
              <Image src="/instagram.svg" alt="" width={28} height={28} />
            </span>
            <span className="social-story-copy">
              <small>Instagram</small>
              <strong>@dela_rosajoyeria</strong>
            </span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <a
            className="social-story-card is-tiktok"
            href={TIKTOK_URL}
            target="_blank"
            rel="noreferrer"
          >
            <span className="social-story-icon">
              <Image src="/tiktok.svg" alt="" width={28} height={28} />
            </span>
            <span className="social-story-copy">
              <small>TikTok</small>
              <strong>@delarosa.joyeria</strong>
            </span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <a
            className="social-story-card is-facebook"
            href={FACEBOOK_URL}
            target="_blank"
            rel="noreferrer"
          >
            <span className="social-story-icon">
              <Image src="/facebook.svg" alt="" width={30} height={30} />
            </span>
            <span className="social-story-copy">
              <small>Facebook</small>
              <strong>Dela Rosa Joyería</strong>
            </span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      </section>
    </>
  );
}
