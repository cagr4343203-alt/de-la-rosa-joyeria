import { TagIcon } from "@sanity/icons/Tag";
import { defineArrayMember, defineField, defineType } from "sanity";

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
      description:
        "Escribí el nombre real de la pieza que se ve en la foto: tipo, diseño y detalle principal.",
      validation: (rule) => [
        rule.required().min(2).max(90),
        rule
          .custom((value) =>
            /\bmodelo\s+\d+\b/iu.test(value ?? "")
              ? "Este nombre todavía es genérico. Reemplazalo por el diseño real o una referencia confirmada."
              : true,
          )
          .warning(),
      ],
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
      name: "materialRef",
      title: "Material",
      type: "reference",
      to: [{ type: "productMaterial" }],
      description:
        "Elegí el material exacto desde la lista administrada en Materiales.",
      options: {
        filter: "active == true",
      },
      validation: (rule) =>
        rule
          .required()
          .error("Elegí un material antes de publicar el producto."),
    }),
    defineField({
      name: "material",
      title: "Material anterior",
      description:
        "Dato conservado temporalmente. Usá el nuevo campo Material de arriba.",
      type: "string",
      deprecated: {
        reason:
          "Este texto fue reemplazado por la referencia administrable Material.",
      },
      readOnly: true,
      hidden: ({ value }) => value === undefined,
      initialValue: undefined,
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
      name: "gallery",
      title: "Galería de fotos adicionales",
      description:
        "Subí fotos del mismo producto desde distintos ángulos. Podés arrastrarlas para cambiar el orden.",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Descripción de la foto",
              description:
                "Ej.: Vista lateral del anillo. Ayuda a describir la imagen.",
              type: "string",
              validation: (rule) =>
                rule
                  .required()
                  .max(120)
                  .warning("Agregá una breve descripción de esta foto."),
            }),
          ],
        }),
      ],
      validation: (rule) => rule.max(8),
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
      category: "category",
      materialName: "materialRef.name",
      legacyMaterial: "material",
      media: "image",
      status: "status",
    },
    prepare({
      title,
      category,
      materialName,
      legacyMaterial,
      media,
      status,
    }) {
      const statusLabel =
        status === "outOfStock"
          ? "Agotado"
          : status === "hidden"
            ? "Oculto"
            : "Disponible";
      return {
        title,
        subtitle: `${category ?? "Sin categoría"} · ${materialName ?? legacyMaterial ?? "Sin material"} · ${statusLabel}`,
        media,
      };
    },
  },
});
