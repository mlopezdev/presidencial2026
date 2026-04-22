"use client";

import { useMemo, useState } from "react";

const tabs = [
  { id: "concepto", label: "Concepto" },
  { id: "ejecucion", label: "Ejecucion" },
  { id: "presupuesto", label: "Presupuesto" },
  { id: "impacto", label: "Impacto" },
];

type TabId = (typeof tabs)[number]["id"];

type Metric = {
  label: string;
  value: string;
};

const heroMetrics: Metric[] = [
  { label: "Instalaciones en campo", value: "15" },
  { label: "Presupuesto total", value: "$1.985.000" },
  { label: "Alcance estimado", value: "+80K" },
];

const executionSteps = [
  {
    title: "Reconocimiento y seleccion",
    desc: "Identificar 15 huecos con alto flujo y registrar coordenadas para el mapa digital.",
  },
  {
    title: "Instalacion relampago",
    desc: "Equipo de 5 personas instala placas y stickers en 3 horas durante la noche.",
  },
  {
    title: "Lanzamiento digital",
    desc: "Publicacion en redes y activacion del micrositio con QR en sitio.",
  },
  {
    title: "Amplificacion",
    desc: "Respuesta ciudadana, reportes en linea y gestion de prensa local.",
  },
];

const budgetItems = [
  { name: "Placas acrilico dorado (15)", value: "$450.000" },
  { name: "Stickers vinilo (20)", value: "$180.000" },
  { name: "Banners 2x1 (3)", value: "$120.000" },
  { name: "Cinta de senalizacion", value: "$35.000" },
  { name: "Stickers QR (60)", value: "$45.000" },
  { name: "Herramientas y tornillos", value: "$30.000" },
  { name: "Overoles y chalecos", value: "$95.000" },
  { name: "Diseno identidad", value: "$180.000" },
  { name: "Micrositio satirico", value: "$250.000" },
  { name: "Dominio + hosting", value: "$55.000" },
  { name: "Fotografia", value: "$200.000" },
  { name: "Edicion video", value: "$120.000" },
  { name: "Transporte", value: "$60.000" },
  { name: "Viaticos", value: "$75.000" },
  { name: "Contingencia 10%", value: "$90.000" },
];

const impactBars = [
  { label: "Vecinos que ven instalaciones fisicas", value: "35.000", width: 86 },
  { label: "Alcance organico en redes", value: "55.000", width: 72 },
  { label: "Cobertura medios locales", value: "80.000", width: 60 },
  { label: "Medios nacionales", value: "+500.000", width: 42, accent: true },
];

