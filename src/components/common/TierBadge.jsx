// ─────────────────────────────────────────────
//  TierBadge
//  S / A / B / C 티어 표시 뱃지
// ─────────────────────────────────────────────
import { TIER_COLOR } from '../../utils/constants.js';

const SIZE_CLASS = {
  sm: 'text-[10px] px-[5px] h-[18px] rounded',
  md: 'text-[11px] px-[7px] py-px h-[22px] rounded-[5px]',
  lg: 'text-[14px] px-[10px] py-0.5 h-[28px] rounded-md',
};

/**
 * @param {string}  tier      - 'S' | 'A' | 'B' | 'C'
 * @param {string}  [size]    - 'sm' | 'md' | 'lg' (기본 'md')
 * @param {boolean} [labeled] - true면 "S티어" 형식 (기본 false)
 */
export default function TierBadge({ tier, size = 'md', labeled = false }) {
  const color = TIER_COLOR[tier] ?? '#94A3B8';

  return (
    <span
      className={`inline-flex items-center font-bold tracking-wide ${SIZE_CLASS[size]}`}
      style={{
        background: color + '1A',
        border:     `1px solid ${color}44`,
        color,
      }}
    >
      {labeled ? `${tier}티어` : tier}
    </span>
  );
}