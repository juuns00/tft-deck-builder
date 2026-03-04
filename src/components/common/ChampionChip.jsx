import { COST_COLOR } from "../../utils/constants.js";

// ─────────────────────────────────────────────
//  ChampionChip
//  챔피언 선택 버튼 — 코스트별 색상 자동 적용
// ─────────────────────────────────────────────

/**
 * @param {{ id, name, cost, traits[] }} champion
 * @param {boolean}  selected  - 선택 여부
 * @param {function} onClick   - 클릭 핸들러
 * @param {boolean}  [missing] - 부족한 챔피언 표시 (빨간색)
 * @param {string}   [size]    - 'sm' | 'md' (기본 'md')
 */
export default function ChampionChip({ champion, selected, onClick, missing = false, size = "md" }) {
  const color   = missing ? "#F87171" : COST_COLOR[champion.cost] ?? "#94A3B8";
  const padding = size === "sm" ? "2px 7px" : "4px 10px";
  const fontSize = size === "sm" ? 11 : 12;

  return (
    <button
      onClick={onClick}
      title={`${champion.name} (${champion.cost}코스트)`}
      style={{
        background:   selected ? color + "28" : missing ? "#F8711110" : "#0F172A",
        border:       `1px solid ${selected || missing ? color : "#1E293B"}`,
        borderRadius: 7,
        padding,
        cursor:       "pointer",
        color:        selected || missing ? color : "#64748B",
        fontSize,
        fontWeight:   selected ? 700 : 400,
        transition:   "all 0.12s",
        whiteSpace:   "nowrap",
        boxShadow:    selected ? `0 0 7px ${color}33` : "none",
        lineHeight:   1.4,
      }}
    >
      {missing && <span style={{ fontSize: fontSize - 1, marginRight: 3 }}>✕</span>}
      {champion.name}
    </button>
  );
}
