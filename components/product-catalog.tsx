"use client";

import { Filter, Gem, Search, SlidersHorizontal, Watch, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { categories, type Product } from "@/lib/store";
import { ProductCard } from "./product-card";

type SortMode = "featured" | "price-asc" | "price-desc" | "name";
type MaterialFilter = string;
type WatchSubtype = "Todos" | "Dama" | "Caballero" | "Infantil";
type BraceletSubtype = "Todos" | "Dama" | "Caballero";
type ChainSubtype = "Todos" | "Caballero";

const watchCategories = new Set([
  "Relojes",
  "Reloj dama",
  "Reloj caballero",
  "Reloj infantil",
]);

const watchSubtypeCategories: Record<
  Exclude<WatchSubtype, "Todos">,
  string
> = {
  Dama: "Reloj dama",
  Caballero: "Reloj caballero",
  Infantil: "Reloj infantil",
};

const watchSubtypeOptions: WatchSubtype[] = [
  "Todos",
  "Dama",
  "Caballero",
  "Infantil",
];

const braceletCategories = new Set([
  "Pulseras",
  "Pulsera dama",
  "Pulsera caballero",
]);

const braceletSubtypeCategories: Record<
  Exclude<BraceletSubtype, "Todos">,
  string
> = {
  Dama: "Pulsera dama",
  Caballero: "Pulsera caballero",
};

const braceletSubtypeOptions: BraceletSubtype[] = [
  "Todos",
  "Dama",
  "Caballero",
];

const chainCategories = new Set(["Cadenas", "Cadena caballero"]);

const chainSubtypeCategories: Record<Exclude<ChainSubtype, "Todos">, string> = {
  Caballero: "Cadena caballero",
};

const chainSubtypeOptions: ChainSubtype[] = ["Todos", "Caballero"];

const categoriesWithoutSubtypes = categories.filter(
  (item) =>
    !Object.values(watchSubtypeCategories).includes(item) &&
    !Object.values(braceletSubtypeCategories).includes(item) &&
    !Object.values(chainSubtypeCategories).includes(item),
);

function getInitialWatchSubtype(initialCategory: string): WatchSubtype {
  const subtype = Object.entries(watchSubtypeCategories).find(
    ([, productCategory]) => productCategory === initialCategory,
  )?.[0];

  return (subtype as WatchSubtype | undefined) ?? "Todos";
}

function getInitialBraceletSubtype(initialCategory: string): BraceletSubtype {
  const subtype = Object.entries(braceletSubtypeCategories).find(
    ([, productCategory]) => productCategory === initialCategory,
  )?.[0];

  return (subtype as BraceletSubtype | undefined) ?? "Todos";
}

function getInitialChainSubtype(initialCategory: string): ChainSubtype {
  const subtype = Object.entries(chainSubtypeCategories).find(
    ([, productCategory]) => productCategory === initialCategory,
  )?.[0];

  return (subtype as ChainSubtype | undefined) ?? "Todos";
}

function getInitialCategory(initialCategory: string) {
  if (getInitialWatchSubtype(initialCategory) !== "Todos") {
    return "Relojes";
  }

  if (getInitialBraceletSubtype(initialCategory) !== "Todos") {
    return "Pulseras";
  }

  if (getInitialChainSubtype(initialCategory) !== "Todos") {
    return "Cadenas";
  }

  return categories.includes(initialCategory) ? initialCategory : "Todo";
}

function matchesCategory(
  productCategory: string,
  selectedCategory: string,
  selectedWatchSubtype: WatchSubtype,
  selectedBraceletSubtype: BraceletSubtype,
  selectedChainSubtype: ChainSubtype,
) {
  if (selectedCategory === "Todo") return true;

  if (selectedCategory === "Relojes") {
    if (!watchCategories.has(productCategory)) return false;

    return (
      selectedWatchSubtype === "Todos" ||
      productCategory === watchSubtypeCategories[selectedWatchSubtype]
    );
  }

  if (selectedCategory === "Pulseras") {
    if (!braceletCategories.has(productCategory)) return false;

    return (
      selectedBraceletSubtype === "Todos" ||
      productCategory === braceletSubtypeCategories[selectedBraceletSubtype]
    );
  }

  if (selectedCategory === "Cadenas") {
    if (!chainCategories.has(productCategory)) return false;

    return (
      selectedChainSubtype === "Todos" ||
      productCategory === chainSubtypeCategories[selectedChainSubtype]
    );
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

const materialAliases: Record<string, string> = {
  "plata 925 banada en oro": "plata banada en oro",
};

function canonicalMaterialName(value: string) {
  const normalized = normalizeSearchText(value);
  return materialAliases[normalized] ?? normalized;
}

function matchesMaterial(
  productMaterial: string,
  selectedMaterial: MaterialFilter,
) {
  if (selectedMaterial === "Todos") return true;

  return canonicalMaterialName(productMaterial) === canonicalMaterialName(selectedMaterial);
}

function availableMaterials(
  products: Product[],
  selectedCategory: string,
  selectedWatchSubtype: WatchSubtype,
  selectedBraceletSubtype: BraceletSubtype,
  selectedChainSubtype: ChainSubtype,
  managedMaterials: string[],
) {
  const availableProductMaterials = new Set<string>();

  products.forEach((product) => {
    if (
      !matchesCategory(
        product.category,
        selectedCategory,
        selectedWatchSubtype,
        selectedBraceletSubtype,
        selectedChainSubtype,
      )
    ) {
      return;
    }

    const materialName = product.material.trim();
    if (materialName) availableProductMaterials.add(canonicalMaterialName(materialName));
  });

  return [
    "Todos",
    ...managedMaterials.filter((materialName, index) => {
      const canonicalName = canonicalMaterialName(materialName);
      return canonicalName &&
        availableProductMaterials.has(canonicalName) &&
        managedMaterials.findIndex((candidate) => canonicalMaterialName(candidate) === canonicalName) === index;
    }),
  ];
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
  managedMaterials,
  initialCategory = "Todo",
  title = "Todos los productos",
}: {
  products: Product[];
  managedMaterials: string[];
  initialCategory?: string;
  title?: string;
}) {
  const [category, setCategory] = useState(() =>
    getInitialCategory(initialCategory),
  );
  const [material, setMaterial] = useState<MaterialFilter>("Todos");
  const [watchSubtype, setWatchSubtype] = useState<WatchSubtype>(() =>
    getInitialWatchSubtype(initialCategory),
  );
  const [braceletSubtype, setBraceletSubtype] = useState<BraceletSubtype>(() =>
    getInitialBraceletSubtype(initialCategory),
  );
  const [chainSubtype, setChainSubtype] = useState<ChainSubtype>(() =>
    getInitialChainSubtype(initialCategory),
  );
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const showWatchSubtypeFilter = category === "Relojes";
  const showBraceletSubtypeFilter = category === "Pulseras";
  const showChainSubtypeFilter = category === "Cadenas";
  const materialOptions = useMemo(
    () =>
      availableMaterials(
        products,
        category,
        watchSubtype,
        braceletSubtype,
        chainSubtype,
        managedMaterials,
      ),
    [braceletSubtype, category, chainSubtype, managedMaterials, products, watchSubtype],
  );
  const showMaterialFilter = materialOptions.length > 1;

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
      const categoryMatch = matchesCategory(
        product.category,
        category,
        watchSubtype,
        braceletSubtype,
        chainSubtype,
      );

      const materialMatch =
        !showMaterialFilter || matchesMaterial(product.material, material);

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
  }, [
    braceletSubtype,
    category,
    chainSubtype,
    material,
    products,
    query,
    showMaterialFilter,
    sort,
    watchSubtype,
  ]);

  function handleSearchChange(value: string) {
    setQuery(value);
  }

  function clearFilters() {
    setCategory("Todo");
    setMaterial("Todos");
    setWatchSubtype("Todos");
    setBraceletSubtype("Todos");
    setChainSubtype("Todos");
    setQuery("");
    setSort("featured");
  }

  function selectCategory(nextCategory: string) {
    setCategory(nextCategory);
    setMaterial("Todos");
    setWatchSubtype("Todos");
    setBraceletSubtype("Todos");
    setChainSubtype("Todos");
    setQuery("");
    setFiltersOpen(false);
  }

  function selectWatchSubtype(nextSubtype: WatchSubtype) {
    setWatchSubtype(nextSubtype);
    setMaterial("Todos");
    setQuery("");
    setFiltersOpen(false);
  }

  function selectBraceletSubtype(nextSubtype: BraceletSubtype) {
    setBraceletSubtype(nextSubtype);
    setMaterial("Todos");
    setQuery("");
    setFiltersOpen(false);
  }

  function selectChainSubtype(nextSubtype: ChainSubtype) {
    setChainSubtype(nextSubtype);
    setMaterial("Todos");
    setQuery("");
    setFiltersOpen(false);
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

            {categoriesWithoutSubtypes.map((item) => {
              const count =
                item === "Todo"
                  ? products.length
                  : products.filter((product) =>
                      matchesCategory(
                        product.category,
                        item,
                        "Todos",
                        "Todos",
                        "Todos",
                      ),
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
                  onClick={() => selectCategory(item)}
                >
                  <span>{item}</span>
                  <small>{count}</small>
                </button>
              );
            })}
          </div>

          {showWatchSubtypeFilter ? (
            <div className="filter-group">
              <h3>Tipos de reloj</h3>

              {watchSubtypeOptions.map((item) => {
                const count = products.filter((product) =>
                  matchesCategory(
                    product.category,
                    "Relojes",
                    item,
                    "Todos",
                    "Todos",
                  ),
                ).length;

                return (
                  <button
                    key={item}
                    type="button"
                    className={watchSubtype === item ? "is-active" : ""}
                    onClick={() => selectWatchSubtype(item)}
                  >
                    <span>
                      {item === "Todos" ? "Todos los relojes" : item}
                    </span>
                    <small>{count}</small>
                  </button>
                );
              })}
            </div>
          ) : null}

          {showBraceletSubtypeFilter ? (
            <div className="filter-group">
              <h3>Tipos de pulsera</h3>

              {braceletSubtypeOptions.map((item) => {
                const count = products.filter((product) =>
                  matchesCategory(
                    product.category,
                    "Pulseras",
                    "Todos",
                    item,
                    "Todos",
                  ),
                ).length;

                return (
                  <button
                    key={item}
                    type="button"
                    className={braceletSubtype === item ? "is-active" : ""}
                    onClick={() => selectBraceletSubtype(item)}
                  >
                    <span>
                      {item === "Todos"
                        ? "Todas las pulseras"
                        : `Pulseras para ${item.toLowerCase()}`}
                    </span>
                    <small>{count}</small>
                  </button>
                );
              })}
            </div>
          ) : null}

          {showChainSubtypeFilter ? (
            <div className="filter-group">
              <h3>Tipos de cadena</h3>

              {chainSubtypeOptions.map((item) => {
                const count = products.filter((product) =>
                  matchesCategory(
                    product.category,
                    "Cadenas",
                    "Todos",
                    "Todos",
                    item,
                  ),
                ).length;

                return (
                  <button
                    key={item}
                    type="button"
                    className={chainSubtype === item ? "is-active" : ""}
                    onClick={() => selectChainSubtype(item)}
                  >
                    <span>
                      {item === "Todos"
                        ? "Todas las cadenas"
                        : "Cadenas para caballero"}
                    </span>
                    <small>{count}</small>
                  </button>
                );
              })}
            </div>
          ) : null}

          {showMaterialFilter ? (
            <div className="filter-group">
              <h3>Materiales</h3>

              {materialOptions.map((item) => {
                const count = products.filter(
                  (product) =>
                    matchesCategory(
                      product.category,
                      category,
                      watchSubtype,
                      braceletSubtype,
                      chainSubtype,
                    ) &&
                    matchesMaterial(product.material, item),
                ).length;

                return (
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
                    <span>
                      {item === "Todos" ? "Todos los materiales" : item}
                    </span>
                    <small>{count}</small>
                  </button>
                );
              })}
            </div>
          ) : null}
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
                    : category === "Relojes" && watchSubtype !== "Todos"
                      ? `Relojes para ${watchSubtype.toLowerCase()}`
                      : category === "Pulseras" &&
                            braceletSubtype !== "Todos"
                        ? `Pulseras para ${braceletSubtype.toLowerCase()}`
                        : category === "Cadenas" &&
                              chainSubtype !== "Todos"
                          ? "Cadenas para caballero"
                        : category}
              </h2>

              <p>{filtered.length} artículos</p>
            </div>

            <div
              className={`results-controls ${
                showMaterialFilter ||
                showWatchSubtypeFilter ||
                showBraceletSubtypeFilter ||
                showChainSubtypeFilter
                  ? "has-context-filter"
                  : ""
              }`}
            >
              <button
                className="mobile-filter-button"
                type="button"
                onClick={() => setFiltersOpen(true)}
              >
                <Filter size={15} />
                Filtrar
              </button>

              {showMaterialFilter ? (
                <label className="sort-control context-filter-control material-filter-control">
                  <Gem size={16} aria-hidden="true" />
                  <span>Material</span>

                  <select
                    value={material}
                    onChange={(event) => {
                      setMaterial(event.target.value as MaterialFilter);
                      setQuery("");
                    }}
                    aria-label="Filtrar por material"
                  >
                    {materialOptions.map((item) => (
                      <option key={item} value={item}>
                        {item === "Todos" ? "Todos los materiales" : item}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              {showWatchSubtypeFilter ? (
                <label className="sort-control context-filter-control watch-filter-control">
                  <Watch size={16} aria-hidden="true" />
                  <span>Tipo de reloj</span>

                  <select
                    value={watchSubtype}
                    onChange={(event) =>
                      selectWatchSubtype(event.target.value as WatchSubtype)
                    }
                    aria-label="Filtrar por tipo de reloj"
                  >
                    <option value="Todos">Todos los relojes</option>
                    <option value="Dama">Relojes dama</option>
                    <option value="Caballero">Relojes caballero</option>
                    <option value="Infantil">Relojes infantiles</option>
                  </select>
                </label>
              ) : null}

              {showBraceletSubtypeFilter ? (
                <label className="sort-control context-filter-control bracelet-filter-control">
                  <Gem size={16} aria-hidden="true" />
                  <span>Tipo de pulsera</span>

                  <select
                    value={braceletSubtype}
                    onChange={(event) =>
                      selectBraceletSubtype(
                        event.target.value as BraceletSubtype,
                      )
                    }
                    aria-label="Filtrar por tipo de pulsera"
                  >
                    <option value="Todos">Todas las pulseras</option>
                    <option value="Dama">Pulseras para dama</option>
                    <option value="Caballero">Pulseras para caballero</option>
                  </select>
                </label>
              ) : null}

              {showChainSubtypeFilter ? (
                <label className="sort-control context-filter-control chain-filter-control">
                  <Gem size={16} aria-hidden="true" />
                  <span>Tipo de cadena</span>

                  <select
                    value={chainSubtype}
                    onChange={(event) =>
                      selectChainSubtype(event.target.value as ChainSubtype)
                    }
                    aria-label="Filtrar por tipo de cadena"
                  >
                    <option value="Todos">Todas las cadenas</option>
                    <option value="Caballero">Cadenas para caballero</option>
                  </select>
                </label>
              ) : null}

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
                {showChainSubtypeFilter && chainSubtype !== "Todos"
                  ? "Todavía no hay cadenas para caballero publicadas en esta colección."
                  : showBraceletSubtypeFilter && braceletSubtype !== "Todos"
                  ? `Todavía no hay pulseras para ${braceletSubtype.toLowerCase()} publicadas en esta colección.`
                  : "Probá escribiendo el tipo de producto y su material, por ejemplo “anillo de oro”."}
              </p>

              <button
                type="button"
                onClick={() => {
                  if (
                    showChainSubtypeFilter &&
                    chainSubtype !== "Todos"
                  ) {
                    selectChainSubtype("Todos");
                    return;
                  }

                  if (
                    showBraceletSubtypeFilter &&
                    braceletSubtype !== "Todos"
                  ) {
                    selectBraceletSubtype("Todos");
                    return;
                  }

                  clearFilters();
                }}
              >
                {showChainSubtypeFilter && chainSubtype !== "Todos"
                  ? "Ver todas las cadenas"
                  : showBraceletSubtypeFilter && braceletSubtype !== "Todos"
                  ? "Ver todas las pulseras"
                  : "Ver todo el catálogo"}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
