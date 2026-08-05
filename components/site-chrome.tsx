"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
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
import { useEffect, useRef, useState } from "react";
import {
  INSTAGRAM_URL,
  MAPS_URL,
  whatsappHref,
} from "@/lib/store";
import { CartDrawer, useStore } from "./store-context";

const navItems = [
  { href: "/", label: "Inicio", hint: "Descubrí Dela Rosa" },
  { href: "/productos", label: "Productos", hint: "Joyas, relojes y regalos" },
  { href: "/combos", label: "Combos", hint: "Detalles listos para regalar" },
  { href: "/nosotros", label: "Nosotros", hint: "Nuestra historia desde 2003" },
  { href: "/reservas", label: "Reserva", hint: "Agendá tu perforación" },
  { href: "/ubicacion", label: "Ubicación", hint: "Cómo llegar y horarios" },
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
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerScrollRef = useRef<HTMLDivElement>(null);
  const previousPathnameRef = useRef(pathname);
  const navigationPendingRef = useRef(false);
  const navigationHideTimerRef = useRef<number | undefined>(undefined);
  const navigationFallbackTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const mobile = window.matchMedia("(max-width: 760px)").matches;
    let readyTimer: number | undefined;
    const timer = window.setTimeout(
      () => {
        setLoading(false);
        readyTimer = window.setTimeout(
          () => {
            document.documentElement.dataset.siteReady = "true";
            window.dispatchEvent(new Event("dela:site-ready"));
          },
          reduced ? 20 : 300,
        );
      },
      reduced ? 50 : mobile ? 320 : 620,
    );
    return () => {
      window.clearTimeout(timer);
      if (readyTimer !== undefined) window.clearTimeout(readyTimer);
    };
  }, []);

  useEffect(() => {
    if (previousPathnameRef.current === pathname) return;

    previousPathnameRef.current = pathname;
    if (!navigationPendingRef.current) return;

    navigationPendingRef.current = false;
    window.clearTimeout(navigationFallbackTimerRef.current);

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const mobile = window.matchMedia("(max-width: 760px)").matches;

    navigationHideTimerRef.current = window.setTimeout(
      () => {
        setLoading(false);
        document.body.classList.remove("page-loading");
        document.documentElement.dataset.siteReady = "true";
        window.dispatchEvent(new Event("dela:site-ready"));
      },
      reduced ? 20 : mobile ? 260 : 380,
    );
  }, [pathname]);

  useEffect(() => {
    const finishFallback = () => {
      navigationPendingRef.current = false;
      setLoading(false);
      document.body.classList.remove("page-loading");
      document.documentElement.dataset.siteReady = "true";
      window.dispatchEvent(new Event("dela:site-ready"));
    };

    const beginNavigation = (nextUrl?: URL) => {
      window.clearTimeout(navigationHideTimerRef.current);
      window.clearTimeout(navigationFallbackTimerRef.current);

      navigationPendingRef.current = true;
      document.documentElement.dataset.siteReady = "false";
      document.body.classList.add("page-loading");
      setMenuOpen(false);
      setLoading(true);

      const samePage =
        nextUrl &&
        nextUrl.pathname === window.location.pathname;
      navigationFallbackTimerRef.current = window.setTimeout(
        finishFallback,
        samePage ? 480 : 2500,
      );
    };

    const handleInternalLink = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (
        !anchor ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      ) {
        return;
      }

      const nextUrl = new URL(anchor.href, window.location.href);
      if (nextUrl.origin !== window.location.origin) return;

      const currentUrl = new URL(window.location.href);
      const isNavigationPanelLink = Boolean(
        anchor.closest(
          ".desktop-nav, .mobile-drawer nav, .mobile-bottom-nav",
        ),
      );
      const isCurrentUrl =
        nextUrl.pathname === currentUrl.pathname &&
        nextUrl.search === currentUrl.search;

      if (isCurrentUrl && !isNavigationPanelLink) {
        return;
      }

      beginNavigation(nextUrl);
    };

    const handleHistoryNavigation = () => beginNavigation();

    document.addEventListener("click", handleInternalLink, true);
    window.addEventListener("popstate", handleHistoryNavigation);

    return () => {
      document.removeEventListener("click", handleInternalLink, true);
      window.removeEventListener("popstate", handleHistoryNavigation);
      window.clearTimeout(navigationHideTimerRef.current);
      window.clearTimeout(navigationFallbackTimerRef.current);
      document.body.classList.remove("page-loading");
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    drawerScrollRef.current?.scrollTo({ top: 0 });

    const focusFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
        return;
      }

      if (event.key !== "Tab") return;

      const drawer = drawerRef.current;
      if (!drawer) return;

      const focusable = Array.from(
        drawer.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !drawer.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  };

  return (
    <>
      <div
        className={`site-loader ${loading ? "" : "is-hidden"}`}
        aria-hidden={!loading}
        aria-live="polite"
        role="status"
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
            ref={menuButtonRef}
            aria-label="Abrir menú"
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      <div
        id="mobile-navigation"
        ref={drawerRef}
        className={`mobile-drawer ${menuOpen ? "is-open" : ""}`}
        aria-hidden={!menuOpen}
        aria-label="Menú de navegación"
        aria-modal="true"
        inert={!menuOpen}
        role="dialog"
      >
        <div className="mobile-drawer-head">
          <Link
            className="header-brand"
            href="/"
            aria-label="Dela Rosa, inicio"
            onClick={() => setMenuOpen(false)}
          >
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
            onClick={closeMenu}
            ref={closeButtonRef}
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mobile-drawer-scroll" ref={drawerScrollRef}>
          <div className="mobile-drawer-intro">
            <span>Menú principal</span>
            <p>El detalle exclusivo para ese momento especial.</p>
          </div>

          <nav aria-label="Navegación móvil">
            {navItems.map((item, index) => {
              const active = isActive(pathname, item.href);
              const reserve = item.href === "/reservas";

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${active ? "is-active" : ""} ${
                    reserve ? "is-reserve" : ""
                  }`}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="mobile-drawer-index">0{index + 1}</span>
                  <span className="mobile-drawer-link-copy">
                    <strong>{item.label}</strong>
                    <small>{item.hint}</small>
                  </span>
                  <span className="mobile-drawer-arrow" aria-hidden="true">
                    <ArrowUpRight size={16} strokeWidth={1.7} />
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="mobile-drawer-footer">
            <p>
              <strong>¿Necesitás ayuda?</strong>
              Te asesoramos de forma personalizada.
            </p>
            <div>
              <a
                className="mobile-drawer-contact is-whatsapp"
                href={whatsappHref(
                  "Hola Dela Rosa, quiero consultar sobre sus productos.",
                )}
                target="_blank"
                rel="noreferrer"
              >
                <Image src="/whatsapp.svg" alt="" width={17} height={17} />
                WhatsApp
              </a>
              <a
                className="mobile-drawer-contact is-instagram"
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
              >
                <Image src="/instagram.svg" alt="" width={17} height={17} />
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
      <button
        className={`menu-overlay ${menuOpen ? "is-visible" : ""}`}
        type="button"
        aria-hidden="true"
        onClick={closeMenu}
        tabIndex={-1}
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
          <span>© {new Date().getFullYear()} Dela Rosa · Encarnación, Paraguay</span>
          <span className="footer-credit">
            Desarrollado por{" "}
            <a
              href="https://www.growthagency.space/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Growth Agency
            </a>
          </span>
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
