"use client";

import Image from "next/image";
import { MessageCircle, Plus, ShoppingBag } from "lucide-react";
import { type CSSProperties, useEffect, useRef } from "react";
import { type Product, money, whatsappHref } from "@/lib/store";
import { observeMotionElement } from "./motion-reveal";
import { useStore } from "./store-context";

export function ProductCard({
  product,
  eager = false,
  motionIndex,
}: {
  product: Product;
  eager?: boolean;
  motionIndex?: number;
}) {
  const { addToCart } = useStore();
  const outOfStock = product.status === "outOfStock";
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (motionIndex === undefined) return;

    const card = cardRef.current;
    if (!card) return;

    card.classList.add("is-motion-ready");

    return observeMotionElement(card, (isInView) => {
      if (isInView) {
        card.classList.add("is-visible", "is-in-view");
      } else {
        card.classList.remove("is-in-view");
      }
    });
  }, [motionIndex]);

  const motionStyle =
    motionIndex === undefined
      ? undefined
      : ({
          "--product-delay": `${motionIndex * 60}ms`,
          "--product-drift-delay": `${motionIndex * -1.15}s`,
        } as CSSProperties);

  return (
    <article
      ref={cardRef}
      className={`product-card ${
        motionIndex === undefined ? "" : "is-featured-motion"
      }`}
      style={motionStyle}
    >
      <div className="product-media">
        <Image
          src={product.image}
          alt={product.name}
          fill
          loading={eager ? "eager" : "lazy"}
          sizes="(max-width: 560px) 48vw, (max-width: 900px) 46vw, (max-width: 1200px) 30vw, 22vw"
          style={{ objectPosition: product.imagePosition }}
        />
        {product.badge && <span className="product-badge">{product.badge}</span>}
        {outOfStock && <span className="stock-badge">Agotado</span>}
        <button
          className="quick-add"
          type="button"
          onClick={() => addToCart(product)}
          disabled={outOfStock}
        >
          <ShoppingBag size={16} />
          {outOfStock ? "Sin stock" : "Agregar al carrito"}
        </button>
      </div>
      <div className="product-info">
        <p>{product.category} · {product.material}</p>
        <h3>{product.name}</h3>
        <span>{product.description}</span>
        {product.referentialImage && <small>Imagen referencial</small>}
        <strong>
          {product.price > 0 ? money(product.price) : "Consultar precio"}
        </strong>
      </div>
      <div className="product-actions">
        <button
          type="button"
          onClick={() => addToCart(product)}
          disabled={outOfStock}
        >
          <Plus size={15} />
          {outOfStock ? "Agotado" : "Agregar"}
        </button>
        <a
          href={whatsappHref(
            `Hola Dela Rosa, quiero consultar por ${product.name}.`,
          )}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={15} />
          Consultar
        </a>
      </div>
    </article>
  );
}
