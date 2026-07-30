import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Gem, Heart, Sparkles } from "lucide-react";
import { MotionReveal } from "@/components/motion-reveal";
import { FACEBOOK_URL, INSTAGRAM_URL, TIKTOK_URL } from "@/lib/store";

export const metadata = {
  title: "Nuestra historia",
  description:
    "Desde 2003, Dela Rosa acompaña los momentos especiales de Encarnación.",
};

export default function AboutPage() {
  return (
    <>
      <MotionReveal
        as="section"
        className="about-hero"
        direction="none"
        observeOnly
      >
        <MotionReveal
          className="about-logo"
          direction="left"
          distance={34}
        >
          <div className="about-logo-frame">
            <Image
              src="/logo-delarosa-negro.jpg"
              alt="Logo de Dela Rosa"
              fill
              priority
              sizes="(max-width: 820px) 86vw, 43vw"
            />
          </div>
          <span className="about-orbit about-orbit-one" aria-hidden="true" />
          <span className="about-orbit about-orbit-two" aria-hidden="true" />
          <span className="about-year-mark">
            <small>Desde</small>
            <strong>2003</strong>
          </span>
        </MotionReveal>
        <MotionReveal
          className="about-copy"
          direction="right"
          delay={100}
          distance={34}
        >
          <span className="kicker">Nuestra historia</span>
          <h1>Desde el 2003 formando parte de tus momentos.</h1>
          <p>
            Gracias por elegirnos para convertir un detalle en un recuerdo. En
            Dela Rosa seleccionamos joyas, relojes y regalos con una atención
            cercana y personalizada.
          </p>
          <div
            className="about-proof"
            role="group"
            aria-label="Trayectoria de Dela Rosa"
          >
            <span>
              <strong>+20 años</strong>
              <small>acompañando momentos</small>
            </span>
            <span>
              <strong>Encarnación</strong>
              <small>nuestra casa</small>
            </span>
          </div>
          <Link className="button button-dark" href="/productos">
            Conocer productos <ArrowUpRight size={17} />
          </Link>
        </MotionReveal>
      </MotionReveal>

      <section className="values-section">
        <MotionReveal as="article" distance={22}>
          <Gem size={25} />
          <span>01</span>
          <h2>Selección</h2>
          <p>Piezas elegidas para celebrar momentos únicos.</p>
        </MotionReveal>
        <MotionReveal as="article" delay={80} distance={22}>
          <Heart size={25} />
          <span>02</span>
          <h2>Cercanía</h2>
          <p>Te acompañamos a encontrar el detalle indicado.</p>
        </MotionReveal>
        <MotionReveal as="article" delay={160} distance={22}>
          <Sparkles size={25} />
          <span>03</span>
          <h2>Experiencia</h2>
          <p>Más de dos décadas formando parte de Encarnación.</p>
        </MotionReveal>
      </section>

      <section className="social-story">
        <MotionReveal className="social-story-heading" distance={22}>
          <span className="kicker kicker-light">Seguinos</span>
          <h2>Descubrí novedades y piezas recién llegadas.</h2>
        </MotionReveal>
        <div className="social-story-grid">
          <MotionReveal
            className="social-story-motion"
            delay={0}
            distance={20}
          >
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
          </MotionReveal>
          <MotionReveal
            className="social-story-motion"
            delay={80}
            distance={20}
          >
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
          </MotionReveal>
          <MotionReveal
            className="social-story-motion"
            delay={160}
            distance={20}
          >
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
          </MotionReveal>
        </div>
      </section>
    </>
  );
}
