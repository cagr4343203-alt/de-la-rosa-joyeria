import { BasketIcon } from "@sanity/icons/Basket";
import { CalendarIcon } from "@sanity/icons/Calendar";
import { CogIcon } from "@sanity/icons/Cog";
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
    id: "pulsera-dama",
    title: "Pulseras para dama",
    value: "Pulsera dama",
    templateId: "product-pulsera-dama",
  },
  {
    id: "pulsera-caballero",
    title: "Pulseras para caballero",
    value: "Pulsera caballero",
    templateId: "product-pulsera-caballero",
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
        .id("site-settings")
        .title("Datos generales y redes")
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Datos generales y redes"),
        ),

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
                .id("promotions")
                .title("Promociones y descuentos")
                .icon(StarIcon)
                .child(
                  S.documentTypeList("promotion")
                    .title("Promociones y descuentos")
                    .defaultOrdering([
                      { field: "order", direction: "asc" },
                    ]),
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

      S.listItem()
        .id("reservation-page")
        .title("Reserva y perforación")
        .icon(CalendarIcon)
        .child(
          S.document()
            .schemaType("reservationPage")
            .documentId("reservationPage")
            .title("Reserva y perforación"),
        ),

      S.listItem()
        .id("about-page")
        .title("Nosotros")
        .icon(InfoOutlineIcon)
        .child(
          S.document()
            .schemaType("aboutPage")
            .documentId("aboutPage")
            .title("Nosotros"),
        ),

      S.listItem()
        .id("location-page")
        .title("Ubicación")
        .icon(PinIcon)
        .child(
          S.document()
            .schemaType("locationPage")
            .documentId("locationPage")
            .title("Ubicación"),
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

              S.listItem()
                .id("generic-product-names")
                .title("Nombres pendientes de mejorar")
                .icon(TagIcon)
                .child(
                  S.documentTypeList("product")
                    .title("Nombres pendientes de mejorar")
                    .apiVersion(apiVersion)
                    .filter(
                      '_type == "product" && status != "hidden" && name match "*modelo*"',
                    )
                    .defaultOrdering([
                      { field: "category", direction: "asc" },
                      { field: "name", direction: "asc" },
                    ]),
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

      S.listItem()
        .id("materials")
        .title("Materiales")
        .icon(TagIcon)
        .child(
          S.list()
            .title("Materiales")
            .items([
              S.listItem()
                .id("manage-materials")
                .title("Administrar materiales")
                .icon(TagIcon)
                .child(
                  S.documentTypeList("productMaterial")
                    .title("Administrar materiales")
                    .defaultOrdering([
                      { field: "order", direction: "asc" },
                      { field: "name", direction: "asc" },
                    ]),
                ),

              S.divider(),

              S.listItem()
                .id("materials-linked-products")
                .title("Productos con material confirmado")
                .icon(TagIcon)
                .child(
                  S.documentTypeList("product")
                    .title("Productos con material confirmado")
                    .apiVersion(apiVersion)
                    .filter(
                      '_type == "product" && defined(materialRef) && materialRef->slug.current != "material-a-confirmar"',
                    )
                    .defaultOrdering([
                      { field: "category", direction: "asc" },
                      { field: "name", direction: "asc" },
                    ]),
                ),

              S.listItem()
                .id("materials-pending-products")
                .title("Material pendiente de confirmar")
                .icon(TagIcon)
                .child(
                  S.documentTypeList("product")
                    .title("Material pendiente de confirmar")
                    .apiVersion(apiVersion)
                    .filter(
                      '_type == "product" && (!defined(materialRef) || materialRef->slug.current == "material-a-confirmar")',
                    )
                    .defaultOrdering([
                      { field: "material", direction: "asc" },
                      { field: "category", direction: "asc" },
                      { field: "name", direction: "asc" },
                    ]),
                ),
            ]),
        ),
    ]);
