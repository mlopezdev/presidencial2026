"use client";
import { useEffect, useState } from "react";

/**
 * Devuelve true cuando el ancho del viewport es < breakpoint (default 640px).
 * SSR-safe: la primera render siempre devuelve `false`; tras montar se ajusta.
 * Si necesitas evitar el flash desktop→móvil en el cliente, podés gatillar
 * los estilos sólo cuando `mounted` sea true (combinándolo con tu propio flag).
 */
export function useIsMobile(breakpoint = 640): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}
