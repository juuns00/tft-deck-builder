// ─────────────────────────────────────────────
//  src/components/simulator/ThreatPanel.jsx
//  위협 요소 설정 패널
//  · CHECKBOX_THREATS → 토글 버튼
//  · DRAG_THREATS     → 그리드 드래그 소스 카드
// ─────────────────────────────────────────────
import { useState } from 'react';
import { CHECKBOX_THREATS, DRAG_THREATS } from '../../utils/simulatorConstants.js';

// ─── ThreatCard (드래그용) ─────────────────────
function ThreatCard({ threat, onDragStart }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div
      draggable
      onDragStart={e => onDragStart(e, { ...threat, sourceType: 'threat' })}
      title={threat.desc}
      className="flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing select-none"
    >
      <div
        className="relative overflow-hidden rounded flex items-center justify-center"
        style={{ width: 44, height: 44, border: `2px solid ${threat.color}55`, background: '#0A0F1A' }}
      >
        {threat.icon && !imgErr ? (
          <img src={threat.icon} alt={threat.name}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover" />
        ) : (
          <span className="text-xl">{threat.emoji ?? '⚠️'}</span>
        )}
      </div>
      <div className="text-[9px] font-bold text-center w-12 leading-tight"
        style={{ color: threat.color }}>
        {threat.name}
      </div>
    </div>
  );
}

// ─── ThreatPanel ──────────────────────────────
/**
 * @param {string[]}  activeThreats     - 체크박스 활성 id 배열
 * @param {function}  onToggleThreat    - (id) => void
 * @param {function}  onDragStart       - (e, item) => void  (드래그 아이템용)
 * @param {{ threatId: string, cellIdx: number }[]} threatPlacements
 */
export default function ThreatPanel({
  activeThreats,
  onToggleThreat,
  onDragStart,
  threatPlacements,
}) {
  return (
    <div className="rounded-xl border p-4"
      style={{ background: '#0A0F1A', borderColor: '#1E293B' }}>

      <div className="text-sm font-black mb-2" style={{ color: '#F87171' }}>
        ⚠️ 위협 요소 설정
      </div>
      <div className="text-xs mb-3" style={{ color: '#475569' }}>
        상대방이 가진 위협을 체크하면 위험 구역이 표시돼.
        서풍·침묵은 전장에 직접 드래그해서 배치해.
      </div>

      {/* 체크박스형 위협 */}
      <div className="flex flex-col gap-2 mb-4">
        {CHECKBOX_THREATS.map(threat => {
          const isActive = activeThreats.includes(threat.id);
          return (
            <button
              key={threat.id}
              onClick={() => onToggleThreat(threat.id)}
              className="flex items-center gap-2 p-2 rounded-lg text-left transition-all"
              style={{
                background: isActive ? `${threat.color}15` : '#0F172A',
                border:     `1px solid ${isActive ? threat.color + '55' : '#1E293B'}`,
              }}
            >
              {/* 아이콘 */}
              <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0 flex items-center justify-center"
                style={{ background: '#1E293B' }}>
                {threat.icon
                  ? <img src={threat.icon} alt={threat.name} className="w-full h-full object-cover" />
                  : <span className="text-lg">{threat.emoji}</span>
                }
              </div>

              {/* 이름 + 설명 */}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold truncate"
                  style={{ color: isActive ? threat.color : '#64748B' }}>
                  {threat.name}
                </div>
                <div className="text-[9px] leading-tight" style={{ color: '#334155' }}>
                  {threat.desc}
                </div>
              </div>

              {/* 체크 박스 */}
              <div className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0"
                style={{
                  borderColor: isActive ? threat.color : '#334155',
                  background:  isActive ? threat.color : 'transparent',
                }}>
                {isActive && <span className="text-[9px] text-black font-black">✓</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* 드래그 배치형 위협 */}
      <div className="text-xs font-bold mb-2" style={{ color: '#64748B' }}>
        전장에 드래그해서 배치
      </div>
      <div className="flex gap-3 flex-wrap">
        {DRAG_THREATS.map(threat => (
          <ThreatCard key={threat.id} threat={threat} onDragStart={onDragStart} />
        ))}
      </div>

      {/* 배치 상태 요약 */}
      {threatPlacements.length > 0 && (
        <div className="mt-2 text-[9px]" style={{ color: '#475569' }}>
          배치: {threatPlacements
            .map(({ threatId, cellIdx }) => {
              const t   = DRAG_THREATS.find(x => x.id === threatId);
              const row = Math.floor(cellIdx / 7) + 1;
              const col = cellIdx % 7 + 1;
              return t ? `${t.name}(${row}행${col}열)` : null;
            })
            .filter(Boolean)
            .join(', ')}
        </div>
      )}
    </div>
  );
}
