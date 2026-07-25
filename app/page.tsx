"use client";

import { useEffect, useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  material: string;
  price: number;
  image: string;
  badge?: string;
  description: string;
};

type CartLine = Product & { quantity: number };

const WHATSAPP_NUMBER = "595985720031";
const INSTAGRAM_URL = "https://www.instagram.com/dela_rosajoyeria/";
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Calle+Estigarribia+y+Constitucion+Encarnacion+Paraguay";

const products: Product[] = [
  {
    id: 1,
    name: "Cadena Espíritu Santo",
    category: "Cadenas",
    material: "Oro 18K",
    price: 1350000,
    image: "/products/01-cadena-angel.jpg",
    badge: "Nueva",
    description: "Cadena delicada con dije simbólico y terminación luminosa.",
  },
  {
    id: 2,
    name: "Argollas Trenzadas",
    category: "Aros",
    material: "Oro 18K",
    price: 980000,
    image: "/products/03-anillos.jpg",
    badge: "Favorita",
    description: "Argollas livianas con detalle trenzado para todos los días.",
  },
  {
    id: 3,
    name: "Solitario Lumière",
    category: "Anillos",
    material: "Plata Gold",
    price: 425000,
    image: "/products/06-joya.jpg",
    badge: "Destacado",
    description: "Anillo de brillo central, clásico y delicado.",
  },
  {
    id: 4,
    name: "Pulsera Cœurs",
    category: "Pulseras",
    material: "Plata 925",
    price: 350000,
    image: "/products/05-pulsera.jpg",
    description: "Corazones engastados y destellos que acompañan cada gesto.",
  },
  {
    id: 5,
    name: "Collar Éclat",
    category: "Cadenas",
    material: "Enchapado",
    price: 380000,
    image: "/products/07-destello.jpg",
    badge: "Edición especial",
    description: "Collar protagonista de discos dorados con textura satinada.",
  },
  {
    id: 6,
    name: "Collar Mariposa",
    category: "Cadenas",
    material: "Plata Gold",
    price: 295000,
    image: "/products/08-coleccion.jpg",
    description: "Mariposa de nácar con cadena regulable y doble detalle.",
  },
  {
    id: 7,
    name: "Huggies Clásicos",
    category: "Aros",
    material: "Oro 18K",
    price: 720000,
    image: "/products/04-aros.jpg",
    description: "Aros compactos, cómodos y versátiles para combinar.",
  },
  {
    id: 8,
    name: "Set Serena",
    category: "Sets",
    material: "Plata 925",
    price: 470000,
    image: "/products/09-plata.jpg",
    badge: "Para regalar",
    description: "Un set armónico pensado para regalar o regalarte.",
  },
  {
    id: 9,
    name: "Reloj Signature",
    category: "Relojes",
    material: "Acero",
    price: 890000,
    image: "/products/10-reloj.jpg",
    description: "Diseño elegante con caja de acero y lectura limpia.",
  },
  {
    id: 10,
    name: "Dije Destello",
    category: "Dijes",
    material: "Oro 18K",
    price: 1100000,
    image: "/products/11-oro.jpg",
    description: "Una pieza de oro con brillo sutil para llevar siempre.",
  },
];

const categories = [
  "Todo",
  "Anillos",
  "Aros",
  "Cadenas",
  "Pulseras",
  "Sets",
  "Relojes",
];

function money(value: number) {
  return `Gs. ${new Intl.NumberFormat("es-PY").format(value)}`;
}

