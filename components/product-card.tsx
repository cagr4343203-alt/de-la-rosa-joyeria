"use client";

import Image from "next/image";
import { MessageCircle, Plus, ShoppingBag } from "lucide-react";
import { type Product, money, whatsappHref } from "@/lib/store";
import { useStore } from "./store-context";

export function ProductCard({
  product,
  eager = false,
}: {
  product: Product;
  eager?: boolean;
}) {
  const { addToCart } = useStore();
  const outOfStock = product.status === "outOfStock";

  return (
    <article className="product-card">
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
            `Hola DELAROSA, quiero consultar por ${product.name}.`,
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
