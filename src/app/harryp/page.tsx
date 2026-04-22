"use client";

import { useMemo, useState } from "react";

type House = "gryffindor" | "slytherin" | "ravenclaw" | "hufflepuff";

type Option = {
  id: string;
  label: string;
  weights: Record<House, number>;
};

type Question = {
  id: string;
  title: string;
  prompt: string;
  options: Option[];
};

const questions: Question[] = [
  {
    id: "q1",
    title: "Decision bajo presion",
    prompt:
      "Durante un debate tenso, notas un punto debil en tu propia postura. Que haces?",
    options: [
      {
        id: "q1a",
        label: "Lo expones con honestidad y ajustas el argumento en publico.",
        weights: { gryffindor: 3, slytherin: 0, ravenclaw: 2, hufflepuff: 2 },
      },
      {
        id: "q1b",
        label:
          "Reencuadras el debate para que el punto debil se vuelva irrelevante.",
        weights: { gryffindor: 1, slytherin: 3, ravenclaw: 2, hufflepuff: 0 },
      },
      {
        id: "q1c",
        label:
          "Pides una pausa, verificas datos y vuelves con una respuesta solida.",
        weights: { gryffindor: 1, slytherin: 1, ravenclaw: 3, hufflepuff: 1 },
      },
      {
        id: "q1d",
        label:
          "Escuchas a todos, sintetizas y propones un acuerdo justo para todos.",
        weights: { gryffindor: 1, slytherin: 0, ravenclaw: 1, hufflepuff: 3 },
      },
    ],
  },
  {
    id: "q2",
    title: "Lealtad vs. vision",
    prompt:
      "Un amigo cercano toma una decision que afecta a todo tu equipo. No estas de acuerdo. Que priorizas?",
    options: [
      {
        id: "q2a",
        label: "Lo confrontas en privado y defiendes lo que crees correcto.",
        weights: { gryffindor: 3, slytherin: 1, ravenclaw: 1, hufflepuff: 1 },
      },
      {
        id: "q2b",
        label:
          "Apoyas la decision, pero preparas una estrategia para corregir el rumbo.",
        weights: { gryffindor: 0, slytherin: 3, ravenclaw: 2, hufflepuff: 1 },
      },
      {
        id: "q2c",
        label:
          "Pides evidencias y propones una revision tecnica antes de actuar.",
        weights: { gryffindor: 0, slytherin: 1, ravenclaw: 3, hufflepuff: 1 },
      },
      {
        id: "q2d",
        label:
          "Buscas que todos se sientan escuchados y mantienes la cohesion.",
        weights: { gryffindor: 1, slytherin: 0, ravenclaw: 1, hufflepuff: 3 },
      },
    ],
  },
  {
    id: "q3",
    title: "Riesgo calculado",
    prompt:
      "Te ofrecen una oportunidad unica, pero con alta incertidumbre. Como decides?",
    options: [
      {
        id: "q3a",
        label: "Aceptas: la valentia se demuestra en la accion.",
        weights: { gryffindor: 3, slytherin: 1, ravenclaw: 0, hufflepuff: 1 },
      },
      {
        id: "q3b",
        label:
          "Aceptas solo si puedes influir en las reglas del juego.",
        weights: { gryffindor: 1, slytherin: 3, ravenclaw: 1, hufflepuff: 0 },
      },
      {
        id: "q3c",
        label:
          "Analizas escenarios, probabilidades y consecuencias antes de elegir.",
        weights: { gryffindor: 0, slytherin: 1, ravenclaw: 3, hufflepuff: 1 },
      },
      {
        id: "q3d",
        label:
          "Consideras el impacto en otros y eliges lo mas responsable.",
        weights: { gryffindor: 1, slytherin: 0, ravenclaw: 1, hufflepuff: 3 },
      },
    ],
  },
  {
    id: "q4",
    title: "Talento en equipo",
    prompt:
      "Tu equipo tiene a alguien brillante pero dificil. Como lo manejas?",
    options: [
      {
        id: "q4a",
        label:
          "Le das un reto claro y lo motivas a superar sus propios limites.",
        weights: { gryffindor: 3, slytherin: 1, ravenclaw: 1, hufflepuff: 0 },
      },
      {
        id: "q4b",
        label:
          "Aprovechas su talento en tareas clave y negocias con firmeza.",
        weights: { gryffindor: 1, slytherin: 3, ravenclaw: 1, hufflepuff: 0 },
      },
      {
        id: "q4c",
        label:
          "Le pides que documente su trabajo y compartes aprendizajes.",
        weights: { gryffindor: 0, slytherin: 1, ravenclaw: 3, hufflepuff: 1 },
      },
      {
        id: "q4d",
        label:
          "Trabajas su integracion al grupo y reduces fricciones.",
        weights: { gryffindor: 1, slytherin: 0, ravenclaw: 1, hufflepuff: 3 },
      },
    ],
  },
  {
    id: "q5",
    title: "Etica en conflicto",
    prompt:
      "Descubres una ventaja no regulada que podria beneficiarte mucho. Que haces?",
    options: [
      {
        id: "q5a",
        label: "La rechazas: no ganarias algo que no defenderias en publico.",
        weights: { gryffindor: 3, slytherin: 0, ravenclaw: 1, hufflepuff: 2 },
      },
      {
        id: "q5b",
        label:
          "La usas si no hay reglas claras, pero mantienes control del riesgo.",
        weights: { gryffindor: 0, slytherin: 3, ravenclaw: 1, hufflepuff: 0 },
      },
      {
        id: "q5c",
        label:
          "Investigas el marco legal y actuas segun evidencia.",
        weights: { gryffindor: 0, slytherin: 1, ravenclaw: 3, hufflepuff: 1 },
      },
      {
        id: "q5d",
        label:
          "Consultas al grupo y eliges lo mas justo para todos.",
        weights: { gryffindor: 1, slytherin: 0, ravenclaw: 1, hufflepuff: 3 },
      },
    ],
  },
];

