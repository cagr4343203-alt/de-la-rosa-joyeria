import { BasketIcon } from "@sanity/icons/Basket";
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
