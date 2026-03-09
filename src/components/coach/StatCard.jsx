// ─────────────────────────────────────────────
//  StatCard  (src/components/coach/StatCard.jsx)
//  라운드 · 골드 · HP 표시용 미니 카드
// ─────────────────────────────────────────────

/**
 * @param {string} icon   - 이모지
 * @param {string} label  - 라벨 텍스트 (대문자 표시됨)
 * @param {string} value  - 표시할 값 (없으면 '—')
 * @param {string} color  - hex 강조색
 */
export default function StatCard({ icon, label, value, color }) {
  return (
    <div
      className="flex flex-col items-center gap-1 flex-1 rounded-xl py-3 px-2"
      style={{ background: color + '12', border: `1px solid ${color}30` }}
    >
      <span className="text-xl leading-none">{icon}</span>
      <span
        className="text-[10px] font-bold tracking-widest uppercase"
        style={{ color: '#64748B' }}
      >
        {label}
      </span>
      <span className="text-[18px] font-black" style={{ color }}>
        {value || '—'}
      </span>
    </div>
  );
}
