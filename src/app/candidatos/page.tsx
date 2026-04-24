"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ALL_CANDIDATES, AXES, COMPARE_DATA, TIMELINES, DEFAULT_TIMELINE, IDEOLOGY_MATRIX, type Candidate, type Spectrum } from "@/lib/data";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Chevron } from "@/components/ui/Chevron";

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} style={{
          width: i === current - 1 ? 24 : 8, height: 8, borderRadius: 999,
          background: i + 1 <= current ? "var(--brand)" : "#D8DEE5",
          transition: "width 220ms ease, background 220ms ease",
        }} />
      ))}
      <span style={{ marginLeft: 6, fontSize: 15, color: "var(--ink-2)", fontWeight: 500 }}>
        Paso {current} de {total}
      </span>
    </div>
  );
}

// ─── PASO 1: Selector de espectro ───
function SpectrumStep({ onPick }: { onPick: (s: Spectrum) => void }) {
  const spectrums: { key: Spectrum; label: string; color: string }[] = [
    { key: "izquierda", label: "Izquierda", color: "#B3261E" },
    { key: "centro", label: "Centro", color: "#2F6B8A" },
    { key: "derecha", label: "Derecha", color: "#1E40AF" },
  ];

  return (
    <div style={{ animation: "slide-up 300ms ease both" }}>
      <div style={{ marginBottom: 28 }}>
        <StepDots current={1} total={3} />
      </div>
      <h1 style={{ margin: "0 0 12px", fontSize: 40, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)",
        fontFamily: "var(--font-plex-serif), Georgia, serif" }}>
        Elige un espectro político
      </h1>
      <p style={{ margin: "0 0 32px", fontSize: 18, color: "var(--ink-2)" }}>
        Selecciona el espectro que más te representa para filtrar los candidatos.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {spectrums.map((s) => {
          const preview = ALL_CANDIDATES.filter((c) => c.spectrum === s.key).slice(0, 3);
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => onPick(s.key)}
              style={{
                fontFamily: "inherit", textAlign: "left", cursor: "pointer",
                border: `1px solid ${s.color}40`, borderRadius: 20,
                background: `${s.color}08`, padding: "24px 20px",
                transition: "all 180ms ease", color: "var(--ink)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 40px -20px ${s.color}40`;
                (e.currentTarget as HTMLElement).style.borderColor = s.color;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.borderColor = `${s.color}40`;
              }}
            >
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: s.color, marginBottom: 14 }} />
              <div style={{ fontSize: 22, fontWeight: 700, textTransform: "capitalize", color: s.color, marginBottom: 16 }}>
                {s.label}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {preview.map((c) => (
                  <span key={c.name} style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.3 }}>{c.name}</span>
                ))}
                <span style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>
                  +{ALL_CANDIDATES.filter((c) => c.spectrum === s.key).length - 3} más
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── PASO 2: Lista de candidatos ───
function CandidateListStep({ spectrum, onBack, onPick }: { spectrum: Spectrum; onBack: () => void; onPick: (c: Candidate) => void }) {
  const candidates = ALL_CANDIDATES.filter((c) => c.spectrum === spectrum);
  const spectrumColor: Record<Spectrum, string> = { izquierda: "#B3261E", centro: "#2F6B8A", derecha: "#1E40AF" };

  return (
    <div style={{ animation: "slide-up 300ms ease both" }}>
      <div style={{ marginBottom: 28, display: "flex", alignItems: "center", gap: 16 }}>
        <button type="button" onClick={onBack} style={{
          width: 40, height: 40, borderRadius: "50%",
          border: "1px solid var(--line)", background: "#fff",
          cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
          color: "var(--ink)",
        }}>
          <Chevron dir="left" />
        </button>
        <StepDots current={2} total={3} />
      </div>
      <h2 style={{ margin: "0 0 24px", fontSize: 34, fontWeight: 600, letterSpacing: "-0.025em", color: "var(--ink)",
        fontFamily: "var(--font-plex-serif), Georgia, serif" }}>
        Candidatos del espectro{" "}
        <span style={{ color: spectrumColor[spectrum] }}>{spectrum}</span>
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {candidates.map((c, i) => (
          <button
            key={c.name}
            type="button"
            onClick={() => onPick(c)}
            style={{
              fontFamily: "inherit", textAlign: "left", cursor: "pointer",
              border: "1px solid var(--line)", borderRadius: 16,
              background: "#fff", padding: "16px 18px",
              display: "flex", alignItems: "center", gap: 14,
              transition: "all 180ms ease", color: "var(--ink)",
              animationDelay: `${i * 40}ms`,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 24px -14px rgba(13,30,45,0.16)";
              (e.currentTarget as HTMLElement).style.borderColor = c.color;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
              (e.currentTarget as HTMLElement).style.borderColor = "var(--line)";
            }}
          >
            <Avatar name={c.name} color={c.color} size={48} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 17, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.015em" }}>{c.name}</div>
              <div style={{ fontSize: 14, color: "var(--ink-3)", marginTop: 2 }}>{c.party}</div>
              <div style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 4, fontStyle: "italic" }}>{c.lede}</div>
            </div>
            <Chevron dir="right" size={18} />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── PASO 3: Perfil del candidato ───
function ProfileStep({ candidate, onBack, onPickOther }: { candidate: Candidate; onBack: () => void; onPickOther: (c: Candidate) => void }) {
  const [activeTab, setActiveTab] = useState("resumen");
  const tabs = [
    { key: "resumen", label: "Resumen" },
    { key: "trayectoria", label: "Trayectoria" },
    { key: "propuestas", label: "Propuestas" },
    { key: "posiciones", label: "Posiciones" },
    { key: "similitudes", label: "Similitudes" },
    { key: "plan", label: "Plan y DOFA" },
  ];
  const compare = COMPARE_DATA[candidate.name];
  const proposalCount = compare ? Object.values(compare).reduce((a, arr) => a + arr.length, 0) : "—";
  const axesCount = compare ? `${Object.values(compare).filter((a) => a.length > 0).length}/4` : "—";

  return (
    <div style={{ animation: "slide-up 300ms ease both" }}>
      <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
        <button type="button" onClick={onBack} style={{
          width: 40, height: 40, borderRadius: "50%",
          border: "1px solid var(--line)", background: "#fff",
          cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
          color: "var(--ink)",
        }}>
          <Chevron dir="left" />
        </button>
        <StepDots current={3} total={3} />
      </div>

      <article style={{ background: "#fff", borderRadius: 24, border: "1px solid var(--line)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
        {/* Cover */}
        <div style={{ height: 140, background: `linear-gradient(135deg, ${candidate.color} 0%, ${candidate.color}88 100%)`, position: "relative" }}>
          <div style={{ position: "absolute", right: 20, top: 16 }}>
            <span style={{
              fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 999,
              background: "rgba(255,255,255,0.2)", color: "#fff",
              border: "1px solid rgba(255,255,255,0.3)", letterSpacing: "-0.005em",
            }}>
              {candidate.party}
            </span>
          </div>
        </div>

        {/* Header overlap */}
        <div style={{ padding: "0 32px", display: "flex", alignItems: "flex-end", gap: 20, marginTop: -52 }}>
          <div style={{ boxShadow: "0 0 0 5px #fff", borderRadius: "50%" }}>
            <Avatar name={candidate.name} color={candidate.color} size={112} />
          </div>
          <div style={{ flex: 1, minWidth: 0, paddingBottom: 12 }}>
            <h2 style={{ margin: 0, fontSize: 32, fontWeight: 600, letterSpacing: "-0.025em", color: "var(--ink)", lineHeight: 1.1,
              fontFamily: "var(--font-plex-serif), Georgia, serif" }}>
              {candidate.name}
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: 17, color: "var(--ink-2)" }}>
              Fórmula: <strong style={{ color: "var(--ink)", fontWeight: 600 }}>{candidate.vice}</strong>
            </p>
          </div>
        </div>

        {/* Bio + stats */}
        <div style={{ padding: "20px 32px 4px" }}>
          <p style={{ margin: "0 0 16px", fontSize: 17, color: "var(--ink-2)", lineHeight: 1.5, maxWidth: 720 }}>{candidate.lede}</p>
          <div style={{ display: "flex", gap: 28, paddingBottom: 4 }}>
            {[{ k: "Propuestas", v: proposalCount }, { k: "Ejes cubiertos", v: axesCount }, { k: "Espectro", v: candidate.spectrum.charAt(0).toUpperCase() + candidate.spectrum.slice(1) }].map((s) => (
              <div key={s.k} style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.01em" }}>{s.v}</span>
                <span style={{ fontSize: 15, color: "var(--ink-3)" }}>{s.k}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tab bar */}
        <nav style={{ display: "flex", borderBottom: "1px solid var(--line)", marginTop: 12, padding: "0 16px", overflowX: "auto" }}>
          {tabs.map((t) => (
            <button key={t.key} type="button" onClick={() => setActiveTab(t.key)} style={{
              fontFamily: "inherit", fontSize: 16, fontWeight: activeTab === t.key ? 600 : 500,
              padding: "16px 18px", border: 0, cursor: "pointer", background: "transparent",
              color: activeTab === t.key ? "var(--ink)" : "var(--ink-2)", whiteSpace: "nowrap",
              position: "relative", transition: "color 160ms ease",
            }}>
              {t.label}
              {activeTab === t.key && (
                <span style={{ position: "absolute", left: 12, right: 12, bottom: -1, height: 3, background: "var(--brand)", borderRadius: 999 }} />
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: "32px 36px" }}>
          <ProfileTabContent tab={activeTab} candidate={candidate} compare={compare} onPickOther={onPickOther} />
        </div>
      </article>
    </div>
  );
}

function ProfileTabContent({ tab, candidate, compare, onPickOther }: {
  tab: string; candidate: Candidate;
  compare: (typeof COMPARE_DATA)[string] | undefined;
  onPickOther: (c: Candidate) => void;
}) {
  if (tab === "resumen") return (
    <div style={{ maxWidth: 760 }}>
      <h3 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 600, letterSpacing: "-0.025em", color: "var(--ink)",
        fontFamily: "var(--font-plex-serif), Georgia, serif" }}>Resumen</h3>
      <p style={{ margin: "0 0 24px", fontSize: 16, color: "var(--ink-3)", lineHeight: 1.45 }}>Una mirada rápida al candidato y su mensaje.</p>
      <p style={{ margin: "0 0 24px", fontSize: 19, lineHeight: 1.6, color: "var(--ink-2)" }}>
        {candidate.lede} Este perfil reúne su trayectoria, propuestas por eje, posiciones frente a temas importantes y similitudes con otros candidatos para ayudarte a decidir.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {[
          { k: "Partido", v: candidate.party },
          { k: "Fórmula vice", v: candidate.vice },
          { k: "Espectro", v: candidate.spectrum.charAt(0).toUpperCase() + candidate.spectrum.slice(1) },
          { k: "Mensaje central", v: candidate.lede },
        ].map((r) => (
          <div key={r.k} style={{ background: "#F7F8FA", borderRadius: 14, padding: "16px 20px" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>{r.k}</div>
            <div style={{ fontSize: 16, color: "var(--ink)", lineHeight: 1.4 }}>{r.v}</div>
          </div>
        ))}
      </div>
    </div>
  );

  if (tab === "trayectoria") {
    const items = TIMELINES[candidate.name] || DEFAULT_TIMELINE;
    return (
      <div style={{ maxWidth: 760 }}>
        <h3 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 600, letterSpacing: "-0.025em", color: "var(--ink)",
          fontFamily: "var(--font-plex-serif), Georgia, serif" }}>Trayectoria</h3>
        <p style={{ margin: "0 0 24px", fontSize: 16, color: "var(--ink-3)" }}>Línea de tiempo de la carrera pública.</p>
        <ol style={{ listStyle: "none", margin: 0, padding: 0, position: "relative" }}>
          <span aria-hidden style={{ position: "absolute", left: 14, top: 10, bottom: 10, width: 2, background: "linear-gradient(to bottom, rgba(47,107,138,0.35), rgba(47,107,138,0.08))" }} />
          {items.map((h, i) => (
            <li key={h.y + i} style={{ position: "relative", display: "flex", gap: 20, paddingLeft: 44, marginBottom: i < items.length - 1 ? 28 : 0 }}>
              <span aria-hidden style={{ position: "absolute", left: 8, top: 4, width: 14, height: 14, borderRadius: "50%", background: "#fff", border: `3px solid ${candidate.color}`, boxShadow: "0 0 0 3px #fff" }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: candidate.color }}>{h.y}</span>
                  <span style={{ fontSize: 18, fontWeight: 600, color: "var(--ink)" }}>{h.t}</span>
                </div>
                <p style={{ margin: "6px 0 0", fontSize: 16, color: "var(--ink-2)", lineHeight: 1.5 }}>{h.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (tab === "propuestas") {
    if (!compare) return <p style={{ color: "var(--ink-2)", fontSize: 18 }}>Contenido en construcción.</p>;
    return (
      <div>
        <h3 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 600, letterSpacing: "-0.025em", color: "var(--ink)",
          fontFamily: "var(--font-plex-serif), Georgia, serif" }}>Propuestas clave</h3>
        <p style={{ margin: "0 0 24px", fontSize: 16, color: "var(--ink-3)" }}>Organizadas por eje temático.</p>
        <div style={{ display: "grid", gap: 24 }}>
          {AXES.map((a) => {
            const items = compare[a.key] || [];
            if (!items.length) return null;
            return (
              <div key={a.key}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ width: 6, height: 22, borderRadius: 3, background: candidate.color }} />
                  <h4 style={{ margin: 0, fontSize: 19, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.02em" }}>{a.key}</h4>
                  <span style={{ fontSize: 14, color: "var(--ink-3)" }}>{items.length} propuestas</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
                  {items.map((p) => (
                    <div key={p.title} style={{ background: "#F7F8FA", borderRadius: 14, padding: "16px 18px", border: "1px solid rgba(0,0,0,0.04)" }}>
                      <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 6, letterSpacing: "-0.01em", lineHeight: 1.3 }}>{p.title}</div>
                      <div style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.5 }}>{p.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (tab === "posiciones") return (
    <div>
      <h3 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 600, letterSpacing: "-0.025em", color: "var(--ink)",
        fontFamily: "var(--font-plex-serif), Georgia, serif" }}>Posiciones</h3>
      <p style={{ margin: "0 0 24px", fontSize: 16, color: "var(--ink-3)" }}>Postura frente a los cuatro ejes principales.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {AXES.map((a) => {
          const items = compare?.[a.key];
          const summary = items?.[0] ? items[0].desc : a.desc;
          return (
            <div key={a.key} style={{ background: "#F7F8FA", borderRadius: 16, padding: 22, border: "1px solid rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: candidate.color }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Eje</span>
              </div>
              <h4 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.02em" }}>{a.key}</h4>
              <p style={{ margin: 0, fontSize: 16, color: "var(--ink-2)", lineHeight: 1.5 }}>{summary}</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (tab === "similitudes") {
    const others = ALL_CANDIDATES.filter((c) => c.name !== candidate.name && COMPARE_DATA[c.name]);
    const scored = others.map((o) => {
      const sameSpectrum = o.spectrum === candidate.spectrum ? 1 : 0;
      const axesShared = AXES.filter((a) => {
        const A = (COMPARE_DATA[candidate.name] || {} as Record<string, unknown[]>)[a.key] || [];
        const B = (COMPARE_DATA[o.name] || {} as Record<string, unknown[]>)[a.key] || [];
        return A.length > 0 && B.length > 0;
      });
      const score = Math.round(sameSpectrum * 45 + (axesShared.length / 4) * 55);
      return { o, score, shared: axesShared.map((a) => a.key) };
    }).sort((a, b) => b.score - a.score).slice(0, 4);

    return (
      <div>
        <h3 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 600, letterSpacing: "-0.025em", color: "var(--ink)",
          fontFamily: "var(--font-plex-serif), Georgia, serif" }}>Similitudes</h3>
        <p style={{ margin: "0 0 24px", fontSize: 16, color: "var(--ink-3)" }}>Afinidad estimada por espectro y ejes con propuestas desarrolladas.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
          {scored.map(({ o, score, shared }) => (
            <button key={o.name} type="button" onClick={() => onPickOther(o)} style={{
              fontFamily: "inherit", textAlign: "left",
              background: "#fff", border: "1px solid var(--line)",
              borderRadius: 16, padding: 18, cursor: "pointer",
              display: "flex", flexDirection: "column", gap: 12,
              transition: "transform 200ms ease, box-shadow 200ms ease",
              color: "var(--ink)",
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 24px -14px rgba(13,30,45,0.16)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar name={o.name} color={o.color} size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.015em" }}>{o.name}</div>
                  <div style={{ fontSize: 14, color: "var(--ink-3)" }}>{o.party}</div>
                </div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "var(--ink-3)" }}>Afinidad</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--brand)" }}>{score}%</span>
                </div>
                <div style={{ height: 6, background: "#EEF1F4", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ width: score + "%", height: "100%", background: `linear-gradient(90deg, ${candidate.color}, ${o.color})`, borderRadius: 999, transition: "width 400ms ease" }} />
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {shared.slice(0, 4).map((k) => (
                  <span key={k} style={{ fontSize: 12, fontWeight: 500, color: "var(--ink-2)", background: "#F2F4F7", padding: "4px 10px", borderRadius: 999 }}>{k}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 760 }}>
      <h3 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 600, letterSpacing: "-0.025em", color: "var(--ink)",
        fontFamily: "var(--font-plex-serif), Georgia, serif" }}>Plan de gobierno y DOFA</h3>
      <p style={{ margin: "0 0 24px", fontSize: 16, color: "var(--ink-3)" }}>Documentos oficiales y análisis estratégico.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { t: "Plan de gobierno", d: "Documento programático completo del candidato.", cta: "Abrir documento" },
          { t: "Análisis DOFA", d: "Debilidades, oportunidades, fortalezas y amenazas.", cta: "Ver análisis" },
        ].map((c) => (
          <div key={c.t} style={{ background: "#F7F8FA", borderRadius: 16, padding: 22, border: "1px solid rgba(0,0,0,0.04)" }}>
            <h4 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 600, color: "var(--ink)" }}>{c.t}</h4>
            <p style={{ margin: "0 0 14px", fontSize: 15, color: "var(--ink-2)", lineHeight: 1.5 }}>{c.d}</p>
            <Button variant="secondary" style={{ padding: "10px 16px", fontSize: 15 }}>{c.cta}</Button>
          </div>
        ))}
      </div>
      <p style={{ margin: 0, fontSize: 14, color: "var(--ink-3)", lineHeight: 1.5 }}>
        Este bloque conectará con los documentos oficiales cuando estén disponibles públicamente.
      </p>
    </div>
  );
}

// ─── Página principal ───
function CandidatosContent() {
  const searchParams = useSearchParams();
  const preselectedName = searchParams.get("name");
  const preselected = preselectedName ? ALL_CANDIDATES.find((c) => c.name === preselectedName) : null;

  const [spectrum, setSpectrum] = useState<Spectrum | null>(preselected?.spectrum ?? null);
  const [picked, setPicked] = useState<Candidate | null>(preselected ?? null);

  const switchTo = (other: Candidate) => {
    setSpectrum(other.spectrum);
    setPicked(other);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 32px 96px" }}>
      {!spectrum && <SpectrumStep onPick={setSpectrum} />}
      {spectrum && !picked && (
        <CandidateListStep spectrum={spectrum} onBack={() => setSpectrum(null)} onPick={setPicked} />
      )}
      {spectrum && picked && (
        <ProfileStep candidate={picked} onBack={() => setPicked(null)} onPickOther={switchTo} />
      )}
    </main>
  );
}

export default function CandidatosPage() {
  return (
    <Suspense fallback={<div style={{ padding: "80px 32px", textAlign: "center", color: "var(--ink-3)" }}>Cargando...</div>}>
      <CandidatosContent />
    </Suspense>
  );
}
