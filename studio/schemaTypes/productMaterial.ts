import { TagIcon } from "@sanity/icons/Tag";
import { defineField, defineType } from "sanity";

const materialFamilies = [
  { title: "Oro", value: "oro" },
  { title: "Plata", value: "plata" },
  { title: "Acero", value: "acero" },
  { title: "Enchapados y otros metales", value: "enchapados" },
  { title: "Relojería", value: "relojeria" },
  { title: "Otros", value: "otros" },
  { title: "Por confirmar", value: "por-confirmar" },
] as const;

const familyLabels = Object.fromEntries(
  materialFamilies.map((family) => [family.value, family.title]),
);

export const productMaterial = defineType({
  name: "productMaterial",
  title: "Material",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      description: "Ej.: Oro 18K, Plata 925 o Acero dorado.",
      type: "string",
      validation: (rule) => rule.required().min(2).max(60),
    }),
    defineField({
      name: "slug",
      title: "Identificador",
      description: "Presioná Generar. Se usa para identificar el material.",
      type: "slug",
      options: { source: "name", maxLength: 72 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "family",
      title: "Familia",
      type: "string",
      options: {
        list: [...materialFamilies],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Orden",
      description: "Los números menores aparecen primero.",
      type: "number",
      initialValue: 100,
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: "active",
      title: "Disponible para seleccionar",
      type: "boolean",
      initialValue: true,
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Orden de materiales",
      name: "materialOrder",
      by: [
        { field: "order", direction: "asc" },
        { field: "name", direction: "asc" },
      ],
    },
    {
      title: "Nombre A–Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      family: "family",
      active: "active",
    },
    prepare({ title, family, active }) {
      const familyLabel = familyLabels[family] ?? "Sin familia";
      return {
        title,
        subtitle: `${familyLabel} · ${active === false ? "Inactivo" : "Activo"}`,
      };
    },
  },
});
