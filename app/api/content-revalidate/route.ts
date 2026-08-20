import { revalidatePath, revalidateTag } from "next/cache";

const allowedPaths = new Set(["/", "/nosotros", "/reservas", "/ubicacion", "/productos", "/combos"]);

export async function POST(request: Request) {
  const secret = process.env.STOREFRONT_REVALIDATE_SECRET;
  const authorization = request.headers.get("authorization");
  if (!secret || authorization !== `Bearer ${secret}`) {
    return Response.json({ ok: false, message: "Acceso no autorizado" }, { status: 401 });
  }

  let requestedPaths: unknown = [];
  try {
    requestedPaths = (await request.json() as { paths?: unknown }).paths;
  } catch {
    return Response.json({ ok: false, message: "Solicitud inválida" }, { status: 400 });
  }

  const paths = Array.isArray(requestedPaths)
    ? Array.from(new Set(requestedPaths.filter((path): path is string => typeof path === "string" && allowedPaths.has(path))))
    : [];
  if (!paths.length) {
    return Response.json({ ok: false, message: "No hay rutas válidas" }, { status: 400 });
  }

  if (paths.some((path) => ["/", "/productos", "/combos"].includes(path))) {
    revalidateTag("products", { expire: 0 });
  }
  if (paths.some((path) => ["/productos", "/combos"].includes(path))) {
    revalidateTag("growth-materials", { expire: 0 });
  }
  for (const path of paths) revalidatePath(path);
  revalidatePath("/", "layout");
  return Response.json({ ok: true, paths, revalidatedAt: new Date().toISOString() });
}
