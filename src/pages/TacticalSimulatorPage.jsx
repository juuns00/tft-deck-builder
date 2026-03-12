// ─────────────────────────────────────────────
//  src/pages/TacticalSimulatorPage.jsx
//  배치 전술 훈련소 — 최종 조립 페이지
//
//  의존:
//    hooks/useSimulator.js
//    utils/simulatorLogic.js   (getDangerCells, getRangeCells)
//    utils/simulatorConstants.js
//    components/simulator/index.js
//    data/index.js             (champions)
// ─────────────────────────────────────────────
import { useMemo }           from 'react';
import { champions }         from '../data/index.js';
import { useSimulator }      from '../hooks/useSimulator.js';
import { getDangerCells, getRangeCells } from '../utils/simulatorLogic.js';
import {
  BoardGrid,
  ChampPool,
  ThreatPanel,
  UnitInfoCard,
  AnalysisPanel,
  RoleLegend,
} from '../components/simulator/index.js';

// ─── 전역 CSS (한 번만 주입) ──────────────────
const GLOBAL_STYLES = `
  @keyframes danger-pulse {
    0%, 100% { opacity: 0.25; }
    50%       { opacity: 0.45; }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

// ─── 메인 페이지 ──────────────────────────────
export default function TacticalSimulatorPage() {
  const sim = useSimulator();

  // ── 파생값 계산 ────────────────────────────
  /** 사거리 강조 셀 */
  const rangeCells = useMemo(() => {
    if (sim.selectedCell === null) return new Set();
    const unit = sim.board[sim.selectedCell];
    if (!unit || unit.sourceType === 'threat') return new Set();
    return getRangeCells(sim.selectedCell, unit.stats?.range ?? 2);
  }, [sim.selectedCell, sim.board]);

  /** 위험 구역 셀 */
  const dangerCells = useMemo(() =>
    getDangerCells(sim.activeThreats, sim.threatPlacements),
    [sim.activeThreats, sim.threatPlacements]
  );

  /** 현재 선택된 셀의 유닛 */
  const selectedUnit = sim.selectedCell !== null ? sim.board[sim.selectedCell] : null;

  return (
    <div className="min-h-screen" style={{ background: '#060B14', color: '#CBD5E1' }}>
      <style>{GLOBAL_STYLES}</style>

      <div className="max-w-[1280px] mx-auto px-4 py-6">

        {/* ── 페이지 헤더 ─────────────────────── */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">🗺️</span>
            <h1
              className="text-2xl font-black tracking-tight"
              style={{
                background:           'linear-gradient(135deg,#FFD700,#F59E0B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
              }}
            >
              배치 전술 훈련소
            </h1>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full border"
              style={{ color: '#4ADE80', borderColor: '#4ADE8033', background: '#4ADE8011' }}
            >
              BETA
            </span>
          </div>
          <p className="text-sm" style={{ color: '#475569' }}>
            유닛을 드래그해서 배치하고, 위협 요소로부터 캐리를 지키는 최적의 위치를 찾아봐.
          </p>
        </div>

        {/* ── 2-컬럼 레이아웃 ─────────────────── */}
        <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 320px' }}>

          {/* ── 좌측: 전장 + 챔피언 풀 ─────────── */}
          <div className="flex flex-col gap-4">
            <BoardGrid
              board={sim.board}
              selectedCell={sim.selectedCell}
              rangeCells={rangeCells}
              dangerCells={dangerCells}
              dragOverCell={sim.dragOverCell}
              onCellClick={sim.handleCellClick}
              onRemoveUnit={sim.handleRemoveUnit}
              onDrop={sim.handleDrop}
              onDragOver={idx => sim.setDragOverCell(idx)}
              onDragLeave={sim.handleDragLeave}
              onBoardDragStart={sim.handleBoardDragStart}
              onClearBoard={sim.clearBoard}
              placedCount={sim.placedCount}
            />
            <ChampPool
              champions={champions}
              onDragStart={sim.handlePoolDragStart}
            />
          </div>

          {/* ── 우측 사이드바 ───────────────────── */}
          <div className="flex flex-col gap-4">
            <ThreatPanel
              activeThreats={sim.activeThreats}
              onToggleThreat={sim.toggleThreat}
              onDragStart={sim.handlePoolDragStart}
              threatPlacements={sim.threatPlacements}
            />

            {/* 선택된 유닛 정보 (선택시만 표시) */}
            {selectedUnit && (
              <UnitInfoCard unit={selectedUnit} />
            )}

            <AnalysisPanel
              feedback={sim.feedback}
              loadingFeedback={sim.loadingFeedback}
              apiKey={sim.apiKey}
              onApiKeyChange={sim.setApiKey}
              showApiInput={sim.showApiInput}
              onShowApiInput={() => sim.setShowApiInput(true)}
              onAnalyze={sim.handleAnalyze}
            />

            <RoleLegend />
          </div>
        </div>
      </div>
    </div>
  );
}
