// ─────────────────────────────────────────────
//  SignalLight  (src/components/coach/SignalLight.jsx)
//  🟢🟡🔴 상황 신호등 — 색상·제목·설명 표시
// ─────────────────────────────────────────────
import { SIGNAL_META } from '../../utils/coachConstants.js';

/**
 * @param {'green'|'yellow'|'red'} signal
 */
export default function SignalLight({ signal }) {
  const meta = SIGNAL_META[signal];
  if (!meta) return null;

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: meta.bg,
        border:     `1px solid ${meta.border}`,
        boxShadow:  `0 0 24px ${meta.glow}`,
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">{meta.emoji}</span>
        <div>
          <div
            className="text-[10px] font-bold tracking-widest uppercase"
            style={{ color: meta.color }}
          >
            {meta.label}
          </div>
          <div className="text-[16px] font-black text-[#E2E8F0]">
            {meta.title}
          </div>
        </div>
      </div>
      <p className="text-[13px] text-[#94A3B8] m-0 leading-relaxed">
        {meta.desc}
      </p>
    </div>
  );
}

/** 미분석 상태의 신호등 프리뷰 (흐릿하게 모든 상태 나열) */
export function SignalPreview() {
  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: '#0A0F1A', border: '1px solid #1E293B' }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-[3px] h-4 rounded-sm" style={{ background: '#4ADE80' }} />
        <span className="text-[12px] font-black tracking-widest uppercase text-[#E2E8F0]">
          상황 신호등
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {Object.entries(SIGNAL_META).map(([key, m]) => (
          <div key={key} className="flex items-start gap-2.5 opacity-40">
            <span className="text-base leading-none mt-0.5">{m.emoji}</span>
            <div>
              <p className="m-0 text-[12px] font-bold text-[#E2E8F0]">{m.title}</p>
              <p className="m-0 text-[11px] text-[#475569]">{m.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-[#1E3A5F] text-center mt-4 m-0">
        스크린샷 분석 후 현재 상황이 표시됩니다
      </p>
    </div>
  );
}
