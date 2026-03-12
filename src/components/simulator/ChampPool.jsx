// ─────────────────────────────────────────────
//  src/components/simulator/ChampPool.jsx
//  챔피언 풀 — 검색·역할·코스트 필터 + 드래그 소스
// ─────────────────────────────────────────────
import { useState, useMemo } from 'react';
import { COST_COLOR, ROLE_COLOR, ROLE_LABEL } from '../../utils/constants.js';

// ─── ChampCard ────────────────────────────────
function ChampCard({ champion, onDragStart }) {
  const [imgErr, setImgErr] = useState(false);
  const color     = COST_COLOR[champion.cost] ?? '#94A3B8';
  const roleColor = ROLE_COLOR[champion.role]  ?? '#94A3B8';

  return (
    <div
      draggable
      onDragStart={e => onDragStart(e, { ...champion, sourceType: 'pool' })}
      title={`${champion.name} (${champion.cost}코스트 · ${ROLE_LABEL[champion.role] ?? champion.role})`}
      className="flex flex-col items-center gap-0.5 cursor-grab active:cursor-grabbing select-none"
      style={{ width: 52 }}
    >
      <div
        className="relative overflow-hidden rounded"
        style={{ width: 48, height: 48, border: `2px solid ${color}55`, background: '#0A0F1A' }}
      >
        {champion.icon && !imgErr ? (
          <img src={champion.icon} alt={champion.name}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-center p-0.5"
            style={{ fontSize: 9, fontWeight: 700, color }}>
            {champion.name}
          </div>
        )}

        {/* 코스트 뱃지 */}
        <div className="absolute top-0 left-0 w-3.5 h-3.5 flex items-center justify-center font-black"
          style={{ background: color, color: '#000', fontSize: 8 }}>
          {champion.cost}
        </div>

        {/* 역할 dot */}
        <div className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full"
          style={{ background: roleColor }} />
      </div>

      <div className="text-[9px] font-bold text-center leading-tight w-full truncate"
        style={{ color: '#64748B' }}>
        {champion.name}
      </div>
    </div>
  );
}

// ─── ChampPool ────────────────────────────────
/**
 * @param {object[]}  champions    - 전체 챔피언 배열 (champions.json)
 * @param {function}  onDragStart  - (e, item) => void
 */
export default function ChampPool({ champions, onDragStart }) {
  const [search,     setSearch]     = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [costFilter, setCostFilter] = useState('all');

  const filtered = useMemo(() => champions.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchRole   = roleFilter === 'all' || c.role === roleFilter;
    const matchCost   = costFilter === 'all' || String(c.cost) === costFilter;
    return matchSearch && matchRole && matchCost;
  }), [champions, search, roleFilter, costFilter]);

  return (
    <div className="rounded-xl border p-4"
      style={{ background: '#0A0F1A', borderColor: '#1E293B' }}>

      {/* 헤더 + 필터 */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <span className="text-sm font-bold" style={{ color: '#CBD5E1' }}>
          챔피언 풀
        </span>
        <div className="flex gap-2 flex-wrap items-center">
          {/* 검색 */}
          <input
            type="text"
            placeholder="검색..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="text-xs rounded px-2 py-1 outline-none"
            style={{ background: '#0F172A', border: '1px solid #1E293B', color: '#CBD5E1', width: 80 }}
          />
          {/* 역할 필터 */}
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
            className="text-xs rounded px-2 py-1 outline-none cursor-pointer"
            style={{ background: '#0F172A', border: '1px solid #1E293B', color: '#CBD5E1' }}>
            <option value="all">전체 역할</option>
            {Object.entries(ROLE_LABEL).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          {/* 코스트 필터 */}
          <select value={costFilter} onChange={e => setCostFilter(e.target.value)}
            className="text-xs rounded px-2 py-1 outline-none cursor-pointer"
            style={{ background: '#0F172A', border: '1px solid #1E293B', color: '#CBD5E1' }}>
            <option value="all">전체 코스트</option>
            {[1, 2, 3, 4, 5].map(c => (
              <option key={c} value={String(c)}>{c}코스트</option>
            ))}
          </select>
        </div>
      </div>

      {/* 챔피언 목록 */}
      <div
        className="flex flex-wrap gap-2 overflow-y-auto"
        style={{ maxHeight: 220 }}
      >
        {filtered.length > 0
          ? filtered.map(c => (
              <ChampCard key={c.id} champion={c} onDragStart={onDragStart} />
            ))
          : <div className="text-sm" style={{ color: '#475569' }}>검색 결과가 없어.</div>
        }
      </div>
    </div>
  );
}
