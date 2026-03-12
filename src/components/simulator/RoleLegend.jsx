// ─────────────────────────────────────────────
//  src/components/simulator/RoleLegend.jsx
//  역할군 색상 범례 패널 (작은 사이드바 위젯)
// ─────────────────────────────────────────────
import { ROLE_COLOR, ROLE_LABEL } from '../../utils/constants.js';

export default function RoleLegend() {
  return (
    <div className="rounded-xl border p-3"
      style={{ background: '#0A0F1A', borderColor: '#1E293B' }}>
      <div className="text-xs font-bold mb-2" style={{ color: '#475569' }}>역할 색상</div>
      <div className="grid grid-cols-2 gap-1">
        {Object.entries(ROLE_LABEL).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs">
            <div className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: ROLE_COLOR[key] }} />
            <span style={{ color: '#64748B' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
