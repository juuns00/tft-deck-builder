import { useState, useMemo } from 'react';
import { comps, items } from '../data/index.js';

// ─── 부품 → 완성템 매핑 ────────────────────────
export const COMPONENT_TO_COMPLETED = {
  bf_sword:             ['infinity_edge','bloodthirster','last_whisper','edge_of_night','giant_slayer','shojins_spear'],
  recurve_bow:          ['runaans_hurricane','last_whisper','ionic_spark','guinsoos_rageblade'],
  needlessly_large_rod: ['rabadons_deathcap','jeweled_gauntlet','morellonomicon','shojins_spear','archangels_staff'],
  tear_of_goddess:      ['blue_buff','shojins_spear','redemption','archangels_staff'],
  chain_vest:           ['bramble_vest','gargoyle_stoneplate','sunfire_cape','titan_resolve','edge_of_night'],
  negatron_cloak:       ['gargoyle_stoneplate','quicksilver','bloodthirster','ionic_spark'],
  giants_belt:          ['warmogs_armor','sunfire_cape','giant_slayer','morellonomicon','redemption','titan_resolve'],
  sparring_gloves:      ['jeweled_gauntlet','last_whisper','quicksilver','thiefs_gloves'],
};

// 역방향: 완성템 → 필요한 부품들
const COMPLETED_TO_COMPONENTS = {};
Object.entries(COMPONENT_TO_COMPLETED).forEach(([comp, completeds]) => {
  completeds.forEach(c => {
    if (!COMPLETED_TO_COMPONENTS[c]) COMPLETED_TO_COMPONENTS[c] = [];
    COMPLETED_TO_COMPONENTS[c].push(comp);
  });
});

const TIER_BONUS = { S: 15, A: 8, B: 3, C: 0 };

// ─── 아이템 이름 조회 헬퍼 ────────────────────
function getItemName(itemId) {
  const found = items?.find(i => i.id === itemId);
  return found?.name ?? itemId;
}

// ─── 매칭 근거 텍스트 생성 ────────────────────
function buildMatchReason(comp, ownedChampIds, ownedComponentIds, craftableSet, matchedChamps, matchedItems) {
  const champRatio = matchedChamps.length / Math.max(comp.champions.length, 1);
  const itemRatio  = matchedItems.length / Math.max(
    (comp.champions.find(c => (c.id ?? c) === comp.carry)?.items ?? []).length, 1
  );

  // 근거 칩 배열 생성
  const tags = [];

  // 기물 매칭
  if (champRatio >= 0.6) {
    tags.push({ type: 'champ', label: `기물 일치 ${Math.round(champRatio * 100)}%` });
  } else if (matchedChamps.length >= 2) {
    const names = matchedChamps.slice(0, 2).map(id => {
      const c = comp.champions.find(ch => (ch.id ?? ch) === id);
      return c?.name ?? id;
    }).join('·');
    tags.push({ type: 'champ', label: `${names} 보유` });
  }

  // 아이템 매칭
  if (matchedItems.length > 0) {
    const carryChamp = comp.champions.find(c => (c.id ?? c) === comp.carry);
    const carryName  = carryChamp?.name ?? '캐리';
    const itemName   = getItemName(matchedItems[0]);
    tags.push({ type: 'item', label: `${carryName}에 ${itemName} 적합` });
  } else if (ownedComponentIds.length > 0) {
    // 완성템은 아니더라도 재료가 있으면
    const carryChamp = comp.champions.find(c => (c.id ?? c) === comp.carry);
    const carryItems = carryChamp?.items ?? [];
    const partialMatch = ownedComponentIds.some(comp =>
      (COMPONENT_TO_COMPLETED[comp] ?? []).some(ci => carryItems.includes(ci))
    );
    if (partialMatch) {
      tags.push({ type: 'item', label: '핵심 아이템 재료 보유' });
    }
  }

  // 티어 보너스
  if (comp.tier === 'S') tags.push({ type: 'tier', label: 'S티어 최강 덱' });
  else if (comp.tier === 'A') tags.push({ type: 'tier', label: 'A티어 안정적' });

  // 겹침(인기) 여부 — winRate 기반 임시
  if (comp.winRate >= 0.55) {
    tags.push({ type: 'popular', label: '인기 높음 (겹칠 수 있음)' });
  }

  // 텍스트 요약
  let summary = '';
  if (champRatio >= 0.7) {
    summary = `보유 기물(${matchedChamps.slice(0,2).map(id => {
      const c = comp.champions.find(ch => (ch.id ?? ch) === id);
      return c?.name ?? id;
    }).join(', ')})이 이 덱의 핵심 시너지와 강하게 일치합니다.`;
  } else if (matchedItems.length > 0) {
    const carryChamp = comp.champions.find(c => (c.id ?? c) === comp.carry);
    const carryName  = carryChamp?.name ?? '캐리';
    const itemName   = getItemName(matchedItems[0]);
    summary = `보유 아이템(${itemName})이 캐리 유닛 ${carryName}의 필수 빌드와 일치합니다.`;
  } else if (matchedChamps.length > 0) {
    const name = (() => {
      const c = comp.champions.find(ch => (ch.id ?? ch) === matchedChamps[0]);
      return c?.name ?? matchedChamps[0];
    })();
    summary = `보유 중인 ${name}이(가) 이 덱의 핵심 기물입니다.`;
  } else {
    summary = `${comp.tier ?? 'A'}티어 덱으로 현재 메타에서 안정적인 성적을 보입니다.`;
  }

  return { summary, tags };
}

