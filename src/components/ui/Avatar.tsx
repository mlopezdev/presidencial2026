interface AvatarProps {
  name: string;
  color?: string;
  size?: number;
  photo?: string;
}

export function Avatar({ name, color = "#2F6B8A", size = 56, photo }: AvatarProps) {
  const inits = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const s = `${size}px`;

  if (photo) {
    return (
      <div
        aria-hidden="true"
        style={{
          width: s, height: s, borderRadius: "50%",
          overflow: "hidden", flex: "0 0 auto", position: "relative",
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.10)",
          background: color,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
        />
      </div>
    );
  }

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
