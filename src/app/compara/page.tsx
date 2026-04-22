"use client";

import { useMemo, useState } from "react";
import { axisOrder, candidateOrder, candidates, type AxisKey } from "./data";

const axisDescriptions: Record<AxisKey, string> = {
  Salud: "Cobertura, reforma del sistema, prevención y atención rural.",
  Economía: "Impuestos, productividad, inversión y generación de empleo.",
  Educación: "Acceso, calidad, tecnología y formación para el trabajo.",
  Seguridad: "Control territorial, justicia, prevención y paz.",
};

export default function ComparaCandidatosPage() {
  const [openAxes, setOpenAxes] = useState<Record<AxisKey, boolean>>({
    Salud: true,
    Economía: false,
    Educación: false,
    Seguridad: false,
  });

  const visibleAxes = useMemo(
    () => axisOrder.filter((axis) => openAxes[axis]),
    [openAxes]
  );

  const orderedCandidates = useMemo(() => {
    const priority = new Set(candidateOrder);
    const ordered = candidateOrder
      .map((name) => candidates.find((candidate) => candidate.name === name))
      .filter((candidate): candidate is (typeof candidates)[number] => Boolean(candidate));
    const remaining = candidates.filter((candidate) => !priority.has(candidate.name));
    return [...ordered, ...remaining];
  }, []);

  const handleToggleAxis = (axis: AxisKey) => {
    setOpenAxes((prev) => {
      const isOpen = prev[axis];
      if (isOpen) {
        return { ...prev, [axis]: false };
      }
      return axisOrder.reduce((acc, key) => {
        acc[key] = key === axis;
        return acc;
      }, {} as Record<AxisKey, boolean>);
    });

    const target = document.getElementById(axis.toLowerCase());
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="flex-1">
      <section className="relative overflow-hidden px-6 pb-10 pt-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(47,107,138,0.28),transparent_55%),radial-gradient(circle_at_30%_40%,rgba(15,35,52,0.7),transparent_65%)]" />
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.45em] text-[color:var(--ink-muted)]">
              Eleccion presidencial
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[color:var(--ink)] sm:text-5xl lg:text-6xl" style={{ fontFamily: "var(--font-serif)" }}>
              COMPARA CANDIDATOS
            </h1>
          </div>
          <div className="flex max-w-2xl flex-1 flex-col gap-4">
            <div className="flex flex-wrap gap-3">
              {axisOrder.map((axis) => {
                const isOpen = openAxes[axis];
                return (
                  <button
                    key={axis}
                    type="button"
                    onClick={() => handleToggleAxis(axis)}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                      isOpen
                        ? "border-transparent bg-[linear-gradient(120deg,var(--brand),var(--brand-soft))] text-white shadow-[0_14px_30px_-18px_rgba(47,107,138,0.6)]"
                        : "border-[color:var(--line-soft)] bg-[color:var(--surface-strong)] text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]"
                    }`}
                  >
                    {axis}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto w-full max-w-6xl">
          <div className="overflow-x-auto rounded-[32px] border border-[color:var(--line-soft)] bg-[color:var(--surface-strong)] shadow-[0_30px_70px_-50px_rgba(15,35,52,0.6)]">
            <div className="min-w-[1100px]">
              <div className="grid grid-cols-[220px_repeat(5,minmax(220px,1fr))] border-b border-[color:var(--line-soft)] bg-[color:var(--surface)]">
                <div className="px-6 py-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink-muted)]">
                    Candidatos
                  </p>
                </div>
                {orderedCandidates.map((candidate) => (
                  <div key={candidate.name} className="px-6 py-6">
                    <p className="text-lg font-semibold text-[color:var(--ink)]" style={{ fontFamily: "var(--font-serif)" }}>
                      {candidate.name}
                    </p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--ink-muted)]">
                      {candidate.alignment}
                    </p>
                  </div>
                ))}
              </div>

              {visibleAxes.length === 0 && (
                <div className="px-6 py-10 text-sm text-[color:var(--ink-muted)]">
                  Selecciona un eje en la parte superior para ver la comparacion.
                </div>
              )}

              {visibleAxes.map((axis) => (
                <div key={axis} id={axis.toLowerCase()} className="border-b border-[color:var(--line-soft)]">
                  <div className="grid grid-cols-[220px_repeat(5,minmax(220px,1fr))] bg-[color:var(--surface-strong)]">
                    <div className="px-6 py-6 text-sm font-semibold uppercase tracking-[0.25em] text-[color:var(--ink-muted)]">
                      {axis}
                    </div>
                    {orderedCandidates.map((candidate) => (
                      <div key={`${axis}-body-${candidate.name}`} className="px-6 py-6">
                        <div className="grid gap-4">
                          {candidate.proposals[axis].map((proposal) => (
                            <div
                              key={`${candidate.name}-${axis}-${proposal.title}`}
                              className="rounded-2xl border border-[color:var(--line-soft)] bg-[color:var(--surface)] px-4 py-4 shadow-[0_10px_20px_-18px_rgba(15,35,52,0.35)]"
                            >
                              <p className="text-sm font-semibold text-[color:var(--ink)]">
                                {proposal.title}
                              </p>
                              <p className="mt-2 text-xs leading-relaxed text-[color:var(--ink-muted)]">
                                {proposal.desc}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
