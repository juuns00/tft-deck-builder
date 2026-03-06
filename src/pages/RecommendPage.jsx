import { useState } from "react";
import { useRecommend } from "../hooks/index.js";
import { champions, augments, getComponentItems } from "../data/index.js";
import { COST_COLOR } from "../utils/constants.js";
import { ScoreBar, RankBadge, TierBadge } from "../components/common/index.js";

const COMPONENTS = getComponentItems();

const AUG_COLOR = { silver: "#94A3B8", gold: "#FFD700", prismatic: "#C084FC" };
const AUG_LABEL = { prismatic: "프리즈매틱", gold: "골드", silver: "실버" };

const scoreColor = s =>
  s >= 75 ? "#4ADE80" : s >= 50 ? "#FACC15" : s >= 25 ? "#FB923C" : "#94A3B8";

/* ── 챔피언 포트레이트 ──────────────────────────────────── */
function ChampionPortrait({ champion, selected, onClick, missing = false, size = "md" }) {
  const cost  = champion.cost ?? 1;
  const color = missing ? "#F87171" : COST_COLOR[cost] ?? "#94A3B8";
  const dim   = size === "sm" ? 42 : size === "lg" ? 58 : 50;
  const [imgErr, setImgErr] = useState(false);

  return (
    <button
      onClick={onClick}
      title={`${champion.name} (${cost}코스트)`}
      className="champ-portrait"
      style={{
        width:      dim,
        height:     dim,
        border:     `2px solid ${selected || missing ? color : "#1E293B"}`,
        background: selected ? color + "28" : "#0A0F1A",
        boxShadow:  selected ? `0 0 10px ${color}55` : "none",
        opacity:    missing ? 0.6 : 1,
      }}
    >
      {champion.icon && !imgErr ? (
        <img
          src={champion.icon}
          alt={champion.name}
          onError={() => setImgErr(true)}
          className="w-full h-full object-cover block"
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center font-bold text-center break-all p-0.5"
          style={{ fontSize: size === "sm" ? 9 : 11, color }}
        >
          {champion.name}
        </div>
      )}

      {/* 하단 이름 바 */}
      <div
        className="absolute bottom-0 left-0 right-0 text-white font-extrabold text-center overflow-hidden text-ellipsis whitespace-nowrap"
        style={{
          background: `linear-gradient(transparent, ${color}99 40%, ${color}CC)`,
          fontSize:   size === "sm" ? 8 : 9,
          lineHeight: size === "sm" ? "14px" : "16px",
          padding:    size === "sm" ? "6px 2px 1px" : "8px 2px 2px",
          textShadow: "0 1px 3px #0008",
        }}
      >
        {champion.name}
      </div>

      {/* 선택 체크 */}
      {selected && (
        <div
          className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full flex items-center justify-center text-black font-black"
          style={{ background: color, fontSize: 7 }}
        >✓</div>
      )}

      {/* 부족 오버레이 */}
      {missing && (
        <div className="absolute inset-0 flex items-center justify-center text-base"
          style={{ background: "#F8711133" }}>✕</div>
      )}
    </button>
  );
}

/* ── 부품 아이템 버튼 ──────────────────────────────────── */
function ComponentButton({ item, selected, onClick }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <button
      onClick={onClick}
      title={item.name}
      className={`component-btn ${selected ? "selected" : ""}`}
    >
      {!imgErr ? (
        <img
          src={item.icon}
          alt={item.name}
          onError={() => setImgErr(true)}
          className="w-9 h-9 object-contain"
        />
      ) : (
        <span className="text-2xl">📦</span>
      )}
    </button>
  );
}

/* ── 증강 칩 ───────────────────────────────────────────── */
function AugChip({ aug, selected, onClick }) {
  const color = AUG_COLOR[aug.tier] ?? "#94A3B8";
  return (
    <button
      onClick={onClick}
      title={aug.description ?? aug.name}
      className={`aug-chip ${selected ? "selected" : ""}`}
      style={{
        background:  selected ? color + "22" : undefined,
        borderColor: selected ? color : undefined,
        color:       selected ? color : undefined,
        boxShadow:   selected ? `0 0 6px ${color}33` : undefined,
      }}
    >
      {selected ? "✓ " : ""}{aug.name}
    </button>
  );
}