// ─── 아이템 빌드업 계산 ───────────────────────
function buildItemPriority(comp, ownedComponentIds) {
  const carryChamp = comp.champions.find(c => (c.id ?? c) === comp.carry);
  if (!carryChamp) return null;

  const carryItems = carryChamp.items ?? [];
  if (carryItems.length === 0) return null;

  // 각 완성템마다 유저 보유 재료 수 계산
  const buildable = carryItems.map(itemId => {
    const requiredComps = COMPLETED_TO_COMPONENTS[itemId] ?? [];
    const owned = ownedComponentIds.filter(c => requiredComps.includes(c));
    return {
      itemId,
      itemName: getItemName(itemId),
      requiredComps,
      ownedCount: owned.length,
      totalRequired: 2, // 모든 완성템은 부품 2개
      canCraft: owned.length >= 2,
      almostCraft: owned.length === 1,
    };
  });

  const craftable  = buildable.filter(b => b.canCraft);
  const almost     = buildable.filter(b => b.almostCraft && !b.canCraft);
  const carryName  = carryChamp.name ?? '캐리';

  if (craftable.length > 0) {
    const first = craftable[0];
    return {
      carryName,
      topItem: first.itemName,
      advice: `지금 바로 ${carryName}에게 ${first.itemName}을(를) 완성하세요!`,
      craftable: craftable.map(b => b.itemName),
      almost:    almost.map(b => b.itemName),
    };
  } else if (almost.length > 0) {
    const first = almost[0];
    const missing = (COMPLETED_TO_COMPONENTS[first.itemId] ?? [])
      .find(c => !ownedComponentIds.includes(c));
    const missingName = missing
      ? (items?.find(i => i.id === missing)?.name ?? missing)
      : '재료 1개';
    return {
      carryName,
      topItem: first.itemName,
      advice: `${missingName}만 더 모으면 ${carryName}의 ${first.itemName} 완성!`,
      craftable: [],
      almost:    almost.map(b => b.itemName),
    };
  }

  return {
    carryName,
    topItem: carryItems[0] ? getItemName(carryItems[0]) : null,
    advice: `${carryName}을(를) 위해 ${carryItems.map(getItemName).join(', ')} 재료를 모으세요.`,
    craftable: [],
    almost: [],
  };
}

// ─── 아이템 홀더 (용병) 추천 ──────────────────
function buildHolderAdvice(comp, ownedChampIds) {
  // 최종 캐리(4~5코스트)가 아직 없을 때
  const carryId    = comp.carry;
  const carryChamp = comp.champions.find(c => (c.id ?? c) === carryId);
  const carryOwned = carryId && ownedChampIds.includes(carryId);

  if (carryOwned) return null; // 이미 캐리 보유 → 홀더 필요 없음

  // 덱 내 1~2코스트 중 유저가 보유한 챔피언
  const lowCostOwned = comp.champions.filter(c => {
    const cid  = c.id ?? c;
    const cost = c.cost ?? 1;
    return cost <= 2 && ownedChampIds.includes(cid);
  });

  if (lowCostOwned.length === 0) return null;

  const holder     = lowCostOwned[0];
  const holderName = holder.name ?? holder.id ?? '이 기물';
  const carryName  = carryChamp?.name ?? '캐리';

  return {
    holderName,
    carryName,
    advice: `${carryName} 나오기 전까지 ${holderName}에게 아이템을 주고 피 관리하세요.`,
  };
}

// ─── 플레이스타일 도출 ────────────────────────
function getPlayStyle(comp) {
  if (comp.playStyle && comp.playStyle !== '') return comp.playStyle;
  const costs    = comp.champions.map(c => c.cost ?? 1);
  const avg      = costs.reduce((a, b) => a + b, 0) / Math.max(costs.length, 1);
  const has6plus = costs.some(c => c >= 6);
  const has5     = costs.some(c => c >= 5);
  const lowCount = costs.filter(c => c <= 2).length;
  const gc       = comp.goldCost ?? 100;
  if (has6plus || (has5 && gc >= 120)) return 'fast9';
  if (lowCount >= 4 || (avg <= 2.5 && gc <= 85)) return 'slow-roll';
  return 'standard';
}

