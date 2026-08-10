import Image from "next/image";
import Link from "next/link";

import { money } from "@/lib/store";
import { getProducts } from "@/sanity/lib/products";

import styles from "./pedido.module.css";

export const metadata = {
  title: "Resumen del pedido",
  description:
    "Resumen de productos seleccionados del catálogo de Dela Rosa.",
  robots: {
    index: false,
    follow: false,
  },
};

type RequestedItem = {
  id: string;
  quantity: number;
};

function parseRequestedItems(value?: string): RequestedItem[] {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => {
        if (
          typeof item !== "object" ||
          item === null
        ) {
          return null;
        }

        const currentItem = item as {
          id?: unknown;
          quantity?: unknown;
        };

        const id = String(currentItem.id ?? "").trim();

        const quantity = Math.max(
          1,
          Math.min(
            99,
            Number(currentItem.quantity) || 1,
          ),
        );

        if (!id) return null;

        return {
          id,
          quantity,
        };
      })
      .filter(
        (item): item is RequestedItem =>
          item !== null,
      )
      .slice(0, 50);
  } catch {
    return [];
  }
}

function parseCompactRequestedItems(value?: string): RequestedItem[] {
  if (!value) return [];

  return value
    .split(",")
    .map((entry) => {
      const separatorIndex = entry.lastIndexOf("~");
      const encodedId =
        separatorIndex >= 0
          ? entry.slice(0, separatorIndex)
          : entry;
      const quantityValue =
        separatorIndex >= 0
          ? entry.slice(separatorIndex + 1)
          : "1";

      try {
        const id = decodeURIComponent(encodedId).trim();
        const quantity = Math.max(
          1,
          Math.min(99, Number(quantityValue) || 1),
        );

        return id ? { id, quantity } : null;
      } catch {
        return null;
      }
    })
    .filter((item): item is RequestedItem => item !== null)
    .slice(0, 50);
}

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{
    p?: string;
    items?: string;
  }>;
}) {
  const [products, params] = await Promise.all([
    getProducts(),
    searchParams,
  ]);

  const compactItems = parseCompactRequestedItems(params.p);
  const requestedItems = compactItems.length
    ? compactItems
    : parseRequestedItems(params.items);

  const orderLines = requestedItems.flatMap(
    (requestedItem) => {
      const product = products.find(
        (currentProduct) =>
          String(currentProduct.id) ===
          requestedItem.id,
      );

      if (!product) {
        return [];
      }

      return [
        {
          product,
          quantity: requestedItem.quantity,
        },
      ];
    },
  );

  const total = orderLines.reduce(
    (sum, line) =>
      sum +
      line.product.price * line.quantity,
    0,
  );

  const hasUnpricedProducts = orderLines.some(
    (line) => line.product.price <= 0,
  );

  const totalLabel = hasUnpricedProducts
    ? total > 0
      ? `${money(total)} + productos a cotizar`
      : "A confirmar"
    : money(total);

  return (
    <main className={styles.page}>
      <section className={styles.heading}>
        <span>Selección Dela Rosa</span>

        <h1>Resumen del pedido</h1>

        <p>
          Productos seleccionados para confirmar
          disponibilidad y precio final con Dela Rosa.
        </p>
      </section>

      {orderLines.length > 0 ? (
        <>
          <section
            className={styles.products}
            aria-label="Productos del pedido"
          >
            {orderLines.map(
              ({ product, quantity }) => (
                <article
                  className={styles.product}
                  key={String(product.id)}
                >
                  <div className={styles.image}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 110px, 190px"
                      style={{
                        objectFit:
                          product.imageFit ??
                          "contain",
                        objectPosition:
                          product.imagePosition ??
                          "center",
                      }}
                    />
                  </div>

                  <div
                    className={
                      styles.information
                    }
                  >
                    <span>
                      {product.category} ·{" "}
                      {product.material}
                    </span>

                    <h2>{product.name}</h2>

                    {product.description && (
                      <p>
                        {product.description}
                      </p>
                    )}

                    <div
                      className={styles.details}
                    >
                      <small>
                        Cantidad:{" "}
                        <strong>
                          {quantity}
                        </strong>
                      </small>

                      <strong>
                        {product.price > 0
                          ? money(
                              product.price *
                                quantity,
                            )
                          : "Precio a confirmar"}
                      </strong>
                    </div>
                  </div>
                </article>
              ),
            )}
          </section>

          <section className={styles.summary}>
            <div>
              <span>Total referencial</span>
              <strong>{totalLabel}</strong>
            </div>

            <p>
              La disponibilidad y el precio final se
              confirman por WhatsApp.
            </p>
          </section>
        </>
      ) : (
        <section className={styles.empty}>
          <span>◇</span>

          <h2>
            No encontramos productos en este pedido
          </h2>

          <p>
            El enlace puede estar incompleto o los
            productos ya no están disponibles.
          </p>

          <Link href="/productos">
            Volver al catálogo
          </Link>
        </section>
      )}

      <Link
        className={styles.back}
        href="/productos"
      >
        ← Ver más productos
      </Link>
    </main>
  );
}
