// ─────────────────────────────────────────────
//  RankBadge
//  추천 결과 1 / 2 / 3위 순위 표시 뱃지
// ─────────────────────────────────────────────

const RANK_STYLE = {
  1: { bg: "linear-gradient(135deg,#FFD700,#F59E0B)", shadow: "#FFD70055" },
  2: { bg: "linear-gradient(135deg,#CBD5E1,#94A3B8)", shadow: "#CBD5E155" },
  3: { bg: "linear-gradient(135deg,#FB923C,#EA580C)", shadow: "#FB923C55" },
};

/**
 * @param {number} rank   - 1 | 2 | 3
 * @param {string} [size] - 'sm' | 'md' (기본 'md')
 */
export default function RankBadge({ rank, size = "md" }) {
  const cfg = RANK_STYLE[rank];
  if (!cfg) return null;

  const sizeStyle = {
    sm: { fontSize: 10, padding: "2px 8px",  borderRadius: 5 },
    md: { fontSize: 12, padding: "3px 11px", borderRadius: 7 },
  }[size];

  return (
    <div style={{
      display:    "inline-flex",
      alignItems: "center",
      background: cfg.bg,
      color:      "#0F0F0F",
      fontWeight: 900,
      flexShrink: 0,
      boxShadow:  `0 2px 10px ${cfg.shadow}`,
      letterSpacing: 0.5,
      ...sizeStyle,
    }}>
      {rank}위
    </div>
  );
}
