import { TIER_COLOR } from "../../utils/constants.js";

// ─────────────────────────────────────────────
//  TierBadge
//  S / A / B / C 티어 표시 뱃지
// ─────────────────────────────────────────────

/**
 * @param {string}  tier      - 'S' | 'A' | 'B' | 'C'
 * @param {string}  [size]    - 'sm' | 'md' | 'lg' (기본 'md')
 * @param {boolean} [labeled] - true면 "S티어" 형식, false면 "S"만 표시 (기본 false)
 */
export default function TierBadge({ tier, size = "md", labeled = false }) {
  const color = TIER_COLOR[tier] ?? "#94A3B8";

  const sizeStyle = {
    sm: { fontSize: 10, padding: "0 5px",  borderRadius: 4, height: 18 },
    md: { fontSize: 11, padding: "1px 7px", borderRadius: 5, height: 22 },
    lg: { fontSize: 14, padding: "2px 10px", borderRadius: 6, height: 28 },
  }[size];

  return (
    <span style={{
      display:        "inline-flex",
      alignItems:     "center",
      background:     color + "1A",
      border:         `1px solid ${color}44`,
      color,
      fontWeight:     700,
      letterSpacing:  0.5,
      ...sizeStyle,
    }}>
      {labeled ? `${tier}티어` : tier}
    </span>
  );
}
