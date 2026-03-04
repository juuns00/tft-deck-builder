import { getTraitById } from "../../data/index.js";
import { TRAIT_TYPE_COLOR } from "../../utils/constants.js";

// ─────────────────────────────────────────────
//  TraitBadge
//  특성(계열/직업) 표시 뱃지
//  활성화된 시너지 단계도 함께 표시 가능
// ─────────────────────────────────────────────

/**
 * @param {string}      traitId       - 특성 id
 * @param {number}      [count]       - 현재 보유 챔피언 수 (없으면 숫자 미표시)
 * @param {boolean}     [active]      - 시너지 발동 여부 (발동 시 강조)
 * @param {string}      [size]        - 'sm' | 'md' (기본 'md')
 */
export default function TraitBadge({ traitId, count, active = false, size = "md" }) {
  const trait = getTraitById(traitId);
  if (!trait) return null;

  const typeColor = TRAIT_TYPE_COLOR[trait.type] ?? "#94A3B8";
  const color     = active ? typeColor : "#475569";
  const bgColor   = active ? typeColor + "22" : "#1E293B";
  const border    = active ? `1px solid ${typeColor}55` : "1px solid #2D3748";

  const sizeStyle = {
    sm: { fontSize: 10, padding: "1px 6px",  borderRadius: 4, gap: 3 },
    md: { fontSize: 11, padding: "2px 8px",  borderRadius: 5, gap: 4 },
  }[size];

  return (
    <span style={{
      display:    "inline-flex",
      alignItems: "center",
      background: bgColor,
      border,
      color,
      fontWeight: active ? 700 : 400,
      whiteSpace: "nowrap",
      ...sizeStyle,
    }}>
      {/* 특성명 */}
      {trait.name}

      {/* 카운트 (있을 때만 표시) */}
      {count !== undefined && (
        <span style={{
          background:   active ? typeColor + "33" : "#334155",
          color:        active ? typeColor : "#64748B",
          borderRadius: 99,
          padding:      "0 5px",
          fontSize:     size === "sm" ? 9 : 10,
          fontWeight:   700,
          minWidth:     16,
          textAlign:    "center",
        }}>
          {count}
        </span>
      )}
    </span>
  );
}
