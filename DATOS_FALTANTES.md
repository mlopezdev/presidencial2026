# Datos faltantes — Presidencial 2026

> Última actualización: Abril 24, 2026
> Este archivo se actualiza automáticamente a medida que el equipo sube información.

---

## Estado general

| Sección           | Completo | Parcial | Sin datos |
|-------------------|----------|---------|-----------|
| Foto del candidato | 14/14 ✅ | —       | —         |
| Info básica (partido, fórmula, espectro, lede) | 14/14 ✅ | — | — |
| Posición ideológica (matriz) | 14/14 ✅ | — | — |
| Trayectoria detallada | 5/14 | — | 9/14 ⚠️ |
| Propuestas por eje temático | 7/14 | — | 7/14 ⚠️ |
| Posiciones sí/no en preguntas | 8/14 | 6/14 | — |
| Plan de gobierno / DOFA | 0/14 ❌ | — | 14/14 |

---

## 1. Trayectoria (línea de tiempo)

> Archivo: `src/lib/data.ts` → `TIMELINES`
> Formato: `{ y: "año", t: "título del cargo/hito", d: "descripción" }[]`

### ✅ Tienen trayectoria real:
- Iván Cepeda
- Abelardo de la Espriella
- Paloma Valencia
- Claudia López
- Roy Barreras

### ⚠️ Falta trayectoria (usan placeholder genérico):
- **Sergio Fajardo** — hitos: Alcalde de Medellín (2004–2007), candidato presidencial 2010, 2018, 2022
- **Miguel Uribe Londoño** — hitos: concejal, senador, movimiento Partido Demócrata
- **Luis Gilberto Murillo** — hitos: Gobernador del Chocó, Embajador en EEUU, Canciller 2022–2024
- **Santiago Botero** — hitos: ciclista profesional (Tour de France), emprendedor, candidato 2026
- **Mauricio Lizcano** — hitos: director MinTIC, alcalde Pereira, senador
- **Carlos Caicedo** — hitos: Gobernador del Magdalena, movimiento ciudadano
- **Sondra Macollins** — hitos: abogada, activismo judicial, candidatura 2026
- **Gustavo Matamoros** — hitos: Representante a la Cámara (antioquia), senador
- **Clara López** — hitos: Alcaldesa de Bogotá (e), candidata presidencial 2014, ministra de Trabajo

---

## 2. Propuestas por eje temático (Salud / Economía / Educación / Seguridad)

> Archivo: `src/lib/data.ts` → `COMPARE_DATA`
> Formato: `Record<AxisKey, { title: string; desc: string }[]>`

### ✅ Tienen propuestas completas:
- Iván Cepeda (3+2+2+3 propuestas)
- Abelardo de la Espriella (3+3+2+3)
- Paloma Valencia (3+3+2+3)
- Claudia López (3+3+2+3)
- Roy Barreras (3+3+2+3)
- Sergio Fajardo (2+2+2+2)
- Luis Gilberto Murillo (2+2+2+2)

### ⚠️ Sin propuestas registradas:
- **Miguel Uribe Londoño** — tiene posiciones sí/no pero sin propuestas detalladas
- **Santiago Botero** — sin datos
- **Mauricio Lizcano** — sin datos
- **Carlos Caicedo** — sin datos
- **Sondra Macollins** — sin datos
- **Gustavo Matamoros** — sin datos
- **Clara López** — sin datos (diferente a la Clara López candidata de 2014)

---

## 3. Posiciones sí/no en preguntas de comparación

> Archivo: `src/lib/compare-questions.ts` → `COMPARE_QUESTIONS`
> 15 preguntas en 7 categorías: Institucional, Derechos, Seguridad, Medio ambiente, Economía, Justicia, Social, Educación

### ✅ Cubiertos en la mayoría de preguntas:
- Iván Cepeda
- Abelardo de la Espriella
- Paloma Valencia
- Claudia López
- Roy Barreras
- Sergio Fajardo
- Luis Gilberto Murillo
- Miguel Uribe Londoño *(aparece en algunas preguntas)*

### ❌ Sin cobertura en preguntas (necesitan posición sí/no + cita):
- **Santiago Botero** — faltan 15 preguntas
- **Mauricio Lizcano** — faltan 15 preguntas
- **Carlos Caicedo** — faltan 15 preguntas
- **Sondra Macollins** — faltan 15 preguntas
- **Gustavo Matamoros** — faltan 15 preguntas
- **Clara López** — faltan 15 preguntas

### Preguntas donde faltan candidatos:
| Pregunta | Falta |
|----------|-------|
| Constituyente | Los 6 sin cobertura + Sergio Fajardo |
| Matrimonio igualitario | Los 6 sin cobertura |
| Adopción mismo sexo | Los 6 sin cobertura + Roy Barreras |
| Aborto 24 semanas | Los 6 sin cobertura + Paloma Valencia |
| Paz Total | Los 6 sin cobertura + Sergio Fajardo, Luis Gilberto Murillo |
| Fracking | Los 6 sin cobertura + Roy Barreras |
| Reducir IVA | Los 6 sin cobertura + Sergio Fajardo, Luis Gilberto Murillo, Miguel Uribe |
| Legalizar armas | Los 6 sin cobertura + Miguel Uribe Londoño |
| Mantener JEP | Los 6 sin cobertura + Sergio Fajardo |
| Salario mínimo | Los 6 sin cobertura + Sergio Fajardo, Luis Gilberto Murillo, Miguel Uribe |
| Megacárceles | Los 6 sin cobertura + Luis Gilberto Murillo, Miguel Uribe |
| Reforma salud Petro | Los 6 sin cobertura + Sergio Fajardo, Luis Gilberto Murillo |
| Renta básica | Los 6 sin cobertura + Sergio Fajardo, Miguel Uribe, Luis Gilberto |
| Educación sexual | Los 6 sin cobertura + Roy Barreras |
| Transición energética | Los 6 sin cobertura + Roy Barreras |

---

## 4. Plan de gobierno y DOFA

> Sección en perfil del candidato, tab "Plan y DOFA"
> **Todos los candidatos (14/14) tienen esta sección vacía.**

Para cada candidato se necesita:
1. Enlace PDF al plan de gobierno oficial
2. Análisis DOFA (Debilidades, Oportunidades, Fortalezas, Amenazas)

---

## 5. Campos opcionales para enriquecer

Estos campos mejorarían la experiencia pero no bloquean ninguna sección:

- **Redes sociales** (Twitter/X, Instagram, sitio web) de cada candidato
- **Encuesta de intención de voto** (% por fuente: Invamer, Centro Nacional de Consultoría, etc.)
- **Financiación de campaña** (tope legal, monto recaudado, fuentes)
- **Número de aval** / número de inscripción Registraduría
- **Departamento de origen** del candidato y del vice
- **Edad** de cada candidato

---

## Cómo agregar datos

### Trayectoria
```ts
// src/lib/data.ts → TIMELINES
"Nombre Candidato": [
  { y: "2010", t: "Cargo o hito", d: "Descripción breve en una oración." },
],
```

### Propuestas
```ts
// src/lib/data.ts → COMPARE_DATA
"Nombre Candidato": {
  Salud: [{ title: "Título propuesta", desc: "Descripción." }],
  Economía: [],
  Educación: [],
  Seguridad: [],
},
```

### Posición sí/no
```ts
// src/lib/compare-questions.ts → COMPARE_QUESTIONS[i]
yes: [...existentes, "Nombre Candidato"],
// o
no: [...existentes, "Nombre Candidato"],
quotes: {
  ...existentes,
  "Nombre Candidato": "Cita o paráfrasis de su posición.",
},
```
