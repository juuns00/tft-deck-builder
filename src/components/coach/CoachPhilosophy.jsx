// ─────────────────────────────────────────────
//  CoachPhilosophy  (src/components/coach/CoachPhilosophy.jsx)
//  코칭 철학 소개 카드
// ─────────────────────────────────────────────

export default function CoachPhilosophy() {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: 'linear-gradient(145deg, #0F1929, #060B14)',
        border:     '1px solid #1E3A5F',
      }}
    >
      <p className="m-0 text-[10px] font-black tracking-widest uppercase text-[#1E3A5F] mb-2">
        코칭 철학
      </p>
      <p className="m-0 text-[12px] text-[#334155] leading-relaxed">
        무분별한 덱 전환 지양.<br />
        <span style={{ color: '#FFD700' }}>현재 라운드와 피 관리를 최우선</span>으로 하는<br />
        현실적 코칭을 제공합니다.
      </p>
    </div>
  );
}
