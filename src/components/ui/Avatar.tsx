interface AvatarProps { name: string; color?: string; size?: number; }

export function Avatar({ name, color = "#2F6B8A", size = 56 }: AvatarProps) {
  const inits = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const s = `${size}px`;
  return (
    <div
      aria-hidden="true"
      style={{
        width: s, height: s, borderRadius: "50%",
        background: color, color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 600, fontSize: Math.round(size * 0.38) + "px",
        letterSpacing: "0.01em", flex: "0 0 auto",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)",
      }}
    >
      {inits}
    </div>
  );
}
