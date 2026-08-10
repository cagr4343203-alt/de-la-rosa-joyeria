import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";

const productCategoryTemplates = [
  {
    id: "product-anillos",
    title: "Nuevo anillo",
    category: "Anillos",
  },
  {
    id: "product-aros",
    title: "Nuevo aro",
    category: "Aros",
  },
  {
    id: "product-cadenas",
    title: "Nueva cadena",
    category: "Cadenas",
  },
  {
    id: "product-pulseras",
    title: "Nueva pulsera",
    category: "Pulseras",
  },
  {
    id: "product-sets",
    title: "Nuevo set",
    category: "Sets",
  },
  {
    id: "product-relojes",
    title: "Nuevo reloj",
    category: "Relojes",
  },
  {
    id: "product-reloj-dama",
    title: "Nuevo reloj dama",
    category: "Reloj dama",
  },
  {
    id: "product-reloj-caballero",
    title: "Nuevo reloj caballero",
    category: "Reloj caballero",
  },
  {
    id: "product-reloj-infantil",
    title: "Nuevo reloj infantil",
    category: "Reloj infantil",
  },
  {
    id: "product-dijes",
    title: "Nuevo dije",
    category: "Dijes",
  },
  {
    id: "product-bombillas",
    title: "Nueva bombilla",
    category: "Bombillas",
  },
  {
    id: "product-boligrafos",
    title: "Nuevo bolígrafo",
    category: "Bolígrafos",
  },
  {
    id: "product-regalos",
    title: "Nuevo regalo",
    category: "Regalos",
  },
] as const;

const singletonTypes = new Set([
  "siteSettings",
  "reservationPage",
  "aboutPage",
  "locationPage",
  "homeHero",
  "homeServices",
  "homeCategories",
  "homeFeatured",
  "homePiercing",
  "homeHistory",
  "homeLocation",
]);

export default defineConfig({
  name: "default",
  title: "Dela Rosa · Catálogo",
  projectId: "224225np",
  dataset: "production",

  plugins: [structureTool({ structure }), visionTool()],

  schema: {
    types: schemaTypes,

    templates: (templates) => [
      ...templates.filter(
        (template) => !singletonTypes.has(template.schemaType),
      ),

      ...productCategoryTemplates.map((template) => ({
        id: template.id,
        title: template.title,
        description: `Agregar un producto en la categoría ${template.category}`,
        schemaType: "product",

        value: {
          category: template.category,
          status: "available",
          featured: false,
          order: 100,
        },
      })),

      {
        id: "combo-product",
        title: "Nuevo combo",
        description: "Agregar un combo al catálogo de Dela Rosa",
        schemaType: "product",

        value: {
          category: "Combos",
          status: "available",
          price: 0,
          featured: false,
          order: 100,
        },
      },
    ],
  },
});
