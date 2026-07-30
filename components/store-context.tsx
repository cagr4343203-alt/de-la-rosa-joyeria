"use client";

import Image from "next/image";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  type CartLine,
  type Product,
  money,
  whatsappHref,
} from "@/lib/store";

type StoreContextValue = {
  cart: CartLine[];
  cartOpen: boolean;
  itemCount: number;
  total: number;
  addToCart: (product: Product) => void;
  changeQuantity: (id: Product["id"], difference: number) => void;
  clearCart: () => void;
  removeFromCart: (id: Product["id"]) => void;
  setCartOpen: (open: boolean) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartReady, setCartReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("delarosa-cart");
    if (saved) {
      try {
        setCart(JSON.parse(saved) as CartLine[]);
      } catch {
        window.localStorage.removeItem("delarosa-cart");
      }
    }
    setCartReady(true);
  }, []);

  useEffect(() => {
    if (!cartReady) return;
    window.localStorage.setItem("delarosa-cart", JSON.stringify(cart));
  }, [cart, cartReady]);

  useEffect(() => {
    document.body.classList.toggle("cart-open", cartOpen);
    return () => document.body.classList.remove("cart-open");
  }, [cartOpen]);

  const value = useMemo<StoreContextValue>(() => {
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    return {
      cart,
      cartOpen,
      itemCount,
      total,
      setCartOpen,
      addToCart(product) {
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
      },
      changeQuantity(id, difference) {
        setCart((current) =>
          current
            .map((item) =>
              item.id === id
                ? { ...item, quantity: item.quantity + difference }
                : item,
            )
            .filter((item) => item.quantity > 0),
        );
      },
      removeFromCart(id) {
        setCart((current) => current.filter((item) => item.id !== id));
      },
      clearCart() {
        setCart([]);
      },
    };
  }, [cart, cartOpen]);

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) {
    throw new Error("useStore debe utilizarse dentro de StoreProvider");
  }
  return value;
}

export function CartDrawer() {
  const {
    cart,
    cartOpen,
    total,
    changeQuantity,
    clearCart,
    removeFromCart,
    setCartOpen,
  } = useStore();
  const hasUnpricedProducts = cart.some((item) => item.price <= 0);
  const totalLabel = hasUnpricedProducts
    ? total > 0
      ? `${money(total)} + artículos a cotizar`
      : "A confirmar"
    : money(total);

  const orderMessage = [
    "Hola Dela Rosa ✨ Quiero consultar por este pedido:",
    "",
    ...cart.map(
      (item) =>
        `• ${item.quantity} × ${item.name} (${item.material}) — ${
          item.price > 0
            ? money(item.price * item.quantity)
            : "Precio a confirmar"
        }`,
    ),
    "",
    `Total referencial: ${totalLabel}`,
    "",
    "¿Me confirman disponibilidad y precio final, por favor?",
  ].join("\n");

  return (
    <>
      <button
        className={`drawer-overlay ${cartOpen ? "is-visible" : ""}`}
        type="button"
        onClick={() => setCartOpen(false)}
        aria-label="Cerrar carrito"
        tabIndex={cartOpen ? 0 : -1}
      />
      <aside
        className={`cart-drawer ${cartOpen ? "is-open" : ""}`}
        aria-hidden={!cartOpen}
        aria-label="Carrito de compras"
        inert={!cartOpen}
      >
        <div className="drawer-head">
          <div>
            <span className="kicker">Tu selección</span>
            <h2>Carrito</h2>
          </div>
          <button
            className="round-close"
            type="button"
            onClick={() => setCartOpen(false)}
            aria-label="Cerrar carrito"
          >
            ×
          </button>
        </div>

        <div className="cart-content">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <span>◇</span>
              <h3>Tu carrito está esperando</h3>
              <p>Agregá las piezas que te gusten para preparar tu consulta.</p>
              <button type="button" onClick={() => setCartOpen(false)}>
                Seguir explorando
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <article className="cart-line" key={item.id}>
                <div className="cart-line-image">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="92px"
                    style={{ objectPosition: item.imagePosition }}
                  />
                </div>
                <div className="cart-line-info">
                  <p>{item.material}</p>
                  <h3>{item.name}</h3>
                  <strong>
                    {item.price > 0 ? money(item.price) : "Consultar precio"}
                  </strong>
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
                  className="remove-line"
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  aria-label={`Eliminar ${item.name}`}
                >
                  ×
                </button>
              </article>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span>Total referencial</span>
            <strong>{cart.length ? totalLabel : money(0)}</strong>
          </div>
          <p>Disponibilidad y precio final se confirman por WhatsApp.</p>
          <a
            className={`checkout-button ${cart.length === 0 ? "is-disabled" : ""}`}
            href={cart.length ? whatsappHref(orderMessage) : undefined}
            target="_blank"
            rel="noreferrer"
            aria-disabled={cart.length === 0}
          >
            Enviar pedido por WhatsApp <span>↗</span>
          </a>
          {cart.length > 0 && (
            <button className="clear-cart" type="button" onClick={clearCart}>
              Vaciar carrito
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
