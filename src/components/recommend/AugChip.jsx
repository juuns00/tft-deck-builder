// ─────────────────────────────────────────────
//  AugChip
//  증강체 선택 칩 — 티어별 색상 자동 적용
// ─────────────────────────────────────────────
import { AUGMENT_TIER_COLOR } from '../../utils/constants.js';

/**
 * @param {{ id, name, tier, description }} aug
 * @param {boolean}  selected - 선택 여부
 * @param {function} onClick  - 클릭 핸들러
 */
export default function AugChip({ aug, selected, onClick }) {
  const color = AUGMENT_TIER_COLOR[aug.tier] ?? '#94A3B8';

  return (
    <button
      onClick={onClick}
      title={aug.description ?? aug.name}
      className={`aug-chip ${selected ? 'selected' : ''}`}
      style={{
        background:  selected ? color + '22' : undefined,
        borderColor: selected ? color : undefined,
        color:       selected ? color : undefined,
        boxShadow:   selected ? `0 0 6px ${color}33` : undefined,
      }}
    >
      {selected ? '✓ ' : ''}{aug.name}
    </button>
  );
}
