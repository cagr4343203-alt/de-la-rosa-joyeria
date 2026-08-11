"use client";

import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Move,
  Plus,
  RotateCcw,
  ShoppingBag,
  X,
  ZoomIn,
  ZoomOut,
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

const SITE_URL = "https://delarosajoyeria.com";

export function ProductCard({
  product,
  eager = false,
  motionIndex,
}: {
  product: Product;
  eager?: boolean;
  motionIndex?: number;
}) {
  const { addToCart, whatsappNumber } = useStore();

  const outOfStock = product.status === "outOfStock";
  const imageFit = product.imageFit ?? "contain";
  const galleryImages = product.images?.length
    ? product.images
    : [{ src: product.image, alt: product.name }];

  const cardRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const lightboxTransformRef = useRef<HTMLDivElement>(null);
  const hasTrackedView = useRef(false);
  const suppressLightboxClickRef = useRef(false);
  const panRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);

  const [imageOpen, setImageOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  const activeImage =
    galleryImages[activeImageIndex] ??
    galleryImages[0] ?? { src: product.image, alt: product.name };

  const productImageUrl = new URL(
    product.image,
    SITE_URL,
  ).toString();

  const consultationMessage = [
    "Hola Dela Rosa, quiero consultar por este producto:",
    "",
    `*${product.name}*`,
    `Categoría: ${product.category}`,
    `Material: ${product.material}`,
    product.price > 0
      ? `Precio: ${money(product.price)}`
      : "Precio: Consultar",
    product.description
      ? `Detalle: ${product.description}`
      : "",
    "",
    "Foto del producto:",
    productImageUrl,
  ]
    .filter(Boolean)
    .join("\n");

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

    function applyKeyboardTransform(nextZoom: number) {
      window.requestAnimationFrame(() => {
        if (!lightboxTransformRef.current) return;

        const { x, y } = panRef.current;
        lightboxTransformRef.current.style.transform =
          `translate3d(${x}px, ${y}px, 0) scale(${nextZoom})`;
      });
    }

    function resetKeyboardView() {
      panRef.current = { x: 0, y: 0 };
      setZoom(1);
      applyKeyboardTransform(1);
    }

    function changeKeyboardImage(difference: number) {
      setActiveImageIndex((currentIndex) => {
        const nextIndex = Math.min(
          galleryImages.length - 1,
          Math.max(0, currentIndex + difference),
        );
        const gallery = galleryRef.current;

        if (gallery) {
          gallery.scrollTo({
            left: gallery.clientWidth * nextIndex,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "auto"
              : "smooth",
          });
        }

        return nextIndex;
      });
      resetKeyboardView();
    }

    function changeKeyboardZoom(difference: number) {
      setZoom((currentZoom) => {
        const nextZoom = Math.min(3, Math.max(1, currentZoom + difference));

        if (nextZoom === 1) {
          panRef.current = { x: 0, y: 0 };
        }

        applyKeyboardTransform(nextZoom);
        return nextZoom;
      });
    }

    function closeWithKeyboard(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setImageOpen(false);
        resetKeyboardView();
      } else if (event.key === "ArrowLeft") {
        changeKeyboardImage(-1);
      } else if (event.key === "ArrowRight") {
        changeKeyboardImage(1);
      } else if (event.key === "+" || event.key === "=") {
        changeKeyboardZoom(0.25);
      } else if (event.key === "-") {
        changeKeyboardZoom(-0.25);
      }
    }

    window.addEventListener("keydown", closeWithKeyboard);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeWithKeyboard);
    };
  }, [imageOpen, galleryImages.length]);

  const motionStyle =
    motionIndex === undefined
      ? undefined
      : ({
          "--product-delay": `${motionIndex * 60}ms`,
          "--product-drift-delay": `${motionIndex * -1.15}s`,
        } as CSSProperties);

  function applyImageTransform(nextZoom = zoom) {
    if (!lightboxTransformRef.current) return;

    const { x, y } = panRef.current;
    lightboxTransformRef.current.style.transform =
      `translate3d(${x}px, ${y}px, 0) scale(${nextZoom})`;
  }

  function resetImageView() {
    panRef.current = { x: 0, y: 0 };
    setZoom(1);
    applyImageTransform(1);
  }

  function changeZoom(difference: number) {
    const nextZoom = Math.min(3, Math.max(1, zoom + difference));

    if (nextZoom === 1) {
      panRef.current = { x: 0, y: 0 };
    }

    setZoom(nextZoom);
    window.requestAnimationFrame(() => applyImageTransform(nextZoom));
  }

  function selectImage(index: number, scrollCard = true) {
    const nextIndex = Math.min(
      galleryImages.length - 1,
      Math.max(0, index),
    );

    setActiveImageIndex(nextIndex);
    resetImageView();

    if (scrollCard) {
      const gallery = galleryRef.current;
      if (gallery) {
        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        gallery.scrollTo({
          left: gallery.clientWidth * nextIndex,
          behavior: reducedMotion ? "auto" : "smooth",
        });
      }
    }
  }

  function changeImage(difference: number) {
    selectImage(activeImageIndex + difference);
  }

  function openImage(index = activeImageIndex) {
    selectImage(index, false);
    setImageOpen(true);

    if (!hasTrackedView.current) {
      trackProductView({
        id: product.growthSlug || String(product.id),
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
    resetImageView();
  }

  function handleGalleryScroll() {
    const gallery = galleryRef.current;
    if (!gallery?.clientWidth) return;

    const nextIndex = Math.round(gallery.scrollLeft / gallery.clientWidth);
    if (nextIndex !== activeImageIndex) {
      setActiveImageIndex(nextIndex);
    }
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    suppressLightboxClickRef.current = false;
    setIsDragging(zoom > 1);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: panRef.current.x,
      originY: panRef.current.y,
      moved: false,
    };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    drag.moved = drag.moved || Math.abs(deltaX) + Math.abs(deltaY) > 8;

    if (drag.moved) {
      suppressLightboxClickRef.current = true;
    }

    if (zoom <= 1) return;

    panRef.current = {
      x: drag.originX + deltaX,
      y: drag.originY + deltaY,
    };
    applyImageTransform();
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    const moved = drag.moved;
    dragRef.current = null;
    setIsDragging(false);

    if (
      zoom === 1 &&
      Math.abs(deltaX) > 50 &&
      Math.abs(deltaX) > Math.abs(deltaY)
    ) {
      changeImage(deltaX < 0 ? 1 : -1);
    }

    if (moved) {
      window.setTimeout(() => {
        suppressLightboxClickRef.current = false;
      }, 0);
    }
  }

  function handlePointerCancel() {
    dragRef.current = null;
    setIsDragging(false);
  }

  function handleLightboxClick() {
    if (suppressLightboxClickRef.current) return;
    changeZoom(zoom > 1 ? 1 - zoom : 1);
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
        data-growth-product-slug={product.growthSlug || String(product.id)}
        className={`product-card ${
          motionIndex === undefined ? "" : "is-featured-motion"
        } ${imageFit === "contain" ? "has-contained-image" : ""}`}
        style={motionStyle}
      >
        <div className="product-media">
          <div
            ref={galleryRef}
            className="product-gallery"
            onScroll={handleGalleryScroll}
            role="region"
            aria-label={`Galería de fotos de ${product.name}`}
          >
            {galleryImages.map((image, index) => (
              <button
                className="product-image-button"
                type="button"
                key={`${image.src}-${index}`}
                onClick={() => openImage(index)}
                aria-label={`Ampliar foto ${index + 1} de ${galleryImages.length} de ${product.name}`}
                title="Ver imagen ampliada"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  loading={eager && index === 0 ? "eager" : "lazy"}
                  sizes="(max-width: 560px) 48vw, (max-width: 900px) 46vw, (max-width: 1200px) 30vw, 22vw"
                  style={{
                    objectFit: imageFit,
                    objectPosition: product.imagePosition ?? "center",
                  }}
                />
              </button>
            ))}
          </div>

          {galleryImages.length > 1 && (
            <>
              <button
                className="product-gallery-arrow is-previous"
                type="button"
                onClick={() => changeImage(-1)}
                disabled={activeImageIndex === 0}
                aria-label="Ver foto anterior"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                className="product-gallery-arrow is-next"
                type="button"
                onClick={() => changeImage(1)}
                disabled={activeImageIndex === galleryImages.length - 1}
                aria-label="Ver foto siguiente"
              >
                <ChevronRight size={18} />
              </button>

              <div
                className="product-gallery-dots"
                role="group"
                aria-label="Fotos del producto"
              >
                {galleryImages.map((image, index) => (
                  <button
                    type="button"
                    key={`dot-${image.src}-${index}`}
                    className={`product-gallery-dot ${
                      index === activeImageIndex ? "is-active" : ""
                    }`}
                    onClick={() => selectImage(index)}
                    aria-label={`Ver foto ${index + 1}`}
                    aria-current={index === activeImageIndex ? "true" : undefined}
                  />
                ))}
              </div>
            </>
          )}

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
            href={whatsappHref(consultationMessage, whatsappNumber)}
            target="_blank"
            rel="noreferrer"
            onClick={handleProductConsultation}
            aria-label={`Consultar por WhatsApp sobre ${product.name}`}
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
              className="product-lightbox-content"
              onClick={(event) => event.stopPropagation()}
            >
              <div
                className={`product-lightbox-image-stage ${
                  zoom > 1 ? "is-zoomed" : ""
                } ${isDragging ? "is-dragging" : ""}`}
                onClick={handleLightboxClick}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
                onWheel={(event) => {
                  event.preventDefault();
                  changeZoom(event.deltaY < 0 ? 0.25 : -0.25);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleLightboxClick();
                  }
                }}
                role="group"
                tabIndex={0}
                aria-label={
                  zoom > 1
                    ? "Mover la imagen ampliada libremente"
                    : "Ampliar y mover la imagen"
                }
              >
                <div
                  ref={lightboxTransformRef}
                  className="product-lightbox-image-transform"
                >
                  <Image
                    src={activeImage.src}
                    alt={activeImage.alt}
                    fill
                    sizes="95vw"
                    draggable={false}
                    style={{
                      objectFit: "contain",
                      objectPosition: product.imagePosition ?? "center",
                    }}
                  />
                </div>

                {galleryImages.length > 1 && (
                  <>
                    <button
                      className="product-lightbox-nav is-previous"
                      type="button"
                      onPointerDown={(event) => event.stopPropagation()}
                      onClick={(event) => {
                        event.stopPropagation();
                        changeImage(-1);
                      }}
                      disabled={activeImageIndex === 0}
                      aria-label="Ver foto anterior"
                    >
                      <ChevronLeft size={24} />
                    </button>

                    <button
                      className="product-lightbox-nav is-next"
                      type="button"
                      onPointerDown={(event) => event.stopPropagation()}
                      onClick={(event) => {
                        event.stopPropagation();
                        changeImage(1);
                      }}
                      disabled={activeImageIndex === galleryImages.length - 1}
                      aria-label="Ver foto siguiente"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>

              <div className="product-lightbox-toolbar" aria-label="Controles de la imagen">
                <button
                  type="button"
                  onClick={() => changeZoom(-0.25)}
                  disabled={zoom <= 1}
                  aria-label="Reducir imagen"
                >
                  <ZoomOut size={18} />
                </button>

                <span>{Math.round(zoom * 100)}%</span>

                <button
                  type="button"
                  onClick={() => changeZoom(0.25)}
                  disabled={zoom >= 3}
                  aria-label="Ampliar imagen"
                >
                  <ZoomIn size={18} />
                </button>

                <button
                  type="button"
                  onClick={resetImageView}
                  disabled={zoom === 1}
                  aria-label="Restablecer imagen"
                >
                  <RotateCcw size={17} />
                </button>
              </div>

              <strong>{product.name}</strong>

              {galleryImages.length > 1 && (
                <span className="product-lightbox-progress">
                  Foto {activeImageIndex + 1} de {galleryImages.length}
                </span>
              )}

              <span className="product-lightbox-help">
                <Move size={14} />
                {zoom > 1
                  ? "Arrastrá la imagen para moverla libremente"
                  : galleryImages.length > 1
                    ? "Deslizá para cambiar de foto · tocá para ampliar"
                    : "Tocá para ampliar y después arrastrá libremente"}
              </span>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
