import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";

export default defineConfig({
  name: "default",
  title: "DELAROSA · Catálogo",
  projectId: "224225np",
  dataset: "production",
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
    templates: (templates) => [
      ...templates,
      {
        id: "combo-product",
        title: "Combo",
        description: "Agregar un combo al catálogo de DELAROSA",
        schemaType: "product",
        value: {
          category: "Combos",
          status: "available",
          material: "Varios",
          price: 0,
          featured: false,
          order: 100,
        },
      },
    ],
  },
});
