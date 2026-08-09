"use client";

import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { categories, materials, type Product } from "@/lib/store";
import { ProductCard } from "./product-card";

type SortMode = "featured" | "price-asc" | "price-desc" | "name";

const watchCategories = new Set([
  "Relojes",
  "Reloj dama",
  "Reloj caballero",
  "Reloj infantil",
]);

function matchesCategory(productCategory: string, selectedCategory: string) {
  if (selectedCategory === "Todo") return true;
  if (selectedCategory === "Relojes") {
    return watchCategories.has(productCategory);
  }
  return productCategory === selectedCategory;
}

const ignoredSearchWords = new Set([
  "de",
  "del",
  "la",
  "las",
  "el",
  "los",
  "para",
  "con",
  "y",
  "en",
  "un",
  "una",
  "unos",
  "unas",
]);

const searchAliases: Record<string, string> = {
  // Oro
  dorado: "oro",
  dorada: "oro",
  dorados: "oro",
  doradas: "oro",

  // Plata
  plateado: "plata",
  plateada: "plata",
  plateados: "plata",
  plateadas: "plata",

  // Anillos
  anillos: "anillo",
  alianzas: "anillo",
  alianza: "anillo",
  solitario: "anillo",
  solitarios: "anillo",

  // Aros
  aros: "aro",
  arete: "aro",
  aretes: "aro",
  argolla: "aro",
  argollas: "aro",

  // Cadenas
  cadenas: "cadena",
  collar: "cadena",
  collares: "cadena",

  // Pulseras
  pulseras: "pulsera",
  brazalete: "pulsera",
  brazaletes: "pulsera",

  // Relojes
  relojes: "reloj",
  damas: "dama",
  mujer: "dama",
  mujeres: "dama",
  senora: "dama",
  senoras: "dama",
  femenino: "dama",
  femenina: "dama",
  femeninos: "dama",
  femeninas: "dama",
  caballeros: "caballero",
  hombre: "caballero",
  hombres: "caballero",
  varon: "caballero",
  varones: "caballero",
  senor: "caballero",
  senores: "caballero",
  masculino: "caballero",
  masculina: "caballero",
  masculinos: "caballero",
  masculinas: "caballero",
  nino: "infantil",
  ninos: "infantil",
  nina: "infantil",
  ninas: "infantil",
  nena: "infantil",
  nenas: "infantil",
  nene: "infantil",
  nenes: "infantil",
  chico: "infantil",
  chicos: "infantil",
  chica: "infantil",
  chicas: "infantil",
  kids: "infantil",

  // Dijes
  dijes: "dije",
  colgante: "dije",
  colgantes: "dije",

  // Bombillas
  bombillas: "bombilla",
  mate: "bombilla",

  // Bolígrafos
  boligrafos: "boligrafo",
  lapicera: "boligrafo",
  lapiceras: "boligrafo",
  birome: "boligrafo",
  biromes: "boligrafo",
  pluma: "boligrafo",
  plumas: "boligrafo",

  // Materiales y formas habituales de pedirlos
  gold: "oro",
  golden: "oro",
  silver: "plata",

  // Sets
  sets: "set",
  conjunto: "set",
  conjuntos: "set",

  // Combos
  combos: "combo",
  combinacion: "combo",
  combinaciones: "combo",

  // Regalos
  regalos: "regalo",
};

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function matchesMaterial(productMaterial: string, selectedMaterial: string) {
  if (selectedMaterial === "Todos") return true;

  const normalizedProductMaterial = normalizeSearchText(productMaterial);

  if (selectedMaterial === "Oro") {
    return ["oro", "gold", "dorado", "dorada"].some((term) =>
      normalizedProductMaterial.includes(term),
    );
  }

  if (selectedMaterial === "Plata") {
    return ["plata", "silver", "plateado", "plateada"].some((term) =>
      normalizedProductMaterial.includes(term),
    );
  }

  if (selectedMaterial === "Acero") {
    return normalizedProductMaterial.includes("acero");
  }

  if (selectedMaterial === "Enchapado") {
    return ["enchapado", "enchapada", "banado", "banada"].some((term) =>
      normalizedProductMaterial.includes(term),
    );
  }

  return normalizedProductMaterial.includes(
    normalizeSearchText(selectedMaterial),
  );
}

function getSearchWords(value: string) {
  return normalizeSearchText(value)
    .split(/\s+/)
    .filter(Boolean)
    .filter((word) => !ignoredSearchWords.has(word))
    .map((word) => searchAliases[word] ?? word);
}

function wordsMatch(queryWord: string, productWord: string) {
  if (queryWord === productWord) return true;

  if (queryWord.length >= 3 && productWord.includes(queryWord)) {
    return true;
  }

  if (productWord.length >= 3 && queryWord.includes(productWord)) {
    return true;
  }

  return false;
}

