// ─────────────────────────────────────────────
//  src/components/simulator/BoardGrid.jsx
//  7×4 전장 그리드 — 드래그앤드롭 + 사거리·위험 오버레이
// ─────────────────────────────────────────────
import { useState } from 'react';
import { SIM_ROWS, SIM_COLS, THREATS, THREAT_MAP } from '../../utils/simulatorConstants.js';
import { COST_COLOR, ROLE_LABEL }                   from '../../utils/constants.js';

// ─── PlacedUnit ───────────────────────────────
function PlacedUnit({ unit, isSelected, onSelect, onRemove, onDragStart }) {
  const [imgErr, setImgErr] = useState(false);
  const isThreat = unit.sourceType === 'threat';
  const threat   = isThreat ? THREAT_MAP[unit.id] : null;
  const color    = isThreat ? (threat?.color ?? '#EF4444') : (COST_COLOR[unit.cost] ?? '#94A3B8');

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={e => { e.stopPropagation(); onSelect(); }}
      onContextMenu={e => { e.preventDefault(); onRemove(); }}
      className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
      style={{
        border:    isSelected ? `2px solid ${color}` : `2px solid ${color}55`,
        background: isSelected ? `${color}22` : '#0A0F1A',
        boxShadow: isSelected ? `0 0 12px ${color}66` : 'none',
      }}
    >
      {/* 이미지 */}
      {unit.icon && !imgErr ? (
        <img src={unit.icon} alt={unit.name}
          onError={() => setImgErr(true)}
          className="w-full h-full object-cover block" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-center p-0.5"
          style={{ fontSize: 9, fontWeight: 700, color }}>
          {unit.emoji ?? unit.name}
        </div>
      )}

      {/* 하단 이름 바 */}
      <div className="absolute bottom-0 left-0 right-0 text-center font-bold overflow-hidden text-ellipsis whitespace-nowrap"
        style={{
          fontSize: 8, lineHeight: '13px', padding: '4px 2px 2px',
          background: `linear-gradient(transparent, ${color}BB)`,
          color: '#fff', textShadow: '0 1px 3px #0008',
        }}>
        {unit.name}
      </div>

      {/* 코스트 뱃지 (챔피언만) */}
      {!isThreat && unit.cost && (
        <div className="absolute top-0 left-0 w-3 h-3 flex items-center justify-center font-black"
          style={{ background: color, color: '#000', fontSize: 7 }}>
          {unit.cost}
        </div>
      )}

      {/* 선택 체크 */}
      {isSelected && (
        <div className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full flex items-center justify-center font-black"
          style={{ background: color, color: '#000', fontSize: 7 }}>
          ✓
        </div>
      )}
    </div>
  );
}

// ─── BoardGrid ────────────────────────────────
/**
 * @param {(object|null)[]} board          - 길이 28 배치 배열
 * @param {number|null}     selectedCell
 * @param {Set<number>}     rangeCells     - 사거리 강조 셀
 * @param {Set<number>}     dangerCells    - 위험 구역 셀
 * @param {number|null}     dragOverCell
 * @param {function}        onCellClick
 * @param {function}        onRemoveUnit
 * @param {function}        onDrop
 * @param {function}        onDragOver     - (cellIdx) => void
 * @param {function}        onDragLeave
 * @param {function}        onBoardDragStart - (e, cellIdx, unit) => void
 * @param {function}        onClearBoard
 * @param {number}          placedCount
 */
export default function BoardGrid({
  board,
  selectedCell,
  rangeCells,
  dangerCells,
  dragOverCell,
  onCellClick,
  onRemoveUnit,
  onDrop,
  onDragOver,
  onDragLeave,
  onBoardDragStart,
  onClearBoard,
  placedCount,
}) {
  return (
    <div className="rounded-xl border p-4"
      style={{ background: '#0A0F1A', borderColor: '#1E293B' }}>

      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold" style={{ color: '#FFD700' }}>
            ⚔️ 전장 ({placedCount}/8)
          </span>
          <span className="text-xs" style={{ color: '#334155' }}>← 내 진영</span>
        </div>
        <div className="flex items-center gap-2">
          {selectedCell !== null && board[selectedCell] && (
            <span className="text-xs px-2 py-1 rounded"
              style={{ background: '#1E293B', color: '#60A5FA' }}>
              📏 사거리 {board[selectedCell].stats?.range ?? '?'} 표시 중
            </span>
          )}
          <button
            onClick={onClearBoard}
            className="text-xs px-3 py-1 rounded font-bold transition-colors"
            style={{ background: '#1E293B', color: '#64748B', border: '1px solid #334155' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#F87171'; e.currentTarget.style.borderColor = '#F8717144'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.borderColor = '#334155'; }}
          >
            초기화
          </button>
        </div>
      </div>

      {/* 범례 */}
      <div className="flex gap-3 mb-3 flex-wrap">
        {[
          { bg: '#EF444430', border: '#EF4444', label: '위험 구역' },
          { bg: '#60A5FA22', border: '#60A5FA', label: '사거리' },
        ].map(({ bg, border, label }) => (
          <div key={label} className="flex items-center gap-1 text-xs" style={{ color: '#475569' }}>
            <div className="w-3 h-3 rounded" style={{ background: bg, border: `1px solid ${border}` }} />
            {label}
          </div>
        ))}
        <div className="text-xs" style={{ color: '#475569' }}>우클릭 = 제거</div>
      </div>

      {/* 7×4 그리드 */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SIM_COLS}, 1fr)`, gap: 3 }}>
        {board.map((unit, idx) => {
          const inRange  = rangeCells.has(idx);
          const inDanger = dangerCells.has(idx);
          const isOver   = dragOverCell === idx;

          let bg     = '#0F172A';
          let border = '#1E293B';
          if (inDanger) { bg = '#EF444414'; border = '#EF444444'; }
          if (inRange && !unit) { bg = '#60A5FA14'; border = '#60A5FA44'; }
          if (isOver)  { bg = '#FFD70022'; border = '#FFD700'; }

          return (
            <div
              key={idx}
              className="relative"
              style={{
                aspectRatio: '1',
                background:  bg,
                border:      `1px solid ${border}`,
                borderRadius: 4,
                transition:  'background 0.1s, border-color 0.1s',
                animation:   inDanger ? 'danger-pulse 2s ease-in-out infinite' : 'none',
              }}
              onDragOver={e => { e.preventDefault(); onDragOver(idx); }}
              onDragLeave={onDragLeave}
              onDrop={e => onDrop(e, idx)}
              onClick={() => onCellClick(idx)}
            >
              {/* 행 번호 라벨 */}
              {idx % SIM_COLS === 0 && (
                <div className="absolute -left-5 top-1/2 -translate-y-1/2 text-[9px] font-bold"
                  style={{ color: '#334155' }}>
                  {Math.floor(idx / SIM_COLS) + 1}
                </div>
              )}

              {unit && (
                <PlacedUnit
                  unit={unit}
                  isSelected={selectedCell === idx}
                  onSelect={() => onCellClick(idx)}
                  onRemove={() => onRemoveUnit(idx)}
                  onDragStart={e => onBoardDragStart(e, idx, unit)}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 하단 방향 안내 */}
      <div className="mt-2 flex justify-between text-[10px]" style={{ color: '#334155' }}>
        <span>↑ 전방 (상대 진영 방향)</span>
        <span>후방 ↓</span>
      </div>
    </div>
  );
}
