"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function ContactanosPage() {
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "64px 32px 96px" }}>
      <p style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 600, color: "var(--brand)", letterSpacing: "-0.01em" }}>Contáctanos</p>
      <h1 style={{
        margin: "0 0 16px", fontSize: "clamp(36px, 5vw, 48px)", fontWeight: 600,
        letterSpacing: "-0.03em", color: "var(--ink)", lineHeight: 1.05,
        fontFamily: "var(--font-plex-serif), Georgia, serif",
      }}>
        ¿Tienes dudas o sugerencias?
      </h1>
      <p style={{ margin: "0 0 32px", fontSize: 20, color: "var(--ink-2)", lineHeight: 1.45 }}>
        Escríbenos y te responderemos en menos de 48 horas. Este proyecto es abierto y apartidista.
      </p>

      {sent ? (
        <div style={{ background: "#F1F7F3", borderRadius: 20, padding: 32, border: "1px solid #CFE3D6" }}>
          <div style={{ fontSize: 22, fontWeight: 600, color: "#1F6E4A", marginBottom: 8 }}>Mensaje enviado.</div>
          <div style={{ fontSize: 17, color: "var(--ink-2)" }}>Gracias por escribirnos. Te contactaremos pronto.</div>
          <button
            type="button"
            onClick={() => setSent(false)}
            style={{ marginTop: 20, fontFamily: "inherit", fontSize: 15, fontWeight: 500, cursor: "pointer", color: "var(--brand)", background: "none", border: "none", padding: 0 }}
          >
            Enviar otro mensaje
          </button>
        </div>
      ) : (
        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          style={{ background: "#fff", borderRadius: 20, border: "1px solid var(--line)", padding: 32, display: "grid", gap: 20 }}
        >
          {[
            { id: "name", label: "Nombre completo", type: "text", placeholder: "Tu nombre" },
            { id: "email", label: "Correo electrónico", type: "email", placeholder: "tu@correo.com" },
          ].map((f) => (
            <label key={f.id} style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 16, fontWeight: 500, color: "var(--ink)" }}>{f.label}</span>
              <input
                type={f.type} required placeholder={f.placeholder}
                onFocus={() => setFocused(f.id)}
                onBlur={() => setFocused(null)}
                style={{
                  fontFamily: "inherit", fontSize: 17, padding: "14px 16px", borderRadius: 12,
                  border: `1px solid ${focused === f.id ? "var(--brand)" : "rgba(0,0,0,0.14)"}`,
                  outline: "none", background: focused === f.id ? "#fff" : "#FAFBFC",
                  transition: "border-color 160ms ease, background 160ms ease",
                  color: "var(--ink)",
                }}
              />
            </label>
          ))}

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 16, fontWeight: 500, color: "var(--ink)" }}>Mensaje</span>
            <textarea
              required rows={5} placeholder="Escribe aquí tu mensaje..."
              onFocus={() => setFocused("message")}
              onBlur={() => setFocused(null)}
              style={{
                fontFamily: "inherit", fontSize: 17, padding: "14px 16px", borderRadius: 12,
                border: `1px solid ${focused === "message" ? "var(--brand)" : "rgba(0,0,0,0.14)"}`,
                outline: "none", background: focused === "message" ? "#fff" : "#FAFBFC",
                resize: "vertical", color: "var(--ink)",
                transition: "border-color 160ms ease, background 160ms ease",
              }}
            />
          </label>

          <div>
            <Button type="submit" variant="primary">Enviar mensaje</Button>
          </div>
        </form>
      )}

      {/* Info extra */}
      <div style={{ marginTop: 48, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        {[
          { icon: "📬", label: "Correo", value: "info@presidencial2026.co" },
          { icon: "🏛", label: "Proyecto", value: "UPB Presidencial 2026" },
          { icon: "⚖️", label: "Apartidista", value: "Sin afiliación política" },
        ].map((item) => (
          <div key={item.label} style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: "18px 20px" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontSize: 15, color: "var(--ink)", lineHeight: 1.4 }}>{item.value}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
