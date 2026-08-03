import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";
import { defineQuery } from "next-sanity";
import { products as fallbackProducts, type Product } from "@/lib/store";
import { sanityClient } from "./client";

const builder = createImageUrlBuilder(sanityClient);

const PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && status != "hidden"] | order(featured desc, order asc, name asc) {
    _id,
    name,
    category,
    material,
    price,
    image,
    badge,
    description,
    referentialImage,
    imageFit,
    status
  }
`);

type SanityProduct = {
  _id: string;
  name: string;
  category: string;
  material: string;
  price: number;
  image?: SanityImageSource;
  badge?: string;
  description: string;
  referentialImage?: boolean;
  imageFit?: "cover" | "contain";
  status?: "available" | "outOfStock" | "hidden";
};

export async function getProducts(): Promise<Product[]> {
  try {
    const entries = await sanityClient.fetch<SanityProduct[]>(
      PRODUCTS_QUERY,
      {},
      { next: { revalidate: 30, tags: ["products"] } },
    );

    if (!entries.length) return fallbackProducts;

    return entries
      .filter((entry) => entry.image)
      .map((entry) => {
        const imageFit = entry.imageFit === "cover" ? "cover" : "contain";
        const imageBuilder = builder.image(entry.image!).width(1200);

        return {
          id: entry._id,
          name: entry.name,
          category: entry.category,
          material: entry.material,
          price: entry.price,
          image:
            imageFit === "cover"
              ? imageBuilder.height(1500).fit("crop").auto("format").url()
              : imageBuilder.auto("format").url(),
          imageFit,
          badge: entry.badge,
          description: entry.description,
          referentialImage: entry.referentialImage,
          status:
            entry.status === "outOfStock" ? "outOfStock" : "available",
        };
      });
  } catch {
    return fallbackProducts;
  }
}
