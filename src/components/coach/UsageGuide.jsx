// ─────────────────────────────────────────────
//  UsageGuide  (src/components/coach/UsageGuide.jsx)
//  사용 방법 가이드 카드
//  isOverwolfMode prop으로 웹/Overwolf 안내 분기
// ─────────────────────────────────────────────

const WEB_STEPS = [
  ['📸', '게임 스크린샷 업로드 또는 Ctrl+V'],
  ['⚡', 'AI 분석 시작 클릭'],
  ['💬', '실시간 팩폭 조언 확인'],
];

const OVERWOLF_STEPS = [
  ['🎮', 'TFT 게임을 시작하세요'],
  ['🔄', '보드·상점 데이터가 자동으로 수신됩니다'],
  ['💡', '원할 때 조언 받기 버튼을 누르세요'],
];

/**
 * @param {boolean} isOverwolfMode - true면 Overwolf 안내, false면 웹 안내
 */
export default function UsageGuide({ isOverwolfMode = false }) {
  const steps = isOverwolfMode ? OVERWOLF_STEPS : WEB_STEPS;

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: '#0A0F1A', border: '1px solid #1E293B' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span style={{ fontSize: 14 }}>📖</span>
        <span className="text-[11px] font-black tracking-widest uppercase text-[#334155]">
          사용 방법
        </span>
      </div>
      <ol className="m-0 p-0 list-none flex flex-col gap-2">
        {steps.map(([icon, text], i) => (
          <li key={i} className="flex items-center gap-2.5">
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0"
              style={{ background: '#1E293B', color: '#475569' }}
            >
              {i + 1}
            </span>
            <span className="text-[11px] text-[#334155]">{icon} {text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
