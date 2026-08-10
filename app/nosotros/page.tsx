import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Gem, Heart, Sparkles } from "lucide-react";
import { MotionReveal } from "@/components/motion-reveal";
import {
  getAboutContent,
  getSiteSettings,
  type AboutContent,
} from "@/sanity/lib/site-content";

export const metadata = {
  title: "Dela Rosa Joyería: nuestra historia desde 2003",
  description:
    "Desde 2003, Dela Rosa acompaña los momentos especiales de Encarnación.",
  alternates: {
    canonical: "/nosotros",
  },
};

const valueIcons = {
  gem: Gem,
  heart: Heart,
  sparkles: Sparkles,
} satisfies Record<AboutContent["values"][number]["icon"], typeof Gem>;

export default async function AboutPage() {
  const [content, settings] = await Promise.all([
    getAboutContent(),
    getSiteSettings(),
  ]);

  const socialNetworks = [
    {
      name: "Instagram",
      className: "is-instagram",
      href: settings.instagramUrl,
      label: settings.instagramLabel,
      icon: "/instagram.svg",
      size: 28,
    },
    {
      name: "TikTok",
      className: "is-tiktok",
      href: settings.tiktokUrl,
      label: settings.tiktokLabel,
      icon: "/tiktok.svg",
      size: 28,
    },
    {
      name: "Facebook",
      className: "is-facebook",
      href: settings.facebookUrl,
      label: settings.facebookLabel,
      icon: "/facebook.svg",
      size: 30,
    },
  ];

  return (
    <>
      <MotionReveal
        as="section"
        className="about-hero"
        direction="none"
        observeOnly
      >
        <MotionReveal className="about-logo" direction="left" distance={34}>
          <div className="about-logo-frame">
            <Image
              src={content.heroImage.src}
              alt={content.heroImage.alt}
              fill
              priority
              sizes="(max-width: 820px) 86vw, 43vw"
            />
          </div>
          <span className="about-orbit about-orbit-one" aria-hidden="true" />
          <span className="about-orbit about-orbit-two" aria-hidden="true" />
          <span className="about-year-mark">
            <small>Desde</small>
            <strong>{content.foundingYear}</strong>
          </span>
        </MotionReveal>
        <MotionReveal
          className="about-copy"
          direction="right"
          delay={100}
          distance={34}
        >
          <span className="kicker">{content.kicker}</span>
          <h1>{content.title}</h1>
          <p>{content.description}</p>
          <div
            className="about-proof"
            role="group"
            aria-label="Trayectoria de Dela Rosa"
          >
            {content.proofPoints.map((point) => (
              <span key={point._key}>
                <strong>{point.value}</strong>
                <small>{point.label}</small>
              </span>
            ))}
          </div>
          <Link className="button button-dark" href="/productos">
            {content.buttonLabel} <ArrowUpRight size={17} />
          </Link>
        </MotionReveal>
      </MotionReveal>

      <section className="values-section">
        {content.values.map((value, index) => {
          const Icon = valueIcons[value.icon] ?? Gem;

          return (
            <MotionReveal
              as="article"
              key={value._key}
              delay={index * 80}
              distance={22}
            >
              <Icon size={25} />
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{value.title}</h2>
              <p>{value.description}</p>
            </MotionReveal>
          );
        })}
      </section>

      <section className="social-story">
        <MotionReveal className="social-story-heading" distance={22}>
          <span className="kicker kicker-light">{content.socialKicker}</span>
          <h2>{content.socialTitle}</h2>
        </MotionReveal>
        <div className="social-story-grid">
          {socialNetworks.map((network, index) => (
            <MotionReveal
              className="social-story-motion"
              key={network.name}
              delay={index * 80}
              distance={20}
            >
              <a
                className={`social-story-card ${network.className}`}
                href={network.href}
                target="_blank"
                rel="noreferrer"
              >
                <span className="social-story-icon">
                  <Image
                    src={network.icon}
                    alt=""
                    width={network.size}
                    height={network.size}
                  />
                </span>
                <span className="social-story-copy">
                  <small>{network.name}</small>
                  <strong>{network.label}</strong>
                </span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </MotionReveal>
          ))}
        </div>
      </section>
    </>
  );
}
