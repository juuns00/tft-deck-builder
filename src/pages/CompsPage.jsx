import { useState, useMemo } from "react";
import { comps, traits, items } from "../data/index.js";
import { COST_COLOR } from "../utils/constants.js";

/* ── 상수 ── */
const LOLCHESS_BASE = "https://lolchess.gg";

const TIER_META = {
  S: { label: "S", color: "#FFD700", bg: "#FFD70018", glow: "#FFD70033" },
  A: { label: "A", color: "#C084FC", bg: "#C084FC18", glow: "#C084FC33" },
  B: { label: "B", color: "#60A5FA", bg: "#60A5FA18", glow: "#60A5FA33" },
  C: { label: "C", color: "#94A3B8", bg: "#94A3B818", glow: "transparent" },
};

const DIFFICULTY_META = {
  easy:   { label: "쉬움",   color: "#4ADE80" },
  medium: { label: "보통",   color: "#FACC15" },
  hard:   { label: "어려움", color: "#F87171" },
  "":     { label: "보통",   color: "#FACC15" },
};

const PLAYSTYLE_META = {
  "slow-roll": "슬로우롤",
  "standard":  "표준 운영",
  "fast9":     "패스트9",
  "":          "표준 운영",
};

/* ── 유틸 ── */
const getTraitName  = id => traits.find(t => t.id === id)?.name ?? id;
const getItemName   = id => items.find(i => i.id === id)?.name ?? id;
const getItemIcon   = id => items.find(i => i.id === id)?.icon ?? null;
const getChampIcon  = (champId) => {
  // champions.json의 icon 필드에서 가져옴 (동적 import 피하고 champions 배열에서 직접)
  return null; // 챔피언 아이콘은 ChampionPortrait에서 처리
};

// 덱의 주요 특성 (가장 카운트 높은 2개)
const getTopTraits = (comp) =>
  [...comp.traits]
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

// 캐리 챔피언 (아이템 가장 많이 달린 챔피언)
const getCarry = (comp) =>
  comp.champions.reduce((best, c) =>
    (c.items?.length ?? 0) > (best.items?.length ?? 0) ? c : best
  , comp.champions[0]);

/* ── 챔피언 아이콘 (champions 배열 참조) ── */
import { champions } from "../data/index.js";

