import champions from './champions.json';
import traits from './traits.json';
import items from './items.json';
import augments from './augments.json';
import comps from './comps.json';

// ─── 기본 조회 ─────────────────────────────────────────────

export const getChampionById = (id) =>
  champions.find((c) => c.id === id) ?? null;

export const getTraitById = (id) =>
  traits.find((t) => t.id === id) ?? null;

export const getItemById = (id) =>
  items.find((i) => i.id === id) ?? null;

export const getAugmentById = (id) =>
  augments.find((a) => a.id === id) ?? null;

export const getCompById = (id) =>
  comps.find((c) => c.id === id) ?? null;

// ─── 코스트별 필터 ────────────────────────────────────────

export const getChampionsByCost = (cost) =>
  champions.filter((c) => c.cost === cost);

// ─── 특성별 챔피언 조회 ───────────────────────────────────

export const getChampionsByTrait = (traitId) =>
  champions.filter((c) => c.traits.includes(traitId));


// ─── 시너지 계산 ─────────────────────────────────────────

/**
 * 챔피언 id 배열을 받아 활성 시너지 목록 반환
 * @param {string[]} championIds
 * @returns {{ trait: object, count: number, activeBreakpoint: object | null }[]}
 */
export const calcActiveTraits = (championIds) => {
  const traitCount = {};

  championIds.forEach((id) => {
    const champ = getChampionById(id);
    if (!champ) return;
    champ.traits.forEach((traitId) => {
      traitCount[traitId] = (traitCount[traitId] ?? 0) + 1;
    });
  });

  return Object.entries(traitCount)
    .map(([traitId, count]) => {
      const trait = getTraitById(traitId);
      if (!trait) return null;
      const activeBreakpoint =
        [...trait.breakpoints]
          .reverse()
          .find((bp) => count >= bp.count) ?? null;
      return { trait, count, activeBreakpoint };
    })
    .filter(Boolean)
    .filter((t) => t.activeBreakpoint !== null)
    .sort((a, b) => b.count - a.count);
};

// ─── 아이템 타입별 조회 ───────────────────────────────────

export const getComponentItems = () =>
  items.filter((i) => i.type === 'component');

export const getNormalItems = () =>
  items.filter((i) => i.type === 'normal');

// ─── Raw 데이터 export ────────────────────────────────────

export { champions, traits, items, augments, comps };