import { useState, useMemo } from 'react';
import { comps } from '../data/index.js';
import { TIER_ORDER } from '../utils/constants.js';

// ─────────────────────────────────────────────
//  useComps
//  티어표·덱 목록 페이지에서 사용하는 필터/정렬 훅
// ─────────────────────────────────────────────

/**
 * @typedef {object} CompsFilter
 * @property {string|null} tier        - 'S'|'A'|'B'|'C'|null (null = 전체)
 * @property {string|null} traitId     - 특성 id (null = 전체)
 * @property {string|null} difficulty  - 'easy'|'medium'|'hard'|null
 * @property {string|null} playStyle   - 'slow-roll'|'standard'|'fast9'|null
 * @property {string}      sortBy      - 'tier'|'winRate'
 * @property {string}      search      - 덱 이름 검색어
 */

const DEFAULT_FILTER = {
  tier:       null,
  traitId:    null,
  difficulty: null,
  playStyle:  null,
  sortBy:     'tier',
  search:     '',
};

/**
 * useComps
 *
 * @returns {{
 *   filter:     CompsFilter,
 *   setFilter:  (patch: Partial<CompsFilter>) => void,
 *   resetFilter:() => void,
 *   filtered:   object[],
 *   total:      number,
 * }}
 */
export function useComps() {
  const [filter, setFilterState] = useState(DEFAULT_FILTER);

  // 부분 업데이트 지원 (setFilter({ tier: 'S' }) 형태)
  const setFilter = patch =>
    setFilterState(prev => ({ ...prev, ...patch }));

  const resetFilter = () => setFilterState(DEFAULT_FILTER);

  const filtered = useMemo(() => {
    let result = [...comps];

    // 티어 필터
    if (filter.tier)
      result = result.filter(c => c.tier === filter.tier);

    // 특성 필터
    if (filter.traitId)
      result = result.filter(c => c.traits.some(t => t.id === filter.traitId));

    // 난이도 필터
    if (filter.difficulty)
      result = result.filter(c => c.difficulty === filter.difficulty);

    // 플레이 스타일 필터
    if (filter.playStyle)
      result = result.filter(c => c.playStyle === filter.playStyle);

    // 검색어 필터
    if (filter.search.trim()) {
      const q = filter.search.trim().toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(q));
    }

    // 정렬
    result.sort((a, b) => {
      if (filter.sortBy === 'winRate') return b.winRate - a.winRate;
      // 기본: 티어 → 승률 순
      const tierDiff = (TIER_ORDER[a.tier] ?? 9) - (TIER_ORDER[b.tier] ?? 9);
      return tierDiff !== 0 ? tierDiff : b.winRate - a.winRate;
    });

    return result;
  }, [filter]);

  return {
    filter,
    setFilter,
    resetFilter,
    filtered,
    total: comps.length,
  };
}
