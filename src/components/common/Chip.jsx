// ─────────────────────────────────────────────
//  Chip
//  선택 가능한 범용 버튼 컴포넌트
//  챔피언 선택, 아이템 선택, 증강 선택 등에 공통 사용
// ─────────────────────────────────────────────

/**
 * @param {string}   label    - 표시할 텍스트
 * @param {boolean}  selected - 선택 여부
 * @param {string}   color    - 선택 시 적용할 색상 (hex)
 * @param {function} onClick  - 클릭 핸들러
 * @param {string}   [size]   - 'sm' | 'md' (기본 'md')
 */
export default function Chip({ label, selected, color, onClick, size = "md" }) {
  const padding = size === "sm" ? "2px 8px" : "4px 10px";
  const fontSize = size === "sm" ? 11 : 12;

  return (
    <button
      onClick={onClick}
      style={{
        background:   selected ? color + "28" : "#0F172A",
        border:       `1px solid ${selected ? color : "#1E293B"}`,
        borderRadius: 7,
        padding,
        cursor:       "pointer",
        color:        selected ? color : "#64748B",
        fontSize,
        fontWeight:   selected ? 700 : 400,
        transition:   "all 0.12s",
        whiteSpace:   "nowrap",
        boxShadow:    selected ? `0 0 7px ${color}33` : "none",
        lineHeight:   1.4,
      }}
    >
      {label}
    </button>
  );
}
