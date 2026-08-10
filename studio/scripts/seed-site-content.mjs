import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-08-09" });

const piercingImage = {
  _type: "image",
  asset: {
    _type: "reference",
    _ref: "image-701956a0bf616aa21c50df4aafe61280a4257ba5-723x989-png",
  },
  alt: "Perforación de oreja realizada con aros plateados",
};

const aboutImage = {
  _type: "image",
  asset: {
    _type: "reference",
    _ref: "image-201fa08d54a7ff20f50dc5624e9289bdace9828c-500x500-jpg",
  },
  alt: "Logo de Dela Rosa Joyería y Relojería",
};

const documents = [
  {
    _id: "siteSettings",
    _type: "siteSettings",
    brandName: "DELA ROSA",
    brandTagline: "Joyería · Relojería",
    whatsappNumber: "595985720031",
    phone: "+595 71 205 132",
    address: "Mariscal José Félix Estigarribia, Encarnación, Paraguay",
    mapsUrl: "https://maps.app.goo.gl/vzreQDfWqbHvAty1A",
    instagramUrl: "https://www.instagram.com/dela_rosajoyeria/",
    instagramLabel: "@dela_rosajoyeria",
    tiktokUrl: "https://www.tiktok.com/@delarosa.joyeria",
    tiktokLabel: "@delarosa.joyeria",
    facebookUrl: "https://www.facebook.com/delarosa.joyeria",
    facebookLabel: "Dela Rosa Joyería",
    promotionsKicker: "Beneficios vigentes",
    promotionsTitle: "Promociones para elegir tu detalle",
    promotionsDescription:
      "Aprovechá beneficios con tarjetas seleccionadas. Consultá siempre vigencia y condiciones.",
    hours: [
      {
        _key: "weekdays",
        _type: "openingHours",
        days: "Lunes a viernes",
        times: ["08:00 - 12:30", "15:00 - 19:00"],
      },
      {
        _key: "saturday",
        _type: "openingHours",
        days: "Sábado",
        times: ["08:00 - 13:00", "15:00 - 19:00"],
      },
      {
        _key: "sunday",
        _type: "openingHours",
        days: "Domingo",
        times: ["Cerrado"],
      },
    ],
  },
  {
    _id: "reservationPage",
    _type: "reservationPage",
    kicker: "Perforación de oreja · Con reserva",
    title: "Elegí tu momento.",
    emphasis: "Nosotros cuidamos cada detalle.",
    description:
      "Completá tus preferencias y enviaremos la solicitud por WhatsApp. La reserva queda confirmada cuando el equipo de Dela Rosa te responde.",
    benefits: [
      { _key: "care", icon: "shield", title: "Orientación y cuidado" },
      { _key: "time", icon: "clock", title: "Horario coordinado" },
      { _key: "attention", icon: "sparkles", title: "Atención personalizada" },
    ],
    referenceImage: piercingImage,
    referenceEyebrow: "Imagen de referencia",
    referenceTitle: "Inspiración para elegir tu estilo",
    referenceDescription:
      "El equipo te orientará sobre las opciones disponibles durante la confirmación de tu reserva.",
    formEyebrow: "Solicitud de reserva",
    formTitle: "Perforación de oreja",
    nameLabel: "Nombre y apellido *",
    namePlaceholder: "Tu nombre",
    serviceLabel: "Servicio *",
    dateLabel: "Fecha preferida *",
    timeLabel: "Horario preferido *",
    notesLabel: "Observaciones",
    notesPlaceholder: "Contanos si tenés alguna preferencia o consulta.",
    serviceOptions: ["Una perforación", "Dos perforaciones", "Consulta previa"],
    buttonLabel: "Solicitar reserva por WhatsApp",
    paymentNotice: "No se realiza ningún cobro desde esta página.",
    whatsappIntro:
      "Hola Dela Rosa ✨ Quiero solicitar una reserva para perforación de oreja.",
    whatsappOutro:
      "¿Me confirman disponibilidad, indicaciones y precio final, por favor?",
    stepsKicker: "Cómo reservar",
    stepsTitle: "Simple, rápido y acompañado",
    steps: [
      {
        _key: "choose",
        icon: "calendar",
        title: "Elegí fecha y horario",
        description: "Indicá cuándo preferís visitar el local.",
      },
      {
        _key: "confirm",
        icon: "message",
        title: "Confirmamos por WhatsApp",
        description: "El equipo revisa la agenda y confirma contigo.",
      },
      {
        _key: "visit",
        icon: "sparkles",
        title: "Vení a Dela Rosa",
        description: "Recibí orientación e indicaciones para tu visita.",
      },
    ],
  },
  {
    _id: "aboutPage",
    _type: "aboutPage",
    heroImage: aboutImage,
    foundingYear: "2003",
    kicker: "Nuestra historia",
    title: "Desde el 2003 formando parte de tus momentos.",
    description:
      "Gracias por elegirnos para convertir un detalle en un recuerdo. En Dela Rosa seleccionamos joyas, relojes y regalos con una atención cercana y personalizada.",
    proofPoints: [
      { _key: "years", value: "+20 años", label: "acompañando momentos" },
      { _key: "city", value: "Encarnación", label: "nuestra casa" },
    ],
    buttonLabel: "Conocer productos",
    values: [
      {
        _key: "selection",
        icon: "gem",
        title: "Selección",
        description: "Piezas elegidas para celebrar momentos únicos.",
      },
      {
        _key: "closeness",
        icon: "heart",
        title: "Cercanía",
        description: "Te acompañamos a encontrar el detalle indicado.",
      },
      {
        _key: "experience",
        icon: "sparkles",
        title: "Experiencia",
        description: "Más de dos décadas formando parte de Encarnación.",
      },
    ],
    socialKicker: "Seguinos",
    socialTitle: "Descubrí novedades y piezas recién llegadas.",
  },
  {
    _id: "locationPage",
    _type: "locationPage",
    kicker: "El local",
    title: "Vení a conocernos",
    description:
      "Te esperamos en el centro de Encarnación para asesorarte de forma personalizada.",
    hoursFeature: "Horarios actualizados",
    hoursTitle: "Horario de atención",
    mapsButtonLabel: "Abrir Google Maps",
    whatsappButtonLabel: "Consultar horario",
    whatsappMessage:
      "Hola Dela Rosa, quiero consultar el horario para visitar el local.",
    mapTitle: "DELA ROSA",
    mapSubtitle: "Mariscal José Félix Estigarribia",
    mapFooterLabel: "Abrir ubicación",
  },
];

const transaction = client.transaction();

for (const document of documents) {
  transaction.createOrReplace(document);
}

await transaction.commit({ autoGenerateArrayKeys: true });

console.log(`Contenido editable preparado: ${documents.length} apartados.`);
