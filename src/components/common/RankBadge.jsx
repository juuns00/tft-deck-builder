// ─────────────────────────────────────────────
//  RankBadge
//  추천 결과 1 / 2 / 3위 순위 표시 뱃지
// ─────────────────────────────────────────────

const RANK_STYLE = {
  1: { bg: 'linear-gradient(135deg,#FFD700,#F59E0B)', shadow: '0 2px 10px #FFD70055' },
  2: { bg: 'linear-gradient(135deg,#CBD5E1,#94A3B8)', shadow: '0 2px 10px #CBD5E155' },
  3: { bg: 'linear-gradient(135deg,#FB923C,#EA580C)', shadow: '0 2px 10px #FB923C55' },
};

const SIZE_CLASS = {
  sm: 'text-[10px] px-2 py-0.5 rounded',
  md: 'text-[12px] px-[11px] py-[3px] rounded-[7px]',
};

/**
 * @param {number} rank   - 1 | 2 | 3
 * @param {string} [size] - 'sm' | 'md' (기본 'md')
 */
export default function RankBadge({ rank, size = 'md' }) {
  const cfg = RANK_STYLE[rank];
  if (!cfg) return null;

  return (
    <div
      className={`inline-flex items-center shrink-0 font-black tracking-wide text-[#0F0F0F] ${SIZE_CLASS[size]}`}
      style={{ background: cfg.bg, boxShadow: cfg.shadow }}
    >
      {rank}위
    </div>
  );
}