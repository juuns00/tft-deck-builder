import { useState } from "react";
import { useRecommend } from "../hooks/index.js";
import { champions, augments, getComponentItems } from "../data/index.js";
import { COST_COLOR } from "../utils/constants.js";
import { ScoreBar, RankBadge, TierBadge, SectionHeader } from "../components/common/index.js";

/* ── 조합 부품 아이템: data에서 가져오기 ─────────────── */
const COMPONENTS = getComponentItems();

const AUG_COLOR = { silver: "#94A3B8", gold: "#FFD700", prismatic: "#C084FC" };
const AUG_LABEL = { prismatic: "프리즈매틱", gold: "골드", silver: "실버" };

const scoreColor = s =>
  s >= 75 ? "#4ADE80" : s >= 50 ? "#FACC15" : s >= 25 ? "#FB923C" : "#94A3B8";

/* ── 챔피언 이미지 버튼 ────────────────────────────────── */
function ChampionPortrait({ champion, selected, onClick, missing = false, size = "md" }) {
  const cost    = champion.cost ?? 1;
  const color   = missing ? "#F87171" : COST_COLOR[cost] ?? "#94A3B8";
  const dim     = size === "sm" ? 40 : size === "lg" ? 60 : 48;
  const [imgErr, setImgErr] = useState(false);

  return (
    <button
      onClick={onClick}
      title={`${champion.name} (${cost}코스트)`}
      style={{
        position:     "relative",
        width:        dim,
        height:       dim,
        padding:      0,
        border:       `2px solid ${selected || missing ? color : "#1E293B"}`,
        borderRadius: 8,
        cursor:       "pointer",
        background:   selected ? color + "28" : "#0A0F1A",
        overflow:     "hidden",
        transition:   "all 0.15s",
        boxShadow:    selected ? `0 0 10px ${color}55` : "none",
        opacity:      missing ? 0.55 : 1,
        flexShrink:   0,
      }}
    >
      {/* 챔피언 이미지 */}
      {champion.icon && !imgErr ? (
        <img
          src={champion.icon}
          alt={champion.name}
          onError={() => setImgErr(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <div style={{
          width: "100%", height: "100%", display: "flex",
          alignItems: "center", justifyContent: "center",
          fontSize: size === "sm" ? 9 : 11, color: color,
          fontWeight: 700, wordBreak: "break-all", textAlign: "center",
          padding: 2,
        }}>
          {champion.name}
        </div>
      )}

      {/* 코스트 컬러 바 + 이름 */}
      <div style={{
        position:     "absolute", bottom: 0, left: 0, right: 0,
        background:   `linear-gradient(transparent, ${color}99 40%, ${color}CC)`,
        fontSize:     size === "sm" ? 8 : 9,
        color:        "#fff",
        fontWeight:   800,
        textAlign:    "center",
        lineHeight:   size === "sm" ? "14px" : "16px",
        overflow:     "hidden",
        textOverflow: "ellipsis",
        whiteSpace:   "nowrap",
        padding:      size === "sm" ? "6px 2px 1px" : "8px 2px 2px",
        textShadow:   "0 1px 3px #0008",
      }}>{champion.name}</div>

      {/* 이름 툴팁 오버레이 (hover) */}
      <div style={{
        position:   "absolute", bottom: 14, left: "50%",
        transform:  "translateX(-50%)",
        background: "#000C", borderRadius: 4, padding: "2px 5px",
        fontSize:   9, color: "#fff", whiteSpace: "nowrap",
        pointerEvents: "none", opacity: 0,
      }} className="champ-name">{champion.name}</div>

      {/* 선택 체크 */}
      {selected && (
        <div style={{
          position:   "absolute", top: 2, right: 2,
          width: 10, height: 10, borderRadius: "50%",
          background: color, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 7, color: "#000", fontWeight: 900,
        }}>✓</div>
      )}

      {/* 부족 표시 */}
      {missing && (
        <div style={{
          position:   "absolute", inset: 0,
          background: "#F8711133", display: "flex",
          alignItems: "center", justifyContent: "center",
          fontSize: 16,
        }}>✕</div>
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
      style={{
        display:      "flex",
        flexDirection:"column",
        alignItems:   "center",
        gap:          4,
        width:        64,
        padding:      "8px 4px",
        background:   selected ? "#F59E0B18" : "#0A0F1A",
        border:       `2px solid ${selected ? "#F59E0B" : "#1E293B"}`,
        borderRadius: 10,
        cursor:       "pointer",
        transition:   "all 0.15s",
        boxShadow:    selected ? "0 0 10px #F59E0B44" : "none",
        color:        selected ? "#F59E0B" : "#475569",
      }}
    >
      {!imgErr ? (
        <img
          src={item.icon}
          alt={item.name}
          onError={() => setImgErr(true)}
          style={{ width: 36, height: 36, objectFit: "contain" }}
        />
      ) : (
        <div style={{ fontSize: 24 }}>{item.fallback ?? "📦"}</div>
      )}
      <span style={{ fontSize: 9, textAlign: "center", lineHeight: 1.3, wordBreak: "keep-all" }}>
        {item.name}
      </span>
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
      style={{
        background:   selected ? color + "22" : "#0A0F1A",
        border:       `1px solid ${selected ? color : "#1E293B"}`,
        borderRadius: 6,
        padding:      "4px 10px",
        cursor:       "pointer",
        color:        selected ? color : "#475569",
        fontSize:     11,
        fontWeight:   selected ? 700 : 400,
        transition:   "all 0.12s",
        whiteSpace:   "nowrap",
        boxShadow:    selected ? `0 0 6px ${color}33` : "none",
      }}
    >
      {selected ? "✓ " : ""}{aug.name}
    </button>
  );
}

/* ── 구분선 헤더 ───────────────────────────────────────── */
function PanelHeader({ title, color, count, total, onClear }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 3, height: 16, borderRadius: 2, background: color }} />
        <span style={{ fontSize: 13, fontWeight: 800, color: "#E2E8F0" }}>{title}</span>
        {count != null && (
          <span style={{
            background: color + "22", color, borderRadius: 99,
            padding: "1px 8px", fontSize: 11, fontWeight: 700,
          }}>
            {count}{total != null ? `/${total}` : ""}
          </span>
        )}
      </div>
      {onClear && count > 0 && (
        <button onClick={onClear} style={{
          background: "none", border: "1px solid #1E293B",
          borderRadius: 5, color: "#475569", fontSize: 10,
          padding: "2px 8px", cursor: "pointer",
        }}>초기화</button>
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

  const [costFilter, setCostFilter] = useState(null);
  const [augOpen,    setAugOpen]    = useState(false);
  const [activeResult, setActiveResult] = useState(null); // 결과 상세 열기

  const filteredChamps = costFilter
    ? champions.filter(c => c.cost === costFilter)
    : champions;

  const COST_COLORS_FILTER = { 1: "#94A3B8", 2: "#4ADE80", 3: "#60A5FA", 4: "#C084FC", 5: "#FBBF24" };

  return (
    <>
      {/* ── 글로벌 스타일 ── */}
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #0A0F1A; }
        ::-webkit-scrollbar-thumb { background: #1E293B; border-radius: 4px; }
        button:hover { opacity: 0.88; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%,100% { opacity: 0.6; }
          50%      { opacity: 1; }
        }

        .result-card { animation: fadeUp 0.25s ease both; }
        .result-card:nth-child(1) { animation-delay: 0.05s; }
        .result-card:nth-child(2) { animation-delay: 0.1s;  }
        .result-card:nth-child(3) { animation-delay: 0.15s; }

        @media (max-width: 768px) {
          .main-grid { grid-template-columns: 1fr !important; }
          .result-sticky { position: static !important; }
          .champ-grid { max-height: 200px !important; }
        }
      `}</style>

      <div style={{
        minHeight:   "100vh",
        background:  "#060B14",
        color:       "#E2E8F0",
        fontFamily:  "'Noto Sans KR','Apple SD Gothic Neo','Malgun Gothic',sans-serif",
        backgroundImage: `
          radial-gradient(ellipse 80% 50% at 50% -5%, #0F2444 0%, transparent 65%),
          radial-gradient(ellipse 40% 30% at 90% 90%, #1A0A2E 0%, transparent 50%)
        `,
        display:     "flex",
        justifyContent: "center",
      }}>
        <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto", padding: "28px clamp(16px, 4vw, 48px)" }}>

          {/* ── 헤더 ── */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#FFD70011", border: "1px solid #FFD70033",
              borderRadius: 99, padding: "4px 14px",
              fontSize: 10, letterSpacing: 3, color: "#FFD700", fontWeight: 700,
              marginBottom: 10, textTransform: "uppercase",
            }}>
              ✦ TFT · 세트 16 신화와 전설
            </div>
            <h1 style={{
              margin: 0, fontSize: "clamp(22px, 5vw, 34px)",
              fontWeight: 900, letterSpacing: -1,
              background: "linear-gradient(135deg, #FFD700 0%, #F59E0B 40%, #E2E8F0 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>덱 추천기</h1>
            <p style={{ margin: "8px 0 0", color: "#475569", fontSize: 12 }}>
              챔피언 · 부품 아이템 · 증강체를 선택하면 최적의 덱을 추천해드립니다
            </p>
          </div>

          {/* ── 메인 그리드 ── */}
          <div className="main-grid" style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1.1fr) minmax(0,0.9fr)",
            gap: 16,
            alignItems: "start",
          }}>

            {/* ───────── 왼쪽: 입력 패널 ───────── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* 챔피언 선택 */}
              <div style={{
                background: "#0A0F1A", border: "1px solid #1E293B",
                borderRadius: 14, padding: 16,
              }}>
                <PanelHeader
                  title="챔피언"
                  color="#60A5FA"
                  count={ownedChamps.length}
                  total={champions.length}
                  onClear={clearChamps}
                />

                {/* 코스트 필터 */}
                <div style={{ display: "flex", gap: 5, marginBottom: 12, flexWrap: "wrap" }}>
                  {[null, 1, 2, 3, 4, 5].map(c => (
                    <button
                      key={c ?? "all"}
                      onClick={() => setCostFilter(c)}
                      style={{
                        background:   costFilter === c ? (c ? COST_COLORS_FILTER[c] + "22" : "#60A5FA22") : "transparent",
                        border:       `1px solid ${costFilter === c ? (c ? COST_COLORS_FILTER[c] : "#60A5FA") : "#1E293B"}`,
                        borderRadius: 6, padding: "3px 10px", cursor: "pointer",
                        color:        costFilter === c ? (c ? COST_COLORS_FILTER[c] : "#60A5FA") : "#475569",
                        fontSize:     11, fontWeight: costFilter === c ? 700 : 400,
                        transition:   "all 0.12s",
                      }}
                    >
                      {c === null ? "전체" : `${c}코`}
                    </button>
                  ))}
                </div>

                {/* 챔피언 포트레이트 그리드 */}
                <div className="champ-grid" style={{
                  display: "flex", flexWrap: "wrap", gap: 5,
                  maxHeight: 260, overflowY: "auto",
                  paddingRight: 2,
                }}>
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
                  <div style={{ marginTop: 10, fontSize: 11, color: "#475569" }}>
                    선택됨: <span style={{ color: "#60A5FA", fontWeight: 700 }}>{ownedChamps.length}명</span>
                    {" "}— 챔피언을 클릭해 선택/해제하세요
                  </div>
                )}
              </div>

              {/* 부품 아이템 선택 */}
              <div style={{
                background: "#0A0F1A", border: "1px solid #1E293B",
                borderRadius: 14, padding: 16,
              }}>
                <PanelHeader
                  title="부품 아이템"
                  color="#F59E0B"
                  count={ownedComponents.length}
                  onClear={clearComponents}
                />
                <p style={{ margin: "0 0 12px", color: "#475569", fontSize: 11 }}>
                  현재 보유 중인 부품 아이템을 선택하세요
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
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

              {/* 증강체 (접기/펼치기) */}
              <div style={{
                background: "#0A0F1A", border: "1px solid #1E293B",
                borderRadius: 14, overflow: "hidden",
              }}>
                <button
                  onClick={() => setAugOpen(v => !v)}
                  style={{
                    width: "100%", background: "none", border: "none", cursor: "pointer",
                    padding: "14px 16px", display: "flex", alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 3, height: 16, borderRadius: 2, background: "#C084FC" }} />
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#E2E8F0" }}>증강체</span>
                    {ownedAugs.length > 0 && (
                      <span style={{
                        background: "#C084FC22", color: "#C084FC",
                        borderRadius: 99, padding: "1px 8px",
                        fontSize: 11, fontWeight: 700,
                      }}>{ownedAugs.length}</span>
                    )}
                    <span style={{ fontSize: 11, color: "#334155" }}>— 선택 사항</span>
                  </div>
                  <span style={{
                    color: "#475569", fontSize: 12,
                    display: "inline-block", transition: "transform 0.2s",
                    transform: augOpen ? "rotate(180deg)" : "none",
                  }}>▾</span>
                </button>

                {augOpen && (
                  <div style={{ padding: "0 16px 16px", borderTop: "1px solid #1E293B" }}>
                    {ownedAugs.length > 0 && (
                      <button onClick={clearAugs} style={{
                        background: "none", border: "1px solid #1E293B", borderRadius: 5,
                        color: "#475569", fontSize: 10, padding: "2px 8px",
                        cursor: "pointer", marginTop: 12, marginBottom: 4,
                      }}>초기화</button>
                    )}
                    {["prismatic", "gold", "silver"].map(tier => (
                      <div key={tier} style={{ marginTop: 14 }}>
                        <div style={{
                          fontSize: 10, color: AUG_COLOR[tier],
                          fontWeight: 700, letterSpacing: 2, marginBottom: 7,
                          textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6,
                        }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: AUG_COLOR[tier] }} />
                          {AUG_LABEL[tier]}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
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

            {/* ───────── 오른쪽: 추천 결과 ───────── */}
            <div>
              <div className="result-sticky" style={{
                background: "#0A0F1A", border: "1px solid #1E293B",
                borderRadius: 14, padding: 16,
                position: "sticky", top: 16,
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 3, height: 16, borderRadius: 2, background: "#FFD700" }} />
                    <span style={{ fontSize: 13, fontWeight: 800 }}>추천 결과</span>
                  </div>
                  {hasInput && (
                    <span style={{ fontSize: 11, color: "#334155" }}>
                      챔 {ownedChamps.length} · 부품 {ownedComponents.length} · 증강 {ownedAugs.length}
                    </span>
                  )}
                </div>

                {!hasInput ? (
                  <div style={{ textAlign: "center", padding: "50px 0", color: "#1E293B" }}>
                    <div style={{ fontSize: 40, marginBottom: 12, animation: "glow 2s infinite" }}>✦</div>
                    <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.8 }}>
                      챔피언·부품·증강체를 합쳐<br />
                      <span style={{ color: "#FFD700" }}>3개 이상</span> 선택하면<br />최적의 덱을 추천해드립니다
                    </div>
                    {(ownedChamps.length + ownedComponents.length + ownedAugs.length) > 0 && (
                      <div style={{
                        marginTop: 12, fontSize: 11, color: "#475569",
                        background: "#FFD70011", border: "1px solid #FFD70022",
                        borderRadius: 8, padding: "6px 14px", display: "inline-block",
                      }}>
                        {ownedChamps.length + ownedComponents.length + ownedAugs.length} / 3 선택됨
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
                      <div style={{ textAlign: "center", padding: "30px 0", color: "#334155", fontSize: 12 }}>
                        매칭되는 덱이 없습니다
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

/* ── 결과 카드 ─────────────────────────────────────────── */
function ResultCard({ comp, rank, expanded, onToggle }) {
  const sc = scoreColor(comp.score);

  return (
    <div
      className="result-card"
      style={{
        background:   rank === 1 ? "#0D1828" : "#060B14",
        border:       `1px solid ${rank === 1 ? "#FFD70044" : "#1E293B"}`,
        borderRadius: 12,
        overflow:     "hidden",
        transition:   "border-color 0.2s",
      }}
    >
      {/* 카드 상단 요약 (항상 표시) */}
      <button
        onClick={onToggle}
        style={{
          width: "100%", background: "none", border: "none",
          padding: "12px 14px", cursor: "pointer", textAlign: "left",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <RankBadge rank={rank} />
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{
                fontSize: 14, fontWeight: 800, color: "#E2E8F0",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>{comp.name}</span>
              <TierBadge tier={comp.tier} />
            </div>
            <div style={{ color: "#475569", fontSize: 10, marginTop: 1 }}>
              챔피언 {comp.matchedChamps}/{comp.champIds.length}명 보유
              {comp.winRate > 0 && ` · 승률 ${Math.round(comp.winRate * 100)}%`}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{
              fontSize: 22, fontWeight: 900, lineHeight: 1,
              color: sc, textShadow: `0 0 12px ${sc}66`,
            }}>{comp.score}</div>
            <div style={{ color: "#1E293B", fontSize: 9 }}>/ 100</div>
          </div>
          <span style={{
            color: "#334155", fontSize: 11, transition: "transform 0.2s",
            transform: expanded ? "rotate(180deg)" : "none",
            display: "inline-block",
          }}>▾</span>
        </div>
      </button>

      {/* 점수 바 */}
      <div style={{ padding: "0 14px 10px" }}>
        <ScoreBar score={comp.score} />
      </div>

      {/* 챔피언 미리보기 (항상 표시, 작은 사이즈) */}
      <div style={{ padding: "0 14px 12px", display: "flex", flexWrap: "wrap", gap: 4 }}>
        {comp.champIds.map(id => {
          const champ = champions.find(c => c.id === id);
          if (!champ) return null;
          const isMissing = comp.missingChamps.includes(id);
          return (
            <ChampionPortrait
              key={id}
              champion={champ}
              selected={!isMissing}
              missing={isMissing}
              size="sm"
            />
          );
        })}
      </div>

      {/* 펼쳐진 상세 */}
      {expanded && (
        <div style={{ borderTop: "1px solid #1E293B", padding: "12px 14px", animation: "fadeUp 0.2s ease" }}>
          {/* 세부 점수 */}
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            {[
              { l: "챔피언", v: comp.champScore, m: 50, c: "#60A5FA" },
              { l: "아이템", v: comp.itemScore,  m: 30, c: "#F59E0B" },
              { l: "증강",   v: comp.augScore,   m: 20, c: "#C084FC" },
            ].map(({ l, v, m, c }) => (
              <div key={l} style={{
                flex: 1, background: "#0A0F1A", borderRadius: 8,
                padding: "8px", border: "1px solid #1E293B", textAlign: "center",
              }}>
                <div style={{ fontSize: 9, color: "#475569", marginBottom: 4 }}>{l}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: c, lineHeight: 1 }}>{v}</div>
                <div style={{ fontSize: 9, color: "#1E293B" }}>/{m}</div>
              </div>
            ))}
          </div>

          {/* 부족한 챔피언 */}
          {comp.missingChamps.length > 0 && (
            <div style={{
              background: "#0A0F1A", border: "1px solid #1E293B",
              borderRadius: 8, padding: "8px 12px",
            }}>
              <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 700, marginBottom: 6 }}>
                ✕ 부족한 챔피언 {comp.missingChamps.length}명
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {comp.missingChamps.map(id => {
                  const champ = champions.find(c => c.id === id);
                  if (!champ) return null;
                  const costColor = COST_COLOR[champ.cost] ?? "#94A3B8";
                  return (
                    <span key={id} style={{
                      background: costColor + "18",
                      border:     `1px solid ${costColor}44`,
                      borderRadius: 5, padding: "2px 8px",
                      fontSize: 11, color: costColor + "BB",
                    }}>{champ.name}</span>
                  );
                })}
              </div>
            </div>
          )}

          {/* 추천 증강 */}
          {comp.augments && comp.augments.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 10, color: "#475569", marginBottom: 5 }}>추천 증강체</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {comp.augments.slice(0, 5).map(augId => {
                  const aug = augments.find(a => a.id === augId);
                  const matched = comp.matchedAugs > 0;
                  return aug ? (
                    <span key={augId} style={{
                      background: matched ? "#C084FC15" : "#0A0F1A",
                      border: `1px solid ${matched ? "#C084FC33" : "#1E293B"}`,
                      borderRadius: 5, padding: "2px 8px",
                      fontSize: 11, color: matched ? "#C084FC" : "#475569",
                    }}>{aug.name}</span>
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