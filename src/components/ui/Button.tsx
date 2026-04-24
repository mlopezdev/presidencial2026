import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
}

export function Button({ variant = "primary", children, style, ...rest }: ButtonProps) {
  const base: React.CSSProperties = {
    fontFamily: "inherit", fontSize: 17, fontWeight: 500,
    padding: "14px 24px", borderRadius: 980,
    cursor: "pointer", transition: "transform 120ms ease, background 160ms ease, box-shadow 160ms ease",
    lineHeight: 1.2, letterSpacing: "-0.01em",
    display: "inline-flex", alignItems: "center", gap: 8,
  };
  const variants: Record<string, React.CSSProperties> = {
    primary:   { background: "var(--brand)", color: "#fff", border: "1px solid transparent", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" },
    secondary: { background: "#F2F4F7", color: "var(--ink)", border: "1px solid #E5E8EC" },
    ghost:     { background: "transparent", color: "var(--brand)", border: "1px solid transparent" },
  };
  return (
    <button style={{ ...base, ...variants[variant], ...style }} {...rest}>
      {children}
    </button>
  );
}
