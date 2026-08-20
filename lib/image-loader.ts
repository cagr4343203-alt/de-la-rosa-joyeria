import type { ImageLoaderProps } from "next/image";

export default function imageLoader({ src, width, quality }: ImageLoaderProps) {
  if (src.startsWith("https://cdn.sanity.io/")) {
    const imageUrl = new URL(src);

    imageUrl.searchParams.set("w", String(width));
    imageUrl.searchParams.set("q", String(quality ?? 70));
    imageUrl.searchParams.set("auto", "format");
    imageUrl.searchParams.set("fit", "max");

    return imageUrl.toString();
  }

  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}w=${width}`;
}
