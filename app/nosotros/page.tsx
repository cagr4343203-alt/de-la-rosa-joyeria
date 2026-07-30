import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Gem, Heart, Sparkles } from "lucide-react";
import { INSTAGRAM_URL } from "@/lib/store";

export const metadata = {
  title: "Nuestra historia",
  description:
    "Desde 2003, DELAROSA acompaña los momentos especiales de Encarnación.",
};

export default function AboutPage() {
  return (
    <>
      <section className="about-hero">
        <div className="about-logo">
          <Image
            src="/logo-delarosa-negro.jpg"
            alt="Logo de DELAROSA"
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
            DELAROSA seleccionamos joyas, relojes y regalos con una atención
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
        <div>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
            @dela_rosajoyeria <ArrowUpRight size={17} />
          </a>
          <a
            href="https://www.instagram.com/delarosa.joyeria/"
            target="_blank"
            rel="noreferrer"
          >
            @delarosa.joyeria <ArrowUpRight size={17} />
          </a>
        </div>
      </section>
    </>
  );
}
