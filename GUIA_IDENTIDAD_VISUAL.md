# Guia De Identidad Visual

## Objetivo
Definir una base visual clara, profesional y consistente para la plataforma, con reglas simples para mantener coherencia en nuevas pantallas.

## Paleta Principal (Modo Claro)
- Tinta principal: `#24303D` (texto principal, titulos, iconos importantes)
- Azul institucional: `#2F6B8A` (acciones, hovers, acentos de navegacion)
- Gris acero: `#9AA8B5` (acento suave, detalles secundarios)
- Azul secundario: `#5B7F95` (gradientes y estados activos)
- Fondo general: `#F6F8FB` (fondo de pagina)
- Superficie: `#FFFFFF` (tarjetas, paneles, bloques)
- Texto secundario: `#6E7D8C` (metadatos, labels, ayudas)
- Linea suave: `rgba(36, 48, 61, 0.14)` (bordes y separadores)

## Paleta Principal (Modo Oscuro)
- Fondo general: `#102030`
- Superficie: `#173043`
- Superficie fuerte: `#1F3A4E`
- Texto principal: `#E6F0F8`
- Texto secundario: `#AEC2D3`
- Linea suave: `rgba(230, 240, 248, 0.17)`

## Tipografias
- Titulos y jerarquia editorial: IBM Plex Serif
  - Pesos: 600, 700
- Texto de interfaz y lectura continua: IBM Plex Sans
  - Pesos: 400, 500, 600

## Reglas De Uso

### 1) Jerarquia Tipografica
- H1/H2/H3: IBM Plex Serif, peso 700
- Subtitulos y texto de apoyo: IBM Plex Sans, peso 500
- Cuerpo de texto: IBM Plex Sans, peso 400
- Microcopy (labels, metadata): IBM Plex Sans, peso 500 y tracking sutil

### 2) Superficies Y Profundidad
- Fondo base siempre claro (o oscuro en tema dark).
- Tarjetas con borde suave y sombra ligera, evitando contrastes agresivos.
- Bordes redondeados amplios para mantener estilo limpio y moderno.

### 3) Acciones Y Estados
- Boton primario y estado activo: gradiente entre `#2F6B8A` y `#5B7F95`.
- Hover: incremento leve de brillo/contraste y elevacion pequena.
- Estados secundarios: usar fondos transluidos del azul institucional.

### 4) Texto Y Legibilidad
- Texto principal siempre en tinta alta (`#24303D` o `#E6F0F8` en dark).
- Texto secundario solo para contenido auxiliar.
- Evitar usar acentos para parrafos largos.

### 5) Consistencia De Componente
- Navegacion: estilo pill, bordes suaves, estados activos claros.
- Tarjetas de candidato: superficie limpia, acento azul controlado.
- Paneles de contenido: fondo neutro, contraste alto para lectura.

## Aplicacion Actual En El Proyecto
- Tokens y colores: `src/app/globals.css`
- Tipografias de Google Fonts y variables: `src/app/layout.tsx`
- Cambio manual de tema claro/oscuro: `src/app/theme-toggle.tsx`

## Regla Rapida Para Futuras Pantallas
Si un elemento es nuevo y no sabes que color usar:
1. Fondo: superficie (`#FFFFFF` en claro)
2. Texto: tinta principal
3. Accion: azul institucional
4. Estado activo: gradiente institucional
5. Borde: linea suave
