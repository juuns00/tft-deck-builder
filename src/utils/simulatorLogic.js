// ─────────────────────────────────────────────
//  src/utils/simulatorLogic.js
//  배치 전술 훈련소 — 순수 계산 함수
//  · getDangerCells   — 위험 구역 Set 계산
//  · getRangeCells    — 사거리 Set 계산
// ─────────────────────────────────────────────
import { SIM_ROWS, SIM_COLS, THREAT_MAP } from './simulatorConstants.js';

/**
 * 체크된 위협 ID 배열 + 그리드 배치 위협 배열 →
 * 위험한 셀 인덱스 Set 반환
 *
 * @param {string[]} activeThreats       - 체크박스 활성 위협 id 배열
 * @param {{ threatId: string, cellIdx: number }[]} threatPlacements
 *                                       - 그리드에 직접 배치된 위협 (서풍·침묵)
 * @returns {Set<number>}
 */
export function getDangerCells(activeThreats, threatPlacements) {
  const danger = new Set();

  // ── 체크박스형 위협 ────────────────────────
  activeThreats.forEach(threatId => {
    const threat = THREAT_MAP[threatId];
    if (!threat) return;

    switch (threat.dangerType) {
      case 'grab':
        // 전방 1–2행 (row 0, 1)
        for (let r = 0; r < 2; r++)
          for (let c = 0; c < SIM_COLS; c++)
            danger.add(r * SIM_COLS + c);
        break;

      case 'assassin':
        // 후방 2행 (row 2, 3)
        for (let r = 2; r < SIM_ROWS; r++)
          for (let c = 0; c < SIM_COLS; c++)
            danger.add(r * SIM_COLS + c);
        break;

      case 'aoe':
        // 전방 중앙 3열 × 2행
        for (let r = 0; r < 2; r++)
          for (let c = 2; c < 5; c++)
            danger.add(r * SIM_COLS + c);
        break;

      default:
        break;
    }
  });

  // ── 드래그 배치형 위협 (서풍·침묵) ─────────
  (threatPlacements ?? []).forEach(({ threatId, cellIdx }) => {
    const threat = THREAT_MAP[threatId];
    if (!threat) return;

    const row = Math.floor(cellIdx / SIM_COLS);
    const col = cellIdx % SIM_COLS;

    switch (threat.dangerType) {
      case 'zephyr': {
        // 반대편 행의 같은 열 ± 1칸
        const mirrorRow = SIM_ROWS - 1 - row;
        danger.add(mirrorRow * SIM_COLS + col);
        if (col > 0)             danger.add(mirrorRow * SIM_COLS + col - 1);
        if (col < SIM_COLS - 1)  danger.add(mirrorRow * SIM_COLS + col + 1);
        break;
      }
      case 'shroud':
        // 같은 열 전체
        for (let r = 0; r < SIM_ROWS; r++)
          danger.add(r * SIM_COLS + col);
        break;

      default:
        break;
    }
  });

  return danger;
}

/**
 * 특정 셀의 사거리 내 셀 인덱스 Set 반환
 * TFT range 값(헥스 거리)을 그리드 맨해튼 거리로 근사
 *
 * @param {number} cellIdx  - 기준 셀 인덱스
 * @param {number} range    - champion.stats.range 값
 * @returns {Set<number>}
 */
export function getRangeCells(cellIdx, range) {
  const baseRow = Math.floor(cellIdx / SIM_COLS);
  const baseCol = cellIdx % SIM_COLS;
  // TFT range → 그리드 반경 근사 (range 1≈1칸, range 4≈2칸, range 5≈3칸)
  const radius = Math.ceil(range / 1.8);
  const cells = new Set();

  for (let r = 0; r < SIM_ROWS; r++) {
    for (let c = 0; c < SIM_COLS; c++) {
      const dist = Math.abs(r - baseRow) + Math.abs(c - baseCol);
      if (dist > 0 && dist <= radius) cells.add(r * SIM_COLS + c);
    }
  }
  return cells;
}