function ChampIcon({ id, name, cost, size = 36 }) {
  const champ = champions.find(c => c.id === id);
  const color = COST_COLOR[cost] ?? "#94A3B8";
  const [err, setErr] = useState(false);

  return (
    <div
      title={name}
      style={{
        width: size, height: size, borderRadius: 6, overflow: "hidden",
        border: `2px solid ${color}`,
        background: "#0A0F1A", flexShrink: 0, position: "relative",
      }}
    >
      {champ?.icon && !err ? (
        <img
          src={champ.icon} alt={name}
          onError={() => setErr(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <div style={{
          width: "100%", height: "100%", display: "flex",
          alignItems: "center", justifyContent: "center",
          fontSize: 9, color, fontWeight: 700, textAlign: "center", padding: 1,
        }}>{name}</div>
      )}
      {/* 코스트 바 */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: `linear-gradient(transparent, ${color}BB)`,
        fontSize: 7, color: "#fff", textAlign: "center",
        lineHeight: "11px", fontWeight: 800, textShadow: "0 1px 2px #000a",
      }}>{name.length > 3 ? name.slice(0, 3) : name}</div>
    </div>
  );
}

function ItemIcon({ id, size = 22 }) {
  const icon = getItemIcon(id);
  const name = getItemName(id);
  const [err, setErr] = useState(false);

  return (
    <div title={name} style={{
      width: size, height: size, borderRadius: 4, overflow: "hidden",
      border: "1px solid #1E293B", background: "#0A0F1A", flexShrink: 0,
    }}>
      {icon && !err ? (
        <img src={icon} alt={name} onError={() => setErr(true)}
          style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      ) : (
        <div style={{ width: "100%", height: "100%", display: "flex",
          alignItems: "center", justifyContent: "center", fontSize: 8, color: "#475569" }}>
          ⚔
        </div>
      )}
    </div>
  );
}

/* ── 덱 카드 ── */
function CompCard({ comp, onClick }) {
  const tier   = TIER_META[comp.tier] ?? TIER_META.C;
  const carry  = getCarry(comp);
  const topTraits = getTopTraits(comp);

  return (
    <div
      onClick={onClick}
      className="panel cursor-pointer transition-all duration-200 hover:border-[#334155]"
      style={{
        border: `1px solid ${comp.tier === "S" ? "#FFD70044" : "#1E293B"}`,
        boxShadow: comp.tier === "S" ? "0 0 20px #FFD70008" : "none",
      }}
    >
      {/* 상단: 티어 + 덱명 + 롤체지지 링크 */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* 티어 뱃지 */}
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: tier.bg, border: `1px solid ${tier.glow}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 900, color: tier.color,
          }}>{tier.label}</div>

          <div className="min-w-0">
            <div className="font-extrabold text-[14px] text-[#E2E8F0] truncate">{comp.name}</div>
            {/* 특성 뱃지 */}
            <div className="flex flex-wrap gap-1 mt-1">
              {topTraits.map(t => (
                <span key={t.id} style={{
                  background: "#1E293B", borderRadius: 4, padding: "1px 6px",
                  fontSize: 10, color: "#94A3B8",
                }}>
                  {getTraitName(t.id)} {t.count}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 롤체지지 링크 */}
        {comp.guideUrl && (
          <a
            href={`${LOLCHESS_BASE}${comp.guideUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            title="롤체지지에서 보기"
            style={{
              flexShrink: 0, background: "#0F2444",
              border: "1px solid #1E3A5F", borderRadius: 6,
              padding: "4px 8px", fontSize: 10, color: "#60A5FA",
              textDecoration: "none", whiteSpace: "nowrap",
              display: "flex", alignItems: "center", gap: 4,
            }}
          >
            🔗 롤체지지
          </a>
        )}
      </div>

      {/* 챔피언 목록 */}
      <div className="flex flex-wrap gap-1 mb-3">
        {comp.champions.map(c => (
          <ChampIcon key={c.id} id={c.id} name={c.name} cost={c.cost} />
        ))}
      </div>

      {/* 캐리 아이템 */}
      {carry?.items?.length > 0 && (
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="text-[10px] text-[#475569] shrink-0">캐리템</span>
          <div className="flex gap-1">
            {carry.items.map((itemId, i) => (
              <ItemIcon key={i} id={itemId} />
            ))}
          </div>
          <span className="text-[10px] text-[#334155]">({carry.name})</span>
        </div>
      )}

      {/* 하단 메타 정보 */}
      <div className="flex items-center gap-2 flex-wrap">
        {comp.difficulty && (
          <span style={{
            fontSize: 10, color: DIFFICULTY_META[comp.difficulty]?.color ?? "#FACC15",
            background: "#0A0F1A", border: "1px solid #1E293B",
            borderRadius: 4, padding: "2px 7px",
          }}>
            난이도 {DIFFICULTY_META[comp.difficulty]?.label ?? "보통"}
          </span>
        )}
        {comp.playStyle && (
          <span style={{
            fontSize: 10, color: "#94A3B8",
            background: "#0A0F1A", border: "1px solid #1E293B",
            borderRadius: 4, padding: "2px 7px",
          }}>
            {PLAYSTYLE_META[comp.playStyle] ?? comp.playStyle}
          </span>
        )}
        <span style={{
          fontSize: 10, color: "#334155",
          marginLeft: "auto",
        }}>
          골드 {comp.goldCost}
        </span>
      </div>
    </div>
  );
}

/* ── 덱 상세 모달 ── */
function CompModal({ comp, onClose }) {
  const tier  = TIER_META[comp.tier] ?? TIER_META.C;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto"
        style={{
          background: "#0A0F1A", border: `1px solid ${tier.glow}`,
          borderRadius: 16, padding: 24,
          boxShadow: `0 0 40px ${tier.glow}`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: tier.bg, border: `1px solid ${tier.glow}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 900, color: tier.color,
            }}>{tier.label}</div>
            <div>
              <div className="text-[18px] font-extrabold text-[#E2E8F0]">{comp.name}</div>
              <div className="text-[11px] text-[#475569] mt-0.5">
                {PLAYSTYLE_META[comp.playStyle] ?? "표준 운영"} · 골드 {comp.goldCost}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: "#475569",
            fontSize: 20, cursor: "pointer", padding: "4px 8px",
          }}>✕</button>
        </div>

        {/* 챔피언 상세 */}
        <div className="mb-4">
          <div className="text-[11px] text-[#475569] font-bold mb-2 uppercase tracking-widest">챔피언</div>
          <div className="flex flex-wrap gap-2">
            {comp.champions.map(c => (
              <div key={c.id} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              }}>
                <ChampIcon id={c.id} name={c.name} cost={c.cost} size={44} />
                {c.items?.length > 0 && (
                  <div className="flex gap-0.5">
                    {c.items.map((itemId, i) => (
                      <ItemIcon key={i} id={itemId} size={18} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 시너지 */}
        <div className="mb-4">
          <div className="text-[11px] text-[#475569] font-bold mb-2 uppercase tracking-widest">활성 시너지</div>
          <div className="flex flex-wrap gap-1.5">
            {comp.traits.filter(t => t.count > 0).sort((a,b) => b.count - a.count).map(t => (
              <span key={t.id} style={{
                background: "#1E293B44", border: "1px solid #1E293B",
                borderRadius: 6, padding: "3px 10px",
                fontSize: 11, color: "#94A3B8",
              }}>
                {getTraitName(t.id)} <span style={{ color: "#E2E8F0", fontWeight: 700 }}>{t.count}</span>
              </span>
            ))}
          </div>
        </div>

        {/* 추천 증강 */}
        {comp.augments?.length > 0 && (
          <div className="mb-4">
            <div className="text-[11px] text-[#475569] font-bold mb-2 uppercase tracking-widest">추천 증강체</div>
            <div className="flex flex-wrap gap-1.5">
              {comp.augments.map(augId => (
                <span key={augId} style={{
                  background: "#C084FC11", border: "1px solid #C084FC33",
                  borderRadius: 6, padding: "3px 10px",
                  fontSize: 11, color: "#C084FC",
                }}>{augId}</span>
              ))}
            </div>
          </div>
        )}

        {/* 롤체지지 이동 */}
        {comp.guideUrl && (
          <a
            href={`${LOLCHESS_BASE}${comp.guideUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              width: "100%", padding: "10px",
              background: "#0F2444", border: "1px solid #1E3A5F",
              borderRadius: 10, color: "#60A5FA", textDecoration: "none",
              fontSize: 13, fontWeight: 700,
            }}
          >
            🔗 롤체지지에서 전체 가이드 보기
          </a>
        )}
      </div>
    </div>
  );
}

