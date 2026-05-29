export interface GeoFeature {
  type: "Feature";
  properties: { NOMBRE_DPT: string };
  geometry: { type: "Polygon" | "MultiPolygon"; coordinates: number[][][] | number[][][][] };
}
export interface GeoJSON { type: "FeatureCollection"; features: GeoFeature[] }

export function makeProjection(features: GeoFeature[], width: number, height: number) {
  let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
  const walk = (c: unknown) => {
    if (typeof (c as number[])[0] === "number") {
      const [lng, lat] = c as number[];
      if (lng < minLng) minLng = lng; if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat; if (lat > maxLat) maxLat = lat;
    } else (c as unknown[]).forEach(walk);
  };
  features.forEach((f) => walk(f.geometry.coordinates));
  const midLat = ((minLat + maxLat) / 2) * Math.PI / 180;
  const kx = Math.cos(midLat);
  const w = (maxLng - minLng) * kx; const h = maxLat - minLat;
  const pad = 10;
  const s = Math.min((width - pad * 2) / w, (height - pad * 2) / h);
  const ox = (width - w * s) / 2; const oy = (height - h * s) / 2;
  return (lng: number, lat: number) => [ox + (lng - minLng) * kx * s, oy + (maxLat - lat) * s] as [number, number];
}

export function geomToPath(geom: GeoFeature["geometry"], proj: (lng: number, lat: number) => [number, number]) {
  const ring = (r: number[][]) => r.map(([lng, lat], i) => {
    const [x, y] = proj(lng, lat);
    return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ") + "Z";
  if (geom.type === "Polygon") return (geom.coordinates as number[][][]).map(ring).join(" ");
  return (geom.coordinates as number[][][][]).flat().map(ring).join(" ");
}

// gradiente blanco → color, según valor normalizado en [0,1]
export function shade(hex: string, t: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  const k = 0.08 + 0.92 * Math.max(0, Math.min(1, t));
  const mix = (c: number) => Math.round(255 - (255 - c) * k);
  return `rgb(${mix(r)},${mix(g)},${mix(b)})`;
}

// gradiente divergente: -1 → colorNeg, 0 → blanco, +1 → colorPos
export function diverge(colorNeg: string, colorPos: string, t: number) {
  const tt = Math.max(-1, Math.min(1, t));
  if (tt >= 0) return shade(colorPos, tt);
  return shade(colorNeg, -tt);
}