// ─── 난이도 도출 ──────────────────────────────
function getDifficulty(comp) {
  // JSON에 difficulty 필드가 있으면 그것 사용, 없으면 골드 코스트 기반 추정
  if (comp.difficulty && comp.difficulty !== '') return comp.difficulty;
  const gc = comp.goldCost ?? 100;
  if (gc <= 80)  return 'easy';
  if (gc <= 110) return 'medium';
  return 'hard';
}

// ─── 인기도 도출 ──────────────────────────────
function getPopularity(comp) {
  const wr = comp.winRate ?? 0;
  if (wr >= 0.55) return 'high';
  if (wr >= 0.45) return 'medium';
  return 'low';
}

// ─── 핵심 점수 계산 ───────────────────────────
function scoreComp(comp, ownedChampIds, ownedComponentIds, ownedAugIds) {
  const champSet = new Set(ownedChampIds);
  const augSet   = new Set(ownedAugIds);

  const champIds   = comp.champions.map(c => c.id ?? c);
  const carryChamp = comp.champions.find(c => (c.id ?? c) === comp.carry);
  const carryItems = carryChamp?.items ?? [];

  // 챔피언 매칭 (50점)
  const matchedChampIds = champIds.filter(id => champSet.has(id));
  const missingChamps   = champIds.filter(id => !champSet.has(id));
  const champScore      = (matchedChampIds.length / Math.max(champIds.length, 1)) * 50;

  // 아이템 매칭 (30점)
  const craftable    = new Set(ownedComponentIds.flatMap(c => COMPONENT_TO_COMPLETED[c] ?? []));
  const matchedItems = carryItems.filter(id => craftable.has(id));
  const itemScore    = (matchedItems.length / Math.max(carryItems.length, 1)) * 30;

  // 증강 매칭 (20점)
  const matchedAugs = comp.augments.filter(id => augSet.has(id));
  const augScore    = (matchedAugs.length / Math.max(comp.augments.length, 1)) * 20;

  const tierBonus = TIER_BONUS[comp.tier] ?? 0;
  const total     = Math.min(100, Math.round(champScore + itemScore + augScore + tierBonus));

  // 매칭 근거, 아이템 빌드업, 홀더 추천
  const { summary: matchSummary, tags: matchTags } = buildMatchReason(
    comp, ownedChampIds, ownedComponentIds, craftable, matchedChampIds, matchedItems
  );
  const itemBuild   = buildItemPriority(comp, ownedComponentIds);
  const holderAdvice = buildHolderAdvice(comp, ownedChampIds);

  return {
    ...comp,
    champIds,
    score:         total,
    matchedChamps: matchedChampIds.length,
    matchedChampIds,
    missingChamps,
    champScore:    Math.round(champScore),
    craftable,
    matchedItems:  matchedItems.length,
    matchedItemIds: matchedItems,
    itemScore:     Math.round(itemScore),
    matchedAugs:   matchedAugs.length,
    augScore:      Math.round(augScore),
    // 신규 필드
    matchSummary,
    matchTags,
    itemBuild,
    holderAdvice,
    difficulty:   getDifficulty(comp),
    playStyle:    getPlayStyle(comp),
    popularity:   getPopularity(comp),
  };
}

// ─── hook ─────────────────────────────────────
export function useRecommend() {
  const [ownedChamps,     setChamps]     = useState([]);
  const [ownedComponents, setComponents] = useState([]);
  const [ownedAugs,       setAugs]       = useState([]);

  const toggle = (arr, set, id) =>
    set(arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id]);

  const toggleChamp     = id => toggle(ownedChamps,     setChamps,     id);
  const toggleComponent = id => toggle(ownedComponents, setComponents, id);
  const toggleAug       = id => toggle(ownedAugs,       setAugs,       id);

  const clearChamps     = () => setChamps([]);
  const clearComponents = () => setComponents([]);
  const clearAugs       = () => setAugs([]);
  const clearAll        = () => { setChamps([]); setComponents([]); setAugs([]); };

  const totalSelected = ownedChamps.length + ownedComponents.length + ownedAugs.length;
  const hasInput = totalSelected >= 3;

  const results = useMemo(() => {
    if (!hasInput) return [];
    return comps
      .map(c => scoreComp(c, ownedChamps, ownedComponents, ownedAugs))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [ownedChamps, ownedComponents, ownedAugs, hasInput]);

  return {
    ownedChamps, ownedComponents, ownedAugs,
    toggleChamp, toggleComponent, toggleAug,
    clearChamps, clearComponents, clearAugs, clearAll,
    results, hasInput,
  };
}