/* ── 패널 헤더 ─────────────────────────────────────────── */
function PanelHeader({ title, color, count, total, onClear }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="w-[3px] h-4 rounded-sm shrink-0" style={{ background: color }} />
        <span className="text-[13px] font-extrabold text-[#E2E8F0]">{title}</span>
        {count != null && (
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-bold"
            style={{ background: color + "22", color }}
          >
            {count}{total != null ? `/${total}` : ""}
          </span>
        )}
      </div>
      {onClear && count > 0 && (
        <button onClick={onClear} className="btn-clear">초기화</button>
      )}
    </div>
  );
}

/* ── 메인 페이지 ────────────────────────────────────────── */
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

  const filteredChamps = costFilter
    ? champions.filter(c => c.cost === costFilter)
    : champions;

  const totalSelected = ownedChamps.length + ownedComponents.length + ownedAugs.length;

  const COST_FILTER_COLOR = {
    1: "#94A3B8", 2: "#4ADE80", 3: "#60A5FA", 4: "#C084FC", 5: "#FBBF24",
  };

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
              background: "linear-gradient(135deg, #FFD700 0%, #F59E0B 40%, #E2E8F0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            덱 추천기
          </h1>
          <p className="mt-2 text-muted text-xs">
            챔피언 · 부품 아이템 · 증강체를 선택하면 최적의 덱을 추천해드립니다
          </p>
        </div>

        {/* ── 메인 그리드 ── */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4 items-start">

          {/* ───── 왼쪽: 입력 ───── */}
          <div className="flex flex-col gap-4">

            {/* 챔피언 */}
            <div className="panel">
              <PanelHeader
                title="챔피언" color="#60A5FA"
                count={ownedChamps.length} total={champions.length}
                onClear={clearChamps}
              />
              {/* 코스트 필터 */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {[null, 1, 2, 3, 4, 5].map(c => {
                  const active = costFilter === c;
                  const col = c ? COST_FILTER_COLOR[c] : "#60A5FA";
                  return (
                    <button
                      key={c ?? "all"}
                      onClick={() => setCostFilter(c)}
                      className="btn-cost"
                      style={{
                        background:  active ? col + "22" : "transparent",
                        borderColor: active ? col : "#1E293B",
                        color:       active ? col : "#475569",
                        fontWeight:  active ? 700 : 400,
                      }}
                    >
                      {c === null ? "전체" : `${c}코`}
                    </button>
                  );
                })}
              </div>
              {/* 챔피언 목록 */}
              <div className="flex flex-wrap gap-2 max-h-[280px] overflow-y-auto pr-1">
                {filteredChamps.map(c => (
                  <ChampionPortrait
                    key={c.id} champion={c}
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

            {/* 부품 아이템 */}
            <div className="panel">
              <PanelHeader
                title="부품 아이템" color="#F59E0B"
                count={ownedComponents.length}
                onClear={clearComponents}
              />
              <div className="flex flex-wrap gap-2.5">
                {COMPONENTS.map(it => (
                  <ComponentButton
                    key={it.id} item={it}
                    selected={ownedComponents.includes(it.id)}
                    onClick={() => toggleComponent(it.id)}
                  />
                ))}
              </div>
            </div>

            {/* 증강체 */}
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
                  style={{ transform: augOpen ? "rotate(180deg)" : "none" }}
                >▾</span>
              </button>

              {augOpen && (
                <div className="px-4 pb-4 border-t border-border">
                  {ownedAugs.length > 0 && (
                    <button onClick={clearAugs} className="btn-clear mt-3 mb-1">초기화</button>
                  )}
                  {["prismatic", "gold", "silver"].map(tier => (
                    <div key={tier} className="mt-3.5">
                      <div
                        className="text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 mb-1.5"
                        style={{ color: AUG_COLOR[tier] }}
                      >
                        <div className="w-2 h-2 rounded-full" style={{ background: AUG_COLOR[tier] }} />
                        {AUG_LABEL[tier]}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {augments.filter(a => a.tier === tier).map(a => (
                          <AugChip
                            key={a.id} aug={a}
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

          {/* ───── 오른쪽: 결과 ───── */}
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

/* ── 결과 카드 ─────────────────────────────────────────── */
function ResultCard({ comp, rank, expanded, onToggle }) {
  const sc = scoreColor(comp.score);

  return (
    <div
      className="result-card"
      style={{
        background: rank === 1 ? "#0D1828" : "#060B14",
        border:     `1px solid ${rank === 1 ? "#FFD70044" : "#1E293B"}`,
      }}
    >
      {/* 헤더 */}
      <button
        onClick={onToggle}
        className="w-full bg-transparent border-none px-3.5 py-3 cursor-pointer text-left flex items-center justify-between gap-2.5"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <RankBadge rank={rank} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[14px] font-extrabold text-[#E2E8F0] truncate">
                {comp.name}
              </span>
              <TierBadge tier={comp.tier} />
            </div>
            <p className="text-muted text-[10px] mt-0.5">
              챔피언 {comp.matchedChamps}/{comp.champIds.length}명 보유
              {comp.winRate > 0 && ` · 승률 ${Math.round(comp.winRate * 100)}%`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right">
            <div
              className="text-[22px] font-black leading-none"
              style={{ color: sc, textShadow: `0 0 12px ${sc}66` }}
            >{comp.score}</div>
            <div className="text-[9px] text-border">/ 100</div>
          </div>
          <span
            className="text-border-subtle text-[11px] inline-block transition-transform duration-200"
            style={{ transform: expanded ? "rotate(180deg)" : "none" }}
          >▾</span>
        </div>
      </button>

      {/* 점수 바 */}
      <div className="px-3.5 pb-2.5">
        <ScoreBar score={comp.score} />
      </div>

      {/* 챔피언 미리보기 */}
      <div className="px-3.5 pb-3 flex flex-wrap gap-1">
        {comp.champIds.map(id => {
          const champ = champions.find(c => c.id === id);
          if (!champ) return null;
          const isMissing = comp.missingChamps.includes(id);
          return (
            <ChampionPortrait
              key={id} champion={champ}
              selected={!isMissing} missing={isMissing}
              size="sm"
            />
          );
        })}
      </div>

      {/* 상세 */}
      {expanded && (
        <div className="border-t border-border px-3.5 py-3 animate-fade-up">

          {/* 세부 점수 */}
          <div className="flex gap-1.5 mb-3">
            {[
              { l: "챔피언", v: comp.champScore, m: 50, c: "#60A5FA" },
              { l: "아이템", v: comp.itemScore,  m: 30, c: "#F59E0B" },
              { l: "증강",   v: comp.augScore,   m: 20, c: "#C084FC" },
            ].map(({ l, v, m, c }) => (
              <div key={l} className="score-box">
                <div className="text-[9px] text-muted mb-1">{l}</div>
                <div className="text-[15px] font-extrabold leading-none" style={{ color: c }}>{v}</div>
                <div className="text-[9px] text-border">/{m}</div>
              </div>
            ))}
          </div>

          {/* 부족한 챔피언 */}
          {comp.missingChamps.length > 0 && (
            <div className="bg-panel border border-border rounded-lg px-3 py-2">
              <p className="text-[10px] text-[#94A3B8] font-bold mb-1.5">
                ✕ 부족한 챔피언 {comp.missingChamps.length}명
              </p>
              <div className="flex flex-wrap gap-1">
                {comp.missingChamps.map(id => {
                  const champ = champions.find(c => c.id === id);
                  if (!champ) return null;
                  const cc = COST_COLOR[champ.cost] ?? "#94A3B8";
                  return (
                    <span
                      key={id}
                      className="rounded px-2 py-0.5 text-[11px]"
                      style={{
                        background: cc + "18",
                        border:     `1px solid ${cc}44`,
                        color:      cc + "BB",
                      }}
                    >{champ.name}</span>
                  );
                })}
              </div>
            </div>
          )}

          {/* 추천 증강 */}
          {comp.augments?.length > 0 && (
            <div className="mt-2.5">
              <p className="text-[10px] text-muted mb-1.5">추천 증강체</p>
              <div className="flex flex-wrap gap-1">
                {comp.augments.slice(0, 5).map(augId => {
                  const aug = augments.find(a => a.id === augId);
                  const matched = comp.matchedAugs > 0;
                  return aug ? (
                    <span
                      key={augId}
                      className="rounded px-2 py-0.5 text-[11px]"
                      style={{
                        background: matched ? "#C084FC15" : "#0A0F1A",
                        border:     `1px solid ${matched ? "#C084FC33" : "#1E293B"}`,
                        color:      matched ? "#C084FC" : "#475569",
                      }}
                    >{aug.name}</span>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}