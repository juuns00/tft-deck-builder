// ─────────────────────────────────────────────
//  src/components/simulator/UnitInfoCard.jsx
//  선택된 셀의 유닛(챔피언·위협) 상세 정보 패널
// ─────────────────────────────────────────────
import { COST_COLOR, ROLE_LABEL } from '../../utils/constants.js';
import { THREAT_MAP }             from '../../utils/simulatorConstants.js';

/**
 * @param {object|null} unit  - board[selectedCell]
 */
export default function UnitInfoCard({ unit }) {
  if (!unit) return null;

  const isThreat  = unit.sourceType === 'threat';
  const threatInfo = isThreat ? THREAT_MAP[unit.id] : null;
  const color      = isThreat
    ? (threatInfo?.color ?? '#EF4444')
    : (COST_COLOR[unit.cost] ?? '#94A3B8');

  return (
    <div
      className="rounded-xl border p-4"
      style={{
        background:  '#0A0F1A',
        borderColor: color + '44',
        animation:   'fadeInUp 0.2s ease',
      }}
    >
      {/* 이미지 + 이름 */}
      <div className="flex items-center gap-2 mb-2">
        {unit.icon && (
          <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0"
            style={{ border: `2px solid ${color}44` }}>
            <img src={unit.icon} alt={unit.name} className="w-full h-full object-cover" />
          </div>
        )}
        <div>
          <div className="text-sm font-bold" style={{ color }}>{unit.name}</div>
          {!isThreat && (
            <div className="text-xs" style={{ color: '#64748B' }}>
              {ROLE_LABEL[unit.role] ?? unit.role} · {unit.cost}코스트
            </div>
          )}
        </div>
      </div>

      {/* 챔피언 스탯 */}
      {!isThreat && (
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div className="rounded p-1.5" style={{ background: '#0F172A' }}>
            <div style={{ color: '#475569' }}>사거리</div>
            <div className="font-bold" style={{ color: '#60A5FA' }}>
              {unit.stats?.range ?? '-'}
            </div>
          </div>
          <div className="rounded p-1.5" style={{ background: '#0F172A' }}>
            <div style={{ color: '#475569' }}>공격 속도</div>
            <div className="font-bold" style={{ color: '#4ADE80' }}>
              {unit.stats?.attackSpeed ?? '-'}
            </div>
          </div>
        </div>
      )}

      {/* 위협 설명 */}
      {isThreat && threatInfo && (
        <div className="text-xs rounded p-2" style={{ background: '#0F172A', color: '#94A3B8' }}>
          {threatInfo.dangerDesc}
        </div>
      )}
    </div>
  );
}