const houseMeta: Record<House, { title: string; tone: string; desc: string }> = {
  gryffindor: {
    title: "Gryffindor",
    tone: "bg-[#f8e7e7] text-[#8b1a1a]",
    desc: "Valor, iniciativa y voluntad para actuar cuando otros dudan.",
  },
  slytherin: {
    title: "Slytherin",
    tone: "bg-[#e6f1ea] text-[#0f5132]",
    desc: "Ambicion enfocada, estrategia y capacidad de convertir vision en ventaja.",
  },
  ravenclaw: {
    title: "Ravenclaw",
    tone: "bg-[#e8eef8] text-[#1b3a6b]",
    desc: "Curiosidad, claridad mental y amor por las buenas ideas.",
  },
  hufflepuff: {
    title: "Hufflepuff",
    tone: "bg-[#faf4e6] text-[#7a5a00]",
    desc: "Lealtad, constancia y una etica fuerte al colaborar.",
  },
};

export default function HarryPQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const totalQuestions = questions.length;
  const current = questions[step];

  const scores = useMemo(() => {
    const base: Record<House, number> = {
      gryffindor: 0,
      slytherin: 0,
      ravenclaw: 0,
      hufflepuff: 0,
    };

    questions.forEach((question) => {
      const chosen = answers[question.id];
      if (!chosen) return;
      const option = question.options.find((opt) => opt.id === chosen);
      if (!option) return;
      (Object.keys(base) as House[]).forEach((house) => {
        base[house] += option.weights[house];
      });
    });

    return base;
  }, [answers]);

  const finished = step >= totalQuestions;

  const winner = useMemo(() => {
    const entries = Object.entries(scores) as [House, number][];
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0]?.[0];
  }, [scores]);

  const progress = Math.round((Math.min(step, totalQuestions) / totalQuestions) * 100);

  const handleAnswer = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const nextStep = () => {
    if (!answers[current.id]) return;
    setStep((prev) => Math.min(prev + 1, totalQuestions));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const reset = () => {
    setAnswers({});
    setStep(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4f5f7] via-[#f7f8fa] to-white px-6 py-16 text-[#111111]">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-10 flex flex-col gap-4">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-[#6b7280]">
            Harry Potter House Test
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-[#0b0b0d] sm:text-5xl">
            Descubre a que casa pertenecerias
          </h1>
          <p className="max-w-2xl text-lg text-[#4b5563]">
            Responde preguntas elaboradas y el sistema pondera tus respuestas con un
            enfoque estrategico, no solo por gustos superficiales.
          </p>
        </div>

        <div className="rounded-3xl border border-white/80 bg-white/70 p-8 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.45)] backdrop-blur">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div className="text-sm font-medium text-[#6b7280]">
              Progreso: {progress}%
            </div>
            <div className="h-2 w-48 overflow-hidden rounded-full bg-[#e5e7eb]">
              <div
                className="h-full rounded-full bg-[#111827] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {!finished && current ? (
            <div className="flex flex-col gap-6">
              <div className="rounded-2xl bg-[#f6f7fb] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9ca3af]">
                  {current.title}
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-[#111827]">
                  {current.prompt}
                </h2>
              </div>

              <div className="grid gap-4">
                {current.options.map((option) => {
                  const active = answers[current.id] === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleAnswer(current.id, option.id)}
                      className={`rounded-2xl border px-6 py-4 text-left text-base transition-all ${
                        active
                          ? "border-[#111827] bg-[#111827] text-white"
                          : "border-[#e5e7eb] bg-white hover:border-[#9ca3af]"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={step === 0}
                  className="rounded-full border border-[#e5e7eb] px-6 py-2 text-sm font-medium text-[#6b7280] transition disabled:opacity-40"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-full bg-[#111827] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#1f2937]"
                >
                  {step === totalQuestions - 1 ? "Ver resultado" : "Siguiente"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="rounded-3xl border border-white/60 bg-white p-8 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.35)]">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9ca3af]">
                  Resultado
                </p>
                {winner ? (
                  <div className="mt-6 flex flex-col gap-4">
                    <span
                      className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${
                        houseMeta[winner].tone
                      }`}
                    >
                      {houseMeta[winner].title}
                    </span>
                    <p className="text-2xl font-semibold text-[#111827]">
                      {houseMeta[winner].desc}
                    </p>
                  </div>
                ) : (
                  <p className="mt-6 text-base text-[#4b5563]">
                    Completa el test para ver tu casa.
                  </p>
                )}
              </div>

              <div className="grid gap-3 text-sm text-[#6b7280]">
                {(Object.keys(scores) as House[]).map((house) => (
                  <div
                    key={house}
                    className="flex items-center justify-between rounded-2xl border border-[#eef0f3] bg-white px-5 py-3"
                  >
                    <span className="font-medium text-[#111827]">
                      {houseMeta[house].title}
                    </span>
                    <span>{scores[house]} pts</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={reset}
                className="w-fit rounded-full border border-[#e5e7eb] px-6 py-2 text-sm font-semibold text-[#111827]"
              >
                Repetir test
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
