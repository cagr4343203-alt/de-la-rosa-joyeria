"use client";

import Image from "next/image";
import {
  MessageCircle,
  Plus,
  ShoppingBag,
  X,
} from "lucide-react";
import { createPortal } from "react-dom";
import {
  type CSSProperties,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  trackAddToCart,
  trackProductConsultation,
  trackProductView,
} from "@/lib/analytics";
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
  const imageFit = product.imageFit ?? "contain";

  const cardRef = useRef<HTMLElement>(null);
  const hasTrackedView = useRef(false);

  const [imageOpen, setImageOpen] = useState(false);
  const [imageZoomed, setImageZoomed] = useState(false);

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

  useEffect(() => {
    if (!imageOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function closeWithKeyboard(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setImageOpen(false);
        setImageZoomed(false);
      }
    }

    window.addEventListener("keydown", closeWithKeyboard);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeWithKeyboard);
    };
  }, [imageOpen]);

  const motionStyle =
    motionIndex === undefined
      ? undefined
      : ({
          "--product-delay": `${motionIndex * 60}ms`,
          "--product-drift-delay": `${motionIndex * -1.15}s`,
        } as CSSProperties);

  function openImage() {
    setImageZoomed(false);
    setImageOpen(true);

    if (!hasTrackedView.current) {
      trackProductView({
        id: String(product.id),
        name: product.name,
        category: product.category,
        material: product.material,
        price: product.price,
      });

      hasTrackedView.current = true;
    }
  }

  function closeImage() {
    setImageOpen(false);
    setImageZoomed(false);
  }

  function handleAddToCart() {
    if (outOfStock) return;

    addToCart(product);

    trackAddToCart({
      id: String(product.id),
      name: product.name,
      category: product.category,
      material: product.material,
      price: product.price,
    });
  }

  function handleProductConsultation() {
    trackProductConsultation({
      id: String(product.id),
      name: product.name,
      category: product.category,
    });
  }

  return (
    <>
      <article
        ref={cardRef}
        className={`product-card ${
          motionIndex === undefined ? "" : "is-featured-motion"
        } ${imageFit === "contain" ? "has-contained-image" : ""}`}
        style={motionStyle}
      >
        <div className="product-media">
          <button
            className="product-image-button"
            type="button"
            onClick={openImage}
            aria-label={`Ver imagen ampliada de ${product.name}`}
            title="Ver imagen ampliada"
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              loading={eager ? "eager" : "lazy"}
              sizes="(max-width: 560px) 48vw, (max-width: 900px) 46vw, (max-width: 1200px) 30vw, 22vw"
              style={{
                objectFit: imageFit,
                objectPosition: product.imagePosition ?? "center",
              }}
            />
          </button>

          {product.badge && (
            <span className="product-badge">
              {product.badge}
            </span>
          )}

          {outOfStock && (
            <span className="stock-badge">
              Agotado
            </span>
          )}

          <button
            className="quick-add"
            type="button"
            onClick={handleAddToCart}
            disabled={outOfStock}
          >
            <ShoppingBag size={16} />
            {outOfStock ? "Sin stock" : "Agregar al carrito"}
          </button>
        </div>

        <div className="product-info">
          <p>
            {product.category} · {product.material}
          </p>

          <h3>{product.name}</h3>

          {product.description && (
            <span>{product.description}</span>
          )}

          {product.referentialImage && (
            <small>Imagen referencial</small>
          )}

          <strong>
            {product.price > 0
              ? money(product.price)
              : "Consultar precio"}
          </strong>
        </div>

        <div
  className="product-actions"
  style={{ display: "grid" }}
>
          <button
            type="button"
            onClick={handleAddToCart}
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
            onClick={handleProductConsultation}
          >
            <MessageCircle size={15} />
            Consultar
          </a>
        </div>
      </article>

      {imageOpen &&
        createPortal(
          <div
            className="product-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`Imagen ampliada de ${product.name}`}
            onClick={closeImage}
          >
            <button
              className="product-lightbox-close"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                closeImage();
              }}
              aria-label="Cerrar imagen ampliada"
            >
              <X size={26} />
            </button>

            <div
              className={`product-lightbox-content ${
                imageZoomed ? "is-zoomed" : ""
              }`}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                className="product-lightbox-image"
                type="button"
                onClick={() =>
                  setImageZoomed((currentValue) => !currentValue)
                }
                aria-label={
                  imageZoomed
                    ? "Reducir imagen"
                    : "Ampliar más la imagen"
                }
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={1600}
                  height={1600}
                  sizes="95vw"
                  style={{
                    objectFit: "contain",
                    objectPosition:
                      product.imagePosition ?? "center",
                  }}
                />
              </button>

              <strong>{product.name}</strong>

              <span>
                {imageZoomed
                  ? "Tocá la imagen para reducir"
                  : "Tocá la imagen para ampliar"}
              </span>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}