import { giftProducts } from "./gift-products";
import { watchProducts } from "./watch-products";
import { clientNewProducts } from "./client-new-products";

export type Product = {
  id: string | number;
  name: string;
  category: string;
  material: string;
  price: number;
  image: string;
  badge?: string;
  description: string;
  imageFit?: "cover" | "contain";
  imagePosition?: string;
  referentialImage?: boolean;
  status?: "available" | "outOfStock";
};

export type CartLine = Product & { quantity: number };

export const WHATSAPP_NUMBER = "595985720031";
export const STORE_PHONE = "+59571205132";
export const INSTAGRAM_URL = "https://www.instagram.com/dela_rosajoyeria/";
export const TIKTOK_URL = "https://www.tiktok.com/@delarosa.joyeria";
export const FACEBOOK_URL = "https://www.facebook.com/delarosa.joyeria";
export const MAPS_URL = "https://maps.app.goo.gl/vzreQDfWqbHvAty1A";
export const STORE_ADDRESS =
  "Mariscal José Félix Estigarribia, Encarnación, Paraguay";
export const STORE_HOURS = [
  {
    days: "Lunes a viernes",
    times: ["08:00 - 12:30", "15:00 - 19:00"],
  },
  {
    days: "Sábado",
    times: ["08:00 - 13:00", "15:00 - 19:00"],
  },
  {
    days: "Domingo",
    times: ["Cerrado"],
  },
] as const;

export const products: Product[] = [
  {
    id: 1,
    name: "Cadena Espíritu Santo",
    category: "Cadenas",
    material: "Oro 18K",
    price: 0,
    image: "/products/01-cadena-angel.jpg",
    badge: "Nueva",
    description: "Cadena delicada con dije simbólico y terminación luminosa.",
  },
  {
    id: 2,
    name: "Argollas Trenzadas",
    category: "Aros",
    material: "Oro 18K",
    price: 0,
    image: "/products/02-argollas.jpg",
    badge: "Favorita",
    description: "Argollas livianas con detalle trenzado para todos los días.",
  },
  {
    id: 3,
    name: "Solitario Lumière",
    category: "Anillos",
    material: "Plata Gold",
    price: 0,
    image: "/products/06-joya.jpg",
    badge: "Destacado",
    description: "Anillo de brillo central, clásico y delicado.",
  },
  {
    id: 4,
    name: "Pulsera Cœurs",
    category: "Pulseras",
    material: "Plata 925",
    price: 0,
    image: "/products/05-pulsera.jpg",
    description: "Corazones engastados y destellos que acompañan cada gesto.",
  },
  {
    id: 5,
    name: "Collar Éclat",
    category: "Cadenas",
    material: "Enchapado",
    price: 0,
    image: "/products/07-destello.jpg",
    badge: "Edición especial",
    description: "Collar protagonista de discos dorados con textura satinada.",
  },
  {
    id: 6,
    name: "Collar Mariposa",
    category: "Cadenas",
    material: "Plata Gold",
    price: 0,
    image: "/products/08-coleccion.jpg",
    description: "Mariposa de nácar con cadena regulable y doble detalle.",
  },
  {
    id: 7,
    name: "Huggies Clásicos",
    category: "Aros",
    material: "Oro 18K",
    price: 0,
    image: "/products/04-aros.jpg",
    description: "Aros compactos, cómodos y versátiles para combinar.",
  },
  {
    id: 8,
    name: "Set Serena",
    category: "Sets",
    material: "Plata 925",
    price: 0,
    image: "/products/09-plata.jpg",
    badge: "Para regalar",
    description: "Un set armónico pensado para regalar o regalarte.",
  },
  {
    id: 9,
    name: "Reloj Signature",
    category: "Relojes",
    material: "Acero",
    price: 0,
    image: "/products/10-reloj.jpg",
    description: "Diseño elegante con caja de acero y lectura limpia.",
  },
  {
    id: 10,
    name: "Dije Destello",
    category: "Dijes",
    material: "Oro 18K",
    price: 0,
    image: "/products/11-oro.jpg",
    description: "Una pieza de oro con brillo sutil para llevar siempre.",
  },
  ...giftProducts,
  ...watchProducts,
  ...clientNewProducts,
];

export const categories = [
  "Todo",
  "Anillos",
  "Aros",
  "Cadenas",
  "Pulseras",
  "Sets",
  "Relojes",
  "Reloj dama",
  "Reloj caballero",
  "Reloj infantil",
  "Bombillas",
  "Bolígrafos",
  "Combos",
  "Regalos",
];

export const materials = [
  "Todos",
  "Oro 18K",
  "Plata 925",
  "Plata Gold",
  "Acero",
  "Enchapado",
];

export function money(value: number) {
  return `Gs. ${new Intl.NumberFormat("es-PY").format(value)}`;
}

export function whatsappHref(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