/* ── 메인 페이지 ── */
export default function CompsPage() {
  const [tierFilter, setTierFilter] = useState(null);
  const [search,     setSearch]     = useState("");
  const [selected,   setSelected]   = useState(null);

  const filtered = useMemo(() => {
    return comps.filter(c => {
      const matchTier   = !tierFilter || c.tier === tierFilter;
      const matchSearch = !search || c.name.includes(search) ||
        c.traits.some(t => getTraitName(t.id).includes(search));
      return matchTier && matchSearch;
    });
  }, [tierFilter, search]);

  const tierCounts = useMemo(() =>
    Object.fromEntries(["S","A","B","C"].map(t => [t, comps.filter(c => c.tier === t).length]))
  , []);

  return (
    <div className="min-h-screen bg-tft text-[#E2E8F0] flex justify-center">
      <div className="w-full max-w-[1200px] px-4 md:px-10 py-7">

        {/* 헤더 */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 bg-[#FFD70011] border border-[#FFD70033] rounded-full px-3.5 py-1 text-[10px] tracking-[3px] text-[#FFD700] font-bold uppercase mb-2.5">
            ✦ TFT · 세트 16 신화와 전설
          </div>
          <h1 className="m-0 font-black tracking-tight text-[clamp(22px,5vw,32px)]"
            style={{
              background: "linear-gradient(135deg, #FFD700 0%, #F59E0B 40%, #E2E8F0 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
            메타 덱 티어표
          </h1>
          <p className="mt-2 text-[#475569] text-xs">
            현재 시즌 추천 덱 목록 · 카드 클릭 시 상세 정보 · 롤체지지 연동
          </p>
        </div>

        {/* 필터 바 */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          {/* 검색 */}
          <input
            type="text"
            placeholder="덱 이름 또는 특성 검색..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, minWidth: 180, background: "#0A0F1A",
              border: "1px solid #1E293B", borderRadius: 8,
              padding: "7px 12px", color: "#E2E8F0", fontSize: 12,
              outline: "none",
            }}
          />

          {/* 티어 필터 */}
          <div className="flex gap-1.5">
            <button
              onClick={() => setTierFilter(null)}
              className="btn-cost"
              style={{
                borderColor: !tierFilter ? "#FFD700" : "#1E293B",
                color:       !tierFilter ? "#FFD700" : "#475569",
                background:  !tierFilter ? "#FFD70011" : "transparent",
                fontWeight:  !tierFilter ? 700 : 400,
              }}
            >전체 {comps.length}</button>
            {["S","A","B","C"].map(t => {
              const meta = TIER_META[t];
              const active = tierFilter === t;
              return (
                <button
                  key={t}
                  onClick={() => setTierFilter(active ? null : t)}
                  className="btn-cost"
                  style={{
                    borderColor: active ? meta.color : "#1E293B",
                    color:       active ? meta.color : "#475569",
                    background:  active ? meta.bg    : "transparent",
                    fontWeight:  active ? 700 : 400,
                  }}
                >
                  {t}티어 {tierCounts[t] ?? 0}
                </button>
              );
            })}
          </div>
        </div>

        {/* 결과 수 */}
        <div className="text-[11px] text-[#334155] mb-3">
          {filtered.length}개 덱 표시 중
        </div>

        {/* 덱 그리드 */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map(comp => (
              <CompCard
                key={comp.id}
                comp={comp}
                onClick={() => setSelected(comp)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-[#334155]">
            <div className="text-4xl mb-3">🔍</div>
            <div className="text-sm">검색 결과가 없습니다</div>
          </div>
        )}
      </div>

      {/* 상세 모달 */}
      {selected && (
        <CompModal comp={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}