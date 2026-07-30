"use client";

import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  categories,
  materials,
  type Product,
} from "@/lib/store";
import { ProductCard } from "./product-card";

type SortMode = "featured" | "price-asc" | "price-desc" | "name";

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
    return () => document.body.classList.remove("filters-open");
  }, [filtersOpen]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = products.filter((product) => {
      const categoryMatch =
        category === "Todo" || product.category === category;
      const materialMatch =
        material === "Todos" ||
        product.material.toLowerCase().includes(material.toLowerCase());
      const queryMatch =
        !normalized ||
        `${product.name} ${product.category} ${product.material}`
          .toLowerCase()
          .includes(normalized);
      return categoryMatch && materialMatch && queryMatch;
    });

    return [...result].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name, "es");
      return 0;
    });
  }, [category, material, products, query, sort]);

  function clearFilters() {
    setCategory("Todo");
    setMaterial("Todos");
    setQuery("");
    setSort("featured");
  }

  return (
    <>
      <section className="catalog-hero">
        <span className="kicker">Catálogo DELAROSA</span>
        <h1>{title}</h1>
        <p>
          Joyas, relojes y regalos especiales. La disponibilidad y los precios
          finales se confirman por WhatsApp.
        </p>
        <label className="catalog-search">
          <Search size={18} />
          <input
            type="search"
            placeholder="¿Qué producto estás buscando?"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
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
                  : products.filter((product) => product.category === item)
                      .length;
              if (item !== "Todo" && count === 0) return null;
              return (
                <button
                  key={item}
                  type="button"
                  className={category === item ? "is-active" : ""}
                  onClick={() => {
                    setCategory(item);
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
              <span className="kicker">Catálogo</span>
              <h2>
                {category === "Todo" ? "Todos los productos" : category}
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
                  onChange={(event) => setSort(event.target.value as SortMode)}
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
              <p>Probá otra búsqueda o limpiá los filtros.</p>
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
