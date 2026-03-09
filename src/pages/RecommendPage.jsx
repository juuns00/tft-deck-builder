// ─────────────────────────────────────────────
//  RecommendPage  (개선판)
//  • 선택된 챔피언 요약 바 (글로우 강조)
//  • 결과 카드에 매칭 근거/빌드업/홀더 포함
// ─────────────────────────────────────────────
import { useState } from 'react';
import { useRecommend }    from '../hooks/index.js';
import { champions, augments, getComponentItems } from '../data/index.js';
import { AUGMENT_TIER_COLOR, AUGMENT_TIER_LABEL, COST_COLOR } from '../utils/constants.js';
import { SectionHeader }   from '../components/common/index.js';
import {
  ChampionPortrait,
  ComponentButton,
  AugChip,
  ResultCard,
} from '../components/recommend/index.js';

const COMPONENTS = getComponentItems();

const COST_FILTER_COLOR = {
  1: '#94A3B8', 2: '#4ADE80', 3: '#60A5FA', 4: '#C084FC', 5: '#FBBF24',
};

// ─────────────────────────────────────────────
export default function RecommendPage() {
  const {
    ownedChamps, ownedComponents, ownedAugs,
    toggleChamp, toggleComponent, toggleAug,
    clearChamps, clearComponents, clearAugs,
    results, hasInput,
  } = useRecommend();

  const [costFilter,   setCostFilter]   = useState(null);
  const [augOpen,      setAugOpen]      = useState(false);
  const [activeResult, setActiveResult] = useState(null);

  const filteredChamps  = costFilter
    ? champions.filter(c => c.cost === costFilter)
    : champions;

  const totalSelected = ownedChamps.length + ownedComponents.length + ownedAugs.length;

  // 선택된 챔피언 객체 목록
  const selectedChampObjs = ownedChamps
    .map(id => champions.find(c => c.id === id))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-tft text-[#E2E8F0] flex justify-center">
      <div className="w-full max-w-[1200px] px-4 md:px-10 py-7">

        {/* ── 헤더 ── */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 bg-[#FFD70011] border border-[#FFD70033] rounded-full px-3.5 py-1 text-[10px] tracking-[3px] text-[#FFD700] font-bold uppercase mb-2.5">
            ✦ TFT · 세트 16 신화와 전설
          </div>
          <h1
            className="m-0 font-black tracking-tight text-[clamp(22px,5vw,34px)]"
            style={{
              background:           'linear-gradient(135deg, #FFD700 0%, #F59E0B 40%, #E2E8F0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
            }}
          >
            덱 추천기
          </h1>
          <p className="mt-2 text-muted text-xs">
            챔피언 · 부품 아이템 · 증강체를 선택하면 최적의 덱을 추천해드립니다
          </p>
        </div>

        {/* ── 선택된 챔피언 요약 바 ── */}
        {selectedChampObjs.length > 0 && (
          <div
            className="mb-4 rounded-xl px-4 py-3 flex items-center gap-3 flex-wrap"
            style={{ background: '#0D1828', border: '1px solid #60A5FA33' }}
          >
            <span className="text-[10px] font-bold text-[#60A5FA] shrink-0 tracking-wider uppercase">
              선택된 기물
            </span>
            <div className="flex flex-wrap gap-1.5 items-center flex-1">
              {selectedChampObjs.map(champ => {
                const color = COST_COLOR[champ.cost] ?? '#94A3B8';
                return (
                  <button
                    key={champ.id}
                    onClick={() => toggleChamp(champ.id)}
                    title={`${champ.name} 선택 해제`}
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold transition-all duration-150 cursor-pointer border-none"
                    style={{
                      background: color + '22',
                      border:     `1px solid ${color}55`,
                      color:      color,
                      boxShadow:  `0 0 8px ${color}33`,
                    }}
                  >
                    {champ.name}
                    <span className="opacity-60 text-[9px]">✕</span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={clearChamps}
              className="text-[10px] text-[#475569] hover:text-[#94A3B8] bg-transparent border-none cursor-pointer shrink-0 transition-colors"
            >
              전체 해제
            </button>
          </div>
        )}

        {/* ── 메인 그리드 ── */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4 items-start">

          {/* ───── 왼쪽: 입력 패널 ───── */}
          <div className="flex flex-col gap-4">

            {/* 챔피언 선택 */}
            <div className="panel">
              <SectionHeader
                title="챔피언" color="#60A5FA"
                count={ownedChamps.length} total={champions.length}
                onClear={clearChamps}
              />

              {/* 코스트 필터 */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {[null, 1, 2, 3, 4, 5].map(c => {
                  const active = costFilter === c;
                  const col    = c ? COST_FILTER_COLOR[c] : '#60A5FA';
                  return (
                    <button
                      key={c ?? 'all'}
                      onClick={() => setCostFilter(c)}
                      className="btn-cost"
                      style={{
                        background:  active ? col + '22' : 'transparent',
                        borderColor: active ? col : '#1E293B',
                        color:       active ? col : '#475569',
                        fontWeight:  active ? 700 : 400,
                      }}
                    >
                      {c === null ? '전체' : `${c}코`}
                    </button>
                  );
                })}
              </div>

              {/* 챔피언 목록 */}
              <div className="flex flex-wrap gap-2 max-h-[280px] overflow-y-auto pr-1">
                {filteredChamps.map(c => (
                  <ChampionPortrait
                    key={c.id}
                    champion={c}
                    selected={ownedChamps.includes(c.id)}
                    onClick={() => toggleChamp(c.id)}
                  />
                ))}
              </div>

              {ownedChamps.length > 0 && (
                <p className="mt-2.5 text-[11px] text-muted">
                  선택됨: <span className="text-[#60A5FA] font-bold">{ownedChamps.length}명</span>
                </p>
              )}
            </div>

            {/* 부품 아이템 선택 */}
            <div className="panel">
              <SectionHeader
                title="부품 아이템" color="#F59E0B"
                count={ownedComponents.length}
                onClear={clearComponents}
              />
              <div className="flex flex-wrap gap-2.5">
                {COMPONENTS.map(it => (
                  <ComponentButton
                    key={it.id}
                    item={it}
                    selected={ownedComponents.includes(it.id)}
                    onClick={() => toggleComponent(it.id)}
                  />
                ))}
              </div>
            </div>

            {/* 증강체 선택 (접기/펼치기) */}
            <div className="panel !p-0 overflow-hidden">
              <button
                onClick={() => setAugOpen(v => !v)}
                className="w-full bg-transparent border-none cursor-pointer px-4 py-3.5 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="w-[3px] h-4 rounded-sm bg-[#C084FC]" />
                  <span className="text-[13px] font-extrabold text-[#E2E8F0]">증강체</span>
                  {ownedAugs.length > 0 && (
                    <span className="bg-[#C084FC22] text-[#C084FC] rounded-full px-2 py-0.5 text-[11px] font-bold">
                      {ownedAugs.length}
                    </span>
                  )}
                  <span className="text-[11px] text-[#334155]">— 선택 사항</span>
                </div>
                <span
                  className="text-muted text-xs inline-block transition-transform duration-200"
                  style={{ transform: augOpen ? 'rotate(180deg)' : 'none' }}
                >▾</span>
              </button>

              {augOpen && (
                <div className="px-4 pb-4 border-t border-border">
                  {ownedAugs.length > 0 && (
                    <button onClick={() => clearAugs()} className="btn-clear mt-3 mb-1">초기화</button>
                  )}
                  {['prismatic', 'gold', 'silver'].map(tier => (
                    <div key={tier} className="mt-3.5">
                      <div
                        className="text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 mb-1.5"
                        style={{ color: AUGMENT_TIER_COLOR[tier] }}
                      >
                        <div className="w-2 h-2 rounded-full" style={{ background: AUGMENT_TIER_COLOR[tier] }} />
                        {AUGMENT_TIER_LABEL[tier]}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {augments.filter(a => a.tier === tier).map(a => (
                          <AugChip
                            key={a.id}
                            aug={a}
                            selected={ownedAugs.includes(a.id)}
                            onClick={() => toggleAug(a.id)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ───── 오른쪽: 결과 패널 ───── */}
          <div>
            <div className="panel sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-[3px] h-4 rounded-sm bg-[#FFD700]" />
                  <span className="text-[13px] font-extrabold">추천 결과</span>
                </div>
                {totalSelected > 0 && (
                  <span className="text-[11px] text-[#334155]">
                    챔 {ownedChamps.length} · 부품 {ownedComponents.length} · 증강 {ownedAugs.length}
                  </span>
                )}
              </div>

              {!hasInput ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3 animate-glow">✦</div>
                  <p className="text-[13px] text-[#334155] leading-relaxed">
                    챔피언·부품·증강체를 합쳐<br />
                    <span className="text-[#FFD700]">3개 이상</span> 선택하면<br />
                    최적의 덱을 추천해드립니다
                  </p>
                  {totalSelected > 0 && (
                    <span className="mt-3 inline-block text-[11px] text-muted bg-[#FFD70011] border border-[#FFD70022] rounded-lg px-3.5 py-1.5">
                      {totalSelected} / 3 선택됨
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {results.map((comp, i) => (
                    <ResultCard
                      key={comp.id}
                      comp={comp}
                      rank={i + 1}
                      expanded={activeResult === comp.id}
                      onToggle={() => setActiveResult(activeResult === comp.id ? null : comp.id)}
                    />
                  ))}
                  {results.length === 0 && (
                    <p className="text-center py-8 text-[#334155] text-xs">
                      매칭되는 덱이 없습니다
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}