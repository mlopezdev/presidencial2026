import { absoluteUrl, json, options } from "@/lib/api-helpers";

export const dynamic = "force-static";
export function OPTIONS() { return options(); }

export function GET(req: Request) {
  return json({
    api: "Presidencial 2026 · UPB Bucaramanga",
    version: "v1",
    descripcion:
      "API pública con datos de candidatos a la presidencia 2026, historial electoral 2010-2022, resultados Congreso 2026 (Senado y Cámara) y geografía electoral de Colombia.",
    fuentes: [
      "Registraduría Nacional del Estado Civil",
      "Curaduría de propuestas y posiciones del proyecto académico UPB Bucaramanga",
    ],
    cors: "Acceso libre desde cualquier origen.",
    docs: absoluteUrl(req, "/api"),
    endpoints: {
      candidatos_lista:           absoluteUrl(req, "/api/v1/candidatos"),
      candidatos_lista_filtrada:  absoluteUrl(req, "/api/v1/candidatos?espectro=izquierda&q=cepeda"),
      candidato_perfil:           absoluteUrl(req, "/api/v1/candidatos/{slug}"),
      temas_polemicos:            absoluteUrl(req, "/api/v1/temas"),
      comparativa_detallada:      absoluteUrl(req, "/api/v1/comparativa"),
      comparativa_filtrada:       absoluteUrl(req, "/api/v1/comparativa?categoria=Derechos&candidato=ivan-cepeda"),
      matriz_ideologica:          absoluteUrl(req, "/api/v1/matriz-ideologica"),
      historial_resumen:          absoluteUrl(req, "/api/v1/historial"),
      historial_año:              absoluteUrl(req, "/api/v1/historial/{2010|2014|2018|2022}"),
      congreso_corporacion:       absoluteUrl(req, "/api/v1/congreso-2026/{senado|camara}"),
      congreso_municipios:        absoluteUrl(req, "/api/v1/congreso-2026/{senado|camara}/munis/{id_depto}"),
      geo_colombia_deptos:        absoluteUrl(req, "/api/v1/geo/colombia-deptos"),
    },
  });
}
