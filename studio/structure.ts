import { BasketIcon } from "@sanity/icons/Basket";
import { TagIcon } from "@sanity/icons/Tag";
import type { StructureResolver } from "sanity/structure";

const apiVersion = "2026-07-29";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Catálogo Dela Rosa")
    .items([
      S.listItem()
        .title("Productos")
        .icon(TagIcon)
        .child(
          S.documentTypeList("product")
            .title("Productos")
            .apiVersion(apiVersion)
            .filter('_type == "product" && category != "Combos"'),
        ),
      S.listItem()
        .title("Combos")
        .icon(BasketIcon)
        .child(
          S.documentTypeList("product")
            .title("Combos")
            .apiVersion(apiVersion)
            .filter('_type == "product" && category == "Combos"')
            .initialValueTemplates([
              S.initialValueTemplateItem("combo-product"),
            ]),
        ),
    ]);
