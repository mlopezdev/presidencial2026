function NavBar({ route, setRoute }) {
  const items = [
    { key: "home", label: "Inicio" },
    { key: "candidatos", label: "Candidatos" },
    { key: "compara", label: "Comparar" },
    { key: "historial", label: "Historial" },
    { key: "contacto", label: "Contacto" },
  ];

  return (
    <div
      style={{
        position: "sticky",
        top: 16,
        zIndex: 50,
        display: "flex",
        justifyContent: "center",
        padding: "0 16px",
        pointerEvents: "none",
      }}
    >
      <header
        className="liquid-nav"
        style={{
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 10px 8px 18px",
          borderRadius: 999,
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "saturate(180%) blur(22px)",
          WebkitBackdropFilter: "saturate(180%) blur(22px)",
          border: "1px solid rgba(255,255,255,0.7)",
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.9) inset," +
            " 0 -1px 0 rgba(0,0,0,0.04) inset," +
            " 0 10px 30px -10px rgba(13,30,45,0.2)," +
            " 0 2px 8px -2px rgba(13,30,45,0.08)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Specular highlight (reflejo tipo cristal) */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0) 55%)",
            pointerEvents: "none",
            mixBlendMode: "overlay",
            opacity: 0.7,
          }}
        />
        {/* Brand */}
        <button
          onClick={() => setRoute("home")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "transparent",
            border: 0,
            cursor: "pointer",
            padding: "4px 10px 4px 0",
            fontFamily: "inherit",
            position: "relative",
            zIndex: 1,
          }}
          aria-label="Ir al inicio"
        >
          <span
            aria-hidden="true"
            style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              background:
                "linear-gradient(180deg, color-mix(in oklab, var(--brand) 100%, white 18%) 0%, var(--brand) 100%)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "-0.02em",
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.5) inset, 0 2px 5px -1px rgba(0,0,0,0.18)",
            }}
          >
            P
          </span>
          <span
            style={{
              fontSize: 15.5,
              fontWeight: 600,
              color: "var(--ink)",
              letterSpacing: "-0.015em",
            }}
          >
            Presidencial 2026
          </span>
        </button>

        {/* Divider (fino estilo iOS) */}
        <span
          aria-hidden="true"
          style={{
            width: 1,
            height: 22,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0) 100%)",
            margin: "0 4px",
            position: "relative",
            zIndex: 1,
          }}
        />

        {/* Nav items */}
        <nav
          aria-label="Principal"
          style={{ display: "flex", gap: 2, position: "relative", zIndex: 1 }}
        >
          {items.map((it) => {
            const active = route === it.key;
            return (
              <button
                key={it.key}
                onClick={() => setRoute(it.key)}
                aria-current={active ? "page" : undefined}
                className={`liquid-nav-item${active ? " is-active" : ""}`}
                style={{
                  fontFamily: "inherit",
                  fontSize: 15,
                  fontWeight: active ? 600 : 500,
                  color: active ? "#fff" : "var(--ink-2)",
                  background: active
                    ? "linear-gradient(180deg, color-mix(in oklab, var(--brand) 100%, white 12%), var(--brand))"
                    : "transparent",
                  border: 0,
                  padding: "8px 16px",
                  borderRadius: 999,
                  cursor: "pointer",
                  transition:
                    "background 200ms ease, color 200ms ease, box-shadow 200ms ease, transform 160ms ease",
                  letterSpacing: "-0.01em",
                  boxShadow: active
                    ? "0 1px 0 rgba(255,255,255,0.35) inset, 0 4px 12px -4px rgba(13,30,45,0.35)"
                    : "none",
                }}
              >
                {it.label}
              </button>
            );
          })}
        </nav>
      </header>
    </div>
  );
}

Object.assign(window, { NavBar });
