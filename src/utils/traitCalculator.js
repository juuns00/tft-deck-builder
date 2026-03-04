import { getChampionById, getTraitById } from '../data/index.js';

// ─────────────────────────────────────────────
//  시너지 계산 유틸
// ─────────────────────────────────────────────

/**
 * 챔피언 id 배열 → 특성별 카운트 맵
 * @param {string[]} championIds
 * @returns {Record<string, number>}  예: { noxus: 4, slaughter: 3 }
 */
export const countTraits = (championIds) => {
  const map = {};
  championIds.forEach((id) => {
    const champ = getChampionById(id);
    if (!champ) return;
    champ.traits.forEach((traitId) => {
      map[traitId] = (map[traitId] ?? 0) + 1;
    });
  });
  return map;
};

/**
 * 특성 카운트 맵 → 활성 시너지 목록 (발동 중인 것만)
 * @param {Record<string, number>} traitCountMap
 * @returns {{
 *   trait: object,
 *   count: number,
 *   activeBreakpoint: { count: number, effect: string },
 *   nextBreakpoint: { count: number, effect: string } | null,
 *   remaining: number | null,   // 다음 발동까지 남은 수
 *   isMaxed: boolean,
 * }[]}
 */
export const resolveActiveTraits = (traitCountMap) => {
  return Object.entries(traitCountMap)
    .map(([traitId, count]) => {
      const trait = getTraitById(traitId);
      if (!trait) return null;

      const { breakpoints } = trait;
      const sorted = [...breakpoints].sort((a, b) => a.count - b.count);

      // 현재 발동 중인 가장 높은 단계
      const activeBreakpoint =
        [...sorted].reverse().find((bp) => count >= bp.count) ?? null;

      // 아직 발동 안 된 것 중 가장 낮은 다음 단계
      const nextBreakpoint =
        sorted.find((bp) => bp.count > count) ?? null;

      const remaining = nextBreakpoint ? nextBreakpoint.count - count : null;
      const isMaxed   = nextBreakpoint === null;

      return {
        trait,
        count,
        activeBreakpoint,
        nextBreakpoint,
        remaining,
        isMaxed,
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      // 발동 중인 것 먼저, 그 다음 카운트 내림차순
      if (!!a.activeBreakpoint !== !!b.activeBreakpoint) {
        return a.activeBreakpoint ? -1 : 1;
      }
      return b.count - a.count;
    });
};

/**
 * 챔피언 id 배열 → 전체 시너지 분석 (편의 함수)
 * @param {string[]} championIds
 */
export const analyzeTraits = (championIds) => {
  const traitCountMap = countTraits(championIds);
  return resolveActiveTraits(traitCountMap);
};

/**
 * 특정 챔피언을 추가했을 때 새로 발동되거나 단계가 오르는 시너지 목록 반환
 * @param {string[]} currentIds  현재 보드의 챔피언 id 배열
 * @param {string}   newId       추가할 챔피언 id
 * @returns {{ traitId: string, prevCount: number, newCount: number, gained: boolean }[]}
 */
export const previewTraitChange = (currentIds, newId) => {
  const newChamp = getChampionById(newId);
  if (!newChamp) return [];

  const before = countTraits(currentIds);
  const after  = countTraits([...currentIds, newId]);

  return newChamp.traits.map((traitId) => {
    const trait       = getTraitById(traitId);
    if (!trait) return null;

    const prevCount = before[traitId] ?? 0;
    const newCount  = after[traitId]  ?? 0;
    const sorted    = [...trait.breakpoints].sort((a, b) => a.count - b.count);

    const prevActive = [...sorted].reverse().find((bp) => prevCount >= bp.count) ?? null;
    const nextActive = [...sorted].reverse().find((bp) => newCount  >= bp.count) ?? null;

    // 새 발동이 생겼거나 단계가 올랐으면 gained = true
    const gained =
      (prevActive === null && nextActive !== null) ||
      (prevActive && nextActive && nextActive.count > prevActive.count);

    return { traitId, trait, prevCount, newCount, gained };
  }).filter(Boolean);
};

/**
 * 덱의 시너지 완성도 점수 계산 (0 ~ 100)
 * 발동 중인 시너지 수 + 최고 단계 가중치
 * @param {string[]} championIds
 * @returns {number}
 */
export const calcSynergyScore = (championIds) => {
  const traits = analyzeTraits(championIds);
  const active = traits.filter((t) => t.activeBreakpoint !== null);
  if (active.length === 0) return 0;

  const score = active.reduce((sum, t) => {
    const { breakpoints } = t.trait;
    const maxCount  = Math.max(...breakpoints.map((bp) => bp.count));
    const tierRatio = t.count / maxCount; // 0~1: 최고 단계 대비 비율
    return sum + tierRatio;
  }, 0);

  // 활성 시너지 수 × 평균 단계 비율 → 100점 만점 정규화
  return Math.min(100, Math.round((score / active.length) * 100));
};
