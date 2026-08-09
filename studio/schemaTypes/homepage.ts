import { CalendarIcon } from "@sanity/icons/Calendar";
import { HomeIcon } from "@sanity/icons/Home";
import { ImageIcon } from "@sanity/icons/Image";
import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";
import { PinIcon } from "@sanity/icons/Pin";
import { StarIcon } from "@sanity/icons/Star";
import { defineArrayMember, defineField, defineType } from "sanity";

const categoryOptions = [
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
  "Regalos",
];

function contentImage(name: string, title: string, description?: string) {
  return defineField({
    name,
    title,
    description,
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Descripción de la imagen",
        description: "Explicá brevemente qué aparece en la foto.",
        type: "string",
        validation: (rule) => rule.required().max(140),
      }),
    ],
    validation: (rule) => rule.required(),
  });
}

export const homeServiceItem = defineType({
  name: "homeServiceItem",
  title: "Servicio de inicio",
  type: "object",
  fields: [
    defineField({
      name: "icon",
      title: "Ícono",
      type: "string",
      options: {
        list: [
          { title: "Joya", value: "gem" },
          { title: "Reloj", value: "watch" },
          { title: "Regalo", value: "gift" },
          { title: "Reserva", value: "calendar" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Nombre",
      type: "string",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "string",
      validation: (rule) => rule.required().max(100),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
  },
});

export const homeCategoryCard = defineType({
  name: "homeCategoryCard",
  title: "Categoría de inicio",
  type: "object",
  fields: [
    defineField({
      name: "category",
      title: "Categoría que abrirá",
      type: "string",
      options: { list: categoryOptions },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Título visible",
      description: "Ej.: Anillos, Aros, Bombillas o Pulseras.",
      type: "string",
      validation: (rule) => rule.required().max(50),
    }),
    defineField({
      name: "eyebrow",
      title: "Texto pequeño",
      description: "Ej.: Momentos únicos.",
      type: "string",
      validation: (rule) => rule.required().max(70),
    }),
    contentImage("image", "Imagen de la categoría"),
  ],
  preview: {
    select: { title: "title", subtitle: "eyebrow", media: "image" },
  },
});

export const homeHero = defineType({
  name: "homeHero",
  title: "Portada principal",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "kicker",
      title: "Texto superior",
      type: "string",
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: "title",
      title: "Título principal",
      type: "string",
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: "emphasis",
      title: "Frase destacada",
      description: "Aparece en cursiva debajo del título principal.",
      type: "string",
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: "primaryActionLabel",
      title: "Texto del botón de productos",
      type: "string",
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: "secondaryActionLabel",
      title: "Texto del botón de reserva",
      type: "string",
      validation: (rule) => rule.required().max(45),
    }),
    defineField({
      name: "trustFirst",
      title: "Primera frase de confianza",
      type: "string",
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: "trustSecond",
      title: "Segunda frase de confianza",
      type: "string",
      validation: (rule) => rule.required().max(70),
    }),
    contentImage(
      "mainImage",
      "Imagen principal",
      "Es la foto grande que aparece al entrar a la página.",
    ),
    contentImage(
      "secondaryImage",
      "Imagen secundaria",
      "Es la foto pequeña superpuesta en la portada.",
    ),
    defineField({
      name: "reserveEyebrow",
      title: "Texto pequeño de la tarjeta de reserva",
      type: "string",
      validation: (rule) => rule.required().max(50),
    }),
    defineField({
      name: "reserveTitle",
      title: "Título de la tarjeta de reserva",
      type: "string",
      validation: (rule) => rule.required().max(70),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Portada principal" }),
  },
});

export const homeServices = defineType({
  name: "homeServices",
  title: "Servicios destacados",
  type: "document",
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: "items",
      title: "Servicios",
      description: "Podés cambiar el nombre, la descripción y el orden.",
      type: "array",
      of: [defineArrayMember({ type: "homeServiceItem" })],
      validation: (rule) => rule.required().min(1).max(6),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Servicios destacados" }),
  },
});

export const homeCategories = defineType({
  name: "homeCategories",
  title: "Categorías de inicio",
  type: "document",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "kicker",
      title: "Texto superior",
      type: "string",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "title",
      title: "Título de la sección",
      type: "string",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "linkLabel",
      title: "Texto del enlace al catálogo",
      type: "string",
      validation: (rule) => rule.required().max(50),
    }),
    defineField({
      name: "cards",
      title: "Imágenes y categorías",
      description: "Arrastrá las tarjetas para cambiar el orden.",
      type: "array",
      of: [defineArrayMember({ type: "homeCategoryCard" })],
      validation: (rule) => rule.required().min(1).max(8),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Categorías de inicio" }),
  },
});

export const homeFeatured = defineType({
  name: "homeFeatured",
  title: "Productos destacados",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({
      name: "kicker",
      title: "Texto superior",
      type: "string",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "title",
      title: "Título de la sección",
      type: "string",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: "products",
      title: "Productos que aparecerán",
      description:
        "Elegí hasta cuatro productos. El nombre, precio y foto se editan en Productos.",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "product" }],
          options: {
            filter: 'category != "Combos" && status != "hidden"',
          },
        }),
      ],
      validation: (rule) => rule.required().min(1).max(4).unique(),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Productos destacados" }),
  },
});

export const homePiercing = defineType({
  name: "homePiercing",
  title: "Reserva de perforación",
  type: "document",
  icon: CalendarIcon,
  fields: [
    defineField({
      name: "kicker",
      title: "Texto superior",
      type: "string",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(260),
    }),
    defineField({
      name: "firstPoint",
      title: "Primer beneficio",
      type: "string",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "secondPoint",
      title: "Segundo beneficio",
      type: "string",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "buttonLabel",
      title: "Texto del botón",
      type: "string",
      validation: (rule) => rule.required().max(40),
    }),
    contentImage("image", "Imagen de perforación"),
    defineField({
      name: "captionEyebrow",
      title: "Texto pequeño sobre la imagen",
      type: "string",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "captionTitle",
      title: "Texto principal sobre la imagen",
      type: "string",
      validation: (rule) => rule.required().max(90),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Reserva de perforación" }),
  },
});

export const homeHistory = defineType({
  name: "homeHistory",
  title: "Nuestra historia",
  type: "document",
  icon: ImageIcon,
  fields: [
    contentImage("image", "Imagen de la historia"),
    defineField({
      name: "kicker",
      title: "Texto superior",
      type: "string",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(260),
    }),
    defineField({
      name: "linkLabel",
      title: "Texto del enlace",
      type: "string",
      validation: (rule) => rule.required().max(50),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Nuestra historia" }),
  },
});

export const homeLocation = defineType({
  name: "homeLocation",
  title: "Ubicación y contacto",
  type: "document",
  icon: PinIcon,
  fields: [
    defineField({
      name: "kicker",
      title: "Texto superior",
      type: "string",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: "description",
      title: "Dirección o descripción",
      type: "string",
      validation: (rule) => rule.required().max(180),
    }),
    defineField({
      name: "mapLabel",
      title: "Texto del botón del mapa",
      type: "string",
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: "whatsappLabel",
      title: "Texto del botón de WhatsApp",
      type: "string",
      validation: (rule) => rule.required().max(45),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Ubicación y contacto" }),
  },
});
