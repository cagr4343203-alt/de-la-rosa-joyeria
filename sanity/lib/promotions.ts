import { createImageUrlBuilder } from "@sanity/image-url";
import { defineQuery } from "next-sanity";
import { sanityClient } from "./client";

const builder = createImageUrlBuilder(sanityClient);

export type Promotion = {
  id: string;
  title: string;
  badge: string;
  description: string;
  terms?: string;
  image: { src: string; alt: string };
  imageRotation: 0 | 90 | 180 | 270;
  linkLabel?: string;
  linkUrl?: string;
};

const PROMOTIONS_QUERY = defineQuery(`
  *[
    _type == "promotion" &&
    active == true &&
    (!defined(startsAt) || startsAt <= now()) &&
    (!defined(endsAt) || endsAt >= now())
  ] | order(coalesce(order, 9999) asc, title asc, _createdAt asc) {
    _id,
    title,
    badge,
    description,
    terms,
    image,
    imageRotation,
    linkLabel,
    linkUrl
  }
`);

export async function getPromotions(): Promise<Promotion[]> {
  try {
    const entries = await sanityClient.fetch<Array<Record<string, unknown>>>(
      PROMOTIONS_QUERY,
      {},
      { next: { revalidate: 30, tags: ["promotions"] } },
    );

    return entries.flatMap((entry) => {
      if (!entry.image || typeof entry.image !== "object") return [];

      try {
        const rotation = [0, 90, 180, 270].includes(Number(entry.imageRotation))
          ? (Number(entry.imageRotation) as Promotion["imageRotation"])
          : 0;
        const imageEntry = entry.image as { alt?: unknown };

        return [{
          id: String(entry._id),
          title: String(entry.title ?? "Promoción"),
          badge: String(entry.badge ?? "Beneficio especial"),
          description: String(entry.description ?? ""),
          terms: typeof entry.terms === "string" ? entry.terms : undefined,
          image: {
            src: builder.image(entry.image).width(1200).auto("format").url(),
            alt:
              typeof imageEntry.alt === "string" && imageEntry.alt.trim()
                ? imageEntry.alt
                : String(entry.title ?? "Promoción de Dela Rosa"),
          },
          imageRotation: rotation,
          linkLabel:
            typeof entry.linkLabel === "string" ? entry.linkLabel : undefined,
          linkUrl: typeof entry.linkUrl === "string" ? entry.linkUrl : undefined,
        }];
      } catch {
        return [];
      }
    });
  } catch {
    return [];
  }
}
