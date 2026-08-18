import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";
import { defineQuery } from "next-sanity";
import { products as fallbackProducts, type Product } from "@/lib/store";
import { sanityClient } from "./client";

const builder = createImageUrlBuilder(sanityClient);

const PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && status != "hidden"] | order(featured desc, _createdAt desc, order asc, name asc) {
    _id,
    "slug": slug.current,
    name,
    category,
    "material": coalesce(materialRef->name, material),
    price,
    image,
    gallery[]{_key, asset, crop, hotspot, alt},
    badge,
    description,
    referentialImage,
    imageFit,
    status
  }
`);

type SanityProduct = {
  _id: string;
  slug?: string;
  name: string;
  category: string;
  material?: string;
  price: number;
  image?: SanityImageSource;
  gallery?: Array<
    SanityImageSource & {
      _key: string;
      alt?: string;
    }
  >;
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
      { next: { revalidate: 300, tags: ["products"] } },
    );

    if (!entries.length) return fallbackProducts;

    return entries
      .filter((entry) => entry.image)
      .map((entry) => {
        const imageFit = entry.imageFit === "cover" ? "cover" : "contain";
        const imageUrl = (source: SanityImageSource) => {
          return builder
            .image(source)
            .width(1200)
            .quality(70)
            .auto("format")
            .url();
        };

        const primaryImage = imageUrl(entry.image!);
        const galleryImages = (entry.gallery ?? []).map((image, index) => ({
          src: imageUrl(image),
          alt: image.alt?.trim() || `${entry.name}, vista ${index + 2}`,
        }));

        return {
          id: entry._id,
          growthSlug: entry.slug,
          name: entry.name,
          category: entry.category,
          material: entry.material?.trim() || "Material a confirmar",
          price: entry.price,
          image: primaryImage,
          images: [
            { src: primaryImage, alt: entry.name },
            ...galleryImages,
          ],
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
