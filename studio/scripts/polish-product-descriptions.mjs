import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-08-09" });

const products = await client.fetch(`
  *[
    _type == "product" &&
    !(_id in path("drafts.**")) &&
    (
      description match "*Foto real de Dela Rosa*" ||
      description match "*Foto real enviada por Dela Rosa*" ||
      description match "*material exacto*"
    )
  ]{
    _id,
    category,
    material
  }
`);

function polishedDescription(product) {
  const category = product.category ?? "";

  if (category === "Aros") {
    return "Diseño delicado y versátil, con una terminación cuidada para sumar brillo a looks cotidianos y ocasiones especiales.";
  }

  if (category === "Reloj infantil") {
    return "Un diseño alegre y cómodo, ideal para acompañar el día a día de los más chicos.";
  }

  if (category === "Reloj dama") {
    return "Un modelo elegante y versátil, pensado para acompañar el uso diario y ocasiones especiales.";
  }

  if (category === "Reloj caballero") {
    return "Un modelo funcional y elegante, con detalles pensados para acompañar el uso diario.";
  }

  if (category === "Relojes") {
    return "Una selección pensada para combinar funcionalidad, estilo y detalles que se disfrutan todos los días.";
  }

  if (category === "Bombillas") {
    return "Diseño artesanal con terminación cuidada, ideal para regalar o disfrutar en cada ronda de mate.";
  }

  if (category === "Bolígrafos") {
    return "Diseño ejecutivo, elegante y práctico para regalar o acompañar el trabajo diario.";
  }

  return `Una pieza de ${product.material || "terminación cuidada"}, seleccionada por su diseño y versatilidad.`;
}

const transaction = client.transaction();

for (const product of products) {
  transaction.patch(product._id, (patch) =>
    patch.set({ description: polishedDescription(product) }),
  );
}

if (products.length > 0) {
  await transaction.commit();
}

console.log(`Descripciones profesionales actualizadas: ${products.length}`);
