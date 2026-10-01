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
  Search,
  ShoppingBag,
  UsersRound,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { money, type Product, whatsappHref } from "@/lib/store";
import type { SiteSettings } from "@/sanity/lib/site-content";

import searchStyles from "./site-search.module.css";
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

const announcementItems = [
  "Desde 2003 formando parte de tus momentos",
  "Oro 18K · Plata 925 · Relojería",
  "Perforación de oreja con reserva",
];

const NAVIGATION_LOADER_DURATION_MS = 650;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function productSearchText(product: Product) {
  return normalizeSearch(
    [
      product.name,
      product.category,
      product.material,
      product.description,
      product.badge ?? "",
    ].join(" "),
  );
}

function productHref(product: Product) {
  const slug = product.growthSlug?.trim();

  if (slug) {
    return `/producto/${encodeURIComponent(slug)}`;
  }

  return "/productos";
}

export function SiteChrome({
  children,
  settings,
  products,
}: {
  children: React.ReactNode;
  settings: SiteSettings;
  products: Product[];
}) {
  const pathname = usePathname();
  const brandLogo = settings.logoUrl || "/logo.png";
  const { itemCount, setCartOpen } = useStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerScrollRef = useRef<HTMLDivElement>(null);
  const previousPathnameRef = useRef(pathname);
  const navigationPendingRef = useRef(false);
  const navigationHideTimerRef = useRef<number | undefined>(undefined);
  const navigationFallbackTimerRef = useRef<number | undefined>(undefined);

  const normalizedQuery = normalizeSearch(searchQuery);

  const searchResults = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    const terms = normalizedQuery.split(" ").filter(Boolean);

    return products
      .map((product) => {
        const haystack = productSearchText(product);

        if (!terms.every((term) => haystack.includes(term))) {
          return null;
        }

        const normalizedName = normalizeSearch(product.name);
        const normalizedCategory = normalizeSearch(product.category);
        const normalizedMaterial = normalizeSearch(product.material);

        let score = 0;

        if (normalizedName === normalizedQuery) score += 120;
        if (normalizedName.startsWith(normalizedQuery)) score += 80;
        if (normalizedName.includes(normalizedQuery)) score += 55;
        if (normalizedCategory.includes(normalizedQuery)) score += 30;
        if (normalizedMaterial.includes(normalizedQuery)) score += 25;

        score += terms.filter((term) => normalizedName.includes(term)).length * 12;
        score += terms.filter((term) => normalizedCategory.includes(term)).length * 6;
        score += terms.filter((term) => normalizedMaterial.includes(term)).length * 5;

        return { product, score };
      })
      .filter(
        (
          entry,
        ): entry is {
          product: Product;
          score: number;
        } => Boolean(entry),
      )
      .sort((left, right) => {
        if (right.score !== left.score) {
          return right.score - left.score;
        }

        return left.product.name.localeCompare(
          right.product.name,
          "es",
        );
      })
      .slice(0, 10)
      .map((entry) => entry.product);
  }, [normalizedQuery, products]);

  const suggestions = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    const candidates = new Map<string, string>();

    for (const product of products) {
      for (const value of [
        product.name,
        product.category,
        product.material,
      ]) {
        const cleanValue = value?.replace(/\s+/g, " ").trim();

        if (!cleanValue) continue;

        const key = normalizeSearch(cleanValue);

        if (!key || candidates.has(key)) continue;

        if (key.includes(normalizedQuery)) {
          candidates.set(key, cleanValue);
        }
      }
    }

    return Array.from(candidates.values())
      .sort((left, right) => {
        const leftValue = normalizeSearch(left);
        const rightValue = normalizeSearch(right);
        const leftStarts = leftValue.startsWith(normalizedQuery) ? 0 : 1;
        const rightStarts = rightValue.startsWith(normalizedQuery) ? 0 : 1;

        if (leftStarts !== rightStarts) {
          return leftStarts - rightStarts;
        }

        return left.length - right.length;
      })
      .slice(0, 5);
  }, [normalizedQuery, products]);

  useEffect(() => {
    document.documentElement.dataset.siteReady = "true";
    window.dispatchEvent(new Event("dela:site-ready"));
  }, []);

  useEffect(() => {
    if (previousPathnameRef.current === pathname) return;

    previousPathnameRef.current = pathname;
    setSearchOpen(false);
    setSearchQuery("");

    if (!navigationPendingRef.current) return;

    navigationPendingRef.current = false;
    window.clearTimeout(navigationFallbackTimerRef.current);

    navigationHideTimerRef.current = window.setTimeout(
      () => {
        setLoading(false);
        document.body.classList.remove("page-loading");
        document.documentElement.dataset.siteReady = "true";
        window.dispatchEvent(new Event("dela:site-ready"));
      },
      NAVIGATION_LOADER_DURATION_MS,
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
      setSearchOpen(false);
      setLoading(true);

      const samePage =
        nextUrl &&
        nextUrl.pathname === window.location.pathname;

      navigationFallbackTimerRef.current = window.setTimeout(
        finishFallback,
        samePage ? NAVIGATION_LOADER_DURATION_MS : 1600,
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

    return () => {
      document.body.classList.remove("menu-open");
    };
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

  useEffect(() => {
    if (!searchOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFrame = window.requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });

    const handleSearchKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleSearchKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", handleSearchKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [searchOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  };

  const openSearch = () => {
    setMenuOpen(false);
    setCartOpen(false);
    setSearchOpen(true);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <div
        className={`site-loader ${loading ? "" : "is-hidden"}`}
        aria-hidden={!loading}
        aria-live="polite"
        role="status"
      >
        <div className="site-loader-mark">
          <div className="site-loader-logo-shell">
            <img
              src={brandLogo}
              alt="Dela Rosa Joyería y Relojería"
              className="site-loader-logo-image"
              onError={(event) => {
                const image = event.currentTarget;

                if (!image.src.endsWith("/logo.png")) {
                  image.src = "/logo.png";
                }
              }}
            />
          </div>

          <span className="site-loader-line" />

          <small className="site-loader-copy">
            Preparando detalles exclusivos
          </small>
        </div>
      </div>

      <div
        className="announcement"
        role="region"
        aria-label={announcementItems.join(". ")}
      >
        <div className="announcement-track" aria-hidden="true">
          {[0, 1].map((groupIndex) => (
            <div className="announcement-group" key={groupIndex}>
              {announcementItems.map((item) => (
                <span className="announcement-item" key={item}>
                  <span>{item}</span>
                  <i>✦</i>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <header className="site-header">
        <Link className="header-brand" href="/" aria-label="Dela Rosa, inicio">
          <Image
            src={brandLogo}
            alt="Dela Rosa Joyería y Relojería"
            width={64}
            height={64}
            priority
          />
          <span>
            <strong>{settings.brandName}</strong>
            <small>{settings.brandTagline}</small>
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
          <button
            className={searchStyles.headerSearch}
            type="button"
            onClick={openSearch}
            aria-label="Buscar productos"
            aria-haspopup="dialog"
            aria-expanded={searchOpen}
          >
            <Search size={19} />
          </button>

          <div className="header-socials">
            <a
              className="brand-bubble instagram"
              href={settings.instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram de Dela Rosa"
            >
              <Image src="/instagram.svg" alt="" width={18} height={18} />
            </a>
            <a
              className="brand-bubble tiktok"
              href={settings.tiktokUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok de Dela Rosa"
            >
              <Image src="/tiktok.svg" alt="" width={18} height={18} />
            </a>
            <a
              className="brand-bubble whatsapp"
              href={whatsappHref(
                "Hola Dela Rosa, quiero consultar sobre sus productos.",
                settings.whatsappNumber,
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

      {searchOpen && (
        <div
          className={searchStyles.overlay}
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) {
              closeSearch();
            }
          }}
        >
          <section
            className={searchStyles.panel}
            role="dialog"
            aria-modal="true"
            aria-label="Buscar productos en Dela Rosa"
          >
            <div className={searchStyles.searchTop}>
              <div className={searchStyles.searchField}>
                <Search size={20} aria-hidden="true" />
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Buscar productos"
                  aria-label="Buscar productos"
                  autoComplete="off"
                  spellCheck={false}
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      searchInputRef.current?.focus();
                    }}
                    aria-label="Limpiar búsqueda"
                  >
                    <X size={17} />
                  </button>
                )}
              </div>

              <button
                className={searchStyles.closeButton}
                type="button"
                onClick={closeSearch}
                aria-label="Cerrar buscador"
              >
                <X size={21} />
              </button>
            </div>

            {!normalizedQuery ? (
              <div className={searchStyles.intro}>
                <span>Buscador Dela Rosa</span>
                <h2>Buscá por joya, reloj o categoría.</h2>
                <p>
                  Elegí un producto para entrar directamente a su ficha.
                </p>
              </div>
            ) : (
              <>
                <div className={searchStyles.scrollArea}>
                  <section className={searchStyles.section}>
                    <div className={searchStyles.sectionTitle}>
                      <span>Sugerencias</span>
                    </div>

                    <div className={searchStyles.suggestions}>
                      {suggestions.length ? (
                        suggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => {
                              setSearchQuery(suggestion);
                              searchInputRef.current?.focus();
                            }}
                          >
                            <Search size={15} />
                            <span>{suggestion}</span>
                          </button>
                        ))
                      ) : (
                        <p className={searchStyles.emptySuggestion}>
                          No hay sugerencias para esta búsqueda.
                        </p>
                      )}
                    </div>
                  </section>

                  <section className={searchStyles.section}>
                    <div className={searchStyles.sectionTitle}>
                      <span>Productos</span>
                      <small>
                        {searchResults.length}{" "}
                        {searchResults.length === 1
                          ? "resultado"
                          : "resultados"}
                      </small>
                    </div>

                    <div className={searchStyles.results}>
                      {searchResults.length ? (
                        searchResults.map((product) => (
                          <Link
                            key={String(product.id)}
                            className={searchStyles.productResult}
                            href={productHref(product)}
                            onClick={() => {
                              setSearchOpen(false);
                              setSearchQuery("");
                            }}
                          >
                            <div className={searchStyles.productImage}>
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                sizes="76px"
                                style={{
                                  objectFit: product.imageFit ?? "contain",
                                  objectPosition:
                                    product.imagePosition ?? "center",
                                }}
                              />
                            </div>

                            <div className={searchStyles.productCopy}>
                              <span>
                                {product.category} · {product.material}
                              </span>
                              <strong>{product.name}</strong>
                              <small>
                                {product.status === "outOfStock"
                                  ? "Agotado"
                                  : product.price > 0
                                    ? money(product.price)
                                    : "Consultar precio"}
                              </small>
                            </div>

                            <ArrowUpRight
                              className={searchStyles.productArrow}
                              size={18}
                              aria-hidden="true"
                            />
                          </Link>
                        ))
                      ) : (
                        <div className={searchStyles.emptyResults}>
                          <Search size={24} />
                          <strong>No encontramos productos</strong>
                          <span>
                            Probá con otro nombre, categoría o material.
                          </span>
                        </div>
                      )}
                    </div>
                  </section>
                </div>

                <div className={searchStyles.footer}>
                  <Link
                    href="/productos"
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    Ver todos los productos
                    <ArrowUpRight size={17} />
                  </Link>
                </div>
              </>
            )}
          </section>
        </div>
      )}

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
              src={brandLogo}
              alt="Dela Rosa Joyería y Relojería"
              width={58}
              height={58}
            />
            <span>
              <strong>{settings.brandName}</strong>
              <small>{settings.brandTagline}</small>
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
                  settings.whatsappNumber,
                )}
                target="_blank"
                rel="noreferrer"
              >
                <Image src="/whatsapp.svg" alt="" width={17} height={17} />
                WhatsApp
              </a>

              <a
                className="mobile-drawer-contact is-instagram"
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Image src="/instagram.svg" alt="" width={17} height={17} />
                Instagram
              </a>

              <a
                className="mobile-drawer-contact is-tiktok"
                href={settings.tiktokUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Image src="/tiktok.svg" alt="" width={17} height={17} />
                TikTok
              </a>

              <a
                className="mobile-drawer-contact is-facebook"
                href={settings.facebookUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Image src="/facebook.svg" alt="" width={17} height={17} />
                Facebook
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
            src={brandLogo}
            alt="Dela Rosa Joyería y Relojería"
            width={94}
            height={94}
          />
          <div>
            <strong>{settings.brandName}</strong>
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

          <a href={settings.mapsUrl} target="_blank" rel="noreferrer">
            {settings.address}
          </a>

          <a href={settings.instagramUrl} target="_blank" rel="noreferrer">
            {settings.instagramLabel}
          </a>

          <a
            href={whatsappHref(
              "Hola Dela Rosa, quiero hacer una consulta.",
              settings.whatsappNumber,
            )}
            target="_blank"
            rel="noreferrer"
          >
            {settings.phone}
          </a>
        </div>

        <p className="footer-copy">
          <span>
            © {new Date().getFullYear()} Dela Rosa · Encarnación, Paraguay
          </span>
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
          href={whatsappHref(
            "Hola Dela Rosa, quiero hacer una consulta.",
            settings.whatsappNumber,
          )}
          target="_blank"
          rel="noreferrer"
          aria-label="Consultar por WhatsApp"
        >
          <Image src="/whatsapp.svg" alt="" width={21} height={21} />
          <span>WhatsApp</span>
        </a>

        <a
          className="social-pill instagram"
          href={settings.instagramUrl}
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
