import { CalendarIcon } from "@sanity/icons/Calendar";
import { CogIcon } from "@sanity/icons/Cog";
import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";
import { PinIcon } from "@sanity/icons/Pin";
import { StarIcon } from "@sanity/icons/Star";
import { defineArrayMember, defineField, defineType } from "sanity";

const requiredText = (name: string, title: string, rows = 0) =>
  defineField({
    name,
    title,
    type: rows ? "text" : "string",
    ...(rows ? { rows } : {}),
    validation: (rule) => rule.required(),
  });

const urlField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "url",
    validation: (rule) =>
      rule.required().uri({ scheme: ["http", "https"] }),
  });

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Datos generales y redes",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "brand", title: "Marca", default: true },
    { name: "contact", title: "Contacto" },
    { name: "social", title: "Redes sociales" },
    { name: "hours", title: "Horarios" },
    { name: "promotions", title: "Promociones" },
  ],
  fields: [
    defineField({
      name: "brandName",
      title: "Nombre de la marca",
      type: "string",
      group: "brand",
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: "brandTagline",
      title: "Descripción corta de la marca",
      type: "string",
      group: "brand",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "logo",
      title: "Logo principal",
      description: "Se usa en la cabecera, el menú y el pie de la tienda.",
      type: "image",
      group: "brand",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Descripción del logo",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "whatsappNumber",
      title: "Número de WhatsApp",
      description: "Solo números, con código de país. Ej.: 595985720031",
      type: "string",
      group: "contact",
      validation: (rule) =>
        rule.required().regex(/^\d{10,15}$/, {
          name: "número internacional",
          invert: false,
        }),
    }),
    defineField({
      name: "phone",
      title: "Teléfono del local",
      type: "string",
      group: "contact",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "address",
      title: "Dirección completa",
      type: "string",
      group: "contact",
      validation: (rule) => rule.required(),
    }),
    urlField("mapsUrl", "Enlace de Google Maps"),
    defineField({
      name: "instagramUrl",
      title: "Instagram",
      type: "url",
      group: "social",
      validation: (rule) =>
        rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "instagramLabel",
      title: "Nombre visible de Instagram",
      type: "string",
      group: "social",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tiktokUrl",
      title: "TikTok",
      type: "url",
      group: "social",
      validation: (rule) =>
        rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "tiktokLabel",
      title: "Nombre visible de TikTok",
      type: "string",
      group: "social",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "facebookUrl",
      title: "Facebook",
      type: "url",
      group: "social",
      validation: (rule) =>
        rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "facebookLabel",
      title: "Nombre visible de Facebook",
      type: "string",
      group: "social",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "hours",
      title: "Horarios de atención",
      type: "array",
      group: "hours",
      of: [
        defineArrayMember({
          type: "object",
          name: "openingHours",
          title: "Día y horario",
          fields: [
            requiredText("days", "Días"),
            defineField({
              name: "times",
              title: "Horarios",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              validation: (rule) => rule.required().min(1),
            }),
          ],
          preview: {
            select: { title: "days", times: "times" },
            prepare: ({ title, times }) => ({
              title,
              subtitle: Array.isArray(times) ? times.join(" · ") : "",
            }),
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "promotionsKicker",
      title: "Texto superior de promociones",
      type: "string",
      group: "promotions",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "promotionsTitle",
      title: "Título de la sección de promociones",
      type: "string",
      group: "promotions",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "promotionsDescription",
      title: "Descripción de promociones",
      type: "text",
      rows: 3,
      group: "promotions",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Datos generales y redes" }),
  },
});

export const promotion = defineType({
  name: "promotion",
  title: "Promoción",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "badge",
      title: "Beneficio destacado",
      description: "Ej.: 12 cuotas o 10% de reintegro",
      type: "string",
      validation: (rule) => rule.required().max(50),
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: "terms",
      title: "Condiciones o aclaración",
      type: "string",
      validation: (rule) => rule.max(180),
    }),
    defineField({
      name: "image",
      title: "Foto de la promoción",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Descripción de la foto",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "imageRotation",
      title: "Rotación de la foto",
      type: "number",
      options: {
        list: [
          { title: "Sin rotar", value: 0 },
          { title: "90 grados", value: 90 },
          { title: "180 grados", value: 180 },
          { title: "270 grados", value: 270 },
        ],
        layout: "radio",
      },
      initialValue: 0,
    }),
    defineField({
      name: "linkLabel",
      title: "Texto del enlace (opcional)",
      type: "string",
    }),
    defineField({
      name: "linkUrl",
      title: "Enlace de la promoción (opcional)",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "startsAt",
      title: "Fecha de inicio (opcional)",
      type: "datetime",
    }),
    defineField({
      name: "endsAt",
      title: "Fecha de finalización (opcional)",
      type: "datetime",
    }),
    defineField({
      name: "active",
      title: "Mostrar en la página",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      initialValue: 10,
      validation: (rule) => rule.required().integer().min(0),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "badge",
      media: "image",
      active: "active",
    },
    prepare: ({ title, subtitle, media, active }) => ({
      title: `${active === false ? "Oculta · " : ""}${title}`,
      subtitle,
      media,
    }),
  },
});

export const reservationPage = defineType({
  name: "reservationPage",
  title: "Página de reserva",
  type: "document",
  icon: CalendarIcon,
  groups: [
    { name: "intro", title: "Portada", default: true },
    { name: "reference", title: "Foto de muestra" },
    { name: "form", title: "Formulario y WhatsApp" },
    { name: "steps", title: "Pasos" },
  ],
  fields: [
    requiredText("kicker", "Texto superior"),
    requiredText("title", "Título"),
    requiredText("emphasis", "Título destacado"),
    requiredText("description", "Descripción", 3),
    defineField({
      name: "benefits",
      title: "Beneficios",
      type: "array",
      group: "intro",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "icon",
              title: "Ícono",
              type: "string",
              options: {
                list: [
                  { title: "Cuidado", value: "shield" },
                  { title: "Horario", value: "clock" },
                  { title: "Brillo", value: "sparkles" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            requiredText("title", "Texto"),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
      validation: (rule) => rule.required().min(1).max(4),
    }),
    defineField({
      name: "referenceImage",
      title: "Fotografía de perforación",
      type: "image",
      group: "reference",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Descripción de la foto",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    requiredText("referenceEyebrow", "Texto sobre la foto"),
    requiredText("referenceTitle", "Título de la foto"),
    requiredText("referenceDescription", "Descripción de la foto", 3),
    requiredText("formEyebrow", "Texto superior del formulario"),
    requiredText("formTitle", "Título del formulario"),
    requiredText("nameLabel", "Etiqueta del nombre"),
    requiredText("namePlaceholder", "Ejemplo del campo nombre"),
    requiredText("serviceLabel", "Etiqueta del servicio"),
    requiredText("dateLabel", "Etiqueta de la fecha"),
    requiredText("timeLabel", "Etiqueta del horario"),
    requiredText("notesLabel", "Etiqueta de observaciones"),
    requiredText("notesPlaceholder", "Ejemplo de observaciones"),
    defineField({
      name: "serviceOptions",
      title: "Opciones de servicio",
      type: "array",
      group: "form",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1),
    }),
    requiredText("buttonLabel", "Texto del botón"),
    requiredText("paymentNotice", "Aviso debajo del botón"),
    requiredText("whatsappIntro", "Inicio del mensaje de WhatsApp", 3),
    requiredText("whatsappOutro", "Cierre del mensaje de WhatsApp", 3),
    requiredText("stepsKicker", "Texto superior de los pasos"),
    requiredText("stepsTitle", "Título de los pasos"),
    defineField({
      name: "steps",
      title: "Pasos para reservar",
      type: "array",
      group: "steps",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "icon",
              title: "Ícono",
              type: "string",
              options: {
                list: [
                  { title: "Calendario", value: "calendar" },
                  { title: "WhatsApp", value: "message" },
                  { title: "Brillo", value: "sparkles" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            requiredText("title", "Título"),
            requiredText("description", "Descripción", 2),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        }),
      ],
      validation: (rule) => rule.required().min(1).max(4),
    }),
  ],
  preview: { prepare: () => ({ title: "Página de reserva" }) },
});

export const aboutPage = defineType({
  name: "aboutPage",
  title: "Página Nosotros",
  type: "document",
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: "heroImage",
      title: "Imagen principal",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Descripción de la imagen",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    requiredText("foundingYear", "Año desde el que están"),
    requiredText("kicker", "Texto superior"),
    requiredText("title", "Título principal"),
    requiredText("description", "Historia breve", 4),
    defineField({
      name: "proofPoints",
      title: "Datos destacados",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            requiredText("value", "Dato"),
            requiredText("label", "Descripción"),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
      validation: (rule) => rule.required().min(1).max(3),
    }),
    requiredText("buttonLabel", "Texto del botón de productos"),
    defineField({
      name: "values",
      title: "Valores de la joyería",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "icon",
              title: "Ícono",
              type: "string",
              options: {
                list: [
                  { title: "Joya", value: "gem" },
                  { title: "Corazón", value: "heart" },
                  { title: "Brillo", value: "sparkles" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            requiredText("title", "Título"),
            requiredText("description", "Descripción", 2),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        }),
      ],
      validation: (rule) => rule.required().min(1).max(4),
    }),
    requiredText("socialKicker", "Texto superior de redes"),
    requiredText("socialTitle", "Título de redes"),
  ],
  preview: { prepare: () => ({ title: "Página Nosotros" }) },
});

export const locationPage = defineType({
  name: "locationPage",
  title: "Página Ubicación",
  type: "document",
  icon: PinIcon,
  fields: [
    requiredText("kicker", "Texto superior"),
    requiredText("title", "Título principal"),
    requiredText("description", "Descripción", 3),
    requiredText("hoursFeature", "Texto sobre los horarios"),
    requiredText("hoursTitle", "Título de horarios"),
    requiredText("mapsButtonLabel", "Texto del botón de Maps"),
    requiredText("whatsappButtonLabel", "Texto del botón de WhatsApp"),
    requiredText("whatsappMessage", "Mensaje de WhatsApp", 3),
    requiredText("mapTitle", "Nombre dentro del mapa"),
    requiredText("mapSubtitle", "Referencia corta de la calle"),
    requiredText("mapFooterLabel", "Texto inferior del mapa"),
  ],
  preview: { prepare: () => ({ title: "Página Ubicación" }) },
});
