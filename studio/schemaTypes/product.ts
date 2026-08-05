import { TagIcon } from "@sanity/icons/Tag";
import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Producto",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      validation: (rule) => rule.required().min(2).max(90),
    }),
    defineField({
      name: "slug",
      title: "Identificador",
      description: "Presioná Generar. Se utiliza para organizar el catálogo.",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: "Estado",
      type: "string",
      initialValue: "available",
      options: {
        list: [
          { title: "Disponible", value: "available" },
          { title: "Agotado", value: "outOfStock" },
          { title: "Oculto", value: "hidden" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "string",
      options: {
        list: [
          "Anillos",
          "Aros",
          "Argollas de plata",
          "Cadenas",
          "Pulseras",
          "Sets",
          "Relojes",
          "Reloj dama",
          "Reloj caballero",
          "Reloj infantil",
          "Dijes",
          "Bombillas",
          "Bolígrafos",
          "Combos",
          "Regalos",
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "material",
      title: "Material",
      type: "string",
      description: "Ej.: Oro 18K, Plata 925, acero o enchapado.",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "price",
      title: "Precio referencial (guaraníes)",
      type: "number",
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: "image",
      title: "Foto principal",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: "alt",
          title: "Descripción de la foto",
          type: "string",
          validation: (rule) => rule.required().max(120),
        }),
      ],
    }),
    defineField({
      name: "referentialImage",
      title: "La foto es referencial",
      description:
        "Activá esta opción cuando la foto todavía no corresponde al producto real.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "imageFit",
      title: "Encuadre de la foto",
      description:
        "Usá Mostrar completa para fotos verticales. Llenar tarjeta puede recortar los bordes.",
      type: "string",
      initialValue: "contain",
      options: {
        list: [
          { title: "Mostrar completa y centrada", value: "contain" },
          { title: "Llenar la tarjeta", value: "cover" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
  name: "description",
  title: "Descripción",
  description: "Opcional. Podés dejar este campo vacío.",
  type: "text",
  rows: 3,
  validation: (rule) => rule.max(300),
}),
    defineField({
      name: "badge",
      title: "Etiqueta opcional",
      description: "Ej.: Nuevo, Favorito, Oferta o Edición especial.",
      type: "string",
      validation: (rule) => rule.max(32),
    }),
    defineField({
      name: "featured",
      title: "Mostrar como destacado",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Orden en el catálogo",
      type: "number",
      initialValue: 100,
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: "sourceKey",
      title: "Identificador de importación",
      type: "string",
      readOnly: true,
      hidden: ({ value }) => value === undefined,
    }),
  ],
  orderings: [
    {
      title: "Orden del catálogo",
      name: "catalogOrder",
      by: [
        { field: "featured", direction: "desc" },
        { field: "order", direction: "asc" },
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
      subtitle: "category",
      media: "image",
      status: "status",
    },
    prepare({ title, subtitle, media, status }) {
      const statusLabel =
        status === "outOfStock"
          ? "Agotado"
          : status === "hidden"
            ? "Oculto"
            : "Disponible";
      return {
        title,
        subtitle: `${subtitle ?? "Sin categoría"} · ${statusLabel}`,
        media,
      };
    },
  },
});
