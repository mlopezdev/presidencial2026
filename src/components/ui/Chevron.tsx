interface ChevronProps { dir?: "right" | "left" | "up" | "down"; size?: number; }

export function Chevron({ dir = "right", size = 16 }: ChevronProps) {
  const rot = { right: 0, left: 180, up: -90, down: 90 }[dir];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"
      style={{ transform: `rotate(${rot}deg)`, flexShrink: 0 }}>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
