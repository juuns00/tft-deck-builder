// ─────────────────────────────────────────────
//  MatchBar  (src/components/coach/MatchBar.jsx)
//  덱 일치도 % 게이지 바
// ─────────────────────────────────────────────

const scoreColor = (s) =>
  s >= 60 ? '#4ADE80' : s >= 35 ? '#FACC15' : '#F87171';

/**
 * @param {number}      score        - 0~100
 * @param {string|null} bestCompName - 가장 유사한 덱 이름
 */
export default function MatchBar({ score, bestCompName }) {
  const color = scoreColor(score);

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest">
          덱 일치도
        </span>
        <div className="flex items-center gap-1.5">
          {bestCompName && (
            <span className="text-[10px] text-[#475569]">{bestCompName}</span>
          )}
          <span className="text-[14px] font-black" style={{ color }}>
            {score}%
          </span>
        </div>
      </div>

      {/* 게이지 */}
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: '#1E293B' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width:      `${score}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
          }}
        />
      </div>
    </div>
  );
}
