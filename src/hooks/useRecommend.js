import { useState, useMemo } from 'react';
import { comps } from '../data/index.js';

const COMPONENT_TO_COMPLETED = {
  bf_sword:             ['infinity_edge','bloodthirster','last_whisper','edge_of_night','giant_slayer','shojins_spear'],
  recurve_bow:          ['runaans_hurricane','last_whisper','ionic_spark'],
  needlessly_large_rod: ['rabadons_deathcap','jeweled_gauntlet','morellonomicon','shojins_spear'],
  tear_of_goddess:      ['blue_buff','shojins_spear','redemption'],
  chain_vest:           ['bramble_vest','gargoyle_stoneplate','sunfire_cape','titan_resolve','edge_of_night'],
  negatron_cloak:       ['gargoyle_stoneplate','quicksilver','bloodthirster','ionic_spark'],
  giants_belt:          ['warmogs_armor','sunfire_cape','giant_slayer','morellonomicon','redemption','titan_resolve'],
  sparring_gloves:      ['jeweled_gauntlet','last_whisper','quicksilver'],
};

const TIER_BONUS = { S: 15, A: 8, B: 3, C: 0 };

function scoreComp(comp, ownedChampIds, ownedComponentIds, ownedAugIds) {
  const champSet = new Set(ownedChampIds);
  const augSet   = new Set(ownedAugIds);

  // comps.json의 champions는 { id, star, position, items }[] 형태
  const champIds   = comp.champions.map(c => c.id ?? c);
  const carryChamp = comp.champions.find(c => (c.id ?? c) === comp.carry);
  const carryItems = carryChamp?.items ?? [];

  // 챔피언 매칭 (50점)
  const matchedChamps = champIds.filter(id => champSet.has(id));
  const missingChamps = champIds.filter(id => !champSet.has(id));
  const champScore    = (matchedChamps.length / Math.max(champIds.length, 1)) * 50;

  // 아이템 매칭 (30점)
  const craftable    = new Set(ownedComponentIds.flatMap(c => COMPONENT_TO_COMPLETED[c] ?? []));
  const matchedItems = carryItems.filter(id => craftable.has(id));
  const itemScore    = (matchedItems.length / Math.max(carryItems.length, 1)) * 30;

  // 증강 매칭 (20점)
  const matchedAugs = comp.augments.filter(id => augSet.has(id));
  const augScore    = (matchedAugs.length / Math.max(comp.augments.length, 1)) * 20;

  const tierBonus = TIER_BONUS[comp.tier] ?? 0;
  const total     = Math.min(100, Math.round(champScore + itemScore + augScore + tierBonus));

  return {
    ...comp,
    champIds,        // id 배열 (RecommendPage 렌더링용)
    score:         total,
    matchedChamps: matchedChamps.length,
    missingChamps,
    champScore:    Math.round(champScore),
    craftable,
    matchedItems:  matchedItems.length,
    itemScore:     Math.round(itemScore),
    matchedAugs:   matchedAugs.length,
    augScore:      Math.round(augScore),
  };
}

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