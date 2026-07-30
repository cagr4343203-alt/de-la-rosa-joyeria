export type Product = {
  id: string | number;
  name: string;
  category: string;
  material: string;
  price: number;
  image: string;
  badge?: string;
  description: string;
  imagePosition?: string;
  referentialImage?: boolean;
  status?: "available" | "outOfStock";
};

export type CartLine = Product & { quantity: number };

export const WHATSAPP_NUMBER = "595985720031";
export const INSTAGRAM_URL = "https://www.instagram.com/dela_rosajoyeria/";
export const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Calle+Estigarribia+y+Constitucion+Encarnacion+Paraguay";

export const products: Product[] = [
  {
    id: 1,
    name: "Cadena Espíritu Santo",
    category: "Cadenas",
    material: "Oro 18K",
    price: 1350000,
    image: "/products/01-cadena-angel.jpg",
    badge: "Nueva",
    description: "Cadena delicada con dije simbólico y terminación luminosa.",
  },
  {
    id: 2,
    name: "Argollas Trenzadas",
    category: "Aros",
    material: "Oro 18K",
    price: 980000,
    image: "/products/02-argollas.jpg",
    badge: "Favorita",
    description: "Argollas livianas con detalle trenzado para todos los días.",
  },
  {
    id: 3,
    name: "Solitario Lumière",
    category: "Anillos",
    material: "Plata Gold",
    price: 425000,
    image: "/products/06-joya.jpg",
    badge: "Destacado",
    description: "Anillo de brillo central, clásico y delicado.",
  },
  {
    id: 4,
    name: "Pulsera Cœurs",
    category: "Pulseras",
    material: "Plata 925",
    price: 350000,
    image: "/products/05-pulsera.jpg",
    description: "Corazones engastados y destellos que acompañan cada gesto.",
  },
  {
    id: 5,
    name: "Collar Éclat",
    category: "Cadenas",
    material: "Enchapado",
    price: 380000,
    image: "/products/07-destello.jpg",
    badge: "Edición especial",
    description: "Collar protagonista de discos dorados con textura satinada.",
  },
  {
    id: 6,
    name: "Collar Mariposa",
    category: "Cadenas",
    material: "Plata Gold",
    price: 295000,
    image: "/products/08-coleccion.jpg",
    description: "Mariposa de nácar con cadena regulable y doble detalle.",
  },
  {
    id: 7,
    name: "Huggies Clásicos",
    category: "Aros",
    material: "Oro 18K",
    price: 720000,
    image: "/products/04-aros.jpg",
    description: "Aros compactos, cómodos y versátiles para combinar.",
  },
  {
    id: 8,
    name: "Set Serena",
    category: "Sets",
    material: "Plata 925",
    price: 470000,
    image: "/products/09-plata.jpg",
    badge: "Para regalar",
    description: "Un set armónico pensado para regalar o regalarte.",
  },
  {
    id: 9,
    name: "Reloj Signature",
    category: "Relojes",
    material: "Acero",
    price: 890000,
    image: "/products/10-reloj.jpg",
    description: "Diseño elegante con caja de acero y lectura limpia.",
  },
  {
    id: 10,
    name: "Dije Destello",
    category: "Dijes",
    material: "Oro 18K",
    price: 1100000,
    image: "/products/11-oro.jpg",
    description: "Una pieza de oro con brillo sutil para llevar siempre.",
  },
  {
    id: 11,
    name: "Bombilla Signature",
    category: "Bombillas",
    material: "Acero inoxidable",
    price: 145000,
    image: "/products/12-regalos-bombilla-boligrafo.png",
    imagePosition: "left center",
    referentialImage: true,
    badge: "Nuevo",
    description: "Bombilla de acero con terminación pulida para un regalo especial.",
  },
  {
    id: 12,
    name: "Bolígrafo Ejecutivo",
    category: "Bolígrafos",
    material: "Laca y metal",
    price: 185000,
    image: "/products/12-regalos-bombilla-boligrafo.png",
    imagePosition: "right center",
    referentialImage: true,
    badge: "Nuevo",
    description: "Bolígrafo elegante en negro y dorado, ideal para obsequiar.",
  },
];

export const categories = [
  "Todo",
  "Anillos",
  "Aros",
  "Cadenas",
  "Pulseras",
  "Sets",
  "Relojes",
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
