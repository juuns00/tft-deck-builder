import { useState, useMemo } from 'react';
import { champions, comps } from '../data/index.js';

// ─────────────────────────────────────────────
//  useSearch
//  챔피언 또는 덱을 이름/특성으로 검색
// ─────────────────────────────────────────────

/**
 * useChampionSearch
 * 챔피언 이름 또는 특성 id로 검색 + 코스트 필터
 *
 * @returns {{
 *   query:         string,
 *   setQuery:      (q: string) => void,
 *   costFilter:    number|null,
 *   setCostFilter: (cost: number|null) => void,
 *   results:       object[],
 *   clear:         () => void,
 * }}
 */
export function useChampionSearch() {
  const [query,      setQuery]      = useState('');
  const [costFilter, setCostFilter] = useState(null);

  const results = useMemo(() => {
    let list = [...champions];

    // 코스트 필터
    if (costFilter !== null)
      list = list.filter(c => c.cost === costFilter);

    // 검색어 필터 (이름 또는 특성 이름)
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.traits.some(t => t.toLowerCase().includes(q))
      );
    }

    // 코스트 오름차순 정렬
    return list.sort((a, b) => a.cost - b.cost);
  }, [query, costFilter]);

  const clear = () => { setQuery(''); setCostFilter(null); };

  return { query, setQuery, costFilter, setCostFilter, results, clear };
}

/**
 * useCompSearch
 * 덱 이름으로 검색
 *
 * @returns {{
 *   query:    string,
 *   setQuery: (q: string) => void,
 *   results:  object[],
 *   clear:    () => void,
 * }}
 */
export function useCompSearch() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return comps;
    return comps.filter(c => c.name.toLowerCase().includes(q));
  }, [query]);

  const clear = () => setQuery('');

  return { query, setQuery, results, clear };
}
