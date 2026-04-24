"use client";

import { useState } from "react";
import { EL_NATIONAL, EL_COLOR, EL_SPECTRUM, EL_YEARS, type ElectionYear } from "@/lib/elections-data";

const pct = (n: number, d = 1) => `${n.toFixed(d)}%`;
const fmt = (n: number) => n.toLocaleString("es-CO");

const SPECTRUM_CLR: Record<string, string> = { izquierda: "#B3261E", centro: "#6B7280", derecha: "#1E40AF" };

function ElSectionHeader({ kicker, title, dek }: { kicker: string; title: string; dek?: string }) {
  return (
    <div style={{ marginBottom: 28, maxWidth: 820 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#B3261E", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>{kicker}</div>
      <h2 style={{ fontFamily: "var(--font-plex-serif), Georgia, 'Times New Roman', serif", fontSize: 38, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--ink)", margin: "0 0 10px", lineHeight: 1.1 }}>{title}</h2>
      {dek && <p style={{ margin: 0, fontSize: 17, color: "var(--ink-2)", lineHeight: 1.5, maxWidth: 720 }}>{dek}</p>}
    </div>
  );
}

// ─── Hero con selector de año ───
function ElHero({ year, setYear }: { year: number; setYear: (y: number) => void }) {
  const h = EL_NATIONAL[year];
  return (
    <header style={{ borderBottom: "1px solid var(--ink)", paddingBottom: 48, marginBottom: 48 }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 18 }}>
        ELECCIONES PRESIDENCIALES · COLOMBIA · 2010 – 2022
      </div>
      <h1 style={{ fontFamily: "var(--font-plex-serif), Georgia, 'Times New Roman', serif", fontSize: "clamp(40px,6vw,64px)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.02, margin: "0 0 20px", maxWidth: 900, color: "var(--ink)" }}>
        Cómo votó Colombia<br />
        <em style={{ fontStyle: "italic", color: "var(--ink-2)" }}>en las últimas cuatro elecciones.</em>
      </h1>
      <p style={{ fontSize: 19, color: "var(--ink-2)", lineHeight: 1.55, maxWidth: 720, margin: 0 }}>
        Resultados, mapas ideológicos y la abstención que sigue siendo la otra mitad del país.{" "}
        <span style={{ color: "var(--ink-3)" }}>Fuente: Registraduría Nacional del Estado Civil.</span>
      </p>

      {/* Year tabs */}
      <div style={{ display: "flex", gap: 4, marginTop: 32, borderBottom: "1px solid rgba(0,0,0,0.1)", paddingBottom: 0 }}>
        {EL_YEARS.map((y) => {
          const active = y === year;
          return (
            <button key={y} type="button" onClick={() => setYear(y)} style={{
              fontFamily: "inherit", cursor: "pointer", padding: "14px 22px", border: 0,
              borderBottom: active ? "3px solid var(--ink)" : "3px solid transparent", marginBottom: -1,
              background: "transparent", color: active ? "var(--ink)" : "var(--ink-3)",
              display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2,
              transition: "color 160ms ease",
            }}>
              <span style={{ fontSize: 22, fontWeight: active ? 700 : 500, letterSpacing: "-0.02em", fontFamily: "var(--font-plex-serif), Georgia, serif" }}>{y}</span>
              <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", color: active ? "var(--ink-2)" : "var(--ink-3)" }}>
                {EL_NATIONAL[y].winner.split(" ").slice(-1)[0]}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 48, marginTop: 36, alignItems: "start" }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#B3261E", marginBottom: 10 }}>{year} · La historia</div>
          <h2 style={{ fontFamily: "var(--font-plex-serif), Georgia, serif", fontSize: 34, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.015em", margin: "0 0 14px", color: "var(--ink)" }}>{h.headline}</h2>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--ink-2)", margin: 0 }}>{h.blurb}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "rgba(0,0,0,0.08)" }}>
          {[
            { label: "Ganador", value: h.winner, big: true },
            { label: "Total de votos", value: fmt(h.totalVotes) },
            { label: "Participación", value: pct(h.turnout) },
            { label: "Abstención", value: pct(h.abstencion), warn: true },
          ].map((s) => (
            <div key={s.label} style={{ background: "#fff", padding: "18px 20px", gridColumn: s.big ? "span 2" : "auto" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontFamily: "var(--font-plex-serif), Georgia, serif", fontSize: s.big ? 28 : 22, fontWeight: 600, color: s.warn ? "#B3261E" : "var(--ink)", lineHeight: 1.1, letterSpacing: "-0.015em" }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

// ─── Barras de resultados ───
function ElRoundBars({ year }: { year: number }) {
  const [round, setRound] = useState<"r1" | "r2">("r1");
  const n = EL_NATIONAL[year];
  const data = round === "r1" ? n.r1 : n.r2;
  const max = Math.max(...data.map((d) => d.pct));

  return (
    <section style={{ marginBottom: 80 }}>
      <ElSectionHeader kicker="Resultados nacionales" title="La foto de cada vuelta" dek={`Porcentaje sobre votos válidos. ${round === "r1" ? "Primera" : "Segunda"} vuelta.`} />
      <div style={{ display: "flex", gap: 4, marginBottom: 24, padding: 4, background: "#F2F4F7", borderRadius: 10, width: "fit-content" }}>
        {[{ k: "r1", l: "1ra vuelta" }, { k: "r2", l: "2da vuelta" }].map((o) => (
          <button key={o.k} type="button" onClick={() => setRound(o.k as "r1" | "r2")} style={{
            fontFamily: "inherit", fontSize: 14, fontWeight: 600, cursor: "pointer",
            padding: "8px 18px", border: 0, borderRadius: 7,
            background: round === o.k ? "#fff" : "transparent",
            color: round === o.k ? "var(--ink)" : "var(--ink-2)",
            boxShadow: round === o.k ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
          }}>{o.l}</button>
        ))}
      </div>
      <div style={{ display: "grid", gap: 14 }}>
        {data.map((d, i) => {
          const w = (d.pct / max) * 100;
          const color = EL_COLOR[d.name] || "#6B7280";
          return (
            <div key={d.name} style={{ display: "grid", gridTemplateColumns: "220px 1fr 120px", gap: 16, alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.01em" }}>{d.name}</div>
                <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 500 }}>
                  {EL_SPECTRUM[d.name] || ""}
                  {i === 0 && <span style={{ color: "#1F8F5C", marginLeft: 8, fontWeight: 700 }}>· GANADOR</span>}
                </div>
              </div>
              <div style={{ position: "relative", height: 38, background: "#F7F8FA", borderRadius: 3 }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${w}%`, background: color, borderRadius: 3, transition: "width 700ms cubic-bezier(0.2,0.8,0.2,1)" }} />
                <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, fontWeight: 600, color: w > 28 ? "#fff" : "var(--ink)" }}>{pct(d.pct)}</div>
              </div>
              <div style={{ fontSize: 13, color: "var(--ink-2)", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmt(d.votes)}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Gráfico de tendencia por espectro ───
function ElTrendChart() {
  const [metric, setMetric] = useState<"r1" | "r2" | "abst">("r1");

  const series: Record<string, { year: number; val: number }[]> = { izquierda: [], centro: [], derecha: [] };
  const abstSeries: { year: number; val: number }[] = [];

  EL_YEARS.forEach((y) => {
    const n = EL_NATIONAL[y];
    const round = metric === "r2" ? n.r2 : n.r1;
    const totals: Record<string, number> = { izquierda: 0, centro: 0, derecha: 0 };
    round.forEach((c) => { const sp = EL_SPECTRUM[c.name]; if (sp && sp in totals) totals[sp] += c.pct; });
    series.izquierda.push({ year: y, val: totals.izquierda });
    series.centro.push({ year: y, val: totals.centro });
    series.derecha.push({ year: y, val: totals.derecha });
    abstSeries.push({ year: y, val: n.abstencion });
  });

  const W = 800, H = 340, pad = 50;
  const points = metric === "abst" ? { abst: abstSeries } : series;
  const maxVal = metric === "abst" ? 70 : 80;
  const xOf = (y: number) => pad + ((y - 2010) / 12) * (W - 2 * pad);
  const yOf = (v: number) => H - pad - (v / maxVal) * (H - 2 * pad);
  const colors: Record<string, string> = metric === "abst"
    ? { abst: "#1D1D1F" }
    : { izquierda: SPECTRUM_CLR.izquierda, centro: SPECTRUM_CLR.centro, derecha: SPECTRUM_CLR.derecha };

  return (
    <section style={{ marginBottom: 80 }}>
      <ElSectionHeader kicker="Tendencia" title="El péndulo ideológico" dek="Suma de porcentajes de los candidatos por espectro en cada elección." />
      <div style={{ display: "flex", gap: 4, marginBottom: 24, padding: 4, background: "#F2F4F7", borderRadius: 10, width: "fit-content" }}>
        {[{ k: "r1", l: "Por espectro · 1ra vuelta" }, { k: "r2", l: "Por espectro · 2da vuelta" }, { k: "abst", l: "Abstención" }].map((o) => (
          <button key={o.k} type="button" onClick={() => setMetric(o.k as "r1" | "r2" | "abst")} style={{
            fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer",
            padding: "7px 14px", border: 0, borderRadius: 7,
            background: metric === o.k ? "#fff" : "transparent",
            color: metric === o.k ? "var(--ink)" : "var(--ink-2)",
            boxShadow: metric === o.k ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
          }}>{o.l}</button>
        ))}
      </div>
      <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 24 }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
          {[0, 20, 40, 60, 80].filter((v) => v <= maxVal).map((v) => (
            <g key={v}>
              <line x1={pad} y1={yOf(v)} x2={W - pad} y2={yOf(v)} stroke="rgba(0,0,0,0.06)" />
              <text x={pad - 10} y={yOf(v) + 4} fontSize="11" fill="var(--ink-3)" textAnchor="end">{v}%</text>
            </g>
          ))}
          {EL_YEARS.map((y) => (
            <g key={y}>
              <text x={xOf(y)} y={H - pad + 22} fontSize="12" fill="var(--ink-2)" textAnchor="middle" fontWeight="600">{y}</text>
              <line x1={xOf(y)} y1={H - pad} x2={xOf(y)} y2={H - pad + 5} stroke="rgba(0,0,0,0.2)" />
            </g>
          ))}
          {Object.entries(points).map(([k, pts]) => {
            const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${xOf(p.year)} ${yOf(p.val)}`).join(" ");
            return (
              <g key={k}>
                <path d={d} fill="none" stroke={colors[k]} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                {pts.map((p) => (
                  <g key={p.year}>
                    <circle cx={xOf(p.year)} cy={yOf(p.val)} r="5" fill="#fff" stroke={colors[k]} strokeWidth="2.5" />
                    <text x={xOf(p.year)} y={yOf(p.val) - 12} fontSize="11" fontWeight="700" fill={colors[k]} textAnchor="middle">{Math.round(p.val)}%</text>
                  </g>
                ))}
              </g>
            );
          })}
        </svg>
        <div style={{ display: "flex", gap: 18, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
          {Object.entries(colors).map(([k, c]) => (
            <div key={k} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--ink-2)" }}>
              <span style={{ width: 14, height: 3, background: c, borderRadius: 2 }} />
              <span style={{ fontWeight: 500, textTransform: "capitalize" }}>{k === "abst" ? "Abstención" : k}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Abstención ───
function ElAbstention() {
  const data = EL_YEARS.map((y) => ({ year: y, abst: EL_NATIONAL[y].abstencion, turn: EL_NATIONAL[y].turnout }));
  return (
    <section style={{ marginBottom: 80 }}>
      <ElSectionHeader kicker="La otra mitad" title="La abstención, constante" dek="Casi la mitad del censo electoral no vota en ninguna elección presidencial." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {data.map((d) => (
          <div key={d.year} style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 24, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${d.abst}%`, background: "repeating-linear-gradient(45deg, rgba(179,38,30,0.05) 0 8px, rgba(179,38,30,0.1) 8px 16px)" }} />
            <div style={{ position: "relative" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink-3)", letterSpacing: "0.04em" }}>{d.year}</div>
              <div style={{ fontFamily: "var(--font-plex-serif), Georgia, serif", fontSize: 54, fontWeight: 600, color: "#B3261E", letterSpacing: "-0.03em", lineHeight: 1, marginTop: 8 }}>{pct(d.abst, 1)}</div>
              <div style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 6 }}>no votó</div>
              <div style={{ marginTop: 12, fontSize: 13, color: "var(--ink-3)" }}>
                Participación: <span style={{ color: "var(--ink)", fontWeight: 600 }}>{pct(d.turn, 1)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Resultados en segunda vuelta ───
function SecondRoundResults({ year }: { year: number }) {
  const n = EL_NATIONAL[year];
  if (!n.r2 || n.r2.length < 2) return null;
  const [a, b] = n.r2;
  const aColor = EL_COLOR[a.name] || "#6B7280";
  const bColor = EL_COLOR[b.name] || "#6B7280";
  return (
    <section style={{ marginBottom: 80 }}>
      <ElSectionHeader kicker="Segunda vuelta" title={`El duelo final ${year}`} dek="Resultado del balotaje presidencial." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 24, alignItems: "center" }}>
        <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 20, padding: "28px 32px", textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: aColor, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Ganador</div>
          <div style={{ fontFamily: "var(--font-plex-serif), Georgia, serif", fontSize: 28, fontWeight: 600, color: "var(--ink)", marginBottom: 12, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{a.name}</div>
          <div style={{ fontFamily: "var(--font-plex-serif), Georgia, serif", fontSize: 56, fontWeight: 600, color: aColor, letterSpacing: "-0.03em", lineHeight: 1 }}>{pct(a.pct, 1)}</div>
          <div style={{ fontSize: 14, color: "var(--ink-3)", marginTop: 8 }}>{fmt(a.votes)} votos</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-plex-serif), Georgia, serif", fontSize: 32, color: "var(--ink-3)", fontWeight: 300 }}>vs</div>
        </div>
        <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 20, padding: "28px 32px", textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: bColor, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Oponente</div>
          <div style={{ fontFamily: "var(--font-plex-serif), Georgia, serif", fontSize: 28, fontWeight: 600, color: "var(--ink)", marginBottom: 12, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{b.name}</div>
          <div style={{ fontFamily: "var(--font-plex-serif), Georgia, serif", fontSize: 56, fontWeight: 600, color: bColor, letterSpacing: "-0.03em", lineHeight: 1 }}>{pct(b.pct, 1)}</div>
          <div style={{ fontSize: 14, color: "var(--ink-3)", marginTop: 8 }}>{fmt(b.votes)} votos</div>
        </div>
      </div>
    </section>
  );
}

// ─── Página principal ───
export default function HistorialPage() {
  const [year, setYear] = useState(2022);

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 32px 120px" }}>
      <ElHero year={year} setYear={setYear} />
      <ElRoundBars year={year} />
      <SecondRoundResults year={year} />
      <ElTrendChart />
      <ElAbstention />
      <footer style={{ marginTop: 80, paddingTop: 32, borderTop: "1px solid rgba(0,0,0,0.12)", fontSize: 13, color: "var(--ink-3)", lineHeight: 1.6 }}>
        <strong style={{ color: "var(--ink-2)" }}>Metodología.</strong> Los resultados nacionales provienen de consolidados oficiales de la Registraduría Nacional del Estado Civil para 2010, 2014, 2018 y 2022. Los porcentajes son aproximaciones con fines editoriales.
      </footer>
    </main>
  );
}
