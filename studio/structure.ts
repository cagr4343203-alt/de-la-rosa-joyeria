import { BasketIcon } from "@sanity/icons/Basket";
import { CalendarIcon } from "@sanity/icons/Calendar";
import { HomeIcon } from "@sanity/icons/Home";
import { ImageIcon } from "@sanity/icons/Image";
import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";
import { PinIcon } from "@sanity/icons/Pin";
import { StarIcon } from "@sanity/icons/Star";
import { TagIcon } from "@sanity/icons/Tag";
import type { StructureResolver } from "sanity/structure";

const apiVersion = "2026-07-29";

const productCategories = [
  {
    id: "anillos",
    title: "Anillos",
    value: "Anillos",
    templateId: "product-anillos",
  },
  {
    id: "aros",
    title: "Aros",
    value: "Aros",
    templateId: "product-aros",
  },
  {
    id: "cadenas",
    title: "Cadenas",
    value: "Cadenas",
    templateId: "product-cadenas",
  },
  {
    id: "pulseras",
    title: "Pulseras",
    value: "Pulseras",
    templateId: "product-pulseras",
  },
  {
    id: "sets",
    title: "Sets",
    value: "Sets",
    templateId: "product-sets",
  },
  {
    id: "relojes",
    title: "Relojes generales",
    value: "Relojes",
    templateId: "product-relojes",
  },
  {
    id: "reloj-dama",
    title: "Reloj dama",
    value: "Reloj dama",
    templateId: "product-reloj-dama",
  },
  {
    id: "reloj-caballero",
    title: "Reloj caballero",
    value: "Reloj caballero",
    templateId: "product-reloj-caballero",
  },
  {
    id: "reloj-infantil",
    title: "Reloj infantil",
    value: "Reloj infantil",
    templateId: "product-reloj-infantil",
  },
  {
    id: "dijes",
    title: "Dijes",
    value: "Dijes",
    templateId: "product-dijes",
  },
  {
    id: "bombillas",
    title: "Bombillas",
    value: "Bombillas",
    templateId: "product-bombillas",
  },
  {
    id: "boligrafos",
    title: "Bolígrafos",
    value: "Bolígrafos",
    templateId: "product-boligrafos",
  },
  {
    id: "regalos",
    title: "Regalos",
    value: "Regalos",
    templateId: "product-regalos",
  },
] as const;

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Catálogo Dela Rosa")
    .items([
      S.listItem()
        .id("homepage")
        .title("Página de inicio")
        .icon(HomeIcon)
        .child(
          S.list()
            .title("Página de inicio")
            .items([
              S.listItem()
                .id("home-hero")
                .title("Portada principal")
                .icon(HomeIcon)
                .child(
                  S.document()
                    .schemaType("homeHero")
                    .documentId("homeHero")
                    .title("Portada principal"),
                ),
              S.listItem()
                .id("home-services")
                .title("Servicios destacados")
                .icon(InfoOutlineIcon)
                .child(
                  S.document()
                    .schemaType("homeServices")
                    .documentId("homeServices")
                    .title("Servicios destacados"),
                ),
              S.listItem()
                .id("home-categories")
                .title("Categorías e imágenes")
                .icon(ImageIcon)
                .child(
                  S.document()
                    .schemaType("homeCategories")
                    .documentId("homeCategories")
                    .title("Categorías e imágenes"),
                ),
              S.listItem()
                .id("home-featured")
                .title("Productos destacados")
                .icon(StarIcon)
                .child(
                  S.document()
                    .schemaType("homeFeatured")
                    .documentId("homeFeatured")
                    .title("Productos destacados"),
                ),
              S.listItem()
                .id("home-piercing")
                .title("Reserva de perforación")
                .icon(CalendarIcon)
                .child(
                  S.document()
                    .schemaType("homePiercing")
                    .documentId("homePiercing")
                    .title("Reserva de perforación"),
                ),
              S.listItem()
                .id("home-history")
                .title("Nuestra historia")
                .icon(ImageIcon)
                .child(
                  S.document()
                    .schemaType("homeHistory")
                    .documentId("homeHistory")
                    .title("Nuestra historia"),
                ),
              S.listItem()
                .id("home-location")
                .title("Ubicación y contacto")
                .icon(PinIcon)
                .child(
                  S.document()
                    .schemaType("homeLocation")
                    .documentId("homeLocation")
                    .title("Ubicación y contacto"),
                ),
            ]),
        ),

      S.divider(),

      S.listItem()
        .id("products")
        .title("Productos")
        .icon(TagIcon)
        .child(
          S.list()
            .title("Productos")
            .items([
              S.listItem()
                .id("all-products")
                .title("Todos los productos")
                .icon(TagIcon)
                .child(
                  S.documentTypeList("product")
                    .title("Todos los productos")
                    .apiVersion(apiVersion)
                    .filter(
                      '_type == "product" && category != "Combos"',
                    ),
                ),

              S.divider(),

              ...productCategories.map((category) =>
                S.listItem()
                  .id(category.id)
                  .title(category.title)
                  .icon(TagIcon)
                  .child(
                    S.documentTypeList("product")
                      .title(category.title)
                      .apiVersion(apiVersion)
                      .filter(
                        '_type == "product" && category == $category',
                      )
                      .params({
                        category: category.value,
                      })
                      .initialValueTemplates([
                        S.initialValueTemplateItem(
                          category.templateId,
                        ),
                      ]),
                  ),
              ),
            ]),
        ),

      S.listItem()
        .id("combos")
        .title("Combos")
        .icon(BasketIcon)
        .child(
          S.documentTypeList("product")
            .title("Combos")
            .apiVersion(apiVersion)
            .filter(
              '_type == "product" && category == "Combos"',
            )
            .initialValueTemplates([
              S.initialValueTemplateItem("combo-product"),
            ]),
        ),
    ]);
