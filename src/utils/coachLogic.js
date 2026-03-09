// ─────────────────────────────────────────────
//  coachLogic.js  (src/utils/coachLogic.js)
//  AI 코치 페이지 판단 로직 — 순수 함수만 모음
// ─────────────────────────────────────────────
import { comps } from '../data/index.js';

// ─── 라운드 파싱 ──────────────────────────────
/**
 * "3-2", "4-5" 같은 라운드 문자열에서 스테이지 번호 추출
 * @param {string|null} roundStr
 * @returns {number|null}
 */
export function parseStage(roundStr) {
  if (!roundStr) return null;
  const match = String(roundStr).match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

// ─── 덱 일치도 계산 ───────────────────────────
/**
 * 감지된 챔피언 이름 배열과 comps.json을 비교해 가장 유사한 덱 + 점수 반환
 * @param {string[]} detectedChampNames
 * @returns {{ score: number, bestComp: object|null }}
 */
export function calcDeckScore(detectedChampNames) {
  if (!detectedChampNames?.length) return { score: 0, bestComp: null };

  const nameSet = new Set(detectedChampNames.map(n => n.toLowerCase()));
  let best = null, bestScore = 0;

  for (const comp of comps) {
    const matched = comp.champions.filter(c =>
      nameSet.has(c.name.toLowerCase())
    ).length;
    const score = Math.round((matched / comp.champions.length) * 100);
    if (score > bestScore) { bestScore = score; best = comp; }
  }

  return { score: bestScore, bestComp: best };
}

// ─── 신호등 판정 ──────────────────────────────
/**
 * 스테이지·HP·덱일치도 조합으로 신호등 색 결정
 *
 * 핵심 로직:
 *  - HP ≤ 30                → 무조건 red
 *  - Stage 4+ (중후반)      → 피벗 페널티 (기준 강화)
 *  - Stage 1~3 (초중반)     → 피벗 허용 (기준 완화)
 *
 * @param {{ score: number, stage: string|null, hp: string|number }} params
 * @returns {'green'|'yellow'|'red'}
 */
export function judgeSignal({ score, stage, hp }) {
  const s     = parseStage(stage);
  const hpNum = parseInt(hp) || 100;

  if (hpNum <= 30) return 'red';

  if (s >= 4) {
    // 중후반: 피벗 강력 페널티 → 기준 엄격
    if (score >= 55) return 'green';
    if (score >= 30) return 'yellow';
    return 'red';
  }

  // 초중반: 피벗 가능 → 기준 완화
  if (score >= 60) return 'green';
  if (score >= 35) return 'yellow';
  return 'red';
}
