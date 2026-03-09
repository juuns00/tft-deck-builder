// ─────────────────────────────────────────────
//  ChampBadge  (src/components/coach/ChampBadge.jsx)
//  Vision 스캔으로 감지된 챔피언 + 성급 표시 뱃지
//  bestComp 소속이면 초록 강조
// ─────────────────────────────────────────────

const STAR_STR = { 3: '★★★', 2: '★★', 1: '★' };

/**
 * @param {string}  name        - 챔피언 이름
 * @param {number}  star        - 1 | 2 | 3
 * @param {boolean} inBestComp  - 추천 덱에 포함 여부
 */
export default function ChampBadge({ name, star, inBestComp }) {
  return (
    <div
      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold"
      style={{
        background: inBestComp ? '#4ADE8018' : '#1E293B',
        border:     `1px solid ${inBestComp ? '#4ADE8044' : '#1E293B'}`,
        color:      inBestComp ? '#4ADE80'   : '#94A3B8',
      }}
    >
      <span>{name}</span>
      <span style={{ color: '#FACC15', fontSize: 9 }}>
        {STAR_STR[star] ?? '★'}
      </span>
      {inBestComp && <span style={{ fontSize: 9 }}>✓</span>}
    </div>
  );
}
