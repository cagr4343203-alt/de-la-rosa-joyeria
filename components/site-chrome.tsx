"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Gift,
  Home,
  MapPin,
  Menu,
  PackageSearch,
  ShoppingBag,
  UsersRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  INSTAGRAM_URL,
  MAPS_URL,
  whatsappHref,
} from "@/lib/store";
import { CartDrawer, useStore } from "./store-context";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/combos", label: "Combos" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/reservas", label: "Reserva" },
  { href: "/ubicacion", label: "Ubicación" },
];

const mobileItems = [
  { href: "/", label: "Inicio", Icon: Home },
  { href: "/productos", label: "Productos", Icon: PackageSearch },
  { href: "/reservas", label: "Reservar", Icon: CalendarDays, primary: true },
  { href: "/combos", label: "Combos", Icon: Gift },
  { href: "/nosotros", label: "Nosotros", Icon: UsersRound },
  { href: "/ubicacion", label: "Ubicación", Icon: MapPin },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { itemCount, setCartOpen } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const mobile = window.matchMedia("(max-width: 760px)").matches;
    const timer = window.setTimeout(
      () => setLoading(false),
      reduced ? 50 : mobile ? 320 : 620,
    );
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", menuOpen);
    return () => document.body.classList.remove("no-scroll");
  }, [menuOpen]);

  return (
    <>
      <div
        className={`site-loader ${loading ? "" : "is-hidden"}`}
        aria-hidden={!loading}
      >
        <Image
          src="/logo-delarosa-negro.jpg"
          alt="Dela Rosa Joyería y Relojería"
          width={220}
          height={220}
          priority
        />
        <span />
        <small>Preparando detalles exclusivos</small>
      </div>

      <div
        className="announcement"
        role="region"
        aria-label="Información destacada"
      >
        <div>
          <span>Desde 2003 formando parte de tus momentos</span>
          <i>✦</i>
          <span>Oro 18K · Plata 925 · Relojería</span>
          <i>✦</i>
          <span>Perforación de oreja con reserva</span>
          <i>✦</i>
          <span>Desde 2003 formando parte de tus momentos</span>
          <i>✦</i>
          <span>Oro 18K · Plata 925 · Relojería</span>
          <i>✦</i>
          <span>Perforación de oreja con reserva</span>
        </div>
      </div>

      <header className="site-header">
        <Link className="header-brand" href="/" aria-label="Dela Rosa, inicio">
          <Image
            src="/logo-delarosa-negro.jpg"
            alt=""
            width={58}
            height={58}
            priority
          />
          <span>
            <strong>DELA ROSA</strong>
            <small>Joyería · Relojería</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Navegación principal">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(pathname, item.href) ? "is-active" : ""}
              aria-current={
                isActive(pathname, item.href) ? "page" : undefined
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <div className="header-socials">
            <a
              className="brand-bubble instagram"
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram de Dela Rosa"
            >
              <Image src="/instagram.svg" alt="" width={18} height={18} />
            </a>
            <a
              className="brand-bubble whatsapp"
              href={whatsappHref(
                "Hola Dela Rosa, quiero consultar sobre sus productos.",
              )}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp de Dela Rosa"
            >
              <Image src="/whatsapp.svg" alt="" width={18} height={18} />
            </a>
          </div>
          <Link className="reserve-header" href="/reservas">
            <CalendarDays size={17} />
            Reservar perforación
          </Link>
          <button
            className="header-cart"
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`Abrir carrito, ${itemCount} productos`}
          >
            <ShoppingBag size={19} />
            <span>Carrito</span>
            <b>{itemCount}</b>
          </button>
          <button
            className="menu-toggle"
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      <aside
        className={`mobile-drawer ${menuOpen ? "is-open" : ""}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="mobile-drawer-head">
          <Link className="header-brand" href="/">
            <Image
              src="/logo-delarosa-negro.jpg"
              alt=""
              width={58}
              height={58}
            />
            <span>
              <strong>DELA ROSA</strong>
              <small>Joyería · Relojería</small>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>
        <nav>
          {navItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
            >
              <span>0{index + 1}</span>
              {item.label}
              <i>↗</i>
            </Link>
          ))}
        </nav>
      </aside>
      <button
        className={`menu-overlay ${menuOpen ? "is-visible" : ""}`}
        type="button"
        aria-label="Cerrar menú"
        onClick={() => setMenuOpen(false)}
        tabIndex={menuOpen ? 0 : -1}
      />

      <main className="site-main">{children}</main>

      <footer className="site-footer">
        <div className="footer-brand">
          <Image
            src="/logo-delarosa-negro.jpg"
            alt="Dela Rosa Joyería y Relojería"
            width={94}
            height={94}
          />
          <div>
            <strong>DELA ROSA</strong>
            <p>El detalle exclusivo para ese momento especial.</p>
          </div>
        </div>
        <div className="footer-links">
          <strong>Tienda</strong>
          <Link href="/productos">Productos</Link>
          <Link href="/combos">Combos</Link>
          <Link href="/reservas">Reservar perforación</Link>
          <Link href="/nosotros">Nuestra historia</Link>
        </div>
        <div className="footer-links">
          <strong>Contacto</strong>
          <a href={MAPS_URL} target="_blank" rel="noreferrer">
            Mariscal José Félix Estigarribia
          </a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
            @dela_rosajoyeria
          </a>
          <a
            href={whatsappHref("Hola Dela Rosa, quiero hacer una consulta.")}
            target="_blank"
            rel="noreferrer"
          >
            +595 985 720031
          </a>
        </div>
        <p className="footer-copy">
          © {new Date().getFullYear()} Dela Rosa · Encarnación, Paraguay
        </p>
      </footer>

      <div
        className="social-dock"
        role="group"
        aria-label="Contacto rápido"
      >
        <a
          className="social-pill whatsapp"
          href={whatsappHref("Hola Dela Rosa, quiero hacer una consulta.")}
          target="_blank"
          rel="noreferrer"
          aria-label="Consultar por WhatsApp"
        >
          <Image src="/whatsapp.svg" alt="" width={21} height={21} />
          <span>WhatsApp</span>
        </a>
        <a
          className="social-pill instagram"
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="Abrir Instagram"
        >
          <Image src="/instagram.svg" alt="" width={20} height={20} />
          <span>Instagram</span>
        </a>
      </div>

      <nav className="mobile-bottom-nav" aria-label="Navegación móvil">
        {mobileItems.map(({ href, label, Icon, primary }) => (
          <Link
            key={href}
            href={href}
            onClick={() => {
              if (href === "/" && pathname === "/") {
                window.scrollTo({ top: 0, behavior: "auto" });
              }
            }}
            className={`${primary ? "is-primary" : ""} ${
              isActive(pathname, href) ? "is-active" : ""
            }`}
            aria-current={isActive(pathname, href) ? "page" : undefined}
          >
            <span>
              <Icon size={20} />
            </span>
            <small>{label}</small>
          </Link>
        ))}
      </nav>

      <CartDrawer />
    </>
  );
}