export function ProductCatalog({
  products,
  initialCategory = "Todo",
  title = "Todos los productos",
}: {
  products: Product[];
  initialCategory?: string;
  title?: string;
}) {
  const [category, setCategory] = useState(
    categories.includes(initialCategory) ? initialCategory : "Todo",
  );
  const [material, setMaterial] = useState("Todos");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("filters-open", filtersOpen);

    return () => {
      document.body.classList.remove("filters-open");
    };
  }, [filtersOpen]);

  const filtered = useMemo(() => {
    const queryWords = getSearchWords(query);
    const searchIsActive = queryWords.length > 0;

    const result = products.filter((product) => {
      const categoryMatch = matchesCategory(product.category, category);

      const materialMatch = matchesMaterial(product.material, material);

      const searchableText = [
        product.name,
        product.category,
        product.material,
        product.description ?? "",
        product.badge ?? "",
        product.referentialImage ? "imagen referencial" : "",
        product.status === "outOfStock" ? "agotado sin stock" : "disponible",
      ].join(" ");

      const productWords = getSearchWords(searchableText);

      const queryMatch =
        !searchIsActive ||
        queryWords.every((queryWord) =>
          productWords.some((productWord) =>
            wordsMatch(queryWord, productWord),
          ),
        );

      return categoryMatch && materialMatch && queryMatch;
    });

    return [...result].sort((a, b) => {
      if (sort === "price-asc") {
        return a.price - b.price;
      }

      if (sort === "price-desc") {
        return b.price - a.price;
      }

      if (sort === "name") {
        return a.name.localeCompare(b.name, "es");
      }

      return 0;
    });
  }, [category, material, products, query, sort]);

  function handleSearchChange(value: string) {
    setQuery(value);
  }

  function clearFilters() {
    setCategory("Todo");
    setMaterial("Todos");
    setQuery("");
    setSort("featured");
  }

  return (
    <>
      <section className="catalog-hero">
        <span className="kicker">Catálogo Dela Rosa</span>

        <h1>{title}</h1>

        <p>
          Joyas, relojes y regalos especiales. La disponibilidad y los precios
          finales se confirman por WhatsApp.
        </p>

        <label className="catalog-search">
          <Search size={18} />

          <input
            type="search"
            placeholder="Ej.: anillo de oro, cadena de plata..."
            value={query}
            onChange={(event) => handleSearchChange(event.target.value)}
            aria-label="Buscar productos"
          />

          <span>Buscar</span>
        </label>
      </section>

      <section className="catalog-layout">
        <button
          className={`filter-overlay ${filtersOpen ? "is-visible" : ""}`}
          type="button"
          onClick={() => setFiltersOpen(false)}
          aria-label="Cerrar filtros"
          tabIndex={filtersOpen ? 0 : -1}
        />

        <aside
          className={`catalog-filters ${filtersOpen ? "is-open" : ""}`}
          aria-label="Filtros de productos"
        >
          <div className="mobile-filter-head">
            <strong>Filtrar productos</strong>

            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              aria-label="Cerrar filtros"
            >
              <X size={19} />
            </button>
          </div>

          <div className="filter-title">
            <div>
              <span>Filtrar productos</span>
              <h2>Filtros</h2>
            </div>

            <button type="button" onClick={clearFilters}>
              Limpiar
            </button>
          </div>

          <div className="filter-group">
            <h3>Categorías</h3>

            {categories.map((item) => {
              const count =
                item === "Todo"
                  ? products.length
                  : products.filter((product) =>
                      matchesCategory(product.category, item),
                    )
                      .length;

              if (item !== "Todo" && count === 0) {
                return null;
              }

              return (
                <button
                  key={item}
                  type="button"
                  className={category === item ? "is-active" : ""}
                  onClick={() => {
                    setCategory(item);
                    setQuery("");
                    setFiltersOpen(false);
                  }}
                >
                  <span>{item}</span>
                  <small>{count}</small>
                </button>
              );
            })}
          </div>

          <div className="filter-group">
            <h3>Materiales</h3>

            {materials.map((item) => (
              <button
                key={item}
                type="button"
                className={material === item ? "is-active" : ""}
                onClick={() => {
                  setMaterial(item);
                  setQuery("");
                  setFiltersOpen(false);
                }}
              >
                <span>{item}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="catalog-results">
          <div className="results-head">
            <div>
              <span className="kicker">
                {query.trim() ? "Resultados de búsqueda" : "Catálogo"}
              </span>

              <h2>
                {query.trim()
                  ? `Resultados para “${query.trim()}”`
                  : category === "Todo"
                    ? "Todos los productos"
                    : category}
              </h2>

              <p>{filtered.length} artículos</p>
            </div>

            <div className="results-controls">
              <button
                className="mobile-filter-button"
                type="button"
                onClick={() => setFiltersOpen(true)}
              >
                <Filter size={15} />
                Filtrar
              </button>

              <label className="sort-control">
                <SlidersHorizontal size={16} />
                <span>Ordenar por</span>

                <select
                  value={sort}
                  onChange={(event) =>
                    setSort(event.target.value as SortMode)
                  }
                  aria-label="Ordenar productos"
                >
                  <option value="featured">Orden predeterminado</option>
                  <option value="price-asc">Menor precio</option>
                  <option value="price-desc">Mayor precio</option>
                  <option value="name">Nombre A–Z</option>
                </select>
              </label>
            </div>
          </div>

          {filtered.length ? (
            <div className="catalog-grid">
              {filtered.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  eager={index < 4}
                />
              ))}
            </div>
          ) : (
            <div className="catalog-empty">
              <span>◇</span>
              <h3>No encontramos esa pieza</h3>
              <p>
                Probá escribiendo el tipo de producto y su material, por ejemplo
                “anillo de oro”.
              </p>

              <button type="button" onClick={clearFilters}>
                Ver todo el catálogo
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
