// ─────────────────────────────────────────────
//  TraitBadge
//  특성(계열/직업) 표시 뱃지
//  활성화된 시너지 단계도 함께 표시 가능
// ─────────────────────────────────────────────
import { getTraitById }      from '../../data/index.js';
import { TRAIT_TYPE_COLOR }  from '../../utils/constants.js';

const SIZE_CLASS = {
  sm: { wrap: 'text-[10px] px-[6px] py-px rounded gap-[3px]', count: 'text-[9px] px-[5px]' },
  md: { wrap: 'text-[11px] px-2 py-0.5 rounded-[5px] gap-1',  count: 'text-[10px] px-[5px]' },
};

/**
 * @param {string}  traitId  - 특성 id
 * @param {number}  [count]  - 현재 보유 챔피언 수 (없으면 숫자 미표시)
 * @param {boolean} [active] - 시너지 발동 여부
 * @param {string}  [size]   - 'sm' | 'md' (기본 'md')
 */
export default function TraitBadge({ traitId, count, active = false, size = 'md' }) {
  const trait = getTraitById(traitId);
  if (!trait) return null;

  const typeColor = TRAIT_TYPE_COLOR[trait.type] ?? '#94A3B8';
  const color     = active ? typeColor : '#475569';
  const cls       = SIZE_CLASS[size];

  return (
    <span
      className={`inline-flex items-center whitespace-nowrap font-${active ? 'bold' : 'normal'} ${cls.wrap}`}
      style={{
        background: active ? typeColor + '22' : '#1E293B',
        border:     active ? `1px solid ${typeColor}55` : '1px solid #2D3748',
        color,
      }}
    >
      {trait.name}

      {count !== undefined && (
        <span
          className={`rounded-full font-bold text-center min-w-[16px] ${cls.count}`}
          style={{
            background: active ? typeColor + '33' : '#334155',
            color:      active ? typeColor : '#64748B',
          }}
        >
          {count}
        </span>
      )}
    </span>
  );
}