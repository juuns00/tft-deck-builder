// ─────────────────────────────────────────────
//  OverwolfStatusPanel  (src/components/coach/OverwolfStatusPanel.jsx)
//  Overwolf GEP 연결 상태 및 핵심 게임 정보 표시
//  connected: 펄스 애니메이션 녹색 점
//  disconnected: 회색 점 + 대기 안내
// ─────────────────────────────────────────────

/**
 * @param {boolean}     hasScan    - 게임 데이터 수신 여부
 * @param {object|null} scanResult - 현재 게임 상태 { round, gold, hp }
 */
export default function OverwolfStatusPanel({ hasScan, scanResult }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: '#0A0F1A', border: '1px solid #1E293B' }}
    >
      {/* 헤더 — 연결 상태 점 */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            background: hasScan ? '#4ADE80' : '#334155',
            boxShadow:  hasScan ? '0 0 8px #4ADE8066' : 'none',
            animation:  hasScan ? 'pulse-dot 2s ease-in-out infinite' : 'none',
          }}
        />
        <span className="text-[12px] font-black tracking-widest uppercase text-[#E2E8F0]">
          {hasScan ? '게임 데이터 수신 중' : '게임 시작 대기 중...'}
        </span>
      </div>

      {/* 수신 데이터 요약 */}
      {hasScan ? (
        <div className="flex flex-col gap-1.5">
          {scanResult?.round != null && (
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-[#475569]">라운드</span>
              <span className="text-[11px] font-bold text-[#E2E8F0]">{scanResult.round}</span>
            </div>
          )}
          {scanResult?.gold != null && (
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-[#475569]">골드</span>
              <span className="text-[11px] font-bold text-[#FACC15]">{scanResult.gold}G</span>
            </div>
          )}
          {scanResult?.hp != null && (
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-[#475569]">체력</span>
              <span
                className="text-[11px] font-bold"
                style={{ color: parseInt(scanResult.hp) <= 30 ? '#F87171' : '#4ADE80' }}
              >
                {scanResult.hp}
              </span>
            </div>
          )}
        </div>
      ) : (
        <p className="m-0 text-[11px] text-[#334155]">
          TFT 게임을 시작하면 자동으로 데이터를 수신합니다.
        </p>
      )}
    </div>
  );
}