export default function HuecoCampaignPage() {
  const [activeTab, setActiveTab] = useState<TabId>("concepto");

  const activeIndex = useMemo(
    () => tabs.findIndex((tab) => tab.id === activeTab),
    [activeTab]
  );

  return (
    <main className="flex-1">
      <section className="relative overflow-hidden px-6 pb-14 pt-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(47,107,138,0.22),transparent_50%),radial-gradient(circle_at_20%_40%,rgba(10,27,40,0.55),transparent_60%)]" />
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col gap-4">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.45em] text-[color:var(--ink-muted)]">
                Campana BTL
              </p>
              <h1
                className="text-4xl font-semibold tracking-tight text-[color:var(--ink)] sm:text-5xl"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                HUECO &amp; CIA.
              </h1>
              <p className="text-base text-[color:var(--ink-muted)] sm:text-lg">
                Una campana de guerrilla urbana que convierte los huecos en una empresa
                ficticia para hacer visible el abandono vial en Bucaramanga.
              </p>
              <div className="flex flex-wrap gap-3">
                {heroMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-3xl border border-[color:var(--line-soft)] bg-[color:var(--surface-strong)] px-5 py-4 shadow-[0_18px_40px_-30px_rgba(15,35,52,0.4)]"
                  >
                    <p className="text-2xl font-semibold text-[color:var(--brand)]" style={{ fontFamily: "var(--font-serif)" }}>
                      {metric.value}
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink-muted)]">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[32px] border border-[color:var(--line-soft)] bg-[color:var(--surface-strong)] p-6 shadow-[0_30px_70px_-55px_rgba(15,35,52,0.6)]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink-muted)]">
                Concepto central
              </p>
              <h2
                className="mt-4 text-2xl font-semibold text-[color:var(--ink)]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                La empresa mas exitosa de Bucaramanga
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--ink-muted)]">
                Placas doradas y reportes corporativos para mostrar el hueco presupuestal
                con ironia. El humor dispara conversacion sin señalar partidos ni personas.
              </p>
              <div className="mt-6 rounded-2xl border border-[color:var(--line-soft)] bg-[color:var(--surface)] px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--ink-muted)]">
                  Tagline
                </p>
                <p className="mt-3 text-lg font-semibold text-[color:var(--ink)]">
                  "Premio Bache de Oro 2025"
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-full border border-[color:var(--line-soft)] bg-[color:var(--surface-strong)] p-2 shadow-[0_16px_35px_-28px_rgba(15,35,52,0.5)]">
            <div className="grid grid-cols-4 gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--ink-muted)]">
              {tabs.map((tab, index) => {
                const isActive = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-full px-4 py-2 transition ${
                      isActive
                        ? "bg-[linear-gradient(120deg,var(--brand),var(--brand-soft))] text-white shadow-[0_12px_25px_-18px_rgba(47,107,138,0.8)]"
                        : "hover:text-[color:var(--ink)]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[32px] border border-[color:var(--line-soft)] bg-[color:var(--surface-strong)] p-8 shadow-[0_30px_70px_-55px_rgba(15,35,52,0.6)]">
            {activeTab === "concepto" && (
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink-muted)]">
                    Lo que la gente ve
                  </p>
                  <h3
                    className="mt-3 text-2xl font-semibold text-[color:var(--ink)]"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Placas corporativas en huecos reales
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--ink-muted)]">
                    Sedes operativas numeradas, QR con informe anual y cinta amarilla
                    de seguridad. Todo luce oficial para generar impacto inmediato.
                  </p>
                </div>
                <div className="rounded-3xl border border-[color:var(--line-soft)] bg-[color:var(--surface)] px-5 py-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--ink-muted)]">
                    Mensaje implicito
                  </p>
                  <ul className="mt-4 grid gap-3 text-sm text-[color:var(--ink-muted)]">
                    <li>Los huecos existen porque la gestion no responde.</li>
                    <li>El deficit presupuestal se vuelve visible en la calle.</li>
                    <li>El silencio institucional tambien comunica.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "ejecucion" && (
              <div className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {executionSteps.map((step, index) => (
                    <div
                      key={step.title}
                      className="rounded-3xl border border-[color:var(--line-soft)] bg-[color:var(--surface)] px-6 py-5"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink-muted)]">
                        Fase {index + 1}
                      </p>
                      <h3
                        className="mt-3 text-lg font-semibold text-[color:var(--ink)]"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm text-[color:var(--ink-muted)]">
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="rounded-3xl border border-[color:var(--line-soft)] bg-[color:var(--surface)] px-6 py-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink-muted)]">
                    Zonas clave
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--ink-muted)]">
                    {[
                      "La Cumbre",
                      "Barrio El Norte",
                      "Mercado La Cumbre",
                      "Cra 31 con Cll 19",
                      "Av. Quebrada Seca",
                      "Ruta del bus RMB",
                    ].map((zone) => (
                      <span
                        key={zone}
                        className="rounded-full border border-[color:var(--line-soft)] bg-[color:var(--surface-strong)] px-4 py-2"
                      >
                        {zone}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "presupuesto" && (
              <div className="grid gap-6">
                <div className="grid gap-3">
                  {budgetItems.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between rounded-2xl border border-[color:var(--line-soft)] bg-[color:var(--surface)] px-5 py-3 text-sm"
                    >
                      <span className="text-[color:var(--ink-muted)]">{item.name}</span>
                      <span className="font-semibold text-[color:var(--brand)]">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-3xl border border-[color:var(--line-soft)] bg-[linear-gradient(120deg,var(--brand),var(--brand-soft))] px-6 py-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em]">Total inversion</p>
                  <p className="mt-3 text-3xl font-semibold">$1.985.000 COP</p>
                  <p className="mt-2 text-sm text-white/80">Costo estimado por impacto: $13 COP.</p>
                </div>
              </div>
            )}

            {activeTab === "impacto" && (
              <div className="grid gap-6">
                <div className="grid gap-5">
                  {impactBars.map((bar) => (
                    <div key={bar.label}>
                      <div className="flex items-center justify-between text-sm text-[color:var(--ink-muted)]">
                        <span>{bar.label}</span>
                        <span className={bar.accent ? "text-[color:var(--brand)]" : ""}>
                          {bar.value}
                        </span>
                      </div>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[color:var(--surface-muted)]">
                        <div
                          className={`h-full rounded-full ${
                            bar.accent
                              ? "bg-[color:var(--brand)]"
                              : "bg-[linear-gradient(120deg,var(--brand),var(--brand-soft))]"
                          }`}
                          style={{ width: `${bar.width}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl border border-[color:var(--line-soft)] bg-[color:var(--surface)] px-6 py-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink-muted)]">
                      Estrategia digital
                    </p>
                    <ul className="mt-4 grid gap-3 text-sm text-[color:var(--ink-muted)]">
                      <li>Reels con inauguracion satirica.</li>
                      <li>Hilos con cifras reales de presupuesto.</li>
                      <li>Micrositio con reportes ciudadanos.</li>
                    </ul>
                  </div>
                  <div className="rounded-3xl border border-[color:var(--line-soft)] bg-[color:var(--surface)] px-6 py-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink-muted)]">
                      Impacto politico
                    </p>
                    <ul className="mt-4 grid gap-3 text-sm text-[color:var(--ink-muted)]">
                      <li>Convierte resignacion en conversacion publica.</li>
                      <li>Genera cobertura sin gasto en medios tradicionales.</li>
                      <li>Incentiva la denuncia ciudadana.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--ink-muted)]">
            Seccion {activeIndex + 1} de {tabs.length}
          </div>
        </div>
      </section>
    </main>
  );
}
