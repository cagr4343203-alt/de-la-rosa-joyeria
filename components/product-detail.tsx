"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  trackAddToCart,
  trackProductConsultation,
  trackProductView,
} from "@/lib/analytics";
import {
  money,
  type Product,
  whatsappHref,
} from "@/lib/store";

import styles from "./product-detail.module.css";
import { useStore } from "./store-context";

export function ProductDetail({
  product,
  recommendedProducts,
}: {
  product: Product;
  recommendedProducts: Product[];
}) {
  const { addToCart, whatsappNumber } = useStore();

  const images = useMemo(() => {
    if (product.images?.length) {
      return product.images;
    }

    return [
      {
        src: product.image,
        alt: product.name,
      },
    ];
  }, [product]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [imageOpen, setImageOpen] = useState(false);

  const activeImage = images[activeIndex] ?? images[0];
  const outOfStock = product.status === "outOfStock";

  useEffect(() => {
    trackProductView({
      id: product.id,
      name: product.name,
      category: product.category,
      material: product.material,
      price: product.price,
    });
  }, [
    product.id,
    product.name,
    product.category,
    product.material,
    product.price,
  ]);

  useEffect(() => {
    if (!imageOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setImageOpen(false);
      }

      if (event.key === "ArrowLeft" && images.length > 1) {
        setActiveIndex((current) =>
          current === 0 ? images.length - 1 : current - 1,
        );
      }

      if (event.key === "ArrowRight" && images.length > 1) {
        setActiveIndex((current) =>
          current === images.length - 1 ? 0 : current + 1,
        );
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [imageOpen, images.length]);

  function goBack() {
    if (typeof window === "undefined") return;

    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.href = "/productos";
  }

  function previousImage() {
    setActiveIndex((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  }

  function nextImage() {
    setActiveIndex((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  }

  function handleAddToCart() {
    if (outOfStock) return;

    addToCart(product);

    trackAddToCart({
      id: product.id,
      name: product.name,
      category: product.category,
      material: product.material,
      price: product.price,
    });
  }

  function handleWhatsApp() {
    trackProductConsultation({
      id: product.id,
      name: product.name,
      category: product.category,
    });
  }

  const consultationMessage = [
    "Hola Dela Rosa ✨",
    `Quiero consultar por ${product.name}.`,
    `Categoría: ${product.category}.`,
    `Material: ${product.material}.`,
    product.price > 0
      ? `Precio publicado: ${money(product.price)}.`
      : "Quiero consultar el precio.",
    "",
    "¿Me confirman disponibilidad, por favor?",
  ].join("\n");

  return (
    <>
      <main className={styles.page}>
        <div className={styles.shell}>
          <div className={styles.topRow}>
            <button
              className={styles.backDesktop}
              type="button"
              onClick={goBack}
            >
              <span aria-hidden="true">←</span>
              Volver a donde estaba
            </button>

            <div className={styles.breadcrumb}>
              <Link href="/">Inicio</Link>
              <span>/</span>
              <Link href="/productos">Productos</Link>
              <span>/</span>
              <b>{product.category}</b>
            </div>
          </div>

          <section className={styles.productSection}>
            <div className={styles.galleryColumn}>
              <div className={styles.mainImage}>
                <Image
                  src={activeImage.src}
                  alt={activeImage.alt || product.name}
                  fill
                  priority
                  sizes="(max-width: 900px) 94vw, 620px"
                  style={{
                    objectFit: "contain",
                    objectPosition: "center",
                    padding: "clamp(14px, 2vw, 28px)",
                  }}
                />

                {product.badge && (
                  <span className={styles.imageBadge}>
                    {product.badge}
                  </span>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      className={`${styles.galleryArrow} ${styles.galleryArrowLeft}`}
                      type="button"
                      onClick={previousImage}
                      aria-label="Ver imagen anterior"
                    >
                      ‹
                    </button>

                    <button
                      className={`${styles.galleryArrow} ${styles.galleryArrowRight}`}
                      type="button"
                      onClick={nextImage}
                      aria-label="Ver siguiente imagen"
                    >
                      ›
                    </button>

                    <span className={styles.counter}>
                      {activeIndex + 1} / {images.length}
                    </span>
                  </>
                )}

                <button
                  className={styles.openImageButton}
                  type="button"
                  onClick={() => setImageOpen(true)}
                >
                  Ver imagen
                  <span aria-hidden="true">↗</span>
                </button>
              </div>

              {images.length > 1 && (
                <div className={styles.thumbnails}>
                  {images.map((image, index) => (
                    <button
                      key={`${image.src}-${index}`}
                      className={
                        index === activeIndex
                          ? styles.activeThumbnail
                          : ""
                      }
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-label={`Ver imagen ${index + 1}`}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt || product.name}
                        fill
                        sizes="72px"
                        style={{
                          objectFit: "contain",
                          objectPosition: "center",
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.info}>
              <div className={styles.tags}>
                <span>{product.category}</span>
                <span>{product.material}</span>
              </div>

              <h1>{product.name}</h1>

              <div className={styles.priceBlock}>
                <span>Precio</span>

                <div>
                  <strong>
                    {product.price > 0
                      ? money(product.price)
                      : "Consultar precio"}
                  </strong>

                  <em
                    className={
                      outOfStock
                        ? styles.stockOut
                        : styles.stockAvailable
                    }
                  >
                    {outOfStock ? "Sin stock" : "Disponible"}
                  </em>
                </div>
              </div>

              <div className={styles.about}>
                <span>Sobre esta joya</span>

                <p>
                  {product.description ||
                    `${product.name}, una pieza seleccionada por Dela Rosa Joyería y Relojería. Consultá disponibilidad, detalles y opciones de compra.`}
                </p>
              </div>

              <div className={styles.detailGrid}>
                <article>
                  <span>Material</span>
                  <strong>{product.material || "Consultar"}</strong>
                </article>

                <article>
                  <span>Categoría</span>
                  <strong>{product.category || "Joyería"}</strong>
                </article>

                <article>
                  <span>Disponibilidad</span>
                  <strong>
                    {outOfStock ? "Sin stock" : "Disponible"}
                  </strong>
                </article>

                <article>
                  <span>Atención</span>
                  <strong>Personalizada</strong>
                </article>
              </div>

              {product.referentialImage && (
                <p className={styles.referential}>
                  Imagen referencial. El tono o terminación puede variar
                  ligeramente.
                </p>
              )}

              <div className={styles.actions}>
                <button
                  className={styles.addButton}
                  type="button"
                  onClick={handleAddToCart}
                  disabled={outOfStock}
                >
                  {outOfStock
                    ? "Producto agotado"
                    : "Agregar al carrito"}
                </button>

                <a
                  className={styles.whatsappButton}
                  href={whatsappHref(
                    consultationMessage,
                    whatsappNumber,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  onClick={handleWhatsApp}
                >
                  Consultar por WhatsApp
                </a>
              </div>

              <div className={styles.trustBar}>
                <article>
                  <span>01</span>
                  <strong>Calidad seleccionada</strong>
                </article>

                <article>
                  <span>02</span>
                  <strong>Atención personalizada</strong>
                </article>

                <article>
                  <span>03</span>
                  <strong>Dela Rosa · Desde 2003</strong>
                </article>
              </div>
            </div>
          </section>

          {recommendedProducts.length > 0 && (
            <section className={styles.recommendedSection}>
              <div className={styles.recommendedHeading}>
                <div>
                  <span>Selección Dela Rosa</span>
                  <h2>También podrían gustarte</h2>
                  <p>
                    Joyas seleccionadas por similitud con la pieza que
                    estás viendo.
                  </p>
                </div>

                <Link
                  className={styles.recommendedMore}
                  href="/productos"
                >
                  Ver más productos
                  <b aria-hidden="true">→</b>
                </Link>
              </div>

              <div className={styles.recommendedGrid}>
                {recommendedProducts.map((item) => {
                  const slug = item.growthSlug?.trim();

                  return (
                    <Link
                      key={String(item.id)}
                      href={
                        slug
                          ? `/producto/${encodeURIComponent(slug)}`
                          : "/productos"
                      }
                      className={styles.recommendedCard}
                    >
                      <div className={styles.recommendedImage}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(max-width: 700px) 72vw, 30vw"
                          style={{
                            objectFit: "contain",
                            objectPosition: "center",
                            padding: "14px",
                          }}
                        />
                      </div>

                      <div className={styles.recommendedCopy}>
                        <span>
                          {item.category}
                          {item.material
                            ? ` · ${item.material}`
                            : ""}
                        </span>

                        <h3>{item.name}</h3>

                        <div className={styles.recommendedBottom}>
                          <strong>
                            {item.price > 0
                              ? money(item.price)
                              : "Consultar precio"}
                          </strong>

                          <i aria-hidden="true">→</i>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>

      <button
        className={styles.backMobile}
        type="button"
        onClick={goBack}
      >
        <span aria-hidden="true">←</span>
        Volver a donde estaba
      </button>

      {imageOpen && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`Imagen ampliada de ${product.name}`}
          onClick={() => setImageOpen(false)}
        >
          <div className={styles.lightboxTop}>
            <div>
              <span>{product.category}</span>
              <strong>{product.name}</strong>
            </div>

            <button
              type="button"
              onClick={() => setImageOpen(false)}
              aria-label="Cerrar imagen"
            >
              ×
            </button>
          </div>

          <div
            className={styles.lightboxStage}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.lightboxImage}>
              <Image
                src={activeImage.src}
                alt={activeImage.alt || product.name}
                fill
                sizes="92vw"
                style={{
                  objectFit: "contain",
                  objectPosition: "center",
                }}
              />
            </div>

            {images.length > 1 && (
              <>
                <button
                  className={`${styles.lightboxArrow} ${styles.lightboxArrowLeft}`}
                  type="button"
                  onClick={previousImage}
                  aria-label="Imagen anterior"
                >
                  ‹
                </button>

                <button
                  className={`${styles.lightboxArrow} ${styles.lightboxArrowRight}`}
                  type="button"
                  onClick={nextImage}
                  aria-label="Imagen siguiente"
                >
                  ›
                </button>
              </>
            )}
          </div>

          <div className={styles.lightboxFooter}>
            <span>
              {activeIndex + 1} / {images.length}
            </span>
            <small>
              Tocá fuera de la imagen o presioná Esc para cerrar.
            </small>
          </div>
        </div>
      )}
    </>
  );
}