function whatsappHref(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Todo");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1650);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem("delarosa-cart");
    if (!saved) return;
    try {
      setCart(JSON.parse(saved) as CartLine[]);
    } catch {
      window.localStorage.removeItem("delarosa-cart");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("delarosa-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", cartOpen || menuOpen);
    return () => document.body.classList.remove("no-scroll");
  }, [cartOpen, menuOpen]);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return products.filter((product) => {
      const categoryMatches =
        activeCategory === "Todo" || product.category === activeCategory;
      const queryMatches =
        !normalized ||
        `${product.name} ${product.category} ${product.material}`
          .toLowerCase()
          .includes(normalized);
      return categoryMatches && queryMatches;
    });
  }, [activeCategory, query]);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  function addToCart(product: Product) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function changeQuantity(id: number, difference: number) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + difference }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  const orderMessage = [
    "Hola De la Rosa ✨ Quiero consultar por este pedido:",
    "",
    ...cart.map(
      (item) =>
        `• ${item.quantity} × ${item.name} (${item.material}) — ${money(
          item.price * item.quantity,
        )}`,
    ),
    "",
    `Total referencial: ${money(total)}`,
    "",
    "¿Me confirman disponibilidad y precio final, por favor?",
  ].join("\n");

  return (
    <>
      <div
        className={`loader ${loading ? "" : "loader--hidden"}`}
        aria-hidden={!loading}
      >
        <img
          className="loader__logo"
          src="/logo.png"
          alt="De la Rosa Joyería y Relojería"
        />
        <span className="loader__line" />
        <small>Preparando una experiencia brillante</small>
      </div>

      <div className={`site-shell ${loading ? "site-shell--loading" : ""}`}>
        <div className="marquee" aria-label="Información destacada">
          <div className="marquee__track">
            <span>Oro 18K</span>
            <i>✦</i>
            <span>Plata 925</span>
            <i>✦</i>
            <span>Relojería</span>
            <i>✦</i>
            <span>Atención personalizada</span>
            <i>✦</i>
            <span>Envíos a todo el país</span>
            <i>✦</i>
            <span>Oro 18K</span>
            <i>✦</i>
            <span>Plata 925</span>
            <i>✦</i>
            <span>Relojería</span>
            <i>✦</i>
            <span>Atención personalizada</span>
            <i>✦</i>
            <span>Envíos a todo el país</span>
          </div>
        </div>

        <header className="header">
          <a className="brand" href="#inicio" aria-label="De la Rosa, inicio">
            <img className="brand__logo" src="/logo.png" alt="" />
            <span>
              <strong>DE LA ROSA</strong>
              <small>Joyería · Relojería</small>
            </span>
          </a>

          <nav className="desktop-nav" aria-label="Navegación principal">
            <a href="#coleccion">Colección</a>
            <a href="#materiales">Materiales</a>
            <a href="#nosotros">Nosotros</a>
            <a href="#ubicacion">Ubicación</a>
          </nav>

          <div className="header__actions">
            <a
              className="icon-button desktop-only"
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Ver Instagram de De la Rosa"
            >
              ◎
            </a>
            <button
              className="cart-button"
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Abrir carrito, ${itemCount} productos`}
            >
              <span>Carrito</span>
              <b>{itemCount}</b>
            </button>
            <button
              className="menu-button"
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
            >
              <span />
              <span />
            </button>
          </div>
        </header>

        <main>
          <section className="hero" id="inicio">
            <div className="hero__copy">
              <p className="eyebrow reveal reveal--1">Encarnación · Paraguay</p>
              <h1 className="reveal reveal--2">
                Joyas que
                <em> hablan de vos.</em>
              </h1>
              <p className="hero__lead reveal reveal--3">
                Piezas para celebrar historias, instantes y personas. Descubrí
                nuestra selección de oro, plata y relojería.
              </p>
              <div className="hero__buttons reveal reveal--4">
                <a className="button button--gold" href="#coleccion">
                  Ver colección <span>↗</span>
                </a>
                <a
                  className="text-link"
                  href={whatsappHref(
                    "Hola De la Rosa, quiero recibir asesoramiento para elegir una joya.",
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  Asesoría personalizada →
                </a>
              </div>
              <div className="hero__proof reveal reveal--4">
                <div className="proof__avatars" aria-hidden="true">
                  <span>DR</span>
                  <span>✦</span>
                  <span>18K</span>
                </div>
                <p>
                  <strong>21,6 mil</strong>
                  personas siguen nuestras novedades
                </p>
              </div>
            </div>

            <div className="hero__visual reveal reveal--2">
              <div className="hero__orb" />
              <figure className="hero__image hero__image--main">
                <img
                  src="/products/06-joya.jpg"
                  alt="Anillos dorados con piedras luminosas"
                />
              </figure>
              <figure className="hero__image hero__image--float">
                <img
                  src="/products/05-pulsera.jpg"
                  alt="Pulsera de plata con corazones"
                />
              </figure>
              <div className="hero__seal" aria-hidden="true">
                <span>PIEZAS CON HISTORIA · DESDE ENCARNACIÓN ·</span>
                <b>◇</b>
              </div>
            </div>

            <a className="scroll-cue" href="#coleccion" aria-label="Ir al catálogo">
              <span>Explorar</span>
              <i>↓</i>
            </a>
          </section>

          <section className="promise-strip" id="materiales">
            <article>
              <span>01</span>
              <div>
                <strong>Materiales seleccionados</strong>
                <p>Oro, plata, acero quirúrgico y enchapados.</p>
              </div>
            </article>
            <article>
              <span>02</span>
              <div>
                <strong>Atención cercana</strong>
                <p>Te ayudamos a encontrar la pieza indicada.</p>
              </div>
            </article>
            <article>
              <span>03</span>
              <div>
                <strong>Compra simple</strong>
                <p>Armá tu pedido y confirmalo por WhatsApp.</p>
              </div>
            </article>
          </section>

          <section className="catalog-section" id="coleccion">
            <div className="section-heading">
              <div>
                <p className="eyebrow eyebrow--dark">Nuestra selección</p>
                <h2>Encontrá tu próxima joya</h2>
              </div>
              <p>
                Una curaduría inspirada en las piezas reales de De la Rosa.
                Precios referenciales sujetos a confirmación.
              </p>
            </div>

            <div className="catalog-tools">
              <div className="filters" aria-label="Filtrar por categoría">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={activeCategory === category ? "active" : ""}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <label className="search-field">
                <span aria-hidden="true">⌕</span>
                <input
                  type="search"
                  placeholder="Buscar una pieza..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  aria-label="Buscar en el catálogo"
                />
              </label>
            </div>

            <div className="product-grid">
              {filteredProducts.map((product, index) => (
                <article
                  className="product-card"
                  key={product.id}
                  style={{ "--delay": `${(index % 4) * 70}ms` } as React.CSSProperties}
                >
                  <div className="product-card__image">
                    <img src={product.image} alt={product.name} />
                    {product.badge && <span>{product.badge}</span>}
                    <button
                      type="button"
                      className="quick-add"
                      onClick={() => addToCart(product)}
                    >
                      Agregar al carrito
                    </button>
                  </div>
                  <div className="product-card__body">
                    <div>
                      <p>{product.material}</p>
                      <h3>{product.name}</h3>
                    </div>
                    <strong>{money(product.price)}</strong>
                  </div>
                  <p className="product-card__description">
                    {product.description}
                  </p>
                  <div className="product-card__mobile-actions">
                    <button type="button" onClick={() => addToCart(product)}>
                      Agregar
                    </button>
                    <a
                      href={whatsappHref(
                        `Hola De la Rosa, quiero consultar por ${product.name}.`,
                      )}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Consultar
                    </a>
                  </div>
                </article>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="empty-results">
                <span>◇</span>
                <h3>No encontramos esa pieza</h3>
                <p>Probá otra búsqueda o escribinos por WhatsApp.</p>
              </div>
            )}
          </section>

          <section className="story-section" id="nosotros">
            <div className="story__image">
              <img
                src="/products/07-destello.jpg"
                alt="Collares dorados de De la Rosa"
              />
              <span>Desde Encarnación</span>
            </div>
            <div className="story__copy">
              <p className="eyebrow eyebrow--dark">De la Rosa</p>
              <h2>El detalle que transforma un momento.</h2>
              <p>
                Somos una joyería y relojería de Encarnación dedicada a
                acompañarte en tus momentos especiales con piezas que podés
                llevar toda la vida.
              </p>
              <p>
                Trabajamos con oro, plata, acero quirúrgico y enchapados, además
                de una selección de relojes y regalos.
              </p>
              <a
                className="text-link text-link--dark"
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
              >
                Conocé nuestras novedades en Instagram →
              </a>
            </div>
          </section>

          <section className="location-section" id="ubicacion">
            <div className="location__card">
              <p className="eyebrow">Nuestra casa</p>
              <h2>Vení a conocernos</h2>
              <p className="location__address">
                Calle Estigarribia y Constitución
                <br />
                Encarnación, Paraguay
              </p>
              <div className="location__hours">
                <span>Atención personalizada</span>
                <span>Consultá el horario del día por WhatsApp</span>
              </div>
              <div className="location__actions">
                <a
                  className="button button--gold"
                  href={MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Cómo llegar <span>↗</span>
                </a>
                <a
                  className="text-link"
                  href={whatsappHref(
                    "Hola De la Rosa, quiero consultar el horario para visitar el local.",
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  Consultar horario →
                </a>
              </div>
            </div>
            <a
              className="location__map"
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Abrir la ubicación en Google Maps"
            >
              <div className="map__grid" aria-hidden="true" />
              <span className="map__road map__road--one" />
              <span className="map__road map__road--two" />
              <span className="map__road map__road--three" />
              <div className="map__pin">
                <img src="/logo.png" alt="" />
                <span>DE LA ROSA</span>
                <small>Joyería · Relojería</small>
              </div>
              <p>Estigarribia y Constitución · Abrir mapa ↗</p>
            </a>
          </section>

          <section className="closing-banner">
            <p className="eyebrow">Una pieza para cada historia</p>
            <h2>
              Elegí lo que te enamora.
              <br />
              <em>Nosotros te ayudamos.</em>
            </h2>
            <a
              className="button button--light"
              href={whatsappHref(
                "Hola De la Rosa, quiero ayuda para elegir una joya.",
              )}
              target="_blank"
              rel="noreferrer"
            >
              Hablar con una asesora <span>↗</span>
            </a>
          </section>
        </main>

        <footer>
          <div className="footer__brand">
            <img className="brand__logo" src="/logo.png" alt="" />
            <div>
              <strong>DE LA ROSA</strong>
              <small>Joyería · Relojería</small>
            </div>
          </div>
          <div className="footer__links">
            <a href="#coleccion">Colección</a>
            <a href="#nosotros">Nosotros</a>
            <a href="#ubicacion">Ubicación</a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
              Instagram
            </a>
          </div>
          <p>
            © {new Date().getFullYear()} De la Rosa · Encarnación, Paraguay
          </p>
        </footer>

        <a
          className="whatsapp-float"
          href={whatsappHref(
            "Hola De la Rosa, quiero consultar sobre sus joyas.",
          )}
          target="_blank"
          rel="noreferrer"
          aria-label="Contactar por WhatsApp"
        >
          <span>◔</span>
          <small>WhatsApp</small>
        </a>

        <div
          className={`overlay ${cartOpen || menuOpen ? "overlay--visible" : ""}`}
          onClick={() => {
            setCartOpen(false);
            setMenuOpen(false);
          }}
          aria-hidden="true"
        />

        <aside
          className={`cart-drawer ${cartOpen ? "cart-drawer--open" : ""}`}
          aria-hidden={!cartOpen}
          aria-label="Carrito de compras"
        >
          <div className="drawer__header">
            <div>
              <p className="eyebrow eyebrow--dark">Tu selección</p>
              <h2>Carrito</h2>
            </div>
            <button
              type="button"
              onClick={() => setCartOpen(false)}
              aria-label="Cerrar carrito"
            >
              ×
            </button>
          </div>

          <div className="cart__content">
            {cart.length === 0 ? (
              <div className="cart__empty">
                <span>◇</span>
                <h3>Tu carrito está esperando</h3>
                <p>Agregá las piezas que te gusten para armar tu consulta.</p>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                >
                  Explorar colección
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <article className="cart-line" key={item.id}>
                  <img src={item.image} alt="" />
                  <div className="cart-line__info">
                    <p>{item.material}</p>
                    <h3>{item.name}</h3>
                    <strong>{money(item.price)}</strong>
                    <div className="quantity">
                      <button
                        type="button"
                        onClick={() => changeQuantity(item.id, -1)}
                        aria-label={`Quitar una unidad de ${item.name}`}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => changeQuantity(item.id, 1)}
                        aria-label={`Agregar una unidad de ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="cart-line__remove"
                    onClick={() =>
                      setCart((current) =>
                        current.filter((product) => product.id !== item.id),
                      )
                    }
                    aria-label={`Eliminar ${item.name}`}
                  >
                    ×
                  </button>
                </article>
              ))
            )}
          </div>

          <div className="cart__footer">
            <div className="cart__total">
              <span>Total referencial</span>
              <strong>{money(total)}</strong>
            </div>
            <p>Disponibilidad y precio final se confirman por WhatsApp.</p>
            <a
              className={`checkout-button ${cart.length === 0 ? "disabled" : ""}`}
              href={cart.length ? whatsappHref(orderMessage) : undefined}
              target="_blank"
              rel="noreferrer"
              aria-disabled={cart.length === 0}
            >
              Enviar pedido por WhatsApp <span>↗</span>
            </a>
            {cart.length > 0 && (
              <button
                className="clear-cart"
                type="button"
                onClick={() => setCart([])}
              >
                Vaciar carrito
              </button>
            )}
          </div>
        </aside>

        <aside
          className={`mobile-menu ${menuOpen ? "mobile-menu--open" : ""}`}
          aria-hidden={!menuOpen}
        >
          <div className="mobile-menu__top">
            <a className="brand" href="#inicio" onClick={() => setMenuOpen(false)}>
              <img className="brand__logo" src="/logo.png" alt="" />
              <span>
                <strong>DE LA ROSA</strong>
                <small>Joyería · Relojería</small>
              </span>
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Cerrar menú"
            >
              ×
            </button>
          </div>
          <nav>
            {[
              ["Colección", "#coleccion"],
              ["Materiales", "#materiales"],
              ["Nosotros", "#nosotros"],
              ["Ubicación", "#ubicacion"],
            ].map(([label, href], index) => (
              <a href={href} key={href} onClick={() => setMenuOpen(false)}>
                <span>0{index + 1}</span>
                {label}
                <i>↗</i>
              </a>
            ))}
          </nav>
          <div className="mobile-menu__footer">
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a
              href={whatsappHref(
                "Hola De la Rosa, quiero consultar sobre sus joyas.",
              )}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}
